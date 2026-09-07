import { OrdersClient } from "@/components/orders/OrderClient";

export const metadata = {
  title: "My Orders | SHOP XYZ",
  description: "Manage your shipping and delivery locations.",
};

export default function AddressPage() {
  return (
    <OrdersClient />
  );
}