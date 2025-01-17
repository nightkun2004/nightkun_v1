
const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken");
const { refreshVideoToken } = require("../src/controllers/videoController")
require("dotenv").config();


// 📌 ตรวจสอบโทเค็นจากเซิร์ฟเวอร์เก็บวิดีโอ
router.post("/auth/verify-token", (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ valid: false, error: "ไม่มีโทเค็น" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, error: "โทเค็นไม่ถูกต้อง" });
        }

        return res.json({
            valid: true,
            videoId: decoded.videoId, // ส่งคืน videoId ที่อยู่ในโทเค็น
            userId: decoded.userId,   // อาจใช้เพื่อตรวจสอบสิทธิ์เพิ่มเติม
        });
    });
});

router.post("/refresh-video-token", refreshVideoToken);

module.exports =
    router