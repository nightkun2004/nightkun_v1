const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware สำหรับตรวจสอบ JWT
const authMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader && authorizationHeader.startsWith("Bearer")
            ? authorizationHeader.split(' ')[1]
            : req.cookies?.token || null;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Forbidden: Invalid token" });
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Middleware ป้องกันการเข้าถึงหน้าที่ต้องล็อกอิน
const ensureAuthenticated = (req, res, next) => {
    if (req.session?.userlogin) {
        return next();
    }
    req.session.returnTo = req.originalUrl; // เก็บ URL ของหน้าปัจจุบัน
    res.redirect('/login'); // ส่งไปยังหน้าเข้าสู่ระบบ
};

module.exports = {
    authMiddleware,
    ensureAuthenticated
};
