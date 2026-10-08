import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Loading03Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {Card,CardContent,CardHeader,CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useGetPackageQuery, useUpdatePackageMutation } from "@/APIs/package/packagesApi";
import { usePackages } from "@/context/packageProvider";
import useAuth from "@/hooks/useAuth";
import DocumentEditGallery from "../documents/DocumentEditGallery";

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

export default function EditPackage({
  orderId,
  onSuccess,
}: EditOrderProps) {
  const {
    data: order,
    isLoading: isLoadingOrder,
    isError: isOrderError,
  } = useGetPackageQuery(orderId);

  const [updateOrder, { isLoading }] = useUpdatePackageMutation();

  const [form, setForm] = useState({
    name: "",
    detail: "",
    amount: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!order) return;

    setForm({
      name: order.name ?? "",
      detail: order.detail ?? "",
      amount: order.amount
        ? String(order.amount)
        : "",
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
        detail: form.detail || null,
        amount: Number(form.amount || 0),
      }).unwrap();

      onSuccess?.();
    } catch (err: any) {
      setError(
        err?.data?.message ||
          "Failed to update package."
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
        Unable to load this package.
      </div>
    );
  }

    const packageData = usePackages();
  
    const packages = packageData?.data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Package #{order.id}</CardTitle>
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

          <div className="space-y-2">
            <Label htmlFor="detail">Details</Label>
            <Textarea
              id="detail"
              name="detail"
              value={form.detail}
              onChange={handleChange}
            />
          </div>

                  <div className="space-y-2">
                      <Label htmlFor="detail">Attach</Label>
                      <DocumentEditGallery itemId={orderId} type="package" documents={order.documents} accept="image/*"/>
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