'use strict';

const firebase = require('../db');
const User = require('../models/users');
const firestore = firebase.firestore();
const jwt = require('jsonwebtoken');


const addUser = async (req, res, next) => {
    try {
        const data = req.body;

        // Kullanıcıyı kaydet
        await firestore.collection('users').doc().set(data);
        res.status(200).send('Kullanıcı başarıyla kaydedildi.');
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
const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Kullanıcıyı bul
        const userRef = firestore.collection('users');
        const query = await userRef.where('username', '==', username).where('password', '==', password).get();

        if (!query.empty) {
            // Kullanıcı bulundu, token üret
            const user = query.docs[0].data();
            const token = jwt.sign({ userId: query.docs[0].id, username: user.username }, 'SECRET_KEY');
            
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    loginUser
}