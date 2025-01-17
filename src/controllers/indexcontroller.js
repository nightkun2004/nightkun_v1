const path = require("path")
const Video = require("../../models/videoModel")

const getHome = (req, res) => {
    const userID = req.session?.userlogin;
    try {
        res.render("./layouts/main", {
            title: "Nightkun | หน้าหลัก",
            content: path.join(__dirname, "../views/index"),
            active: "home",
            headerBar: "pribta",
            userID
        });
    } catch (err) {
        res.status(500).render("./layouts/main", {
            error: err,
            title: '500 - Internal Server Error',
            active: "error",
            headerBar: "pribta",
            userID
        });
    }
};

const getActivities = (req, res) => {
    const userID = req.session?.userlogin;
    try {
        res.render("./layouts/main", {
            title: "กิจกรรม",
            content: path.join(__dirname, "../views/pages/activities"),
            active: "activities",
            headerBar: "pribta",
            userID
        });
    } catch (err) {
        res.status(500).render("./layouts/main", {
            error: err,
            title: '500 - Internal Server Error',
            active: "error",
            headerBar: "pribta",
            userID
        });
    }
};

const getHappeningNow = (req, res) => {
    const { username } = req.params;
    const userID = req.session?.userlogin;
    try {
        res.render("./layouts/main", {
            title: "เกิดขึ้นตอนนี้",
            content: path.join(__dirname, "../views/pages/Happening"),
            active: "Happening",
            headerBar: "pribta",
            userID
        });
    } catch (err) {
        res.status(500).render("./layouts/main", {
            error: err,
            title: '500 - Internal Server Error',
            active: "error",
            headerBar: "pribta",
            userID
        });
    }
};

const getPribta = async (req, res) => {
    const { username } = req.params;
    const userID = req.session?.userlogin;
    const userCountry = req.userCountry; 
    try {

        const data_pribtas = await Video.find({
            $or: [
                { allowedRegions: { $exists: false } }, // ✅ ถ้าไม่มี allowedRegions แสดงว่าทุกคนดูได้
                { allowedRegions: { $size: 0 } }, // ✅ ถ้า allowedRegions เป็น [] (ว่าง) แสดงว่าทุกคนดูได้
                // { allowedRegions: userCountry } // ✅ เฉพาะประเทศที่ได้รับอนุญาต
            ]
        }).populate("ownerId").sort({ createdAt: -1 }).exec();

        res.render("./layouts/main", {
            title: "Pribta",
            content: path.join(__dirname, "../views/pages/pribta"),
            active: "pribta",
            headerBar: "hidden",
            userID,
            data_pribtas
        });
    } catch (err) {
        res.status(500).render("./layouts/main", {
            error: err,
            title: '500 - Internal Server Error',
            active: "error",
            headerBar: "pribta",
            userID
        });
    }
};

const getUploadPribta = async (req, res) => {
    const userID = req.session?.userlogin;
    try {
        res.render("./layouts/main", {
            title: "Pribta",
            content: path.join(__dirname, "../views/uploads/video"),
            active: "UploadPribta",
            headerBar: "pribta",
            userID
        });
    } catch (err) {
        res.status(500).render("./layouts/main", {
            error: err,
            title: '500 - Internal Server Error',
            active: "error",
            headerBar: "pribta",
            userID
        });
    }
}

const getRedeem = async (req, res) => {
    try {
        res.render("./pages/redeem", { active: "redeem" })
    } catch (error) {
        console.log(error)
    }
}

// 🔹 ต้องการเพิ่ม Middleware เช่น ตรวจสอบ JWT หรือ session
const User = require("../../models/userModel")


const getProfile = async (req, res) => {
    let { username } = req.params;
    const userID = req.session?.userlogin;

    // 🔹 ตัด "@" ออกถ้ามี
    if (username.startsWith("@")) {
        username = username.slice(1);
    }

    try {
        // console.log("🔍 ค้นหา username:", username);
        const user = await User.findOne({ username }).exec();

        if (!user) {
            console.warn("⚠️ ไม่พบผู้ใช้:", username);
            return res.status(404).render("./layouts/main", {
                title: "404 - ไม่พบผู้ใช้",
                content: path.join(__dirname, "../views/pages/notfound"),
                active: "error",
                userID
            });
        }

        // console.warn("เจอผู้ใช้ ✅:", username);
        console.log(user)
        res.render("./layouts/main", {
            title: `Nightkun | โปรไฟล์ของ ${username}`,
            content: path.join(__dirname, "../views/pages/profile"),
            active: "profile",
            headerBar: "pribta",
            userID,
            user
        });
    } catch (err) {
        console.error("❌ Error in getProfile:", err);
        res.status(500).render("./layouts/main", {
            error: err,
            title: "500 - Internal Server Error",
            content: path.join(__dirname, "../views/pages/profile"),
            active: "error",
            headerBar: "pribta",
            userID
        });
    }
};


module.exports = {
    getHome,
    getActivities,
    getHappeningNow,
    getPribta,
    getProfile,
    getUploadPribta,
    getRedeem
}