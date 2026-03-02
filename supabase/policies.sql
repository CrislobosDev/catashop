-- Apply this script on existing environments to harden RLS policies.
-- It assumes tables already exist.

create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

alter table public.products enable row level security;
alter table public.orders enable row level security;

create table if not exists public.order_request_log (
  id bigserial primary key,
  client_key text not null,
  created_at timestamptz default now()
);

create index if not exists order_request_log_client_key_created_at_idx
on public.order_request_log (client_key, created_at desc);

alter table public.order_request_log enable row level security;

drop policy if exists "Public read products" on public.products;
drop policy if exists "Admin insert products" on public.products;
drop policy if exists "Admin update products" on public.products;
drop policy if exists "Admin delete products" on public.products;

create policy "Public read products"
on public.products
for select
using (true);

create policy "Admin insert products"
on public.products
for insert
with check (public.is_admin());

create policy "Admin update products"
on public.products
for update
using (public.is_admin());

create policy "Admin delete products"
on public.products
for delete
using (public.is_admin());

drop policy if exists "Public insert orders" on public.orders;
drop policy if exists "Admin insert orders" on public.orders;
drop policy if exists "Admin read orders" on public.orders;
drop policy if exists "Admin update orders" on public.orders;
drop policy if exists "Admin delete orders" on public.orders;

create policy "Admin insert orders"
on public.orders
for insert
with check (public.is_admin());

create policy "Admin read orders"
on public.orders
for select
using (public.is_admin());

create policy "Admin update orders"
on public.orders
for update
using (public.is_admin());

create policy "Admin delete orders"
on public.orders
for delete
using (public.is_admin());

create or replace function public.create_order_secure(
  p_items jsonb,
  p_customer_details jsonb,
  p_readable_id text,
  p_client_key text default null
)
returns table(order_id uuid, order_total integer, order_items jsonb)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_key text;
  v_item_count integer;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'Invalid order items payload';
  end if;

  v_item_count := jsonb_array_length(p_items);
  if v_item_count = 0 or v_item_count > 40 then
    raise exception 'Invalid amount of order items';
  end if;

  v_client_key := left(nullif(trim(coalesce(p_client_key, '')), ''), 120);
  if v_client_key is not null then
    if exists (
      select 1
      from public.order_request_log
      where client_key = v_client_key
        and created_at > now() - interval '20 seconds'
    ) then
      raise exception 'Too many checkout attempts. Please wait a few seconds.';
    end if;

    insert into public.order_request_log (client_key)
    values (v_client_key);
  end if;

  return query
  with requested as (
    select
      (value ->> 'id')::uuid as product_id,
      greatest(1, least(coalesce((value ->> 'quantity')::integer, 1), 99)) as quantity
    from jsonb_array_elements(p_items) as value
  ),
  collapsed as (
    select product_id, sum(quantity)::integer as quantity
    from requested
    where product_id is not null
    group by product_id
  ),
  priced as (
    select
      p.id,
      p.name,
      p.price,
      p.category,
      p.code,
      p.image_url,
      p.detail,
      c.quantity,
      (p.price * c.quantity)::integer as subtotal
    from collapsed c
    join public.products p on p.id = c.product_id
  ),
  summary as (
    select
      count(*)::integer as matched_count,
      coalesce(sum(subtotal), 0)::integer as total_amount,
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', id,
            'name', name,
            'price', price,
            'stock', 0,
            'category', category,
            'code', code,
            'image_url', image_url,
            'detail', detail,
            'quantity', quantity
          )
          order by name
        ),
        '[]'::jsonb
      ) as normalized_items
    from priced
  ),
  inserted as (
    insert into public.orders (readable_id, items, customer_details, client_key, total, status)
    select
      left(nullif(trim(coalesce(p_readable_id, '')), ''), 20),
      s.normalized_items,
      p_customer_details,
      v_client_key,
      s.total_amount,
      'new'
    from summary s
    where s.matched_count > 0
      and s.total_amount > 0
    returning id, total, items
  )
  select id, total, items
  from inserted;

  if not found then
    raise exception 'Could not create order from requested items';
  end if;
