import React, { useState } from "react";

const RAZORPAY_KEY = "YOUR_KEY_ID"; // 🔑 Replace with your actual Razorpay key

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | error

  const handlePayment = async () => {
    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Failed to load Razorpay. Check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://payment-gateway-8f2m.onrender.com/create-order",
        { method: "POST" }
      );
      const data = await res.json();

      const options = {
        key: RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: "Arieeb App",
        description: "Test Payment",
        order_id: data.id,
        handler: function (response) {
          setStatus("success");
          console.log("Payment successful:", response);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: { color: "#6c63ff" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setStatus("error");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Order creation failed:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setStatus("idle");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pg-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #08080f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        /* ── card ── */
        .pg-card {
          background: #11111c;
          border: 0.5px solid #22223a;
          border-radius: 24px;
          width: 100%;
          max-width: 420px;
          overflow: hidden;
        }

        /* ── header band ── */
        .pg-header {
          padding: 1.75rem 2rem;
          border-bottom: 0.5px solid #1a1a2e;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pg-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pg-logo {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: #6c63ff;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 15px; color: #fff; font-weight: 700;
        }

        .pg-brand-name { font-size: 15px; font-weight: 500; color: #e8e6f4; }
        .pg-brand-sub  { font-size: 12px; color: #56567a; margin-top: 2px; }

        .pg-amount-pill {
          background: #18182e;
          border: 0.5px solid #2a2a44;
          border-radius: 12px;
          padding: 8px 16px;
          text-align: right;
        }

        .pg-amount-label { font-size: 11px; color: #56567a; letter-spacing: 0.04em; }

        .pg-amount-value {
          font-family: 'Space Mono', monospace;
          font-size: 22px; font-weight: 700;
          color: #a78bfa;
          line-height: 1.2;
        }

        /* ── order summary ── */
        .pg-summary {
          padding: 1.5rem 2rem;
          border-bottom: 0.5px solid #1a1a2e;
        }

        .pg-summary-title {
          font-size: 11px; letter-spacing: 0.06em; color: #56567a;
          text-transform: uppercase; margin-bottom: 14px;
        }

        .pg-line {
          display: flex; justify-content: space-between; align-items: center;
          padding: 7px 0;
        }

        .pg-line-label { font-size: 13px; color: #8888aa; }
        .pg-line-value { font-size: 13px; color: #c4c0d8; font-weight: 500; }

        .pg-divider {
          height: 0.5px; background: #1a1a2e; margin: 8px 0;
        }

        .pg-line-total .pg-line-label { color: #c4c0d8; font-weight: 500; font-size: 14px; }
        .pg-line-total .pg-line-value { color: #a78bfa; font-weight: 600; font-size: 16px; font-family: 'Space Mono', monospace; }

        /* ── methods strip ── */
        .pg-methods {
          padding: 1.25rem 2rem;
          border-bottom: 0.5px solid #1a1a2e;
        }

        .pg-methods-title {
          font-size: 11px; letter-spacing: 0.06em; color: #56567a;
          text-transform: uppercase; margin-bottom: 12px;
        }

        .pg-method-chips {
          display: flex; gap: 8px; flex-wrap: wrap;
        }

        .pg-chip {
          display: flex; align-items: center; gap: 6px;
          background: #18182e; border: 0.5px solid #2a2a44;
          border-radius: 8px; padding: 6px 12px;
          font-size: 12px; color: #8888aa;
        }

        .pg-chip-dot {
          width: 6px; height: 6px; border-radius: 50%;
        }

        /* ── footer ── */
        .pg-footer {
          padding: 1.5rem 2rem 2rem;
        }

        /* ── pay button ── */
        .pg-pay-btn {
          width: 100%;
          padding: 15px;
          background: #6c63ff;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 15px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s, opacity 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          position: relative;
          overflow: hidden;
        }

        .pg-pay-btn:hover:not(:disabled) { background: #7c73ff; }
        .pg-pay-btn:active:not(:disabled) { transform: scale(0.985); }
        .pg-pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .pg-pay-btn svg { width: 17px; height: 17px; flex-shrink: 0; }

        .pg-secure {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin-top: 14px; font-size: 12px; color: #3c3c5a;
        }

        .pg-secure svg { width: 12px; height: 12px; }

        /* ── loading dots ── */
        .pg-dots span {
          display: inline-block;
          width: 5px; height: 5px; border-radius: 50%; background: #fff;
          margin: 0 2px;
          animation: pgBounce 1.1s infinite;
        }
        .pg-dots span:nth-child(2) { animation-delay: 0.18s; }
        .pg-dots span:nth-child(3) { animation-delay: 0.36s; }

        @keyframes pgBounce {
          0%,80%,100% { transform: scale(0.55); opacity: 0.45; }
          40%          { transform: scale(1);    opacity: 1; }
        }

        /* ── success / error screens ── */
        .pg-result {
          padding: 3rem 2rem;
          display: flex; flex-direction: column; align-items: center; text-align: center;
        }

        .pg-result-icon {
          width: 68px; height: 68px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem;
        }

        .pg-result-icon.success {
          background: #0e2a1a; border: 0.5px solid #1e5a34;
        }
        .pg-result-icon.error {
          background: #2a0e0e; border: 0.5px solid #5a1e1e;
        }

        .pg-result-icon svg { width: 30px; height: 30px; }

        .pg-result h2 { font-size: 19px; font-weight: 500; color: #e8e6f4; margin-bottom: 6px; }
        .pg-result p  { font-size: 13px; color: #56567a; line-height: 1.6; }

        .pg-txn-ref {
          background: #18182e; border: 0.5px solid #2a2a44;
          border-radius: 10px; padding: 10px 18px;
          margin: 1.1rem 0;
          font-family: 'Space Mono', monospace;
          font-size: 13px; color: #a78bfa; letter-spacing: 0.05em;
        }

        .pg-reset-btn {
          margin-top: 1.25rem; width: 100%; padding: 13px;
          background: transparent;
          border: 0.5px solid #2a2a44;
          border-radius: 12px; color: #8888aa;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
        }
        .pg-reset-btn:hover { border-color: #6c63ff; color: #c4c0d8; }

        /* ── razorpay badge ── */
        .pg-rzp {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          margin-top: 10px; font-size: 11px; color: #2e2e4a;
        }
      `}</style>

      <div className="pg-root">

        {/* ── SUCCESS STATE ── */}
        {status === "success" && (
          <div className="pg-card">
            <div className="pg-result">
              <div className="pg-result-icon success">
                <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2>Payment Successful!</h2>
              <p>Your transaction was completed<br />and confirmed by Razorpay.</p>
              <div className="pg-txn-ref">
                TXN#{Math.random().toString(36).substring(2, 10).toUpperCase()}
              </div>
              <p style={{ fontSize: 12, color: "#3c3c5a" }}>
                A receipt has been sent to your registered email.
              </p>
              <button className="pg-reset-btn" onClick={reset}>
                Make Another Payment
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {status === "error" && (
          <div className="pg-card">
            <div className="pg-result">
              <div className="pg-result-icon error">
                <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h2>Payment Failed</h2>
              <p>Something went wrong during<br />your transaction. Please try again.</p>
              <button className="pg-reset-btn" onClick={reset} style={{ marginTop: "1.5rem" }}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ── MAIN CHECKOUT CARD ── */}
        {status === "idle" && (
          <div className="pg-card">

            {/* Header */}
            <div className="pg-header">
              <div className="pg-brand">
                <div className="pg-logo">A</div>
                <div>
                  <div className="pg-brand-name">Arieeb App</div>
                  <div className="pg-brand-sub">Secure Checkout</div>
                </div>
              </div>
              <div className="pg-amount-pill">
                <div className="pg-amount-label">TOTAL DUE</div>
                <div className="pg-amount-value">₹500</div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="pg-summary">
              <div className="pg-summary-title">Order Summary</div>
              <div className="pg-line">
                <span className="pg-line-label">Test Payment</span>
                <span className="pg-line-value">₹500.00</span>
              </div>
              <div className="pg-line">
                <span className="pg-line-label">GST (18%)</span>
                <span className="pg-line-value">₹0.00</span>
              </div>
              <div className="pg-divider" />
              <div className="pg-line pg-line-total">
                <span className="pg-line-label">Total</span>
                <span className="pg-line-value">₹500.00</span>
              </div>
            </div>

            {/* Accepted Methods */}
            <div className="pg-methods">
              <div className="pg-methods-title">Accepted Via</div>
              <div className="pg-method-chips">
                {[
                  { label: "Cards",       color: "#6c63ff" },
                  { label: "UPI",         color: "#4ade80" },
                  { label: "Net Banking", color: "#60a5fa" },
                  { label: "Wallets",     color: "#f59e0b" },
                ].map(({ label, color }) => (
                  <div className="pg-chip" key={label}>
                    <span className="pg-chip-dot" style={{ background: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pg-footer">
              <button
                className="pg-pay-btn"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <div className="pg-dots">
                    <span /><span /><span />
                  </div>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Pay ₹500 Securely
                  </>
                )}
              </button>

              <div className="pg-secure">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                256-bit SSL encrypted · PCI DSS compliant
              </div>

              <div className="pg-rzp">Powered by Razorpay</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Payment;