const express = require("express");
const router = express.Router();
const {
  addUser,
  getAllUsers,
  getUser,
  getUserWithEmail,
  updateUser,
  deleteUser,
  loginUser,
  logout,
  addUserAdmin,
  updateUserPassword,
  loginUserWithEmail,
  checkPassword,
} = require("../controllers/userContollers");
const {
  addOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  addCreoterOrder,
  getAllCreoterOrders
} = require("../controllers/orderController");

const {
  addFavorite,
  getAllFavorites,
  getFavorite,
  updateFavorite,
  deleteFavorite,
  deleteFavoriteById,
  getFavoriteById,
  addExFavorite,
  getAllExFavorites,
  getExFavorite,
  deleteExFavorite,
} = require("../controllers/favoriteController");

const {
  addCart,
  getAllCarts,
  getCart,
  updateCart,
  deleteCart,
  clearCarts,
} = require("../controllers/cartController");

const { sendEmail } = require("../controllers/sendMail");

/*  Email post actions */
router.post("/users/:userId/sendEmail", sendEmail); // send email
router.post("/users/sendEmail", sendEmail); // send email

/*  post actions */
router.post("/users", addUser); // add user
router.post("/users-admin", addUserAdmin); // add user with email
router.post("/users/:userId/orders", addOrder); // add order
router.post("/orders", addCreoterOrder); // add order in creoterorders collection
router.post("/users/:userId/favorites/:favoriteId", addFavorite); // add favorite
router.post("/users/:userId/carts/:cartId", addCart); // add cart
router.post("/users/:userId/exfavorites/:exfavoriteId", addExFavorite); // add  exfavorites colecction

/* get actions */
router.get("/users", getAllUsers); // get all users
router.get("/users/:userId/orders", getAllOrders); // get all orders
router.get("/users/:userId/favorites", getAllFavorites); // get all favorites
router.get("/users/:userId/exfavorites", getAllExFavorites); // get all ex favorites
router.get("/users/:userId/favorites/product/:productId", getFavoriteById); // get favorites by id
router.get("/users/:userId/exfavorites/product/:productId", getExFavorite); // get ex favorites by id
router.get("/users/:userId/carts", getAllCarts); // get all carts
router.get("/users/:userId", getUser); // get user by id
router.get("/users/email/:email", getUserWithEmail); // get user by email
router.get("/users/:userId/orders/:orderId", getOrder); // get order by id
router.get("/users/:userId/favorites/:favoriteId", getFavorite); // get favorite by id
router.get("/users/:userId/carts/:cartId", getCart); // get cart by id

/* delete actions */
router.delete("/users/:userId", deleteUser); // delete user
router.delete("/users/:userId/orders/:orderId", deleteOrder); // delete order
router.delete("/users/:userId/favorites/:favoriteId", deleteFavorite); // delete favorite
router.delete("/users/:userId/exfavorites/:favoriteId", deleteExFavorite); // delete ex favorite by id
router.delete(
  "/users/:userId/favorites/product/:productId",
  deleteFavoriteById
); // delete favorite by id
router.delete("/users/:userId/carts/:cartId", deleteCart); // delete cart
router.delete("/users/:userId/carts", clearCarts); // delete all carts

/* put actions */
router.put("/users/:userId", updateUser); // update user
router.put("/users/:userId/password", updateUserPassword); // update user password
router.put("/users/:userId/orders/:orderId", updateOrder); // update order
router.put("/users/:userId/favorites/:favoriteId", updateFavorite); // update favorite
router.put("/users/:userId/carts/:cartId", updateCart); // update cart

/* llogin post actions */
router.post("/login", loginUser); // login user
router.post("/checkpassword/:userId", checkPassword); // check password
router.post("/loginEmail/:email", loginUserWithEmail); // login user with email
router.post("/logout", logout); // logout user

module.exports = {
  routes: router,
};
