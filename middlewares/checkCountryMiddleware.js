const axios = require("axios");
const requestIp = require("request-ip");

const checkCountryMiddleware = async (req, res, next) => {
    const userID = req.session?.userlogin;
    let ip = requestIp.getClientIp(req);

    console.log("🔍 IP ของผู้ใช้:", ip);

    if (ip === "127.0.0.1" || ip === "::1") {
        ip = "49.49.49.49"; // ✅ IP จำลองจากไทย
    }

    try {
        // ✅ ใช้ API สำรอง `ip-api.com`
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const country = response.data.countryCode || "UNKNOWN"; // ได้ค่าเป็น "TH", "US" ฯลฯ

        console.log("🌍 ประเทศของคุณคือ:", country);

        if (country !== "TH") {
            return res.render("./layouts/main", {
                title: "Access Denied: This content is only available in Thailand.",
                content: require("path").join(__dirname, "../error/views/countryAccess"),
                active: "countryAccess",
                headerBar: "pribta",
                userID
            });
        }

        req.userCountry = country;
        next();
    } catch (error) {
        console.error("❌ ไม่สามารถดึงข้อมูลประเทศได้:", error);
        return res.status(500).send("❌ Internal Server Error");
    }
};

module.exports = checkCountryMiddleware;
