const auth          = require("../controllers/auth"),
      express       = require('express'),
      isAuth        = require('../controllers/authMiddlewares').isAuth,
      isAdmin       = require('../controllers/authMiddlewares').isAdmin,
      passport      = require('passport'),
      router        = express.Router(),
      validPassword = require('../controllers/passportUtils').validPassword;
var User = require('../models/user');

//LOGIN
router.get("/", auth.loginGet);
router.post("/", passport.authenticate('local', 
    { 
        failureRedirect: '/', 
        successRedirect: '/home',
        failureFlash: true,
        successFlash: 'Welcome to HierHub!' 
    }), function(req, res){
    console.log(req.user);
    eval(require('locus'));
});


//REGISTER
router.get("/register",isAdmin, auth.registerGet);
router.post("/register",isAdmin,auth.registerPost);


//LOGOUT
router.get("/logout", function (req, res) {
    // eval(require("locus"));
    User.findById(req.user._id, function(err, user){
        if(err){
            req.flash("error", "Something went wrong in the users database");
            console.log(err);
            res.redirect("/")
        } else {
            user.last_login_date = Date.now();
            user.save();
            req.logout();
            console.log("Logout Success");
            console.log(req.user);
            req.flash("success", "See you later!!")
            res.redirect("/");
        }
    })
});


module.exports = router;