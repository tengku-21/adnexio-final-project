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
import OrderPayments from "./OrderPayments";

type OneOrderProps = {
  orderId: number;
};

export default function OneOrder({
  orderId,
}: OneOrderProps) {
  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrderQuery(orderId);

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
            Order
          </p>

          <h2 className="text-2xl font-semibold">
            #{order.id}
          </h2>
        </div>

        <Badge variant="secondary">
          Order
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <HugeiconsIcon
                icon={UserIcon}
                size={20}
                className="mt-0.5 text-muted-foreground"
              />

              <div>
                <p className="text-sm text-muted-foreground">
                  Name
                </p>
                <p className="font-medium">
                  {order.name}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <HugeiconsIcon
                icon={Call02Icon}
                size={20}
                className="mt-0.5 text-muted-foreground"
              />

              <div>
                <p className="text-sm text-muted-foreground">
                  Phone
                </p>
                <p className="font-medium">
                  {order.phone}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <HugeiconsIcon
                icon={Mail01Icon}
                size={20}
                className="mt-0.5 text-muted-foreground"
              />

              <div>
                <p className="text-sm text-muted-foreground">
                  Email
                </p>
                <p className="break-all font-medium">
                  {order.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card> 
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <HugeiconsIcon
                icon={PackageIcon}
                size={20}
                className="mt-0.5 text-muted-foreground"
              />

              <div>
                <p className="text-sm text-muted-foreground">
                  Package
                </p>

                <p className="font-medium">
                  {order.package?.name ||
                    (order.package_id
                      ? `Package #${order.package_id}`
                      : "No package")}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <HugeiconsIcon
                icon={Location01Icon}
                size={20}
                className="mt-0.5 text-muted-foreground"
              />

              <div>
                <p className="text-sm text-muted-foreground">
                  Location
                </p>

                <p className="font-medium">
                  {order.location}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={20}
                className="mt-0.5 text-muted-foreground"
              />

              <div>
                <p className="text-sm text-muted-foreground">
                  Event Date
                </p>

                <p className="font-medium">
                  {order.date
                    ? new Date(
                        order.date
                      ).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Payment / Amount</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Order Amount
            </span>

            <span className="text-2xl font-bold">
              RM{" "}
              {Number(order.amount ?? 0).toFixed(2)}
            </span>

            
          </div>
        </CardContent>
      </Card> */}

      {/* <PaymentCard order={order} /> */}
      <OrderPayments order={order}/>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
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
    </div>
  );
}