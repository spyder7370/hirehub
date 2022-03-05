const express        = require('express'),
      isAuth         = require('../controllers/authMiddlewares').isAuth,
      isAdmin        = require('../controllers/authMiddlewares').isAdmin,
      methodOverride = require("method-override"),
      router         = express.Router();

var Job  		 = require("../models/job"),
    Notification   = require("../models/notification")
    User 		 = require("../models/user");


//LANDING PAGE
// router.get("/", function (req, res) {
// 	res.render("landing");
// })


//JOB INDEX ROUTE
router.get("/jobs", isAuth, function (req, res) {
	var noMatch = null;
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Job.find({name: regex}, function(err,jobs){
			if(err){
				req.flash("error", "Something went wrong in jobs database");
				console.log(err);
				res.redirect("/home")
			}
			else{
				if(jobs.length < 1) {
					noMatch = "No jobs match that query, please try again.";
				}
				res.render("jobs/index",{jobs:jobs, noMatch: noMatch});
			}
		});
	}
	else {
		Job.find({}, function (err, jobs) {
			if (err) {
				req.flash("error", "Something went wrong in jobs database");
				console.log(err);
				res.redirect("/home")
			}
			else {
				res.render("jobs/index", { jobs: jobs, noMatch: noMatch });
			}
		});
	}
});


//JOB NEW FORM ROUTE
router.get("/jobs/new", isAdmin, function (req, res) {
	res.render("jobs/new");
});


//JOB CREATE ROUTE
router.post("/jobs", isAdmin, function (req, res) {
	Job.create(req.body.job, function (err, newJob) {
		if (err) {
			req.flash("error", "Something went wrong in jobs database");
			console.log(err);
			res.redirect("/jobs/new")
		}
		else {
			var notif = {
				description: req.body.job.name + " just posted a new job !!",
				author: req.body.job.name
			};
			Notification.create(notif, function (err, newNotif) {	
				if(err){
					req.flash("error", "Something went wrong in jobs database");
					console.log(err);
					res.redirect("/jobs")
				} else {
					req.flash("success", "Successfully posted job");
					res.redirect("/jobs/" + newJob._id);
					console.log(newJob);
				}
			})
		}
	});
});


//JOB SHOW ROUTE
router.get("/jobs/:id", isAuth, function (req, res) {
	Job.findById(req.params.id).populate("students").exec(function (err, foundJob) {
		if (err) {
			req.flash("error", "Something went wrong in jobs database");
			console.log(err);
			res.redirect("/jobs")
		}
		else {
			res.render("jobs/show", { job: foundJob });
		}
	});
});


//JOB EDIT PAGE ROUTE
router.get("/jobs/:id/edit", isAdmin, function (req, res) {
	Job.findById(req.params.id, function (err, foundJob) {
		if (err) {
			req.flash("error", "Something went wrong in jobs database");
			console.log(err);
			res.redirect("/jobs/" + req.params.id);
		}
		else {
			res.render("jobs/edit", { job: foundJob });
		}
	});
});


//JOB UPDATE ROUTE
router.put("/jobs/:id", isAdmin, function (req, res) {
	Job.findByIdAndUpdate(req.params.id, req.body.job, function (err, updatedJob) {
		if (err) {
			req.flash("error", "Something went wrong in jobs database");
			console.log(err);
			res.redirect("/jobs/" + req.params.id)
		}
		else {
			req.flash("success", "Successfully updated job");
			res.redirect("/jobs/" + req.params.id);
		}
	});
});


//JOB DELETE ROUTE
router.delete("/jobs/:id", isAdmin, function (req, res) {
	Job.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", "Something went wrong in jobs database");
			console.log(err);
			res.redirect("/jobs")
		}
		else {
			req.flash("success", "Successfully deleted job");
			res.redirect("/jobs");
		}
	});
});

