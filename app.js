var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
const mongoose = require("mongoose");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const passport = require('passport');
const flash= require('connect-flash');
const session = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');

const expressHandleBars = require("express-handlebars").create({
  defaultLayout: "layout",
  extname: "hbs",
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  
  helpers:{

    pointsToFixed: function(point){
      return point.toFixed(2);
     },

    trafficToday: function(project) { 

        var trafficDates = project.updated_at;
        var total=0;

        var today = new Date();   

        for(count = 0; count < trafficDates.length; count++){
            
            if(trafficDates[count].getDate() == today.getDate()){
                total++;
            }
            
        }

        return total;
     },

    
  }
});

var app = express();

// connecting to mongoose
 if(process.env.DEV_ENV){

   mongoose.connect("mongodb://localhost:27017/trafficHit");
}
else{
  mongoose.connect('mongodb://traffichit:traffichit@ds245357.mlab.com:45357/heroku_mv8ds3ms');
}


require('./passport-init.js');


// view engine setup
app.engine("hbs", expressHandleBars.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({secret:'trafficHit',resave:false,saveUninitialized:false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.use('/', users);
app.use('/', index);
app.use('/',auth);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
