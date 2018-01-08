var express = require('express');
var router = express.Router();

// setting the authentication piece for this router

router.use((req,res,next)=>{

    if(req.isUnauthenticated){
        res.redirect("/");
    }
    
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
