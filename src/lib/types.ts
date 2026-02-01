export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image_url: string | null;
  detail: string | null;
  is_featured?: boolean | null;
  is_offer?: boolean | null;
  created_at?: string | null;
};

export type CartItem = Product & {
  quantity: number;
};

export type Order = {
  id: string;
  created_at: string;
  items: CartItem[];
  total: number;
  status: string;
};
