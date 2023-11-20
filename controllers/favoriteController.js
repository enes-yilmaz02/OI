'use strict';
const firebase = require('../db');
const Favorite = require('../models/favorites');
const firestore = firebase.firestore();


const addFavorite = async (req, res, next) => {
    try {
        const userId= req.params.userId;
        const data = req.body;
        // Kullanıcının belgesini alın
      const userDocRef = firestore.collection("users").doc(userId);
  
      // Eğer belge (document) yoksa oluştur
      await userDocRef.set({}, { merge: true });

      // Kullanıcının orders koleksiyonuna ürün ekleyin
      const favoritesCollectionRef = userDocRef.collection("favorites");
      await favoritesCollectionRef.add(data);
  
      res.status(200).json({ message: 'ürün başarıyla kaydedildi.' });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllFavorites = async (req, res, next) => {
    try {
         // Kullanıcının kimlik bilgilerini çöz
      const userId = req.params.userId;
  
      const favoritesCollectionRef = firestore
        .collection("users")
        .doc(userId)
        .collection("favorites");
  
      const data = await favoritesCollectionRef.get();
        const favoritesArray = [];
       
        if(data.empty) {
            res.send(favoritesArray);
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
                  doc.data().valueRating,
                  doc.data().companyName,
                  doc.data().taxNumber,
                  doc.data().email,
                  doc.data().description,
                  doc.data().userId,
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
        const userId = req.params.userId; // Değişiklik: userId parametresi
      
      const favoriteId = req.params.favoriteId; // Değişiklik: orderId parametresi
      
      // Kullanıcının belgesini alın
      const userDocRef = firestore.collection("users").doc(userId);
  
      // Kullanıcının orders koleksiyonuna erişin
      const favoritesCollectionRef = userDocRef.collection("favorites");
  
      // Belirli bir sipariş ID'si ile belgeyi alın
      const favoriteDocRef = favoritesCollectionRef.doc(favoriteId);
      const favoriteSnapshot = await favoriteDocRef.get();
  
      if (!favoriteSnapshot.exists) {
        res.status(404).send("Order with the given ID not found");
      } else {
        res.send(favoriteSnapshot.data());
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
}

const updateFavorite = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const favoriteId = req.params.favoriteId;
        const updatedData = req.body;
    
        // Kullanıcının belgesini alın
        const userDocRef = firestore.collection("users").doc(userId);
    
        // Kullanıcının orders koleksiyonuna erişin
        const favoritesCollectionRef = userDocRef.collection("favorites");
    
        // Belirli bir sipariş ID'si ile belgeyi güncelleyin
        const favoriteDocRef = favoritesCollectionRef.doc(favoriteId);
        await favoriteDocRef.update(updatedData);
    
        res.status(200).json({ message: 'ürün başarıyla güncellendi.' });
      } catch (error) {
        res.status(400).send(error.message);
      }
}

const deleteFavorite = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const favoriteId = req.params.favoriteId;
    
        // Kullanıcının belgesini alın
        const userDocRef = firestore.collection("users").doc(userId);
    
        // Kullanıcının orders koleksiyonuna erişin
        const favoritesCollectionRef = userDocRef.collection("favorites");
    
        // Belirli bir sipariş ID'si ile belgeyi silin
        await favoritesCollectionRef.doc(favoriteId).delete();
    
        res.status(200).json({ message: 'ürün başarıyla silindi.' });
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