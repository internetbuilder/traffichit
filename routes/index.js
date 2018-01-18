var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('/', (req, res, next) =>{

  if (req.isAuthenticated()) {
      return res.redirect("/dashboard");
  }
  res.render('index/index', { title: 'Express' });
});

module.exports = router;