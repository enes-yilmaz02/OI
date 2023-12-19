"use strict";
const firebase = require("../db");
const Favorite = require("../models/favorites");
const firestore = firebase.firestore();

const addFavorite = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const data = req.body;
    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Eğer belge (document) yoksa oluştur
    await userDocRef.set({}, { merge: true });

    // Kullanıcının orders koleksiyonuna ürün ekleyin
    const favoritesCollectionRef = userDocRef.collection("favorites");
    await favoritesCollectionRef.add(data);

    res.status(200).json({ message: "ürün başarıyla kaydedildi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

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

        // Eğer favori ürünleri varsa, bunları çek ve diziye ekle
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

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Kullanıcının favorites koleksiyonunu alın
    const favoritesCollectionRef = userDocRef.collection("favorites");

    // Kullanıcının favorilerini getirin
    const favoritesSnapshot = await favoritesCollectionRef
      .where("id", "==", productId)
      .get();

    if (favoritesSnapshot.empty) {
      res.json([]);
    }

    // İlk bulunan favori belgesini döndür
    const favoriteDoc = favoritesSnapshot.docs[0];

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

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Kullanıcının orders koleksiyonuna erişin
    const favoritesCollectionRef = userDocRef.collection("favorites");

    // Belirli bir sipariş ID'si ile belgeyi güncelleyin
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

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Kullanıcının orders koleksiyonuna erişin
    const favoritesCollectionRef = userDocRef.collection("favorites");

    // Belirli bir sipariş ID'si ile belgeyi silin
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

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Kullanıcının favorites koleksiyonunu alın
    const favoritesCollectionRef = userDocRef.collection("favorites");

    // Kullanıcının favorilerini getirin
    const favoritesSnapshot = await favoritesCollectionRef
      .where("id", "==", productId)
      .get();

    if (favoritesSnapshot.empty) {
      res.json([]);
    }

    // Favoriler içinde belirli bir ürünü içeren belgeyi silin
    favoritesSnapshot.forEach(async (favoriteDoc) => {
      await favoriteDoc.ref.delete();
    });

    res.status(200).json({ message: "Ürün başarıyla silindi." });
  } catch (error) {
    return ;
  }
};

module.exports = {
  addFavorite,
  getAllFavorites,
  getFavorite,
  updateFavorite,
  deleteFavorite,
  deleteFavoriteById,
  getFavoriteById
};
