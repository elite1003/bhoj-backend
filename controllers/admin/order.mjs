import Order from "../../models/order.mjs";
import Recipe from "../../models/recipe.mjs";
import OrderRecipe from "../../models/order-recipe.mjs";

export const getOrders = (req, res, next) => {
  const userId = req.user.id;
  Order.findAll({
    include: [
      {
        model: Recipe,
        through: { model: OrderRecipe, attributes: ["quantity"] },
        // Recipe attributes you want to fetch
        attributes: ["id", "name", "price", "imageUrl"],
        where: { userId }, // Only include recipes created by this user
      },
    ],
  })
    .then((orders) => res.status(200).json(orders))
    .catch((error) => res.status(500).json(`Internal server error: ${error}`));
};

export const patchOrder = async (req, res, next) => {
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
