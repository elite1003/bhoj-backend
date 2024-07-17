import Order from "../../models/order.mjs";

export const getOrder = async (req, res, next) => {
  req.user
    .getRecipes({ include: ["Orders"] })
    .then((orders) => res.status(200).json(orders))
    .catch((error) => res.status(500).json(`Internal server error: ${error}`));
};

export const putOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }
    order.status = orderStatus;
    await order.save();
    return res.status(200).json(`Order updated to ${orderStatus}`);
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
};
