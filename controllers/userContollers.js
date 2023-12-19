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
    data.confirmpassword = hashedCPassword;
    // Kullanıcıyı kaydet
    await firestore.collection("users").doc().set(data);

    res.status(200).json({ message: 'Kullanıcı başarıyla kaydedildi.' });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addUserAdmin = async (req, res, next) => {
  try {
    const data = req.body;

    
    await firestore.collection("users").doc().set(data);

    res.status(200).json({ message: 'Kullanıcı başarıyla kaydedildi.' });
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

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await firestore.collection("users").doc(userId);
    const data = await user.get();
    if (!data.exists) {
      res.send(data.data());
    } else {
      res.send(data.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getUserWithEmail = async (req, res, next) => {
  try {
    const email = req.params.email;
    const usersSnapshot = await firestore.collection("users").where("email", "==", email).get();

    if (usersSnapshot.empty) {
      res.status(404).send("E-posta kullanıcıya ait bilgilere ulaşamadı.");
    } else {
      // Kullanıcıyı temsil eden belge
      const userDoc = usersSnapshot.docs[0];

      // Belge ID'sini al
      const docId = userDoc.id;

      // Belgeyi JSON formatına çevirerek tüm bilgileri al
      const userData = userDoc.data();
      
      // Belge ID'sini response'a ekle
      const responseData = {
        id: docId,
        ...userData
      };

      res.send(responseData);
      console.log(responseData);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};


const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const data = req.body;
    const user = await firestore.collection("users").doc(userId);
    await user.update(data);
    res.status(200).json({message:'sucessfuly'});
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const updateUserPassword = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const data = req.body;
       // password'u hashle
       const hashedPassword = await bcrypt.hash(data.password, 10);
       const hashedCPassword = await bcrypt.hash(data.confirmpassword, 10);
   
       // hashlenmiş password'u veriye ekle
       data.password = hashedPassword;
       data.confirmpassword = hashedCPassword;
       const user = await firestore.collection("users").doc(userId);
       await user.update(data);
    res.status(200).json({message:'sucessfuly'});
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await firestore.collection("users").doc(userId).delete();
    res.status(200).json({ message: 'kullanıcı başarıyla silindi.' });
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
    const userQuery = users.docs.filter((doc) => doc.data().email === email);

    if (!userQuery[0]) {
      return res.status(403).json({ error: "Invalid Credentials1" });
    }

    const user = userQuery[0].data();

    // compare passwords
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        const token = jwt.sign(
          { id: userQuery[0].id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        
        //res.setHeader('Authorization', `Bearer ${token}`);
        
        // // // Token'i istemciye gönder (örneğin, tarayıcıya)
        res.cookie("jwt", token, {
          httpOnly:true
        });
        return res.status(200).json({ message: user, token: token });
        
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

const loginUserWithEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Tüm kullanıcıları al
    const users = await firestore.collection("users").get();

    // Kullanıcıları filtrele
    const userQuery = users.docs.filter((doc) => doc.data().email === email);

    if (!userQuery[0]) {
      return res.status(403).json({ error: "Invalid Credentials1" });
    }

    const user = userQuery[0].data();

    const token = jwt.sign(
      { id: userQuery[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, {
      httpOnly:true
    });
    return res.status(200).json({ message: user, token: token });
  
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};



const logout = (req, res) => {
  try {
    // JWT cookie'sini temizle
    res.clearCookie("jwt");

    // Başarılı cevap gönder
    return res.status(200).json({ message: 'çıkış işlemi başarılı'});
  } catch (error) {
    // Hata durumunda hata mesajını gönder
    res.status(500).send("Error clearing token: " + error.message);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUser,
  getUserWithEmail,
  updateUser,
  deleteUser,
  addUserAdmin,
  loginUser,
  logout,
  updateUserPassword,
  loginUserWithEmail
};
