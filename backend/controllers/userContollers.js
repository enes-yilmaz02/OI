'use strict';

const firebase = require('../db');
const User = require('../models/users');
const firestore = firebase.firestore();
const { checkIfEmailExists } = require('./emailValidationService');


const addUser = async (req, res, next) => {
    try {
        const data = req.body;
        // Önce e-posta çakışmasını kontrol edin
        const emailExists = await checkIfEmailExists(data.email);
        
        if (emailExists) {
            res.status(400).send('E-posta adresi başka bir kullanıcı tarafından kullanılıyor.');
        } else {
            // E-posta çakışması yoksa kullanıcıyı kaydedin
            await firestore.collection('users').doc().set(data);
            res.sendStatus(200);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await firestore.collection('users');
        const data = await users.get();
        const usersArray = [];
       
        if(data.empty) {
            res.status(404).send('No user record found');
        }else {
            data.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.data().name,
                    doc.data().username,
                    doc.data().email,
                    doc.data().phone,
                    doc.data().password,
                    doc.data().confirmpassword,
                    doc.data().status
                );
                usersArray.push(user);
            });
            res.send(usersArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await firestore.collection('users').doc(id);
        const data = await user.get();
        if(!data.exists) {
            res.status(404).send('User with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user =  await firestore.collection('users').doc(id);
        await user.update(data);
        res.send('User record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('users').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}