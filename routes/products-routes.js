const express = require('express');
const {addProduct, 
       getAllProducts, 
       getProduct,
       updateProduct,
       deleteProduct,
       getCreoterProducts,
       getCreoterProduct,
       updateCreoterProduct,
       deleteCreoterProduct,
       //getAllCreoterProducts
      } = require('../controllers/productController');
const { uploadFile } = require('../controllers/uploadfileController');



const router = express.Router();
router.post('/products/upload', uploadFile);
router.post('/products', addProduct);
router.get('/products', getAllProducts);
// router.get('/products/allcreoter', getAllCreoterProducts);
router.get('/products/:productId', getProduct);
router.get('/products/creoter/:creoterId', getCreoterProducts);
router.get('/products/:creoter/creoterId/:productId', getCreoterProduct);
router.put('/products/:productId', updateProduct);
router.put('/products/creoter/:creoterId/:productId', updateCreoterProduct);
router.delete('/products/:productId', deleteProduct);
router.delete('/products/creoter/:creoterId/:productId', deleteCreoterProduct);


module.exports = {
    routes: router
}