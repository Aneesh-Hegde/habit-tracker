const express = require("express");
const router = express.Router();
const { renderPhysical, addPhysical, physicalTimer, updatePhysical, deletePhysical } = require("../controller/physical");
const isLoggedIn = require("../middleware");

router.route("/")
    .get(isLoggedIn, renderPhysical)
    .post(isLoggedIn, addPhysical);

router.route("/timer/:id")
    .get(isLoggedIn, physicalTimer)
    .post(isLoggedIn, updatePhysical);

router.route("/:id")
    .delete(isLoggedIn, deletePhysical);

module.exports = router;
