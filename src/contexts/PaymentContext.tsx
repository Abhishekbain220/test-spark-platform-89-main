import axios from "../components/utils/axios";
import React, { createContext, useContext, useState } from "react";

// 1. Define context type (updated to include paymentSwitch + setter)
type PaymentContextType = {
  pay: (amountInRupees: number) => Promise<void>;
  paymentSwitch: boolean;
  setPaymentSwitch: React.Dispatch<React.SetStateAction<boolean>>;
};

// 2. Create context with proper typing
export const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// 3. Provider component
export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
  const [paymentSwitch, setPaymentSwitch] = useState(false);

  const pay = async (amountInRupees: number) => {
    try {
      // Ask server for public key & order
      const [{ data: { key } }, { data: { order } }] = await Promise.all([
        axios.get("/api/payments/key"),
        axios.post("/api/payments/order", {
          amountInRupees,
          receiptId: "order_rcptid_11",
          notes: { purpose: "Pro Plan" },
        }),
      ]);

      console.log("Created order:", order);

      // Razorpay options
      const options = {
        key,
        amount: order.amount, // in paise
        currency: order.currency,
        name: "Your Company",
        description: "Pro Plan Payment",
        order_id: order.id, // REQUIRED
        prefill: {
          name: "ABHISHEK",
          email: "user@example.com",
          contact: "9999999999",
        },
        notes: order.notes,
        handler: async (response: any) => {
          // Verify payment
          const verifyRes = await axios.post("/api/payments/verify", response);
          if (verifyRes.data.verified) {
            alert("Payment successful ✅");
            setPaymentSwitch(true);
          } else {
            alert("Verification failed ❌");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed ❌");
    }
  };

  return (
    <PaymentContext.Provider value={{ pay, paymentSwitch, setPaymentSwitch }}>
      {children}
    </PaymentContext.Provider>
  );
};

// 4. Custom hook (safe usage)
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("usePayment must be used within a PaymentProvider");
  return context;
};
