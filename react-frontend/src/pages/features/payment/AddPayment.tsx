import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Cancel01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreatePaymentMutation } from "@/APIs/payment/paymentsApi";
import { useCreateDocumentMutation } from "@/APIs/document/documentsApi";

const PAYMENT_METHODS = [
  { value: "online_banking", label: "Online Banking" },
  { value: "credit_card", label: "Credit / Debit Card" },
  { value: "ewallet", label: "E-Wallet" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
];

const MAX_FILE_MB = 10; // matches 'max:10240' in DocumentController

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

type AddPaymentProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: {
    id: number;
    name?: string | null;
    phone?: string | null;
  };
  balance: number;
  currency?: string;
  proofRequired?: boolean;
  onSuccess?: () => void;
};

export default function AddPayment({
  open,
  onOpenChange,
  order,
  balance,
  currency = "MYR",
  proofRequired = false,
  onSuccess,
}: AddPaymentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
  const [createDocument] = useCreateDocumentMutation();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    amount: "",
    method: "online_banking",
    reference: "",
  });
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  // Set once the payment exists, so a retry never creates a second payment.
  // id is null if the backend response didn't include one.
  const [saved, setSaved] = useState<{ id: number | null } | null>(null);

  const isBusy = isCreating || isUploading;
  const locked = saved !== null; // payment fields can't change after creation

  // Reset only when the dialog opens. Depending on balance here would wipe
  // the retry state if the parent refetches the order in the background.
  useEffect(() => {
    if (open) {
      setForm({
        name: order.name ?? "",
        phone: order.phone ?? "",
        amount: balance.toFixed(2),
        method: "online_banking",
        reference: "",
      });
      setProofFiles([]);
      setSaved(null);
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleOpenChange = (next: boolean) => {
    if (!next && isBusy) return; // don't close mid-request

    // The payment exists even if a proof upload failed, so refresh on close
    if (!next && saved) onSuccess?.();

    onOpenChange(next);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // lets the same file be picked again

    if (picked.length === 0) return;

    const tooBig = picked.find((file) => file.size > MAX_FILE_MB * 1024 * 1024);
    if (tooBig) {
      setError(`"${tooBig.name}" is larger than ${MAX_FILE_MB} MB.`);
      return;
    }

    setError("");
    setProofFiles((prev) => [...prev, ...picked]);
  };

  const removeFile = (index: number) =>
    setProofFiles((prev) => prev.filter((_, i) => i !== index));

  // Uploads files for a payment, returns the ones that failed
  const uploadProofs = async (paymentId: number, files: File[]) => {
    const failed: File[] = [];

    for (const file of files) {
      try {
        await createDocument({ file, payment_id: paymentId }).unwrap();
      } catch {
        failed.push(file);
      }
    }

    return failed;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let paymentId = saved?.id ?? null;

    // Step 1: create the payment (skipped when retrying failed uploads)
    if (!saved) {
      const amount = Number(form.amount);

      if (!amount || amount <= 0) {
        setError("Please enter an amount greater than 0.");
        return;
      }

      if (amount > balance + 0.001) {
        setError(`Amount cannot be more than the balance (${balance.toFixed(2)}).`);
        return;
      }

      if (proofRequired && proofFiles.length === 0) {
        setError("Please attach proof of payment.");
        return;
      }

      try {
        const result: any = await createPayment({
          order_id: order.id,
          name: form.name,
          phone: form.phone,
          amount,
          currency,
          method: form.method,
          reference: form.reference || null,
        }).unwrap();

        paymentId = result?.id ?? result?.data?.id ?? result?.payment?.id ?? null;
        setSaved({ id: paymentId });
      } catch (err: any) {
        const firstValidationError = err?.data?.errors
          ? (Object.values(err.data.errors)[0] as string[])?.[0]
          : null;

        setError(
          firstValidationError ||
            err?.data?.message ||
            "Failed to add payment. Please try again."
        );
        return;
      }
    }

    // Nothing to upload: done
    if (proofFiles.length === 0) {
      onOpenChange(false);
      onSuccess?.();
      return;
    }

    if (paymentId === null) {
      setError(
        "Payment was saved, but its ID wasn't returned, so the proof couldn't be attached. Close this and upload it from the payment list."
      );
      return;
    }

    // Step 2: upload proof using the new payment id
    setIsUploading(true);
    const failed = await uploadProofs(paymentId, proofFiles);
    setIsUploading(false);

    if (failed.length === 0) {
      onOpenChange(false);
      onSuccess?.();
      return;
    }

    // Keep only the failed files so "Retry upload" doesn't resend the rest
    setProofFiles(failed);
    setError(
      `Payment saved, but ${failed.length} proof file(s) failed to upload: ${failed
        .map((file) => file.name)
        .join(", ")}`
    );
  };

  const submitLabel = () => {
    if (isCreating) return "Saving payment...";
    if (isUploading) return "Uploading proof...";
    if (saved) return "Retry upload";
    return "Submit Payment";
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            Remaining balance:{" "}
            <span className="font-medium text-foreground">
              {currency} {balance.toFixed(2)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Payment fields, locked once the payment has been created */}
          <fieldset disabled={locked} className="min-w-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Amount ({currency})</Label>
              <div className="flex gap-2">
                <Input
                  id="payment-amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  max={balance}
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, amount: balance.toFixed(2) }))
                  }
                >
                  Full balance
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <select
                id="payment-method"
                name="method"
                value={form.method}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="payment-name">Name</Label>
                <Input
                  id="payment-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Payer name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-phone">Phone</Label>
                <Input
                  id="payment-phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="012-3456789"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-reference">Reference (optional)</Label>
              <Input
                id="payment-reference"
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder="Transaction / receipt number"
              />
            </div>
          </fieldset>

          {/* Proof of payment */}
          <div className="space-y-2">
            <Label>
              Proof of Payment{" "}
              {!proofRequired && (
                <span className="font-normal text-muted-foreground">(optional)</span>
              )}
            </Label>

            {proofFiles.length > 0 && (
              <ul className="divide-y rounded-md border">
                {proofFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 p-2.5 text-sm"
                  >
                    <span className="min-w-0 truncate">{file.name}</span>

                    <span className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatSize(file.size)}
                      </span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                        disabled={isBusy}
                        aria-label={`Remove ${file.name}`}
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={14} />
                      </Button>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy || saved?.id === null}
            >
              <HugeiconsIcon icon={Add01Icon} size={16} className="mr-2" />
              {proofFiles.length > 0 ? "Add another file" : "Attach receipt / screenshot"}
            </Button>

            <p className="text-xs text-muted-foreground">
              Images or PDF, up to {MAX_FILE_MB} MB each.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handlePickFiles}
              className="hidden"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isBusy}
            >
              {saved ? "Close" : "Cancel"}
            </Button>

            <Button type="submit" disabled={isBusy || saved?.id === null}>
              {isBusy && (
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="mr-2 animate-spin"
                  size={18}
                />
              )}
              {submitLabel()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}