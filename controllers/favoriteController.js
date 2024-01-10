"use strict";
const firebase = require("../db");
const Favorite = require("../models/favorites");
const firestore = firebase.firestore();

const addFavorite = async (req, res, next) => {
  try {
    console.log('burada çalışıyor:');
    const userId = req.params.userId;
    const data = req.body;
    const productId = data.id;
    const userDocRef = firestore.collection("users").doc(userId);
    await userDocRef.set({}, { merge: true });

    
    const favoritesCollectionRef = userDocRef.collection("favorites").doc(productId);
    await favoritesCollectionRef.set(data);

    res.status(200).json({ message: "ürün başarıyla kaydedildi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllFavorites = async (req, res, next) => {
  try {
    
    const userId = req.params.userId;
    const favoritesCollectionRef = firestore
      .collection("users")
      .doc(userId)
      .collection("favorites");
    const data = await favoritesCollectionRef.get();
    const favoritesArray = [];
    if (data.empty) {
      res.json([]);
    } else {
      data.forEach(async (doc) => {
        const favoriteData = doc.data();
        const favorite = {
          id: doc.id,
          ...favoriteData,
          status: favoriteData.status,
        };

        if (favoriteData.products) {
          const productsArray = await Promise.all(
            favoriteData.products.map(async (productRef) => {
              const productDoc = await productRef.get();
              const productData = productDoc.data();
              return {
                id: productDoc.id,
                code: productData.code,
                name: productData.name,
                category: productData.category,
                file: productData.file,
                priceStacked: productData.priceStacked,
                quantity: productData.quantity,
                selectedStatus: productData.selectedStatus,
                valueRating: productData.valueRating,
                companyName: productData.companyName,
                taxNumber: productData.taxNumber,
                email: productData.email,
                description: productData.description,
                creoterId: productData.creoterId,
                userId: productData.userId,
              };
            })
          );
          favorite.products = productsArray;
        }
        favoritesArray.push(favorite);
      });

      res.send(favoritesArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const getFavorite = async (req, res, next) => {
  try {
    const userId = req.params.userId; 
    const favoriteId = req.params.favoriteId; 
    
    const userDocRef = firestore.collection("users").doc(userId);
    const favoritesCollectionRef = userDocRef.collection("favorites");
    const favoriteDocRef = favoritesCollectionRef.doc(favoriteId);
    const favoriteSnapshot = await favoriteDocRef.get();

    if (!favoriteSnapshot.exists) {
      res.json([]);
    } else {
      res.send(favoriteSnapshot.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getFavoriteById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;
    const userDocRef = firestore.collection("users").doc(userId);
    const favoritesCollectionRef = userDocRef.collection("favorites");
    const favoritesSnapshot = await favoritesCollectionRef
      .where("id", "==", productId)
      .get();

    if (favoritesSnapshot.empty) {
      res.json([]);
    }
    const favoriteDoc = favoritesSnapshot.docs[0];
    console.log(favoriteDoc.data())
    res.status(200).json(favoriteDoc.data());
  } catch (error) {
    return;
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const favoriteId = req.params.favoriteId;
    const updatedData = req.body;

    const userDocRef = firestore.collection("users").doc(userId);
    const favoritesCollectionRef = userDocRef.collection("favorites");
    const favoriteDocRef = favoritesCollectionRef.doc(favoriteId);
    await favoriteDocRef.update(updatedData);

    res.status(200).json({ message: "ürün başarıyla güncellendi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteFavorite = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const favoriteId = req.params.favoriteId;

    const userDocRef = firestore.collection("users").doc(userId);
    const favoritesCollectionRef = userDocRef.collection("favorites");
    await favoritesCollectionRef.doc(favoriteId).delete();

    res.status(200).json({ message: "ürün başarıyla silindi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteFavoriteById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    const userDocRef = firestore.collection("users").doc(userId);
    const favoritesCollectionRef = userDocRef.collection("favorites");
    const favoritesSnapshot = await favoritesCollectionRef
      .where("id", "==", productId)
      .get();

    if (favoritesSnapshot.empty) {
      res.json([]);
    }
    favoritesSnapshot.forEach(async (favoriteDoc) => {
      await favoriteDoc.ref.delete();
    });

    res.status(200).json({ message: "Ürün başarıyla silindi." });
  } catch (error) {
    return ;
  }
};



/* Ex Favorites Functions */

const addExFavorite = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const data = req.body;
    const productId = data.productId;
    const userDocRef = firestore.collection("users").doc(userId);
    await userDocRef.set({}, { merge: true });

    const favoritesCollectionRef = userDocRef.collection("exfavorites").doc(productId);
    await favoritesCollectionRef.set(data);

    res.status(200).json({ message: "Favori başarıyla eklendi"});
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllExFavorites = async (req, res, next) => {
  try {
    
    const userId = req.params.userId;
    const favoritesCollectionRef = firestore
      .collection("users")
      .doc(userId)
      .collection("exfavorites");
    const data = await favoritesCollectionRef.get();
    const favoritesArray = [];
    if (data.empty) {
      res.json([]);
    } else {
      data.forEach(async (doc) => {
        const favoriteData = doc.data();
        const favorite = {
          id: doc.id,
          ...favoriteData,
          status: favoriteData.status,
        };

        if (favoriteData.products) {
          const productsArray = await Promise.all(
            favoriteData.products.map(async (productRef) => {
              const productDoc = await productRef.get();
              const productData = productDoc.data();
              return {
                id: productDoc.id,
                code: productData.code,
                name: productData.name,
                category: productData.category,
                file: productData.file,
                priceStacked: productData.priceStacked,
                quantity: productData.quantity,
                selectedStatus: productData.selectedStatus,
                valueRating: productData.valueRating,
                companyName: productData.companyName,
                taxNumber: productData.taxNumber,
                email: productData.email,
                description: productData.description,
                creoterId: productData.creoterId,
                userId: productData.userId,
              };
            })
          );
          favorite.products = productsArray;
        }
        favoritesArray.push(favorite);
      });

      res.send(favoritesArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getExFavorite = async (req, res, next) => {
  try {
    const userId = req.params.userId; 
    const favoriteId = req.params.productId; 
    const userDocRef = firestore.collection("users").doc(userId);
    const favoritesCollectionRef = userDocRef.collection("exfavorites");
    const favoriteDocRef = favoritesCollectionRef.doc(favoriteId);
    const favoriteSnapshot = await favoriteDocRef.get();

    if (!favoriteSnapshot.exists) {
      res.json([]);
    } else {
      res.send(favoriteSnapshot.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteExFavorite = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const favoriteId = req.params.favoriteId;
    
   
    const userDocRef = firestore.collection("users").doc(userId);
    const favoritesCollectionRef = userDocRef.collection("exfavorites");
    await favoritesCollectionRef.doc(favoriteId).delete();

    res.status(200).json({ message: "ürün başarıyla silindi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addFavorite,
  getAllFavorites,
  getFavorite,
  updateFavorite,
  deleteFavorite,
  deleteFavoriteById,
  getFavoriteById,

  // Ex Favorites exports functions
  addExFavorite,
  getAllExFavorites,
  getExFavorite,
  deleteExFavorite

};
