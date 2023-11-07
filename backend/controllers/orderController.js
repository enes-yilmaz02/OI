'use strict';

const firebase = require('../db');
const Order = require('../models/orders');
const firestore = firebase.firestore();


const addOrder = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('orders').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await firestore.collection('orders');
        const data = await orders.get();
        const ordersArray = [];
       
        if(data.empty) {
            res.status(404).send('No order record found');
        }else {
            data.forEach(doc => {
                const order = new Order(
                    doc.id,
                    doc.data().code,
                    doc.data().name,
                    doc.data().category,
                    doc.data().file,
                    doc.data().priceStacked,
                    doc.data().quantity,
                    doc.data().selectedStatus,
                    doc.data().status
                );
                ordersArray.push(order);
            });
            res.send(ordersArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await firestore.collection('orders').doc(id);
        const data = await order.get();
        if(!data.exists) {
            res.status(404).send('Order with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const order =  await firestore.collection('orders').doc(id);
        await order.update(data);
        res.send('Order record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('orders').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addOrder,
    getAllOrders,
    getOrder,
    updateOrder,
    deleteOrder
}