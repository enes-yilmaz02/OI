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
      res.status(404).json({ message: "ürün id getirme hatası" });
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
    console.log(categoryName)
    if (!categoryName) {
      return res.status(400).send("Category name is required");
    }
    const productsRef = firestore.collection("products");
    const querySnapshot = await productsRef
      .where("category", "==", categoryName)
      .get();

    if (querySnapshot.empty) {
      return res.json([]);
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

const getProductByPriceRange = async (req, res, next) => {
  try {
    const priceRange = req.params.price;

    if (!priceRange) {
      return res.status(400).send("Price range is required");
    }

    // Price range'yi iki ayrı değere ayır
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);

    if (isNaN(minPrice)) {
      return res.status(400).send("Invalid minimum price format");
    }

    const productsRef = firestore.collection("products");

    // Eğer maksimum fiyat belirtilmemişse, sadece minimum fiyatı dikkate alarak filtreleme yap
    let query = productsRef.where("priceStacked", ">=", minPrice);

    // Eğer maksimum fiyat belirtilmişse, hem minimum hem de maksimum fiyatı dikkate alarak filtreleme yap
    if (!isNaN(maxPrice)) {
      query = query.where("priceStacked", "<=", maxPrice);
    }

    const querySnapshot = await query.get();

    if (querySnapshot.empty) {
      return res.json([]);
    }

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push(doc.data());
    });

    res.send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductByStockStatus = async (req, res, next) => {
  try {
    const stockStatus = req.params.status;

    if (!stockStatus) {
      return res.status(400).send("Stock status is required");
    }

    const productsRef = firestore.collection("products");

    // Eğer stockStatus "All" ise, tüm ürünleri getir
    if (stockStatus.toLowerCase() === "all") {
      const querySnapshot = await productsRef.get();

      const products = [];
      querySnapshot.forEach((doc) => {
        products.push(doc.data());
      });

      res.send(products);
    } else {
      const querySnapshot = await productsRef
        .where("selectedStatus.name", "==", stockStatus)
        .get();

      if (querySnapshot.empty) {
        res.json([]);
      } else {
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push(doc.data());
        });
        res.send(products);
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};


const getProductByRating = async (req, res, next) => {
  try {
    const valueRating = req.params.rating;

    const rating = parseInt(valueRating.trim());

    console.log(rating);

    // Eğer rating bir sayı değilse veya 1-5 aralığında değilse, tüm ürünleri getir
    if (isNaN(rating) || rating < 1 || rating > 5) {
      const productsRef = firestore.collection("products");
      const querySnapshot = await productsRef.get();

      const products = [];
      querySnapshot.forEach((doc) => {
        products.push(doc.data());
      });

      res.send(products);
      return; // Fonksiyonu sonlandır
    }

    const productsRef = firestore.collection("products");
    const querySnapshot = await productsRef
      .where("valueRating", "==", rating)
      .get();

    if (querySnapshot.empty) {
      return res.json([]);
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

const getProductByAlphabeticalFilter = async (req, res, next) => {
  try {
    const startingLetter = req.params.letter.toLowerCase();
    console.log(startingLetter);
    if (
      !startingLetter ||
      startingLetter.length !== 1 ||
      !isLetter(startingLetter)
    ) {
      return res.status(400).send("Invalid starting letter");
    }

    const productsRef = firestore.collection("products");
    const querySnapshot = await productsRef
      .where("name", ">=", startingLetter)
      .where("name", "<", startingLetter + "\uf8ff")
      .get();

    if (querySnapshot.empty) {
      return res.json([]);
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
// Yardımcı fonksiyon: Bir karakterin harf olup olmadığını kontrol et
function isLetter(char) {
  return /^[a-zA-Z]$/.test(char);
}

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
  getProductByCategory,
  getProductByPriceRange,
  getProductByStockStatus,
  getProductByRating,
  getProductByAlphabeticalFilter,
};
