const express = require("express");
const router = express.Router();
const {
  getPlants,
  addPlant,
  getAPlant,
  updatePlant,
  deletePlant
} = require("../controllers/plantController");

const validateToken = require("../middleware/validateTokenHandler");
const authorizeRole = require("../middleware/authorizeRole");

// ✅ Public routes (anyone)
router.route("/")
  .get(getPlants);

router.route("/:id")
  .get(getAPlant);

// 🔒 Admin-only routes
router.route("/")
  .post(
    validateToken,
    authorizeRole("admin"),
    addPlant
  );

router.route("/:id")
  .put(
    validateToken,
    authorizeRole("admin"),
    updatePlant
  )
  .delete(
    validateToken,
    authorizeRole("admin"),
    deletePlant
  );

module.exports = router;
