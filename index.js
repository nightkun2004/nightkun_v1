const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const connectDB = require("./config/db")

dotenv.config();
const app = express();
connectDB();

// 📌 Middleware สำหรับใช้ session (ต้องมาก่อน Router)
app.use(session({
    secret: process.env.SESSION_SECRET || "mysecret", // ใช้ค่าใน .env หรือ default
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true ถ้าใช้ HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // อายุ Session 1 วัน
    }
}));

// 📌 ตั้งค่า View Engine และ Static Files
app.set('view engine', 'ejs');
app.set('views', [
    path.join(__dirname, 'src/views'),
    path.join(__dirname, 'error/views'),
    path.join(__dirname, 'admin/views')
]);
app.use(express.static(path.join(__dirname, 'public')));

// 📌 ใช้ body-parser (รองรับ JSON และ Form Data)
app.use(express.json({ limit: "500mb" })); 
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(fileUpload({
    limits: { fileSize: 500 * 1024 * 1024 }, // ✅ 500MB
    useTempFiles: true, // ใช้ไฟล์ชั่วคราวช่วยจัดการไฟล์ใหญ่
    tempFileDir: "/tmp/" // กำหนดโฟลเดอร์ชั่วคราว
}));

// 📌 Middleware กำหนดค่า session ใน res.locals
app.use((req, res, next) => {
    res.locals.userID = req.session?.userlogin || null;
    next();
});

// 📌 Import Routes
const routerWeb = require("./src/router/web");
const routerAdmin = require("./admin/router");
const routerApi = require("./service/api");
const routerVideo = require("./src/router/videoRoutes");

// 📌 ใช้ Router
app.use(routerWeb);
app.use(routerAdmin);
app.use("/api/v2", routerApi);
app.use(routerVideo);

const Routerauth = require("./src/router/authRouter")
app.use("/api/v2", Routerauth)

// 📌 404 Page Not Found Handler
app.use((req, res, next) => {
    const err = new Error("Page Not Found");
    err.status = 404;
    next(err);
});

app.use((req, res, next) => {
    console.log("🔍 IP ที่รับมา:", req.headers["x-forwarded-for"] || req.connection.remoteAddress);
    next();
});


// 📌 Custom Error Handling Middleware
app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).render('layouts/main', {
            error: err,
            title: '404 - Page Not Found',
            content: path.join(__dirname, "./error/views/error404"),
            headerBar: "hidden",
            active: "error"
        });
    } else {
        res.status(err.status || 500).render('layouts/main', {
            error: err,
            title: '500 - Internal Server Error',
            content: path.join(__dirname, "./error/views/error500"),
            headerBar: "hidden",
            active: "error"
        });
    }
});

// 📌 Start Server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
