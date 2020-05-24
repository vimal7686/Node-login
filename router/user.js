const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// DB Schema
const User = require('../models/User')
//Login Page
router.get('/login', (req, res)=>{
    res.render('login');
});

//Register Page
router.get('/register', (req, res)=>{
    res.render('register');
});

//Register Post
router.post('/register', (req, res)=>{
    const {name, email, password, password2 } = req.body;

    let errors = [];
    //Check requiired field
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all Fields.'})
    }
    //check Password match
    if(password !== password2){
        errors.push({msg: 'Password do not match'})
    }
    // Check Password Length
    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters'})
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else{
        // Validation Passed
        User.findOne({ email: email })
            .then(user =>{
                if(user){
                    errors.push({msg: 'Email is already Registered.'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    
                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) =>{
                            if(err) throw err;
                            // Set pass to hashed
                            newUser.password = hash;
                            //Save User
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now Registered and can log in.')
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                    }))
                }
            })
    }
});

//Login HAndle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout handle
router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})


module.exports = router;