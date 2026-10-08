import { HugeiconsIcon } from "@hugeicons/react";
import {
  Call02Icon,
  Mail01Icon,
  Location01Icon,
  PackageIcon,
  Calendar03Icon,
  Loading03Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useGetOrderQuery } from "@/APIs/order/ordersApi";
import { useGetPackageQuery} from "@/APIs/package/packagesApi"
import DocumentGallery from "../documents/DocumentGallery";

// import OrderPayments from "./OrderPayments";

type OneOrderProps = {
  orderId: number;
};

export default function OnePackage({
  orderId,
}: OneOrderProps) {
  const {
    data: order,
    isLoading,
    isError,
  } = useGetPackageQuery(orderId);

  if (isLoading) {
    return (
      <div className="flex min-h-[250px] items-center justify-center">
        <HugeiconsIcon
          icon={Loading03Icon}
          size={28}
          className="animate-spin"
        />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load order #{orderId}.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Package
          </p>

          <h2 className="text-2xl font-semibold">
            #{order.id}
          </h2>
        </div>

        <Badge variant="secondary">
          {order.name}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>

        <CardContent>
          {order.detail ? (
            <p className="whitespace-pre-wrap text-sm leading-6">
              {order.detail}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No additional details.
            </p>
          )}
        </CardContent>
      </Card>

            <Card>
        <CardHeader>
          <CardTitle>Attached</CardTitle>
        </CardHeader>

        <CardContent>
          <DocumentGallery documents={order.documents}/>
        </CardContent>
      </Card>
    </div>
  );
}