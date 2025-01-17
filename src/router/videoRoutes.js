const express = require("express");
const axios = require("axios")
const router = express.Router();
const {  publishPribta } = require("../controllers/videoController");
// const { uploadVideoToCloudinary } = require("../../config/upload")
const UploadToServer = require("../../config/VideoUoload")
const { authMiddleware } = require("../../middlewares/authMiddleware")

router.post("/api/v2/upload-video", UploadToServer);
router.post("/api/v2/publish-video", authMiddleware, publishPribta);
router.get('/video/:id', async (req, res) => {
    try {
        const videoMap = {
            "1": "https://res.cloudinary.com/dvbm04q9l/video/upload/v1736937310/TV%E3%82%A2%E3%83%8B%E3%83%A1_%E4%B8%8D%E9%81%87%E8%81%B7_%E9%91%91%E5%AE%9A%E5%A3%AB_%E3%81%8C%E5%AE%9F%E3%81%AF%E6%9C%80%E5%BC%B7%E3%81%A0%E3%81%A3%E3%81%9F_%E7%AC%AC1%E5%BC%BEPV_2025%E5%B9%B41%E6%9C%889%E6%97%A5%E6%94%BE%E9%80%81%E9%96%8B%E5%A7%8B_m3zwyf.mp4",
            "2": "https://res.cloudinary.com/dvbm04q9l/video/upload/v1736937395/ee0fd9648a1823ca1045de3761852ed4_qldppj.mp4"
        };

        const videoUrl = videoMap[req.params.id];
        if (!videoUrl) return res.status(404).send("Video not found");

        // ใช้ Axios ดึงวิดีโอแบบ Stream
        const response = await axios({
            url: videoUrl,
            method: "GET",
            responseType: "stream"
        });

        // ตั้งค่า Header เพื่อรองรับการสตรีม
        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Content-Length", response.headers["content-length"]);
        
        // console.log(response.data)
        // ส่ง Stream ของวิดีโอไปที่ Client ejs
        response.data.pipe(res);
    } catch (error) {
        console.error("โหลดวิดีโอไม่สำเร็จ:", error);
        res.status(500).send("Error loading video");
    }
});

module.exports = router;