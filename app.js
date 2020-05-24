// Packages
const express = require('express');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


// Port initialization
const PORT = process.env.PORT || 5000;

// Express initialization
const app = express();

//Passport Config
require('./config/passport')(passport);

// DataBase Connection
mongoose.connect('mongodb+srv://Vimal:ySZlEi7Qb54cR7Ym@cluster0-vy07n.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
// mongoose.connect('mongodb://localhost:27017/Login', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('Connected to DataBase.'))
    .catch(err=> console.log(err))

//Middle-ware
app.use(morgan('dev'));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// Session Middle-ware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connet Flash
app.use(flash());

// // Global Var
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./router/index'));
app.use('/users', require('./router/user'))


//
app.listen(PORT, console.log(`Server started at PORT ${PORT}.`))