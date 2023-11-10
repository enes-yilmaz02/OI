const express = require('express');
const router = express.Router();
const {addUser, 
       getAllUsers, 
       getUser,
       updateUser,
       deleteUser,
       loginUser
      } = require('../controllers/userContollers');


router.post('/user', addUser);
router.get('/users', getAllUsers);
router.get('/user/:id', getUser);
router.put('/user/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/login' , loginUser);


module.exports = {
    routes: router
}