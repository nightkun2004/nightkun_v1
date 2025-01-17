const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadVideoToCloudinary = async (req, res) => {
    try {
        if (!req.files || !req.files.video) {
            return res.status(400).json({ error: "กรุณาเลือกไฟล์วิดีโอ" });
        }

        const videoFile = req.files.video;
        
        // ดึงชื่อไฟล์และตัดนามสกุลออก
        const originalName = videoFile.name.replace(/\.[^/.]+$/, ""); // ตัด .mp4 หรือ .mov ฯลฯ ออก
        const uniqueFileName = `videos/${uuidv4()}_${originalName}`; // ตั้งชื่อใหม่โดยไม่ต้องมี .mp4

        // ใช้ Promise รองรับ async/await
        const uploadStream = new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "video",
                    public_id: uniqueFileName, // ไม่ต้องใส่ .mp4
                    chunk_size: 90000000, // 90MB
                    eager: [{ width: 300, height: 300, crop: "thumb", gravity: "auto" }]
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            streamifier.createReadStream(videoFile.data).pipe(stream);
        });

        const result = await uploadStream;

        // ส่ง URL วิดีโอและ Thumbnail กลับไปให้ Client
        res.json({ 
            videoUrl: result.secure_url,
            thumbnailUrl: result.eager[0]?.secure_url || ""
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
};

module.exports = { uploadVideoToCloudinary };
