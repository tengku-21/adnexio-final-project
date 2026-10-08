import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useCreateOrderMutation } from "@/APIs/order/ordersApi";
import { useGetPackageQuery } from "@/APIs/package/packagesApi";
import { usePackages } from "@/context/packageProvider";
import useAuth from "@/hooks/useAuth";

type PackageOption = {
  id: number;
  name: string;
  amount?: string | number;
};

type CreateOrderProps = {
  packages?: PackageOption[];
  onSuccess?: () => void;
};

export default function CreateOrder({
  onSuccess,
}: CreateOrderProps) {
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    detail: "",
    package_id: "",
    amount: 0.00,
    date:""
  });

  const [error, setError] = useState("");

  const {name, email} = useAuth()

  useEffect(()=>{
    setForm(prev => ({
        ...prev,
        name: name,
        email: email
    }))
  },[])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      await createOrder({
        name: form.name,
        phone: form.phone,
        email: form.email,
        location: form.location,
        detail: form.detail || null,
        package_id: form.package_id
          ? Number(form.package_id)
          : null,
        amount: Number(form.amount || 0),
        date : form.date
      }).unwrap();

      setForm({
        name: "",
        phone: "",
        email: "",
        location: "",
        detail: "",
        package_id: "",
        amount: 0,
        date : ""
      });

      onSuccess?.();
    } catch (err: any) {
      setError(
        err?.data?.message ||
          "Failed to create order. Please check your information."
      );
    }
  };

  const packageData = usePackages();

  const packages = packageData?.data ?? []


  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Order</CardTitle>
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
                placeholder="Customer name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="012-3456789"
                required
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
                placeholder="customer@example.com"
                required
                disabled
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
                placeholder="0.00"
                required
              />
            </div>

                      <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                              id="date"
                              name="date"
                              type="datetime"
                              value={form.date}
                              onChange={handleChange}
                              placeholder="0.00"
                              required
                          />
                      </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="package_id">Package</Label>

            <select
              id="package_id"
              name="package_id"
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
              placeholder="Event / delivery location"
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
              placeholder="Additional order details..."
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
                Creating...
              </>
            ) : (
              <>
                <HugeiconsIcon
                  icon={Add01Icon}
                  className="mr-2"
                  size={18}
                />
                Create Order
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}