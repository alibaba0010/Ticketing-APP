import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = ({ doRequest }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    // Create a token to mimic the legacy behavior of react-stripe-checkout
    // which the backend likely expects ({ token: id })
    const { error, token } = await stripe.createToken(
      elements.getElement(CardElement)
    );

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      setError(null);
      // Send the token ID to the backend
      await doRequest({ token: token.id });
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label text-start d-block fw-bold text-muted">
          Card Details
        </label>
        <div className="form-control p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>
      {error && <div className="text-danger mb-3">{error}</div>}
      <button
        type="submit"
        className="btn btn-primary w-100 py-2"
        disabled={!stripe || processing}
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
