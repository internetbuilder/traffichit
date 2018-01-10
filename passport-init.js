const passport = require("passport");
const User = require("./models/userSchema");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const configAuth = require('./auth');

passport.serializeUser(function (user, done) {
    done(null, user.google.id);
});

passport.deserializeUser(function (id, done) {

    User.findOne({ 'google.id': id}, function (err, user) {
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
                    console.log("found an error");
                    return done(err);
                }
                   
                if (user){
                    console.log("the users permissions are"+user);
                    return done(null, user,{message: "You'll be redirected to the dashboard."});
                    
                }
                else {
                    console.log("we are here and about to create new user in the system.");
                    console.log(profile);
                    var newUser = new User();
                    newUser.permission.push("user");
                    newUser.google.id = profile.id;
                    newUser.google.token = accessToken;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.google.imageUrl = profile.photos[0].value;
                    
                    newUser.save(function(err){
                        if (err){
                           
                            return(err,false);
                        }
                           
                        console.log("user was successfully saved");
                        return done(null, newUser);
                        
                    });
                    
                }
            });
        });
    }

));