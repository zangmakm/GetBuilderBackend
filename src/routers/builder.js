const express = require("express");
const router = express.Router();
const {
  getAllBuilders,
  getBuilder,
  addBuilder,
} = require("../controllers/builder");
//get all
router.get("/", getAllBuilders);
//get specified builder
router.get("/:builderId", getBuilder);
//add new builder
router.post("/", addBuilder);
//cancel builder

module.exports = router;