import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Loading03Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

import { useCreateOrderMutation } from "@/APIs/order/ordersApi";
import { usePackages } from "@/context/packageProvider";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import type { PackageData } from "@/types/packageType";

type CreateOrderProps = {
  onSuccess?: () => void;
};

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  location: "",
  detail: "",
  package_id: "",
  amount: "0",
  date: ""
};

export default function BookPelamin({ onSuccess }: CreateOrderProps) {
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const navigate = useNavigate()
  const {name, email} = useAuth()
  const packageData : PackageData = usePackages();
  const packages = packageData?.data ?? [];

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const selectedPackage = packages.find(
    (pkg : any) => String(pkg.id) === form.package_id
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Click a card to select it, click again to unselect
  const handleSelectPackage = (pkg: (typeof packages)[number]) => {
    setForm((prev) => {
      const isSelected = prev.package_id === String(pkg.id);

      return {
        ...prev,
        package_id: isSelected ? "" : String(pkg.id),
        amount: isSelected ? "0" : String(pkg.amount ?? 0),
      };
    });
  };

  useEffect(()=>{
    setForm(prev => ({
        ...prev,
        name: name,
        email: email
    }))
  },[])

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
        package_id: form.package_id ? Number(form.package_id) : null,
        amount: Number(form.amount || 0),
        date: form.date
      }).unwrap();

      setForm(emptyForm);
      onSuccess?.();
      navigate("/dashboard/order")
    } catch (err: any) {
      setError(
        err?.data?.message ||
          "Failed to create order. Please check your information."
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Pelamin</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Package picker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Choose a package</Label>

            {selectedPackage ? (
              <span className="text-sm text-muted-foreground">
                Selected:{" "}
                <span className="font-medium text-foreground">
                  {selectedPackage.name}
                </span>
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                No package selected
              </span>
            )}
          </div>

          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="py-2">
              {packages.map((pkg: any) => {
                const image = pkg.documents?.[0];
                const isSelected = form.package_id === String(pkg.id);

                const imageUrl = image
                  ? `${import.meta.env.VITE_API_URL.replace("/api", "")}/storage/${image.path}`
                  : null;

                return (
                  <CarouselItem
                    key={pkg.id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <Card
                      onClick={() => handleSelectPackage(pkg)}
                      className={`flex h-full cursor-pointer flex-col overflow-hidden transition ${
                        isSelected
                          ? "ring-2 ring-primary"
                          : "hover:shadow-md"
                      }`}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={pkg.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            Package Image
                          </div>
                        )}
                      </div>

                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>

                          {Boolean(pkg.popular) && <Badge>Popular</Badge>}
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <p className="text-sm leading-6 text-muted-foreground">
                          {pkg.detail}
                        </p>

                        <div className="mt-6">
                          <span className="text-3xl font-bold">
                            {pkg.currency} {pkg.amount}
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter>
                        {/* No onClick here: the click bubbles up to the Card */}
                        <Button
                          type="button"
                          className="w-full"
                          variant={isSelected ? "default" : "outline"}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious type="button" />
            <CarouselNext type="button" />
          </Carousel>
        </div>

        {/* Order form */}
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
                disabled
              />
            </div>

                      <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                              id="date"
                              name="date"
                              type="datetime-local"
                              value={form.date}
                              onChange={handleChange}
                              placeholder="0.00"
                              required
                          />
                      </div>
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
                <HugeiconsIcon icon={Add01Icon} className="mr-2" size={18} />
                Create Order
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}