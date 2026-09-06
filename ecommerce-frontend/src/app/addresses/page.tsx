import { AddressClient } from "@/components/addresses/AddressClient";

export const metadata = {
  title: "My Addresses | Your Store",
  description: "Manage your shipping and delivery locations.",
};

export default function AddressPage() {
  return (
    <AddressClient />
  );
}