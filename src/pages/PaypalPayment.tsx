import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function PaypalPayment() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const buttonId = params.get("buttonId");

  useEffect(() => {
    // Inject custom CSS for PayPal select styling and premium look
    const style = document.createElement("style");
    style.innerHTML = `
      /* Premium card look */
      .premium-paypal-card {
        background: linear-gradient(135deg, #181c25 60%, #23243a 100%);
        border: 2px solid #e6c200;
        box-shadow: 0 4px 32px 0 rgba(230, 194, 0, 0.08), 0 2px 16px 0 rgba(0,0,0,0.18);
      }
      .premium-paypal-card h2 {
        color: #fff;
        margin-bottom: 1rem;
        font-weight: 800;
        font-size: 1.5rem;
        letter-spacing: 0.5px;
        position: relative;
        text-align: center;
      }
      .premium-paypal-card h2:after {
        content: '';
        display: block;
        margin: 0.5rem auto 0 auto;
        width: 60px;
        height: 3px;
        border-radius: 2px;
        background: linear-gradient(90deg, #e6c200 0%, #fffbe6 100%);
      }
      /* PayPal select and options override */
      [id^='paypal-container-'] select,
      [id^='paypal-container-'] option {
        background: #23243a !important;
        color: #fff !important;
        border: 1px solid #e6c200 !important;
        font-weight: 600 !important;
      }
      [id^='paypal-container-'] select:focus {
        outline: 2px solid #e6c200 !important;
      }
      [id^='paypal-container-'] input,
      [id^='paypal-container-'] textarea {
        background: #23243a !important;
        color: #fff !important;
        border: 1px solid #e6c200 !important;
      }
      [id^='paypal-container-'] label {
        color: #fff !important;
        font-weight: 500 !important;
      }
    `;
    document.head.appendChild(style);

    if (!buttonId) return;

    // Only add the PayPal SDK script if it doesn't already exist
    const existingScript = document.querySelector("script[src*='paypal.com/sdk/js']");
    let script: HTMLScriptElement | null = null;

    if (!existingScript) {
      script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=BAAVhQ-XV0bu4stPIr4QY9p_HfNWMaJe_lPkYOg8QvRMDwXtkbdcCKD7n5-gdXOAEdhoGQWKV4RAj7Unwc&components=hosted-buttons&disable-funding=venmo&currency=USD";
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        if (window.paypal) {
          // @ts-ignore
          window.paypal.HostedButtons({ hostedButtonId: buttonId }).render(`#paypal-container-${buttonId}`);
        }
      };
      document.body.appendChild(script);
    } else {
      // If script already exists, just render the button
      // @ts-ignore
      if (window.paypal) {
        // @ts-ignore
        window.paypal.HostedButtons({ hostedButtonId: buttonId }).render(`#paypal-container-${buttonId}`);
      }
    }

    return () => {
      document.head.removeChild(style);
      // Clean up the button container, but do not remove the script
      const container = document.getElementById(`paypal-container-${buttonId}`);
      if (container) container.innerHTML = "";
    };
  }, [buttonId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#10131a",
      }}
    >
      <div
        className="premium-paypal-card"
        style={{
          padding: "1.5rem 1.5rem",
          borderRadius: "20px",
          width: 500,
          height: 500,
          maxWidth: "95vw",
          maxHeight: "95vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <h2>Pay with PayPal</h2>
        {buttonId ? (
          <div id={`paypal-container-${buttonId}`} style={{ width: "100%", marginTop: 8 }}></div>
        ) : (
          <p style={{ color: "#fff", textAlign: 'center' }}>Invalid PayPal button.</p>
        )}
      </div>
    </div>
  );
} 