end;
$$;

revoke all on function public.create_order_secure(jsonb, jsonb, text, text) from public;
grant execute on function public.create_order_secure(jsonb, jsonb, text, text) to anon, authenticated;

create or replace function public.mark_order_sold_secure(p_order_id uuid)
returns table(order_id uuid, new_status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_status text;
  v_items_count integer;
  v_products_count integer;
begin
  if not public.is_admin() then
    raise exception 'Forbidden';
  end if;

  select status
  into v_current_status
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Order not found';
  end if;

  if v_current_status = 'sold' then
    return query
    select p_order_id, v_current_status;
    return;
  end if;

  with requested as (
    select
      (value ->> 'id')::uuid as product_id,
      greatest(1, least(coalesce((value ->> 'quantity')::integer, 1), 9999)) as quantity
    from public.orders o
    cross join jsonb_array_elements(o.items) as value
    where o.id = p_order_id
  ),
  collapsed as (
    select product_id, sum(quantity)::integer as quantity
    from requested
    where product_id is not null
    group by product_id
  )
  select count(*)::integer
  into v_items_count
  from collapsed;

  if coalesce(v_items_count, 0) = 0 then
    raise exception 'Order has no valid items';
  end if;

  with requested as (
    select
      (value ->> 'id')::uuid as product_id,
      greatest(1, least(coalesce((value ->> 'quantity')::integer, 1), 9999)) as quantity
    from public.orders o
    cross join jsonb_array_elements(o.items) as value
    where o.id = p_order_id
  ),
  collapsed as (
    select product_id, sum(quantity)::integer as quantity
    from requested
    where product_id is not null
    group by product_id
  ),
  locked_products as (
    select p.id
    from public.products p
    join collapsed c on c.product_id = p.id
    for update
  )
  select count(*)::integer
  into v_products_count
  from locked_products;

  if v_products_count <> v_items_count then
    raise exception 'Order references missing products';
  end if;

  if exists (
    with requested as (
      select
        (value ->> 'id')::uuid as product_id,
        greatest(1, least(coalesce((value ->> 'quantity')::integer, 1), 9999)) as quantity
      from public.orders o
      cross join jsonb_array_elements(o.items) as value
      where o.id = p_order_id
    ),
    collapsed as (
      select product_id, sum(quantity)::integer as quantity
      from requested
      where product_id is not null
      group by product_id
    )
    select 1
    from collapsed c
    join public.products p on p.id = c.product_id
    where p.stock < c.quantity
  ) then
    raise exception 'Insufficient stock for one or more products';
  end if;

  with requested as (
    select
      (value ->> 'id')::uuid as product_id,
      greatest(1, least(coalesce((value ->> 'quantity')::integer, 1), 9999)) as quantity
    from public.orders o
    cross join jsonb_array_elements(o.items) as value
    where o.id = p_order_id
  ),
  collapsed as (
    select product_id, sum(quantity)::integer as quantity
    from requested
    where product_id is not null
    group by product_id
  )
  update public.products p
  set stock = p.stock - c.quantity
  from collapsed c
  where p.id = c.product_id;

  update public.orders
  set status = 'sold'
  where id = p_order_id;

  return query
  select p_order_id, 'sold'::text;
end;
$$;

revoke all on function public.mark_order_sold_secure(uuid) from public;
grant execute on function public.mark_order_sold_secure(uuid) to authenticated;

drop policy if exists "Public read product images" on storage.objects;
drop policy if exists "Admin upload product images" on storage.objects;
drop policy if exists "Admin update product images" on storage.objects;
drop policy if exists "Admin delete product images" on storage.objects;

create policy "Public read product images"
on storage.objects
for select
using (bucket_id = 'products');

create policy "Admin upload product images"
on storage.objects
for insert
with check (bucket_id = 'products' and public.is_admin());

create policy "Admin update product images"
on storage.objects
for update
using (bucket_id = 'products' and public.is_admin());

create policy "Admin delete product images"
on storage.objects
for delete
using (bucket_id = 'products' and public.is_admin());
