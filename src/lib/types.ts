export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  code?: string | null;
  image_url: string | null;
  detail: string | null;
  is_featured?: boolean | null;
  is_offer?: boolean | null;
  created_at?: string | null;
  readable_id?: string | null;
};

export type CartItem = Product & {
  quantity: number;
};

export type Order = {
  id: string;
  readable_id?: string;
  created_at: string;
  items: CartItem[];
  total: number;
  status: string;
};

export type CustomerDetails = {
  name: string;
  rut: string;
  address: string;
  email: string;
  phone: string;
  agency: string;
};
