const express = require("express")
const router = express.Router()
const {
    getHomeAdmmin
} = require("./controller/adminIndexController")

router.get("/admin/control", getHomeAdmmin)

module.exports =
    router