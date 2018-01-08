
var express = require('express');
var router = express.Router();
const passport = require('passport');
var User = require('../models/userSchema');


router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback', 

        passport.authenticate('google', 

                {   successRedirect: '/dashboard',
                    failureRedirect: '/',
                    failureFlash: true
                }
        )
);

router.get('/dashboard',(req,res,next)=>{

        res.render('dashboard/index');

});


module.exports = router;