import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddPayment from "../payment/AddPayment";
import DocumentGallery from "../documents/DocumentGallery";

export type Payment = {
  id: number;
  order_id: number;
  user_id: number | null;
  name: string;
  phone: string;
  amount: string | number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded" | string;
  gateway: string | null;
  method: string | null;
  reference: string | null;
  paid_at: string | null;
  failed_at: string | null;
  created_at: string;
  updated_at: string;
};

type OrderPaymentsProps = {
  order: {
    id: number;
    name?: string | null;
    phone?: string | null;
    amount?: string | number | null;
    payments?: Payment[];
  };
  onPaymentAdded?: () => void; // e.g. refetch the order
};

const formatMoney = (value: string | number | null | undefined, currency = "MYR") =>
  new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency,
  }).format(Number(value ?? 0));

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleString("en-MY", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kuala_Lumpur",
      })
    : "-";

// "online_banking" -> "Online Banking"
const humanize = (value: string | null) =>
  value
    ? value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "-";

const statusStyles: Record<string, string> = {
  paid: "border-transparent bg-green-100 text-green-700 hover:bg-green-100",
  pending: "border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  failed: "border-transparent bg-red-100 text-red-700 hover:bg-red-100",
  refunded: "border-transparent bg-slate-100 text-slate-700 hover:bg-slate-100",
};

function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={`capitalize ${statusStyles[status] ?? ""}`}
    >
      {status}
    </Badge>
  );
}

export default function OrderPayments({ order, onPaymentAdded }: OrderPaymentsProps) {
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);

  const payments = order.payments ?? [];
  const orderAmount = Number(order.amount ?? 0);

  const totalPaid = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);

  // Round to 2 decimals to avoid floating point leftovers like 0.0000001
  const balance = Math.max(Math.round((orderAmount - totalPaid) * 100) / 100, 0);
  const progress =
    orderAmount > 0 ? Math.min((totalPaid / orderAmount) * 100, 100) : 0;

  const isFullyPaid = orderAmount > 0 && balance === 0;
  const canAddPayment = balance > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Payment / Amount</CardTitle>

          <div className="flex items-center gap-2">
            {isFullyPaid ? (
              <PaymentStatusBadge status="paid" />
            ) : (
              <Badge variant="outline">
                {totalPaid > 0 ? "Partially paid" : "Unpaid"}
              </Badge>
            )}

            {canAddPayment && (
              <Button size="sm" onClick={() => setAddPaymentOpen(true)}>
                Make Payment
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Order Amount</p>
              <p className="text-2xl font-bold">{formatMoney(orderAmount)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {formatMoney(totalPaid)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold">{formatMoney(balance)}</p>
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Payment history */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">
            Payment History{" "}
            <span className="text-muted-foreground">({payments.length})</span>
          </h3>

          {payments.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              No payments recorded for this order yet.
            </div>
          ) : (
                          <ul className="divide-y rounded-md border">
                              {payments.map((payment) => (
                                  <li
                                      key={payment.id}
                                      className="grid gap-3 p-4 sm:grid-cols-2"
                                  >
                                      {/* 1 */}
                                      <div className="space-y-1">
                                          <div className="flex flex-wrap items-center gap-2">
                                              <span className="font-medium">
                                                  {payment.reference ?? `Payment #${payment.id}`}
                                              </span>
                                              <PaymentStatusBadge status={payment.status} />
                                          </div>

                                          <p className="text-sm text-muted-foreground">
                                              {humanize(payment.method)}
                                              {payment.gateway && <> · {humanize(payment.gateway)}</>}
                                          </p>

                                          <p className="text-sm text-muted-foreground">
                                              {payment.name} · {payment.phone}
                                          </p>

                                          <p className="text-xs text-muted-foreground">
                                              {payment.status === "failed"
                                                  ? `Failed on ${formatDate(payment.failed_at)}`
                                                  : payment.paid_at
                                                      ? `Paid on ${formatDate(payment.paid_at)}`
                                                      : `Created on ${formatDate(payment.created_at)}`}
                                          </p>
                                      </div>

                                      {/* 2 */}
                                      <div className="text-lg font-semibold sm:text-right">
                                          {formatMoney(payment.amount, payment.currency)}
                                      </div>

                                      {/* 3 */}
                                      <div className="sm:col-span-2">
                                          <DocumentGallery documents={payment.documents} />
                                      </div>
                                  </li>

              ))}
            </ul>
          )}
        </div>

       
      </CardContent>

      {/* Popup */}
      {canAddPayment && (
        <AddPayment
          open={addPaymentOpen}
          onOpenChange={setAddPaymentOpen}
          order={order}
          balance={balance}
          onSuccess={onPaymentAdded}
        />
      )}
    </Card>
  );
}