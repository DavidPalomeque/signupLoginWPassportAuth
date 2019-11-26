const router = require("express").Router()
const { ensureAuthenticated } = require("../config/auth") // Guard from config/auth

router.get("/" , (req , res) => {
    res.render("welcome")
})

router.get("/dashboard" , ensureAuthenticated , (req , res) => { // When this url is required the guard is gonna be used
    res.render("dashboard")
})

module.exports = router