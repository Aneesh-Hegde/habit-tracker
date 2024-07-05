const express = require("express");
const router = express.Router();
const { renderPhysical, addMental, mentalTimer, updateMental, deleteMental } = require("../controller/mental");
const isLoggedIn = require("../middleware");

router.route("/")
    .get(isLoggedIn, renderPhysical)
    .post(isLoggedIn, addMental);

router.route("/timer/:id")
    .get(isLoggedIn, mentalTimer)
    .post(isLoggedIn, updateMental);

router.route("/:id")
    .delete(isLoggedIn, deleteMental);

module.exports = router;
