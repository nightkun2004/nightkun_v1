const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilepic: {
        type: String,
        default: "https://res.cloudinary.com/dvbm04q9l/image/upload/v1736925620/Shxtou-PNG_utpr1v.png"
    },
    coverphoto: {
        type: String,
        default: "https://res.cloudinary.com/dvbm04q9l/image/upload/v1736925927/GPZiBHVboAAFZP2-e1717739664634-696x393_ve2ade.jpg"
    },
    posts: [{
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"  // ต้องตรงกับชื่อโมเดลของวิดีโอ
        }
    }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema)

module.exports = User;
