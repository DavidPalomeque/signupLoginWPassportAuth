module.exports = { // This is a guard for pages that only can be seen for the logged users
    ensureAuthenticated : function(req , res , next){
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash("error_msg" , "You need to be logged for see this!")
        res.redirect("/users/login")
    }
}