//USER APPLY FOR JOB ROUTE
router.get("/jobs/:id/apply/:userID", isAuth, function (req, res) {
	User.findById(req.params.userID, function (err, student) {
		if (err) {
			req.flash("error", "Something went wrong in database");
			console.log(err);
			res.redirect("/jobs/" + req.params.id)
		} else {
			//console.log("a user was found " + student);
			Job.findById(req.params.id, function (err, foundJob) {
				if (err) {
					req.flash("error", "Something went wrong in jobs database");
					console.log(err);
					res.redirect("/jobs/" + req.params.id)
				} else {
					var flag = 0;
					//eval(require("locus"));
					if (req.user.cgpa < foundJob.eligibility) {
						flag = 2;
					}
					foundJob.students.forEach(function (registeredStudent) {
						//eval(require("locus"));
						//console.log("this is a registered student" + registeredStudent);
						if (registeredStudent._id.equals(student._id)) {
							//eval(require("locus"));
							//res.send("you can only apply once");
							flag = 1;
						}
					});
					//console.log("a job was found " + foundJob);
					if (flag === 0) {
						foundJob.students.push(student);
						var size = foundJob.students.length;
						foundJob.students[size-1].name = student.name;
						foundJob.save();
						student.appliedJobs.push(foundJob);
						student.save();	
						req.flash("success", "Successfully applied!!");
						res.redirect("/jobs/" + req.params.id);
					}
					else if (flag === 1) {
						req.flash("error", "You can only apply once!")
						return res.redirect("back");
						// return res.status(400).json({
						// 	status: 'error',
						// 	error: 'you can only apply once',
						// });
					}
					else if (flag === 2) {
						req.flash("error", "Required criteria not met!")
						return res.redirect("back");
						// return res.status(400).json({
						// 	status: 'error',
						// 	error: 'required criteria not met',
						// });
					}
				}
			});
		}
	});
});

//JOB STATUS ACTIVE ROUTE
router.get("/jobs/:id/active", isAdmin, function(req,res){
	Job.findById(req.params.id, function(err, job) {
		if(err){
			req.flash("error", "Something went wrong in jobs database");
			console.log(err);
			res.redirect("/jobs/" + req.params.id);
		} else {
			job.status = "Active";
			job.save();
			var notif = {
				description: job.name + " just updated its status!! : Active",
				author: job.name
			};
			Notification.create(notif, function (err, newNotif) {	
				if(err){
					req.flash("error", "Something went wrong in notifications database");
					console.log(err);
					res.redirect("/jobs/" + req.params.id)
				} else {
					req.flash("success", "Updated status: Active");
					res.redirect("/jobs/" + req.params.id);
				}
			})
		}
	});
});

//JOB STATUS INTERVIEW ROUTE
router.get("/jobs/:id/inter", isAdmin, function(req,res){
	Job.findById(req.params.id, function(err, job) {
		if(err){
			req.flash("error", "Something went wrong in jobs database");
			console.log(err);
			res.redirect("/jobs/" + req.params.id)
		} else {
			job.status = "Interview Phase";
			job.save();
			var notif = {
				description: job.name + " just updated its status!! : Interview Phase",
				author: job.name
			};
			Notification.create(notif, function (err, newNotif) {	
				if(err){
					req.flash("error", "Something went wrong in notifications database");
					console.log(err);
					res.redirect("/jobs/" + req.params.id)
				} else {
					req.flash("success", "Updated status: Interview Phase");
					res.redirect("/jobs/" + req.params.id);
				}
			})
		}
	});
});

//JOB STATUS ACTIVE ROUTE
router.get("/jobs/:id/over", isAdmin, function(req,res){
	Job.findById(req.params.id, function(err, job) {
		if(err){
			req.flash("error", "Something went wrong in jobs database");
			console.log(err);
			res.redirect("/jobs/" + req.params.id)
		} else {
			job.status = "Over";
			job.save();
			var notif = {
				description: job.name + " just updated its status!! : Over",
				author: job.name
			};
			Notification.create(notif, function (err, newNotif) {	
				if(err){
					req.flash("error", "Something went wrong in notifications database");
					console.log(err);
					res.redirect("/jobs/" + req.params.id)
				} else {
					req.flash("success", "Updated status: Over");
					res.redirect("/jobs/" + req.params.id);
				}
			})
		}
	});
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;
