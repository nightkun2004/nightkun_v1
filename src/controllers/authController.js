const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const { generateToken } = require("../../config/jwt");

// POST: /api/users/register
const authRegister = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ success: false, error: "โปรดใส่ข้อมูลให้ครบ" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, error: "รหัสผ่านของคุณไม่ตรงกัน" });
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ success: false, error: "รหัสผ่านต้องมีอักษรพิมพ์ใหญ่, พิมพ์เล็ก และตัวเลข" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "อีเมลหรือชื่อผู้ใช้นี้ถูกใช้ไปแล้ว" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = generateToken(newUser);
        res.cookie("token", token, { httpOnly: true, secure: true });

        console.log("✅ สมัครสมาชิกสำเร็จ:", newUser);

        return res.status(201).json({
            success: true, // 🔹 เพิ่ม success: true
            message: "สมัครสมาชิกสำเร็จ",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("❌ Error in authRegister:", error);
        return res.status(500).json({ success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่" });
    }
};

const authLogin = async (req, res) => {
    const lang = res.locals.lang;
    
    try {
        const { email, password } = req.body;

        // ตรวจสอบว่าข้อมูลที่ส่งมาครบถ้วนหรือไม่
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "โปรดใส่ข้อมูลให้ครบ" });
        }

        const user = await User.findOne({ email: email });

        // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบหรือไม่
        if (!user) {
            return res.status(404).json({ success: false, error: "ไม่พบผู้ใช้นี้ในระบบ" });
        }

        // ตรวจสอบความถูกต้องของรหัสผ่าน
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: 'รหัสผ่านไม่ถูกต้อง' });
        }

        // สร้าง JWT token
        const { _id: id, username, role, profilepic } = user;
        
        // บันทึก session (เก็บเฉพาะข้อมูลที่จำเป็น)
        req.session.userlogin = { id, username, role, profilepic };

        const token = jwt.sign({ id, username, role, email }, process.env.JWT_SECRET, { expiresIn: "5d" });
        const th_nightkun = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "5d" });

        // ตั้งค่า cookie (secure เฉพาะ production)
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
        res.cookie('th_nightkun', th_nightkun, { httpOnly: false, secure: false });

        // ถ้าเป็น admin ให้ redirect ไปที่ /admin/control
        if (role === 'admin') {
            return res.status(200).redirect('/admin/control');
        }
        
        console.log("session",req.session.userlogin  )
        console.log("token",token)
        console.log("th_nightkun",th_nightkun)

        // ป้องกัน Open Redirect (ให้แน่ใจว่า returnTo เป็น path ในเว็บ)
        const returnTo = req.session.returnTo && req.session.returnTo.startsWith('/')
            ? req.session.returnTo
            : `/@${username}`;
        delete req.session.returnTo;

        return res.status(200).json({success: true, th_nightkun, returnTo})
    } catch (error) {
        console.error("❌ Error in authLogin:", error);
        return res.status(500).json({ success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่" });
    }
};


module.exports = {
    authRegister,
    authLogin
};
