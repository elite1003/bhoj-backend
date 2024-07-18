import Recipe from "../../models/recipe.mjs";

export const getCart = async (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => cart.getRecipes())
    .then((recipes) => {
      const mappedRecipes = recipes.map((p) => {
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: p.CartRecipe.quantity,
        };
      });
      res.status(200).json(mappedRecipes);
    })
    .catch((err) => res.status(400).json(err));
};
export const postCart = async (req, res, next) => {
  const { recipeId } = req.body;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getRecipes({ where: { id: recipeId } });
    })
    .then((recipes) => {
      let recipe;
      if (recipes.length > 0) recipe = recipes[0];
      if (recipe) {
        const oldQuantity = recipe.CartRecipe.quantity;
        newQuantity = oldQuantity + 1;
        return recipe;
      } else {
        return Recipe.findByPk(recipeId);
      }
    })
    .then((recipe) => {
      return fetchedCart.addRecipe(recipe, {
        through: { quantity: newQuantity },
      });
    })
    .then((data) => {
      res
        .status(200)
        .json(
          data ? "Recipe added to cart." : "Recipe addition to cart failed"
        );
    })
    .catch((err) => res.status(400).json(err));
};
export const deleteRecipeFromCart = async (req, res, next) => {
  const { recipeId } = req.params;
  req.user
    .getCart()
    .then((cart) => cart.getRecipes({ where: { id: recipeId } }))
    .then((recipes) => {
      const recipe = recipes[0];
      return recipe.CartRecipe.destroy();
    })
    .then((result) => {
      res
        .status(200)
        .json(
          result
            ? "Recipe deleted from cart."
            : "Recipe deletion from cart failed"
        );
    })
    .catch((err) => res.status(400).json(err));
};
