const express = require('express');
const router = express.Router();
const {addUser, 
       getAllUsers, 
       getUser,
       updateUser,
       deleteUser
      } = require('../controllers/userContollers');


router.post('/user', addUser);
router.get('/users', getAllUsers);
router.get('/user/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);


module.exports = {
    routes: router
}