import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {Loading03Icon,Edit02Icon,} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {Card,CardContent,CardHeader,CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {useGetOrderQuery,useUpdateOrderMutation,} from "@/APIs/order/ordersApi"
import { usePackages } from "@/context/packageProvider";
import useAuth from "@/hooks/useAuth";

type PackageOption = {
  id: number;
  name: string;
  amount?: string | number;
};

type EditOrderProps = {
  orderId: number;
  packages?: PackageOption[];
  onSuccess?: () => void;
};

export default function EditOrder({
  orderId,
  onSuccess,
}: EditOrderProps) {
  const {
    data: order,
    isLoading: isLoadingOrder,
    isError: isOrderError,
  } = useGetOrderQuery(orderId);

  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    detail: "",
    package_id: "",
    amount: "",
    date:"",
    status:""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!order) return;

    setForm({
      name: order.name ?? "",
      phone: order.phone ?? "",
      email: order.email ?? "",
      location: order.location ?? "",
      detail: order.detail ?? "",
      package_id: order.package_id
        ? String(order.package_id)
        : "",
      amount: order.amount
        ? String(order.amount)
        : "",
        date: order.date ?? "",
        status: order.status
    });
  }, [order]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePackageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const packageId = e.target.value;

    const selectedPackage = packages.find(
      (pkg) => String(pkg.id) === packageId
    );

    setForm((prev) => ({
      ...prev,
      package_id: packageId,
      amount:
        selectedPackage?.amount !== undefined
          ? String(selectedPackage.amount)
          : prev.amount,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await updateOrder({
        id: orderId,
        name: form.name,
        phone: form.phone,
        email: form.email,
        location: form.location,
        detail: form.detail || null,
        package_id: form.package_id
          ? Number(form.package_id)
          : null,
        amount: Number(form.amount || 0),
        date: form.date,
        status: form.status
      }).unwrap();

      onSuccess?.();
    } catch (err: any) {
      setError(
        err?.data?.message ||
          "Failed to update order."
      );
    }
  };

  const {isAdmin} = useAuth()

  if (isLoadingOrder) {
    return (
      <div className="flex items-center justify-center p-8">
        <HugeiconsIcon
          icon={Loading03Icon}
          size={24}
          className="animate-spin"
        />
      </div>
    );
  }

  if (isOrderError || !order) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load this order.
      </div>
    );
  }

    const packageData = usePackages();
  
    const packages = packageData?.data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Order #{order.id}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={!isAdmin}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                disabled={!isAdmin}
              />                
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (RM)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

                  { isAdmin && <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>

                      <select
                          id="status"
                          value={form.status}
                          name="status"
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                          {["done", "pending", "cancelled", "refunded"].map((pkg) => (
                              <option key={pkg} value={pkg}>
                                  {pkg}
                              </option>
                          ))}
                      </select>
                  </div>}

          <div className="space-y-2">
            <Label htmlFor="package_id">Package</Label>

            <select
              id="package_id"
              value={form.package_id}
              onChange={handlePackageChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">No package</option>

              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Textarea
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail">Details</Label>
            <Textarea
              id="detail"
              name="detail"
              value={form.detail}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="mr-2 animate-spin"
                  size={18}
                />
                Saving...
              </>
            ) : (
              <>
                <HugeiconsIcon
                  icon={Edit02Icon}
                  className="mr-2"
                  size={18}
                />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}