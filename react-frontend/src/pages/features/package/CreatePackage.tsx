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
import {  useCreatePackageMutation } from "@/APIs/package/packagesApi";
import { usePackages } from "@/context/packageProvider";

type PackageOption = {
  id: number;
  name: string;
  amount?: string | number;
};

type CreateOrderProps = {
  packages?: PackageOption[];
  onSuccess?: () => void;
};

export default function CreatePackage({
  onSuccess,
}: CreateOrderProps) {
  const [createOrder, { isLoading }] = useCreatePackageMutation();

  const [form, setForm] = useState({
    name: "",
    detail: "",
    amount: 0.00,
  });

  const [error, setError] = useState("");


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
        detail: form.detail || null,
        amount: Number(form.amount || 0),
      }).unwrap();

      setForm({
        name: "",
        detail: "",
        amount: 0,
      });

      onSuccess?.();
    } catch (err: any) {
      setError(
        err?.data?.message ||
          "Failed to create package. Please check your information."
      );
    }
  };

  const packageData = usePackages();

  const packages = packageData?.data ?? []


  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Package</CardTitle>
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Package name"
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
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail">Details</Label>
            <Textarea
              id="detail"
              name="detail"
              value={form.detail}
              onChange={handleChange}
              placeholder="Additional package details..."
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
                Create Package
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}