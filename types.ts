export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sizes: string[];
  colors: string[]; // Hex codes or names
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface ShippingZone {
  id: string;
  wilaya: string; // State/Province
  baladiya: string; // Municipality/City
  price: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  date: string;
  shippingZone: ShippingZone;
}
