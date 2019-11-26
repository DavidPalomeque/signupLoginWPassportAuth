const router = require("express").Router() // For create routes
const User = require("../models/user")  // The User data model that was created in models/user
const bcrypt = require("bcryptjs") // For hash the new user´s password
const passport = require("passport") // For manage the sessions


// SIGN UP / REGISTRATION ROUTES

router.get("/users/signup" , (req,  res) => {
    res.render("signup")
})

router.post("/users/signup" , async (req , res) => {
    const { name , email , password , password2 } = req.body // Taking all the data

    //Cheking Data with Validations
    /*  
       In each validation that the user doesn´t pass , it´s necessary to redirect the user with a flash message 
       indicating the error . If the code isn´t written in the next way , probably the message is not gonna be send
       and there will be an error : 
       req.flash("kindofmessage" , "message content")
       res.redirect("url")
    */

    if (!name || !email || !password || !password2) { // Cheking if there is an empty field
        req.flash("error_msg" , "Please , complete all the fields")
        res.redirect("/users/signup")
    } else {
        const emailExists = await User.findOne({email : email}) // Cheking if the Email is already registered
        if (emailExists) {
        req.flash("error_msg" , "This Email is already in use")
        res.redirect("/users/signup")
        } else {
            if (password.length < 6) {
                req.flash("error_msg" , "The Password must contain at least 6 characters") // Cheking password´s length
                res.redirect("/users/signup")
            } else {
                if (password !== password2) {  // Cheking password´s similarities
                    req.flash("error_msg" , "The Passwords must match")
                    res.redirect("/users/signup")
                } else {
                    const newUser = new User({ // Creating new User with the received Data
                        name , email , password
                    })
                    bcrypt.genSalt(10 , (err , salt) => { // Hashing Password
                        bcrypt.hash(newUser.password , salt , (err , hash) => {
                            if(err) throw err

                            newUser.password = hash // Replacing normal password with the hashed password
                            newUser.save() // Saving the new User in the db
                             .then(newUser => {
                                req.flash("success_msg" , "Done! Now you only have to login.") 
                                res.redirect("/users/login")
                             })
                             .catch(err => {
                                 console.log(err)
                             })
                        })
                    })
                }
            }
        }
    }
    
})



// LOGIN / SIGN IN ROUTES

router.get("/users/login" , (req , res) => {
    res.render("login")
})

router.post("/users/login" , (req , res , next) => { // Here is gonna be used the function that´s in config/passport
    passport.authenticate("local" , {    // "local" is the default name of the function of config/passport
        successRedirect : "/dashboard",  
        failureRedirect : "/users/login",
        failureFlash : true // This allows flash messages
    })(req , res , next) // This is also necessary
})



// LOGOUT ROUTE

router.get("/users/logout" , async(req , res) => {
    req.logout() // We can close the session in this way thanks to passport dependency
    req.flash("success_msg" , "You are out!")
    res.redirect("/")
})

module.exports = router