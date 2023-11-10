const express = require('express');
const router = express.Router();
const {addUser, 
       getAllUsers, 
       getUser,
       updateUser,
       deleteUser,
    //    checkEmailAvailability
      } = require('../controllers/userContollers');


router.post('/user', addUser);
router.get('/users', getAllUsers);
router.get('/user/:id', getUser);
// router.get('/user/check-email/:email', checkEmailAvailability);
router.put('/user/:id', updateUser);
router.delete('/users/:id', deleteUser);


module.exports = {
    routes: router
}