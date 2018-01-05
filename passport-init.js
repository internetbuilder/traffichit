const passport = require("passport");
const User = require("./models/userSchema");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const configAuth = require('./auth');

passport.serializeUser(function (user, done) {
    done(null, user.google.id);
});

passport.deserializeUser(function (email, done) {

    User.findOne({ 'google.id': email }, function (err, user) {
        done(err, user);
    });
});


passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
},
    function (accessToken, refreshToken, profile, done) {
       

        process.nextTick(function () {
            console.log("mongodb is confused");
            User.findOne({ 'google.id': profile.id }, function (err, user) {

                console.log("mongodb is not confused....");
                if (err){
                    return done(err);
                }
                   
                if (user){
                    return done(null, user,{message: "You'll be redirected to the dashboard."});
                    console.log("the users permissions are"+user.permission);
                }
                else {
                    console.log("we are here and about to create new user in the system.");
                    console.log(profile);
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = accessToken;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.google.imageUrl = profile.photos[0].value;
                    
                    newUser.save(function(err){
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                    
                }
            });
        });
    }

));