/**
 * Razorpay Checkout integration (client-side only).
 *
 * Uses Razorpay's Standard Checkout to open an in-app payment modal.
 * The Razorpay script is loaded lazily on first use.
 *
 * NOTE: For production, order creation should happen server-side.
 * This client-side integration is suitable for testing / early-stage.
 */

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID ?? "";

/** Lazily load the Razorpay script once */
let scriptLoaded = false;
function loadRazorpayScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      scriptLoaded = true;
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.head.appendChild(script);
  });
}

export interface RazorpayPaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface OpenCheckoutOptions {
  /** Amount in INR (will be multiplied by 100 for paise) */
  amount: number;
  /** Product / description */
  productName: string;
  /** Buyer's email */
  email?: string;
  /** Buyer's phone */
  phone?: string;
  /** Buyer's name */
  name?: string;
}

/**
 * Open a Razorpay payment modal.
 * Returns the payment result on success, or throws on failure / dismissal.
 */
export async function openRazorpayCheckout(
  opts: OpenCheckoutOptions
): Promise<RazorpayPaymentResult> {
  if (!RAZORPAY_KEY) {
    throw new Error("Razorpay key not configured. Set VITE_RAZORPAY_KEY_ID in your .env file.");
  }

  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(opts.amount * 100), // paise
      currency: "INR",
      name: "Thryft",
      description: opts.productName,
      image: "/images/logo.png",
      prefill: {
        name: opts.name ?? "",
        email: opts.email ?? "",
        contact: opts.phone ?? "",
      },
      theme: {
        color: "#e11d48", // matches primary
      },
      handler(response: RazorpayPaymentResult) {
        resolve(response);
      },
      modal: {
        ondismiss() {
          reject(new Error("Payment cancelled"));
        },
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  });
}
