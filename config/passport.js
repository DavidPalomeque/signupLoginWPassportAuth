const LocalStrategy = require("passport-local").Strategy // For manage sessions with passport
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../models/user")
const passport = require("passport")

/* HERE IS THE FUNCTION WITH WICH YOU CAN MANAGE SESSIONS
   I highly recommend you to just copy and paste this block of code , in fact i would say that you only have to change
   the content of the messages as you want , because this is the easier and "official" way of write this .
   This is the login´s function , where there are validations for the email and the password that are received .
   Obviously you can make the login´s logic as you want but i consider this as an easy way of make a well working login .
*/

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField : "email"} , (email , password , done) => { 
            User.findOne({email : email})
              .then(user => {
                  if(!user){ // If there is no user with the sent email
                      return done(null , false , {message : "Incorrect Email!"})
                  }
                  bcrypt.compare(password , user.password , (err , isMatch) => { // The sent Password is compared with
                      if(err) throw err                                          // the saved password

                      if (isMatch) { // If they are equal
                          return done(null , user)
                      } else { // If they are different
                          return done(null , false , { message : "Incorrect Password!" })
                      }
                  })
              })
              .catch(err => {
                  console.log(err)
              })
        })
    )

    passport.serializeUser(function(user , done){ // Open a session
        done(null , user.id)
    })

    passport.deserializeUser(function(id , done){ // Close a session
        User.findById(id , function(err , user){
            done(err , user)
        })
    })

}









