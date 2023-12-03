"use strict";
const firebase = require("../db");
const Cart = require("../models/cart");
const firestore = firebase.firestore();

// addCart fonksiyonunu
const addCart = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Eğer belge (document) yoksa oluştur
    await userDocRef.set({}, { merge: true });

    // Kullanıcının orders koleksiyonuna ürün ekleyin
    const cartsCollectionRef = userDocRef.collection("carts");
    await cartsCollectionRef.add(data);

    res.status(200).json({ message: "ürün başarıyla eklendi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllCarts = async (req, res, next) => {
  try {
    // Kullanıcının kimlik bilgilerini çöz
    const userId = req.params.userId;

    const cartsCollectionRef = firestore
      .collection("users")
      .doc(userId)
      .collection("carts");

    const data = await cartsCollectionRef.get();

    const cartsArray = [];

    if (data.empty) {
      res.send(cartsArray);
    } else {
      data.forEach((doc) => {
        const cartData = doc.data();

        // Create a Cart instance with the necessary properties
        const cart = {
          id: doc.id,
          creoterId: cartData.creoterId,
          email: cartData.email,
          product:cartData.product ,
          quantity: cartData.quantity,
        };

        cartsArray.push(cart);
      });

      res.send(cartsArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const getCart = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Değişiklik: userId parametresi

    const cartId = req.params.cartId; // Değişiklik: orderId parametresi

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Kullanıcının orders koleksiyonuna erişin
    const cartsCollectionRef = userDocRef.collection("carts");

    // Belirli bir sipariş ID'si ile belgeyi alın
    const cartDocRef = cartsCollectionRef.doc(cartId);
    const cartSnapshot = await cartDocRef.get();

    if (!cartSnapshot.exists) {
      res.status(404).send("Cart with the given ID not found");
    } else {
      res.send(cartSnapshot.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateCart = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const cartId = req.params.cartId;
    const updatedData = req.body;

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Kullanıcının orders koleksiyonuna erişin
    const cartCollectionRef = userDocRef.collection("carts");

    // Belirli bir sipariş ID'si ile belgeyi güncelleyin
    const cartDocRef = cartCollectionRef.doc(cartId);
    await cartDocRef.update(updatedData);

    res.status(200).json({ message: "ürün başarıyla güncellendi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const cartId = req.params.cartId;

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Kullanıcının orders koleksiyonuna erişin
    const cartsCollectionRef = userDocRef.collection("carts");

    // Belirli bir sipariş ID'si ile belgeyi silin
    await cartsCollectionRef.doc(cartId).delete();

    res.status(200).json({ message: "ürün başarıyla silindi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const clearCarts = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Kullanıcının carts koleksiyonuna erişin
    const cartsCollectionRef = userDocRef.collection("carts");

    // Koleksiyonu sorgula ve tüm belgeleri al
    const snapshot = await cartsCollectionRef.get();

    // Tüm belgeleri sırayla sil
    const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);

    res.status(200).json({ message: "Tüm ürünler başarıyla silindi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addCart,
  getAllCarts,
  getCart,
  updateCart,
  deleteCart,
  clearCarts,
};
