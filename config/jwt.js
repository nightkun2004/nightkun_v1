const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// 🔹 สร้าง JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1d" }
    );
};

// 🔹 ตรวจสอบ JWT Token (Middleware)
// const authenticate = (req, res, next) => {
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ error: "Unauthorized" });
//     }

//     try {
//         const decoded = jwt.verify(token, JWT_SECRET);
//         req.user = decoded; // เพิ่มข้อมูลผู้ใช้เข้า req
//         next();
//     } catch (error) {
//         return res.status(401).json({ error: "Invalid token" });
//     }
// };

module.exports = { generateToken };