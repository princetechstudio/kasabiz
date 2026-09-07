const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;
const PAYSTACK_SCRIPT_URL = "https://js.paystack.co/v2/inline.js";

type PaystackTransaction = {
  reference: string;
  status: string;
  transaction: string;
};

type PaystackPop = {
  resumeTransaction: (accessCode: string) => void;
  newTransaction: (options: {
    key: string;
    email: string;
    amount: number;
    currency: "GHS";
    ref: string;
    metadata: { plan: string; billing: string };
    onSuccess: (transaction: PaystackTransaction) => void;
    onCancel: () => void;
  }) => void;
};

declare global {
  interface Window {
    PaystackPop?: { setup: (options: { key: string }) => PaystackPop };
  }
}

export function isPaystackConfigured(): boolean {
  return Boolean(PAYSTACK_PUBLIC_KEY);
}

export function getPaystackPublicKey(): string {
  if (!PAYSTACK_PUBLIC_KEY) {
    throw new Error("Paystack is not configured. Add VITE_PAYSTACK_PUBLIC_KEY.");
  }
  return PAYSTACK_PUBLIC_KEY;
}

export function createPaystackReference(businessId: string): string {
  return `sika_${businessId}_${Date.now()}`;
}

export const PAYSTACK_PLAN = {
  name: "Business",
  firstMonthAmountGhs: 30,
  recurringAmountGhs: 60,
  currency: "GHS",
} as const;

async function loadPaystack(): Promise<PaystackPop> {
  if (window.PaystackPop) return window.PaystackPop.setup({ key: getPaystackPublicKey() });
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PAYSTACK_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load Paystack checkout.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = PAYSTACK_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Paystack checkout."));
    document.head.appendChild(script);
  });
  const paystack = (window as Window & { PaystackPop?: { setup: (options: { key: string }) => PaystackPop } }).PaystackPop;
  if (!paystack) throw new Error("Paystack checkout is unavailable.");
  return paystack.setup({ key: getPaystackPublicKey() });
}

export async function startPaystackCheckout(input: {
  email: string;
  businessId: string;
  yearly: boolean;
}): Promise<PaystackTransaction> {
  const checkout = await loadPaystack();
  const amountGhs = input.yearly ? PAYSTACK_PLAN.recurringAmountGhs * 12 : PAYSTACK_PLAN.firstMonthAmountGhs;
  return new Promise((resolve, reject) => {
    checkout.newTransaction({
      key: getPaystackPublicKey(),
      email: input.email,
      amount: amountGhs * 100,
      currency: PAYSTACK_PLAN.currency,
      ref: createPaystackReference(input.businessId),
      metadata: { plan: PAYSTACK_PLAN.name, billing: input.yearly ? "yearly" : "monthly" },
      onSuccess: (transaction) => resolve(transaction),
      onCancel: () => reject(new Error("Payment was cancelled.")),
    });
  });
}
