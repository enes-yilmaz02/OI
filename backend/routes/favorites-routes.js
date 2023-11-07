const express = require('express');
const {addFavorite, 
       getAllFavorites, 
       getFavorite,
       updateFavorite,
       deleteFavorite
      } = require('../controllers/favoriteController');

const router = express.Router();

router.post('/favorite', addFavorite);
router.get('/favorites', getAllFavorites);
router.get('/favorite/:id', getFavorite);
router.put('/favorite/:id', updateFavorite);
router.delete('/favorites/:id', deleteFavorite);


module.exports = {
    routes: router
}