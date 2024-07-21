export const getOrderWithRecipe = (req, res, next) => {
  req.user
    .getOrders({ include: ["Recipes"] })
    .then((orders) => res.status(200).json(orders))
    .catch((error) => res.status(500).json(`Internal server error: ${error}`));
};

export const postOrder = (req, res, next) => {
  const { addressId } = req.body;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getRecipes();
    })
    .then((recipes) =>
      req.user
        .createOrder({ addressId })
        .then((order) =>
          order.addRecipes(
            recipes.map((p) => {
              p.OrderRecipe = { quantity: p.CartRecipe.quantity };
              return p;
            })
          )
        )
        .catch((error) =>
          res.status(500).json(`Internal server error: ${error}`)
        )
    )
    .then((result) => fetchedCart.setRecipes(null))
    .then((result) => {
      res.status(200).json(result[0] > 0 ? true : false);
    });
};
