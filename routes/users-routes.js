const express = require('express');
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
  addUserAdmin
} = require('../controllers/userContollers');
const {
  addOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  addCreoterOrder
} = require('../controllers/orderController');

const {addFavorite, 
    getAllFavorites, 
    getFavorite,
    updateFavorite,
    deleteFavorite,
    deleteFavoriteById,
    getFavoriteById
   } = require('../controllers/favoriteController');

const {addCart, 
    getAllCarts, 
    getCart,
    updateCart,
    deleteCart,
    clearCarts
   } = require('../controllers/cartController');

const { sendEmail } = require('../controllers/sendMail');

// send email
router.post('/users/:userId/sendEmail', sendEmail);

// send email
router.post('/users/sendEmail', sendEmail);

// add user
router.post('/users', addUser);

// add user
router.post('/users-admin', addUserAdmin);

// add order
router.post('/users/:userId/orders', addOrder);

// add order
router.post('/orders', addCreoterOrder);


// add favorite
router.post('/users/:userId/favorites/:favoriteId', addFavorite);

// add cart
router.post('/users/:userId/carts/:cartId', addCart);

// get all users
router.get('/users', getAllUsers);

// get all orders
router.get('/users/:userId/orders', getAllOrders);

// get all favorites
router.get('/users/:userId/favorites', getAllFavorites);

// get  favorites by id
router.get('/users/:userId/favorites/product/:productId', getFavoriteById);

// get all carts
router.get('/users/:userId/carts', getAllCarts);

// get user by id
router.get('/users/:userId', getUser);

// get user by email
router.get('/users/email/:email', getUserWithEmail);

// get order by id
router.get('/users/:userId/orders/:orderId', getOrder);

// get favorite by id
router.get('/users/:userId/favorites/:favoriteId', getFavorite);

// get cart by id
router.get('/users/:userId/carts/:cartId', getCart);

// delete user
router.delete('/users/:userId', deleteUser);

// delete order
router.delete('/users/:userId/orders/:orderId', deleteOrder);

// delete favorite
router.delete('/users/:userId/favorites/:favoriteId', deleteFavorite);

// delete favorite by id
router.delete('/users/:userId/favorites/product/:productId', deleteFavoriteById);


// delete cart
router.delete('/users/:userId/carts/:cartId', deleteCart);

// delete all carts
router.delete('/users/:userId/carts', clearCarts);

// update user
router.put('/users/:userId', updateUser);

// update order
router.put('/users/:userId/orders/:orderId', updateOrder);

// update favorite
router.put('/users/:userId/favorites/:favoriteId', updateFavorite);

// update cart
router.put('/users/:userId/carts/:cartId', updateCart);

// login user
router.post('/login', loginUser);

// logout user
router.post('/logout', logout);

module.exports = {
  routes: router
}
