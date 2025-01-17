const axios = require("axios");
const FormData = require("form-data");
const jwt = require("jsonwebtoken");

const UploadToServer = async (req, res) => {
    try {
        if (!req.files || !req.files.video) {
            return res.status(400).json({ error: "กรุณาเลือกไฟล์วิดีโอ" });
        }

        const videoUrl = "https://sv8.nightkun.com/api/v2/server/upload";
        const videoFile = req.files.video;

        const formData = new FormData();
        formData.append("video", videoFile.data, { filename: videoFile.name });

        // 📌 ส่งวิดีโอไปที่เซิร์ฟเวอร์เก็บวิดีโอ
        const response = await axios.post(videoUrl, formData, {
            headers: {
                ...formData.getHeaders(),
                "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`
            },
        });

        if (!response.data.videoId) {
            throw new Error("ไม่สามารถอัปโหลดวิดีโอได้");
        }

        const videoId = response.data.videoId;
        const expires = Math.floor(Date.now() / 1000) + 3600; // หมดอายุใน 1 ชั่วโมง
        const token = jwt.sign({ videoId, exp: expires }, process.env.JWT_SECRET);

        // ✅ ส่ง URL วิดีโอกลับไปให้ Client
        res.json({
            success: true,
            videoUrl: `https://sv8.nightkun.com/api/v2/server/stream/${videoId}?tk=${token}&expires=${expires}`,
            videoID: videoId
        });

    } catch (error) {
        console.error("Upload Error:", error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            error: error.response ? error.response.data.error : "เกิดข้อผิดพลาดในการส่งวิดีโอ"
        });
    }
};

module.exports = UploadToServer;
