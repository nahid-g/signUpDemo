const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

//passport config
require('./src/passport')(passport)

///db connection
require("./src/db/conn");  

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//BodyParser
app.use(express.urlencoded({extended: false}))

//express session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash())

//Global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash('error')
    next()

})

//Routes
app.use('/',require('./routes/index'))
app.use('/user',require('./routes/user'))


const port = process.env.PORT || 5000
app.listen(port, console.log(`running on port ${port}`))
