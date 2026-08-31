export interface User {
  id: number; // Use 'number' if your Prisma ID is an Int
  email: string;
  name?: string | null;
  role?: 'USER' | 'ADMIN'; // Add any other roles you have
  defaultShippingAddress: number;
  defaultBillingAddress: number;
  createdAt: Date;
  updatedAt: Date;
  address: Object[];
  cart: Object[];
  order: Object[];
}

export interface Product {
  id: number;
  name: string;
  image_url: string;
  description: string;
  price: number;
  tags: string;
  createdAt: Date;
  updatedAt: Date;
  cart : Object[];
  orderProduct: Object []
}
