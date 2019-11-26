//Dependencies installed : 
// express mongoose bcryptjs
// express-ejs-layouts ejs connect-flash
// express-session passport passport-local
// nodemon -D (For have an easier development)

//Dependencies required 
const express = require("express") 
const expressLayouts = require("express-ejs-layouts") // For the view engine
const session = require("express-session") // For manage sessions  
const flash = require("connect-flash") // For send flash messages
const passport = require("passport") // For manage sessions

//INITIALIZATIONS
const app = express()
require("./database") // connecting db to the rest of the App
require("./config/passport")(passport) // also connecting passport dependency

//SETTINGS
app.set("port" , process.env.PORT || 3101) // Connecting with a port
app.use(express.urlencoded({extended : false})) // It doesn´t allows video , images and strange links in forms
app.use(expressLayouts)  //This is necessary for express-ejs-layouts to work
app.set("view engine" , "ejs") // Declaring what view engine we are gonna use
app.use(flash()) //This is necessary for connect-flash to work

//GLOBAL VARIABLES
app.use(session({      // This is necessary for express-session to work
    secret : "mysecretapp" ,
    resave :  true ,
    saveUninitialized : true 
}))
app.use((req , res , next) => {  //Declaring what kind of flash messages there will be
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    next()
})
app.use(passport.initialize()); // This is necessary 
app.use(passport.session());  // for passport to work

//ROUTES
app.use(require("./routes/index"))
app.use(require("./routes/users"))

//SERVER
app.listen(app.get("port") , () => {
    console.log("Server listening in " + app.get("port"));
})