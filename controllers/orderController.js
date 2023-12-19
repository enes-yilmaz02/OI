"use strict";
const firebase = require("../db");
const Order = require("../models/orders");
const firestore = firebase.firestore();

// addOrder fonksiyonunu güncelliyoruz
const addOrder = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Eğer belge (document) yoksa oluştur
    await userDocRef.set({}, { merge: true });

    // Kullanıcının orders koleksiyonuna ürün ekleyin
    const ordersCollectionRef = userDocRef.collection("orders");
    await ordersCollectionRef.add(data);

    res.status(200).json({ message: "order başarıyla eklendi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// addOrder fonksiyonunu güncelliyoruz
const addCreoterOrder = async (req, res, next) => {
  try {
    const data = req.body;

    // Kullanıcının belgesini alın
    const creoterDocRef = firestore.collection("creoterOrders");
    await creoterDocRef.add(data);

    res.status(200).json({ message: "orders başarıyla eklendi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const ordersCollectionRef = firestore
      .collection("users")
      .doc(userId)
      .collection("orders");

    const data = await ordersCollectionRef.get();
    const ordersArray = [];

    if (data.empty) {
      res.send(ordersArray);
    } else {
      data.forEach(async (doc) => {
        const orderData = doc.data();
        const order = {
          id: doc.id,
          ...orderData,
          status: orderData.status,
        };
        if (orderData.products) {
          const productsArray = await Promise.all(
            orderData.products.map(async (productRef) => {
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
                orderDate:productData.orderDate,
                userId: productData.userId,
              };
            })
          );

          order.products = productsArray;
        }

        ordersArray.push(order);
      });
      res.send(ordersArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllCreoterOrders = async (req, res, next) => {
  try {
    const creoterOrdersCollectionRef = firestore.collection("creoterOrders");

    const data = await creoterOrdersCollectionRef.get();
    const ordersArray = [];

    if (data.empty) {
      res.send(ordersArray);
    } else {
      data.forEach(async (doc) => {
        const orderData = doc.data();
      

        // Create an Order instance with productsArray and other properties
        const order = new Order(
          orderData.id || doc.id,
          orderData.orders,
          orderData.totalAmount,
          orderData.userId,
          orderData.orderDate,
        );

        // Assuming there are other properties in the Order model (e.g., totalAmount)
        // Add those properties to the order instance as needed

        ordersArray.push(order);
      });

      res.send(ordersArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllCreoterOrdersById = async (req, res, next) => {
  try {
    const creoterId = req.params.creoterId;

    if (!creoterId) {
      return res.status(400).send("creoterId tanımsız");
    }

    const creoterOrdersCollectionRef = firestore.collection("creoterOrders");

    // CreoterId'ye göre filtreleme
    const data = await creoterOrdersCollectionRef.get();

    const ordersArray = [];

    if (data.empty) {
      res.send(ordersArray);
    } else {
      data.forEach((doc) => {
        const orderData = doc.data();

        // Siparişin içindeki her bir ürünün product nesnesine ulaşma
        const ordersWithMatchingCreoterId = orderData.orders
          .filter((orderItem) => orderItem.product.creoterId === creoterId)
          .map((orderItem) => {
            return {
              ...orderItem,
              product: {
                ...orderItem.product,
                creoterId: creoterId
              }
            };
          });

        // Eğer eşleşen ürün varsa, orders içine ekleyin
        if (ordersWithMatchingCreoterId.length > 0) {
          orderData.orders = ordersWithMatchingCreoterId;
          ordersArray.push(orderData);
        }
      });

      res.send(ordersArray);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};






const getOrder = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Değişiklik: userId parametresi

    const orderId = req.params.orderId; // Değişiklik: orderId parametresi

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Kullanıcının orders koleksiyonuna erişin
    const ordersCollectionRef = userDocRef.collection("orders");

    // Belirli bir sipariş ID'si ile belgeyi alın
    const orderDocRef = ordersCollectionRef.doc(orderId);
    const orderSnapshot = await orderDocRef.get();

    if (!orderSnapshot.exists) {
      res.status(404).send("Order with the given ID not found");
    } else {
      res.send(orderSnapshot.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const orderId = req.params.orderId;
    const updatedData = req.body;

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Kullanıcının orders koleksiyonuna erişin
    const ordersCollectionRef = userDocRef.collection("orders");

    // Belirli bir sipariş ID'si ile belgeyi güncelleyin
    const orderDocRef = ordersCollectionRef.doc(orderId);
    await orderDocRef.update(updatedData);

    res.status(200).json({ message: "order başarıyla güncelendi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const orderId = req.params.orderId;

    // Kullanıcının belgesini alın
    const userDocRef = firestore.collection("users").doc(userId);

    // Kullanıcının orders koleksiyonuna erişin
    const ordersCollectionRef = userDocRef.collection("orders");

    // Belirli bir sipariş ID'si ile belgeyi silin
    await ordersCollectionRef.doc(orderId).delete();

    res.status(200).json({ message: "order başarıyla silindi." });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  addCreoterOrder,
  getAllCreoterOrders,
  getAllCreoterOrdersById
};
