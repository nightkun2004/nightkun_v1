const checkAuth = (req, res, next) => {
    const userID = req.session.userlogin;
    // console.log("authcheck", userID)
    if (!userID || !userID.username) {
        return res.redirect('/?meassage_error=คุณยังไมได้เข้าสู่ระบบครับ');
    }
    next();
};

module.exports = {
    checkAuth
};
