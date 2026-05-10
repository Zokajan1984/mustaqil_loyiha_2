export interface Category {
  id: string;
  name: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  categaryId: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id?: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: "new" | "cooking" | "delivered";
  createdAt: string;
}
