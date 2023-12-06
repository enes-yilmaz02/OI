const express = require("express");
const router = express.Router();
const {
  addwaitList,
  getwaitList,
  deletewaitList,
  getAllwaitList,
  updatewaitList,
} = require("../controllers/waitListController");



router.post("/waitList", addwaitList);
router.get("/waitList", getAllwaitList);
router.get("/waitList/:userId", getwaitList);
router.put("/waitList/:userId", updatewaitList);
router.delete("/waitList/:userId", deletewaitList);

module.exports = {
  routes: router,
};
