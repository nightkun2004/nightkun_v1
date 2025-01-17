const User = require("../../models/userModel")
const Video = require("../../models/videoModel")
const multer = require("multer")
require("dotenv").config

// อัปโหลดวิดีโอไปที่ Cloudinary
// const uploadVideo = async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).send("No file uploaded.");

//         const result = await cloudinary.uploader.upload_stream(
//             { resource_type: "video", folder: "videos" },
//             async (error, result) => {
//                 if (error) return res.status(500).json({ error });

//                 const newVideo = new Video({
//                     title: req.body.title,
//                     description: req.body.description,
//                     videoUrl: result.secure_url,
//                     thumbnailUrl: result.secure_url.replace(".mp4", ".jpg"),
//                     ownerId: req.user.id,
//                     allowedRegions: req.body.allowedRegions.split(",")
//                 });

//                 await newVideo.save();
//                 res.redirect("/");
//             }
//         ).end(req.file.buffer);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


const publishPribta = async (req, res) => {
    try {
        const { videoId, description, videoUrl, thumbnailUrl, visibility } = req.body;

        if (!videoUrl || !description) {
            return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
        }

        // บันทึกข้อมูลวิดีโอลง MongoDB
        const newVideo = new Video({
            videoId,
            description,
            videoUrl,
            thumbnailUrl,
            visibility: visibility || "public",
            ownerId: req.user.id,
            status: "approved"
        });

        await newVideo.save();
        // console.log(newVideo)
        res.json({ message: "วิดีโอเผยแพร่เรียบร้อย", video: newVideo });
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเผยแพร่วิดีโอ:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
}

const refreshVideoToken = async (req, res) => {
    try {
        const { videoId } = req.body;
        if (!videoId) {
            return res.status(400).json({ error: "กรุณาระบุ videoId" });
        }

        // ✅ สร้างโทเค็นใหม่ และกำหนดวันหมดอายุใหม่
        const newExpires = Math.floor(Date.now() / 1000) + 3600; // 1 ชั่วโมง
        const newToken = jwt.sign({ videoId, exp: newExpires }, process.env.JWT_SECRET);

        // ✅ ตอบกลับลิงก์ใหม่ให้กับ ServerVideo
        res.json({
            success: true,
            newToken,
            newExpires,
            newUrl: `https://sv8.nightkun.com/api/v2/server/stream/${videoId}?tk=${newToken}&expires=${newExpires}`
        });

    } catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการสร้างโทเค็นใหม่" });
    }
};

module.exports = { publishPribta, refreshVideoToken };