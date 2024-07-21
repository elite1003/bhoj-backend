import Order from "../../models/order.mjs";

export const postPayment = (req, res, next) => {
  const { orderId } = req.params;
  const { paymentMethod } = req.body;

  Order.findByPk(orderId)
    .then((order) => {
      order
        .createPayment({ paymentMethod, paymentStatus: "Pending" })
        .then((payment) => res.status(200).json(payment))
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(400).json(error));
};
