'use strict';

const firebase = require('../db');
const Favorite = require('../models/favorites');
const Order = require('../models/favorites');
const firestore = firebase.firestore();


const addFavorite = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('favorites').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllFavorites = async (req, res, next) => {
    try {
        const favorites = await firestore.collection('favorites');
        const data = await favorites.get();
        const favoritesArray = [];
       
        if(data.empty) {
            res.status(404).send('No favorite record found');
        }else {
            data.forEach(doc => {
                const favorite = new Favorite(
                    doc.id,
                    doc.data().code,
                    doc.data().name,
                    doc.data().category,
                    doc.data().file,
                    doc.data().priceStacked,
                    doc.data().quantity,
                    doc.data().selectedStatus,
                    doc.data().status
                );
                favoritesArray.push(favorite);
            });
            res.send(favoritesArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getFavorite = async (req, res, next) => {
    try {
        const id = req.params.id;
        const favorite = await firestore.collection('favorites').doc(id);
        const data = await favorite.get();
        if(!data.exists) {
            res.status(404).send('Favorite with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateFavorite = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const favorite =  await firestore.collection('favorites').doc(id);
        await favorite.update(data);
        res.send('Favorite record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteFavorite = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('favorites').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addFavorite,
    getAllFavorites,
    getFavorite,
    updateFavorite,
    deleteFavorite
}