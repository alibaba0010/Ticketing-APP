import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/v1/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="alert alert-danger text-center shadow-sm">
            <h4 className="alert-heading mb-0">Order Expired</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card shadow-sm border-0">
          <div className="card-body text-center p-5">
            <h2 className="card-title fw-bold mb-4">Complete your Order</h2>
            <div className="alert alert-warning d-inline-block px-4">
              Time left to pay: <span className="fw-bold">{timeLeft}</span>{" "}
              seconds
            </div>
            <div className="mt-4">
              <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
                amount={order.ticket.price * 100}
                email={currentUser.email}
              />
            </div>
            {errors}
          </div>
        </div>
      </div>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/v1/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
