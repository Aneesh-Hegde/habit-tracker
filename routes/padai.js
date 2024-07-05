const express = require("express");
const router = express.Router();
const { renderPadai, addPadai, padaiTimer, updatePadai, deletePadai } = require("../controller/padai");
const isLoggedIn = require("../middleware");

router.route("/")
    .get(isLoggedIn, renderPadai)
    .post(isLoggedIn, addPadai);

router.route("/timer/:id")
    .get(isLoggedIn, padaiTimer)
    .post(isLoggedIn, updatePadai);

router.route("/:id")
    .delete(isLoggedIn, deletePadai);

module.exports = router;
