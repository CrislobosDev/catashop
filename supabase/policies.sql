-- 1. Activar RLS en las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS PARA PRODUCTOS
-- Permitir que CUALQUIERA vea los productos (público)
CREATE POLICY "Public Read Products" 
ON products FOR SELECT 
USING (true);

-- Permitir que SOLO EL ADMIN (autenticado) cree, edite o borre productos
CREATE POLICY "Admin Manage Products" 
ON products FOR ALL 
USING (auth.role() = 'authenticated');

-- 3. POLÍTICAS PARA PEDIDOS (ORDERS)
-- Permitir que CUALQUIERA cree un pedido (comprar)
CREATE POLICY "Public Create Orders" 
ON orders FOR INSERT 
WITH CHECK (true);

-- Permitir que SOLO EL ADMIN vea y modifique los pedidos
CREATE POLICY "Admin Manage Orders" 
ON orders FOR ALL 
USING (auth.role() = 'authenticated');
