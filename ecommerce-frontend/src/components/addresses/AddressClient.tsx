"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useErrorToast } from "@/hooks/error-toast";
import { useAddressStore } from "@/store/useAddressStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "./schema";
import { useForm, Controller } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";

export function AddressClient() {
  const [mounted, setMounted] = useState(false);

  // 1. Extract user and changeDefaultAddress from the auth store
  const user = useAuthStore((state) => state.user);
  const changeDefaultAddress = useAuthStore(
    (state) => state.changeDefaultAddress,
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Safe initialization (fallback to empty string if undefined)
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<string>(
    user?.defaultShippingAddress?.toString() || "",
  );

  const { showErrorToast } = useErrorToast();
  const { addresses, addAddress, removeAddress, setAddresses } =
    useAddressStore();

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    mode: "onChange",
    defaultValues: {
      lineOne: "",
      lineTwo: "",
      city: "",
      pincode: "",
      country: "",
    },
  });

  useEffect(() => {
    setMounted(true);
    setAddresses();
  }, [setAddresses]);

  if (!mounted) return null;

  async function onSubmit(data: z.infer<typeof addressSchema>) {
    
    // 1. Clean the payload to satisfy backend strict validation
    const payload = {
      ...data,
      // If the user left lineTwo blank, send 'null' instead of an empty string
      lineTwo: data.lineTwo === "" ? null : data.lineTwo,
      
      // FIX 2 (Optional but common): 
      // If your backend database expects 'pincode' to be an Integer, uncomment the line below:
      // pincode: Number(data.pincode) 
    };

    // 2. Send the cleaned payload
    addAddress(payload, showErrorToast);
    
    setIsDialogOpen(false);
    form.reset();
  }

  const handleDelete = (id: number) => {
    removeAddress(id, showErrorToast);
    // If the active address is deleted, clear the selection
    if (selectedAddressIndex === id.toString()) {
      setSelectedAddressIndex("");
    }
  };

  // 2. Custom handler to update local UI and trigger the store update
  const handleAddressChange = (value: string) => {
    setSelectedAddressIndex(value);
    changeDefaultAddress(Number(value), showErrorToast);
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Shipping Addresses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your delivery locations
          </p>
        </div>

        {/* Add Address Dialog */}
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Address
        </Button>

        {/* 2. Dialog controlled completely by your state */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                  Enter the details for your new delivery location.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup className="space-y-4 py-4">
                <Controller
                  name="lineOne"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-2"
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium leading-none"
                      >
                        House No./Apartment/Street :
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        value={field.value ?? ""}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        className="w-full"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-[0.8rem] font-medium text-destructive"
                        />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="lineTwo"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-2"
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium leading-none"
                      >
                        {" "}
                        Area/Landmark/Town :
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        value={field.value ?? ""}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        className="w-full"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-[0.8rem] font-medium text-destructive"
                        />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="city"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-2"
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium leading-none"
                      >
                        City :
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        value={field.value ?? ""}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        className="w-full"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-[0.8rem] font-medium text-destructive"
                        />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="pincode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-2"
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium leading-none"
                      >
                        PIN Code:
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        value={field.value ?? ""}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        className="w-full"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-[0.8rem] font-medium text-destructive"
                        />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="country"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-2"
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium leading-none"
                      >
                        Country :
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        value={field.value ?? ""}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        className="w-full"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-[0.8rem] font-medium text-destructive"
                        />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  type="submit"
                  form="form-rhf-demo"
                  className="w-full sm:w-auto bg-primary"
                >
                  Save Address
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            You haven't saved any delivery addresses yet. Add one to make
            checkout faster.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">
            Add Your First Address
          </Button>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Select Default Address
            </CardTitle>
            <CardDescription>
              This address will be selected automatically at checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* 3. Replaced raw setSelectedAddressIndex with handleAddressChange */}
            <RadioGroup
              value={selectedAddressIndex}
              onValueChange={handleAddressChange}
              className="space-y-4"
            >
              {addresses.map((address) => {
                const isActive = selectedAddressIndex === address.id.toString();

                return (
                  <div
                    key={address.id}
                    className={`relative flex items-start space-x-4 border rounded-lg p-4 transition-all duration-200 ${
                      isActive
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem
                      value={address.id.toString()}
                      id={`address-${address.id}`}
                      className="mt-1"
                    />

                    <Label
                      htmlFor={`address-${address.id}`}
                      className="flex-1 cursor-pointer flex flex-col gap-1 leading-relaxed"
                    >
                      <span className="font-semibold text-base">
                        {address.lineOne}
                      </span>
                      {address.lineTwo && (
                        <span className="font-semibold text-base">
                          {address.lineTwo}
                        </span>
                      )}
                      <span className="text-muted-foreground font-normal">
                        {address.city}
                      </span>
                      <span className="text-muted-foreground font-normal">
                        {address.country}, {address.pincode}
                      </span>
                    </Label>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 z-10 relative"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(address.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete address</span>
                    </Button>
                  </div>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
