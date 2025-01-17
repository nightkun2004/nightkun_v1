const express = require("express");
const router = express.Router();
const {
    getHome,
    getActivities,
    getProfile,
    getHappeningNow,
    getPribta,
    getUploadPribta,
    getRedeem
} = require("../controllers/indexcontroller");

// const checkCountryMiddleware = require("../../middlewares/checkCountryMiddleware")

// 🔹 เส้นทางหลัก
router.get("/", getHome);
router.get("/activities", getActivities);
router.get("/happening-now", getHappeningNow);
router.get("/pribta", getPribta);
router.get("/redeem/code", getRedeem);

// 🔹 เส้นทาง Welcome (เพิ่ม return)
router.get("/welcome", async (req, res) => {
    try {
        return res.render("./pages/welcome", { active: "welcome" });
    } catch (err) {
        console.error("❌ Error rendering /welcome:", err);
        return res.status(500).send("เกิดข้อผิดพลาด");
    }
});

// 🔹 ต้องการเพิ่ม Middleware เช่น ตรวจสอบ JWT หรือ session
const { checkAuth } = require("../../utils/lib/auth")
router.get("/:username", checkAuth, getProfile);
router.get("/upload/pribta", checkAuth, getUploadPribta);

module.exports = router;
