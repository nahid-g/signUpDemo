const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const passport = require('passport')


//User model
const User = require('../models/User')

//LOGIN
router.get('/login',(req,res)=>{
    res.render("login")
})
//REGISTER
router.get('/register',(req,res)=>{
    res.render("register")
})

//Regiter Handle
router.post('/register',(req,res)=>{
    const{name,email,password,password2}= req.body
    let errors = []

    //check required field
    if(!name || !email || !password || !password2){
        errors.push({msg : "PLease fill in the fields"})

    }
    // Check passwords match
    if(password != password2){
        errors.push({msg : "password did not match"})
    }

    //check password length
    if(password.length < 6){
        errors.push({msg : "Password should be at least 6 characters"})
    }

    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        //validation pass
        User.findOne({email: email})
            .then(user =>{
                if(user){
                    errors.push({msg : "This Email is already regitered"})
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    console.log(newUser)
                    bcrypt.genSalt(10,(err,salt)=> 
                        bcrypt.hash(newUser.password,salt, (err,hash) =>{
                            if(err) throw error
                            //set password to hashed
                            newUser.password = hash
                            //save User
                            newUser.save()
                                .then(user =>{
                                    req.flash('success_msg','You are now registered')
                                    res.redirect('/user/login')
                                })
                                .catch(err => console.log(err))
                    })

                    )
                    
                }
            })
    }

})

//login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/user/login',
        failureFlash : true
    })(req, res, next)  
})

//logout handle
router.get('/logout', (req, res)=>{
    req.logout()
    req.flash('success_msg', 'you are logged out')
    res.redirect('/user/login')
})


module.exports = router

