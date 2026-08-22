export interface User {
  id: number; // Use 'number' if your Prisma ID is an Int
  email: string;
  name?: string | null;
  role?: 'USER' | 'ADMIN'; // Add any other roles you have
  defaultShippingAddress:   number;
  defaultBillingAddress :  number;
  createdAt :  Date;
  updatedAt : Date;
  address :  Object[];
  cart: Object[];
  order: Object[];
}
