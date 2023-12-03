const express = require('express');
const {addOrder, 
       getOrder,
       updateOrder,
       deleteOrder,
       getAllCreoterOrders,
       getAllCreoterOrdersById
      } = require('../controllers/orderController');

const router = express.Router();

router.post('/order', addOrder);
router.get('/orders/:creoterId', getAllCreoterOrdersById);
router.get('/orders', getAllCreoterOrders);
router.get('/order/:id', getOrder);
router.put('/order/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);


module.exports = {
    routes: router
}