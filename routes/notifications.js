const express        = require('express'),
      isAuth         = require('../controllers/authMiddlewares').isAuth,
      isAdmin        = require('../controllers/authMiddlewares').isAdmin,
      methodOverride = require("method-override"),
      router         = express.Router();

var Job          = require("../models/job"),
    Notification = require("../models/notification"),
    User         = require("../models/user");


//NOTIFICATION LANDING PAGE
router.get("/notifications", isAuth, function (req, res) {
	Notification.find().sort({ _id: -1 }).limit(5).exec(function(err,notifs){
        if(err){
            console.log(err);
            res.redirect("/home");
        } else {
            res.render("notifications/home", {recentNotifications: notifs});
        }
    });
})

//NOTIFICATION INDEX ROUTE
router.get("/notifications/index", isAuth, function (req, res) {
    Notification.find({}, function (err, notifications) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("notifications/index", { notifications: notifications });
        }
    });
});


//NOTIFICATION NEW FORM ROUTE
router.get("/notifications/new", isAdmin, function (req, res) {
    console.log(req.user);
    res.render("notifications/new");
});


//NOTIFICATION CREATE ROUTE
router.post("/notifications", isAdmin, function (req, res) {
    const newNotification = new Notification({
        description: req.body.description,
		author: req.body.author
    })
    Notification.create(newNotification, function (err, result) {
        if (err) {
            res.render("notifications/new");
        }
        else {
            res.redirect("/notifications");
            console.log(result);
        }
    });
});


//NOTIFICATION SHOW ROUTE
router.get("/notifications/:id", isAuth, function (req, res) {
    Notification.findById(req.params.id, function (err, foundNotification) {
        if (err) {
            res.redirect("/notifications");
        }
        else {
            res.render("notifications/show", { notification: foundNotification });
        }
    });
});


//NOTIFICATION DELETE ROUTE
router.delete("/notifications/:id", isAdmin, function (req, res) {
    Notification.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/notifications");
        }
        else {
            res.redirect("/notifications");
        }
    });
});



module.exports = router;