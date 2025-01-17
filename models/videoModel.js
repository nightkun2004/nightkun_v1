const mongoose = require("mongoose");

const SubtitleSchema = new mongoose.Schema({
    language: { type: String, required: true },
    srtUrl: { type: String, required: true }
});

const VideoSchema = new mongoose.Schema({
    videoId: String,
    title: { type: String, default: () => new Date().toISOString(), trim: true },
    description: { type: String, trim: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    visibility: { type: String, enum: ["public", "private"], default: "public" },
    allowedRegions: [{ type: String, uppercase: true }], // เก็บรหัสประเทศเป็นตัวพิมพ์ใหญ่ เช่น ["US", "TH"]
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    subtitles: [SubtitleSchema],
    createdAt: { type: Date, default: Date.now }
});

const Video = mongoose.model("Video", VideoSchema)

module.exports = Video;