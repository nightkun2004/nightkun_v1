const path = require("path")

const getHomeAdmmin = async (req, res) => {
    try {
        res.render("./admin/layouts/main", {
            title: "Admin | ผู้ดูแลระบบ",
            content: path.join(__dirname, "../views/home"),
            active: "Admin"
        });
    } catch (err) {
        res.status(500).render("./admin/layouts/main", {
            error: err,
            title: '500 - Internal Server Error',
            active: "error"
        });
    }
}

module.exports = {
    getHomeAdmmin
}