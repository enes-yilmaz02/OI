"use strict";
const firebase = require("../db");
const waitListUser = require("../models/waitListUser");
const firestore = firebase.firestore();

const addwaitList = async (req, res, next) => {
  try {
    
    const data = req.body;
    // Eğer belge (document) yoksa oluştur
    await firestore.collection("waitList").doc().set(data);

    res.status(200).json({ message: "ürün başarıyla kaydedildi." });
  } catch (error) {
    res.status(400).json({message:"error.message"});
  }
};

const getAllwaitList = async (req, res, next) => {
  try {
    const users = await firestore.collection("waitList");
    const data = await users.get();
    const usersArray = [];


    if (data.empty) {
        res.status(404).send("No user record found");
      } else {
        data.forEach((doc) => {
          const user = new User(
            doc.id,
            doc.data().name,
            doc.data().username,
            doc.data().email,
            doc.data().phone,
            doc.data().password,
            doc.data().confirmpassword,
            doc.data().address,
            doc.data().companyName,
            doc.data().taxNumber,
            doc.data().role,
            doc.data().bDate,
            doc.data().gender,
            doc.data().surname,
            doc.data().status
          );
          usersArray.push(user);
        });
        res.send(usersArray);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
};


const getwaitList = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await firestore.collection("waitList").doc(userId);
        const data = await user.get();
        if (!data.exists) {
          res.status(404).send("User with the given ID not found");
        } else {
          res.send(data.data());
        }
      } catch (error) {
        res.status(400).send(error.message);
      }
};


const updatewaitList = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const data = req.body;
        const user = await firestore.collection("waitList").doc(userId);
        await user.update(data);
        res.status(200).json({message:'sucessfuly'});
      } catch (error) {
        res.status(400).send(error.message);
      }
};

const deletewaitList = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await firestore.collection("waitList").doc(userId).delete();
        res.status(200).json({ message: 'kullanıcı başarıyla silindi.' });
      } catch (error) {
        res.status(400).send(error.message);
      }
};



module.exports = {
  addwaitList,
  getAllwaitList,
  getwaitList,
  updatewaitList,
  deletewaitList,
};
