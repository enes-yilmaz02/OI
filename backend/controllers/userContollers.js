"use strict";

const firebase = require("../db");
const User = require("../models/users");
const firestore = firebase.firestore();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const addUser = async (req, res, next) => {
    try {
      const data = req.body;
  
      // password'u hashle
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const hashedCPassword = await bcrypt.hash(data.confirmpassword, 10);
  
      // hashlenmiş password'u veriye ekle
      data.password = hashedPassword;
      data.confirmpassword=hashedCPassword;
      // Kullanıcıyı kaydet
      await firestore.collection("users").doc().set(data);
  
      res.status(200).send("Kullanıcı başarıyla kaydedildi.");
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  

const getAllUsers = async (req, res, next) => {
  try {
    const users = await firestore.collection("users");
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

const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await firestore.collection("users").doc(id);
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

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const user = await firestore.collection("users").doc(id);
    await user.update(data);
    res.send("User record updated successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    await firestore.collection("users").doc(id).delete();
    res.send("Record deleted successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tüm kullanıcıları al
        const users = await firestore.collection("users").get();

        // Kullanıcıları filtrele
        const userQuery = users.docs.filter(doc => doc.data().email === email);
        
        if (!userQuery[0]) {
            return res.status(403).json({ error: "Invalid Credentials1" });
        }

        const user = userQuery[0].data();

        // compare passwords
        bcrypt.compare(password, user.password, function(err, result){
            if(result === true){
                const token = jwt.sign({ id: userQuery[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24,
                  });
                return res.status(200).json({ token });
            } else {
                return res.status(403).json({ error: "Invalid Credentials2" });
            }
        });

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

module.exports = {
  addUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
};
