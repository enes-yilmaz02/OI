"use strict";

const firebase = require("../db");
const Product = require("../models/products");
const firestore = firebase.firestore();

const addProduct = async (req, res, next) => {
  try {
    const data = req.body;
    await firestore.collection("products").doc().set(data);
    res.status(200).json({ message: "ürün başarıyla kaydedildi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await firestore.collection("products");
    const data = await products.get();
    const productsArray = [];

    if (data.empty) {
      res.status(404).json({ message: "No product record found" });
    } else {
      data.forEach((doc) => {
        const product = new Product(
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
          doc.data().creoterId,
          doc.data().createDate,
          doc.data().status
        );
        productsArray.push(product);
      });
      res.send(productsArray);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getCreoterProducts = async (req, res, next) => {
  try {
    const creoterId = req.params.creoterId;
    const productsRef = firestore.collection("products");

    // Use where clause to filter products based on creoterId
    const querySnapshot = await productsRef
      .where("creoterId", "==", creoterId)
      .get();

    const productsArray = [];

    if (querySnapshot.empty) {
      res.status(404).json({ message: "No product record found" });
    } else {
      querySnapshot.forEach((doc) => {
        const product = new Product(
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
          doc.data().creoterId,
          doc.data().createDate,
          doc.data().status
        );
        productsArray.push(product);
      });
      res.send(productsArray);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// const getAllCreoterProducts = async (req, res, next) => {
//     try {
      
//       const productsRef = firestore.collection("creoterOrders");
//       const data = await productsRef.get();
//       console.log(data);
//       const productsArray = [];
  
//       if (data.empty) {
//         res.status(404).json({ message: "No product record found" });
//       } else {
//         data.forEach((doc) => {
//           const product = new Product(
//             doc.id,
//             doc.data().code,
//             doc.data().name,
//             doc.data().category,
//             doc.data().file,
//             doc.data().priceStacked,
//             doc.data().quantity,
//             doc.data().selectedStatus,
//             doc.data().valueRating,
//             doc.data().companyName,
//             doc.data().taxNumber,
//             doc.data().email,
//             doc.data().description,
//             doc.data().creoterId,
//              doc.data().createDate,
//             doc.data().status
//           );
//           console.log(product);
//           productsArray.push(product);
//         });
//         res.send(productsArray);
//       }
//     } catch (error) {
//       res.status(400).json(error.message);
//     }
//   };

const getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    console.log(productId);
    const product = await firestore.collection("products").doc(productId);
    console.log(product);
    const data = await product.get();
    if (!data.exists) {
      res.status(404).json({message:"ürün id getirme hatası"});
    } else {
      res.send(data.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getProductByCategory = async (req, res, next) => {
  try {
    const categoryName = req.params.category;

    if (!categoryName) {
      return res.status(400).send("Category name is required");
    }
    const productsRef = firestore.collection("products");
    const querySnapshot = await productsRef
      .where("category.name", "==", categoryName)
      .get();

    if (querySnapshot.empty) {
      res.status(404).json({message:"Bu kategory ait ürün bulunmamaktadır"});
    } else {
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push(doc.data());
      });
      res.send(products);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}; 

const getCreoterProduct = async (req, res, next) => {
  try {
    const creoterId = req.params.creoterId;
    const productId = req.params.productId;
    console.log(creoterId);
    console.log(productId);
    const product = await firestore.collection("products").doc(productId);
    const data = await product.get();
    if (!data.exists) {
      res.status(404).send("creoter product hatası");
    } else {
      res.send(data.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const data = req.body;
    const product = await firestore.collection("products").doc(productId);
    await product.update(data);
    res.status(200).json({ message: "ürün başarıyla güncellendi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    await firestore.collection("products").doc(productId).delete();
    res.status(200).json({ message: "ürün başarıyla silindi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateCreoterProduct = async (req, res, next) => {
  try {
    const creoterId = req.params.creoterId;
    const productId = req.params.productId;
    const dataBody = req.body;
    console.log(creoterId);
    console.log(productId);
    const product = await firestore.collection("products").doc(productId);
    await product.update(dataBody);
    if (!data.exists) {
      res.status(404).send("Product with the given ID not found");
    } else {
      res.status(200).json({ message: "ürün başarıyla güncellendi." });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const deleteCreoterProduct = async (req, res, next) => {
  try {
    const creoterId = req.params.creoterId;
    const productId = req.params.productId;
    console.log(creoterId);
    console.log(productId);
    await firestore.collection("products").doc(productId).delete();
    res.status(200).json({ message: "ürün başarıyla silindi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
//   getAllCreoterProducts,
  getCreoterProducts,
  getCreoterProduct,
  updateCreoterProduct,
  deleteCreoterProduct,
  getProductByCategory
};
