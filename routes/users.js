var express = require('express');
var router = express.Router();
const User = require('../models/userSchema');
const Project = require('../models/projectSchema');

// setting the authentication piece for this router

// router.use((req,res,next)=>{

//     if(!req.isAuthenticated){
//         return res.redirect("/");

//     }
//     return next();

// });


/* GET users listing. */
router.get('/dashboard/:post?', isLoggedIn, (req, res, next) => {
    const perPage = 9;
    var page = req.params.post || 1;

    Project
        .find({ '_created_by': req.user._id })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ created_at: 'desc' })
        .exec(function (err, projects) {
            Project.find({ '_created_by': req.user._id })
            .count()
            .exec(function (err, count) {
                if (err) {
                    return next(err);
                }

                const pages = Math.ceil(count / perPage);
                console.log("count is " + count);
                res.render('dashboard/index', {
                    name: req.user.google.name,
                    points: req.user.points,
                    img: req.user.google.imageUrl,
                    projects: projects,
                    title:'dashboard',
                    paginator: paginate(pages, page),

                })
            })
        });


});

router.post("/project", isLoggedIn, (req, res, next) => {

    var project = new Project();
    project._created_by = req.user._id;
    project.created_by = req.user.google.email;
    project.url = req.body.url;

    console.log(req.body);

    project.save(function (err, post) {
        if (err){
            console.log(err);
            return  res.send(err);
        }
            

        res.redirect('/dashboard');
    });

});


router.post("/pause", isLoggedIn, (req, res, next) => {

    const id = req.body._id;
    
    console.log("The found id is "+id);

    Project.findById(id,function (err, project) {
        if (err){
            return res.send(err);
        }
        
        console.log(project);
        project.active=false;

        project.save((err,post)=>{

            res.redirect('/dashboard')
        });
        
    });

});

router.post("/play", isLoggedIn, (req, res, next) => {

    const id = req.body._id;
    
    console.log("The found id is "+id);

    Project.findById(id,function (err, project) {
        if (err){
            return  res.send(err);
        }
        
            
        console.log(project);
        project.active=true;

        project.save((err,post)=>{

            res.redirect('/dashboard')
        });
        
    });

});

router.post("/delete", isLoggedIn, (req, res, next) => {

    const id = req.body._id;

    console.log("The found id is " + id);

    Project.remove({_id:id}, function (err, project) {
        if (err){
            return res.send(err);
        }
         
        console.log(project);

        res.redirect('/dashboard')

    });

});



router.get("/earnpoints", isLoggedIn, (req, res, next) => {
    
        Project
        .find({'participants': {$ne: req.user._id},'active':true})
        .populate({ 
            path: '_created_by',
            select: 'points',
            options: {
                sort: { points: -1 }
            } 
        })
        .limit(1)//please do not change this limit
        .exec( (err, project)=> {
            if (err){
                return res.send(err);
            }
            
    
            console.log(project);
    
            res.render('dashboard/earnpoints',{
                title:'Earn+points',
                project:project[0],
                user: req.user,
                layout:false
            })
    
        });
    
});

router.post("/earnpoints", isLoggedIn, (req, res, next) => {
    
        const projectId = req.body.project;
        //const newPoints = req.user.points+0.8;
        const updatedAt = new Date();
        

        if(!projectId){
            return res.redirect("/dashboard");
        }
        
    Project
    .findByIdAndUpdate( projectId, 
        {"$addToSet": { "participants": req.user._id },
            "$inc":{ "traffic": 1 },
            "$push":{ "updated_at": updatedAt } 
        },
        (err, project) =>{

            if (err){
                return res.redirect("/dashboard");
            }
            

            //participants has already been updated for this project
            //proceed to increment the users points

            User
            .findByIdAndUpdate(req.user._id,{ $inc: { points: 0.8 }},//increments user points by 0.8
                (err,user)=>{
                    
                    if (err){
                       return res.send(err);
                    }
                     
                    console.log("user points successfully incremented");
                    res.redirect("/earnpoints");

                }
            );

            

        }

    );
            
});



router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();

    res.redirect('/');
});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

const paginate = (pages, current) => {

    let paginator = "";


    if (pages > 0) {

        paginator = paginator + '<ul class="pagination text-center">';
        if (current == 1) {
            paginator = paginator + '<li class="page-item disabled"><a class="page-link">First</a></li>';
        } else {
            paginator = paginator + '<li class="page-item"><a class="page-link" href="/dashboard/1">First</a></li>';
        }
        let i = (Number(current) > 5 ? Number(current) - 4 : 1)
        if (i !== 1) {
            paginator = paginator + '<li class="page-item disabled"><a class="page-link">...</a></li>';
        }
        for (; i <= (Number(current) + 4) && i <= pages; i++) {
            if (i == current) {
                paginator = paginator + '<li class="page-item active"><a class="page-link">' + i + '</a></li>';
            } else {
                paginator = paginator + `<li class="page-item"><a class="page-link" href="/dashboard/${i}">${i}</a></li>`;
            }
            if (i == Number(current) + 4 && i < pages) {
                paginator = paginator + '<li class="page-item disabled"><a class="page-link">...</a></li>';
            }
        }
        if (current == pages) {
            paginator = paginator + '<li class="page-item disabled"><a class="page-link">Last</a></li>';
        } else {
            paginator = paginator + `<li class="page-item"><a class="page-link" href="/dashboard/${pages}">Last</a></li>`;
        }
        paginator = paginator + '</ul>';
    }


    return paginator;

};

module.exports = router;