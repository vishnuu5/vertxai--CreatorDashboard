const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  updateUserCredits,
  getReportedContent,
  resolveReport,
} = require("../controllers/adminController");
const { isAdmin } = require("../middleware/auth");

// Apply admin middleware to all routes
router.use(isAdmin);


router.get("/stats", getAdminStats);
router.get("/users", getUsers);
router.post("/credits", updateUserCredits);
router.get("/reports", getReportedContent);
router.put("/reports/:id/resolve", resolveReport);

module.exports = router;
