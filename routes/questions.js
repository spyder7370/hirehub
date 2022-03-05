const express        = require('express'),
      isAuth         = require('../controllers/authMiddlewares').isAuth,
      isAdmin        = require('../controllers/authMiddlewares').isAdmin,
      methodOverride = require("method-override"),
      router         = express.Router();

var Job  = require("../models/job"),
	Question = require("../models/question"),
	User = require("../models/user");


//QUESTION NEW FORM ROUTE
router.get("/job/:id/questions/new", isAdmin, function (req, res) {
	Job.findById(req.params.id, function(err,job){
		if(err){
			req.flash("error", "Something went wrong in the database");
			console.log(err);
			res.redirect("/jobs/" + req.params.id + "/questions");
		} else {
			res.render("questions/new", {job: job});
		}
	});
});


//QUESTION CREATE ROUTE
router.post("/job/:id/questions", isAdmin, function(req,res){
	Question.create(req.body.question, function (err, newQues) {
		if (err) {
			req.flash("error", "Something went wrong in the database");
			console.log(err);
			res.redirect("/jobs/" + req.params.id + "/questions");
		}
		//push  to job
		else {
			Job.findById(req.params.id, function(err,foundJob){
				foundJob.questions.push(newQues);
				foundJob.save();
				req.flash("success", "Successfully added question");
				res.redirect("/job/"+req.params.id+"/questions")
			});
		}
	});
});


//QUESTION SHOW ROUTE
router.get("/job/:id/questions", isAdmin, function (req, res) {
    Job.findById(req.params.id).populate("questions").exec(function (err, foundJob) {
        if (err) {
            req.flash("error", "Something went wrong in the database");
			console.log(err);
			res.redirect("/jobs/" + req.params.id + "/questions");
        }
        else {
            res.render("questions/show", { job: foundJob });
        }
    });
});


//QUESTION EDIT FORM ROUTE
router.get("/job/:id/questions/:questionId/edit", isAdmin, function (req, res) {
	Question.findById(req.params.questionId, function (err, foundQues) {
		if (err) {
			req.flash("error", "Something went wrong in the database");
			console.log(err);
			res.redirect("/jobs/" + req.params.id + "/questions");
		}
		else {
			res.render("questions/edit", { jobId: req.params.id, question: foundQues });
		}
	});
});


// QUESTION UPDATE ROUTE
router.put("/job/:id/questions/:questionId", isAdmin, function (req, res) {
	Question.findByIdAndUpdate(req.params.questionId, req.body.question, function (err, updatedQues) {
		if (err) {
			req.flash("error", "Something went wrong in the database");
			console.log(err);
			res.redirect("/jobs/" + req.params.id + "/questions");
		}
		else {
			req.flash("success", "Successfully updated question");
			res.redirect("/job/" + req.params.id + "/questions");
		}
	});
});


//QUESTION DELETE ROUTE
router.delete("/job/:id/questions/:questionId", isAdmin, function (req, res) {
	Question.findByIdAndRemove(req.params.questionId, function (err) {
		if (err) {
			req.flash("error", "Something went wrong in the database");
			console.log(err);
			res.redirect("/jobs/" + req.params.id + "/questions");
		}
		else {
			req.flash("success", "Successfully deleted question");
			res.redirect("/job/" + req.params.id + "/questions");
		}
	});
});


//TEST FORM ROUTE
router.get("/job/:id/test/:userId", isAuth, function(req, res){
	if(req.user.selected == true){
		req.flash("error", "You are already selected for another job")
		return res.redirect("back");
	// return res.status(400).json({
	// 	status: 'error',
	// 	error: 'you are already selected for another job',
	// });
	}

	Job.findById(req.params.id).populate("questions").exec(function (err, foundJob) {
		if(err){
			console.log(err);
		} else {
			foundJob.students.forEach(function(student){
				if(student._id.equals(req.user._id)){
					if(student.shortlisted){
						req.flash("error", "You are already shortlisted for this job!")
						return res.redirect("back");
						// return res.status(400).json({
						// 	status: 'error',
						// 	error: 'you are already shortlisted for this job',
						// });
					}
					else if(student.rejected){
						req.flash("error", "Sorry but you have been rejected for this job")
						return res.redirect("back");
						// return res.status(400).json({
						// 	status: 'error',
						// 	error: 'Sorry but you have been rejected for this job',
						// });
					}
				}
			});
			User.findById(req.params.userId, function(err, user){
				if(err){
					console.log(err);
				} else {
					res.render("test-info", {user:user, job: foundJob});
				}
			});
		}
	});
});

router.get("/job/:id/test/:userId/form", isAuth, function(req,res){
	Job.findById(req.params.id).populate("questions").exec(function (err, foundJob) {
		if(err){
			console.log(err);
		} else {
			User.findById(req.params.userId, function(err, user){
				if(err){
					console.log(err);
				} else {
					res.render("test", {user:user, job: foundJob});
				}
			});
		}
	});
});

//TEST FORM LOGIC
router.post("/job/:id/test/:userId", isAuth, function(req,res){
	// eval(require("locus"));
	//req.body.option
	if(req.user.selected == true){
		req.flash("error", "You can only apply once!")
		return res.redirect("back");
		// return res.status(400).json({
		// 	status: 'error',
		// 	error: 'you can only apply once',
		// });
	}
	Job.findById(req.params.id).populate("questions").exec(function (err, foundJob) {
		if(err){
			console.log(err);
		} else {
			let marks=0;
			let total= foundJob.questions.length*0.75;
			for(let i =0;i< foundJob.questions.length; i++){
				if(foundJob.questions[i].correctAns == req.body.option[i]){
					marks++;
				}
			}
			//eval(require("locus"));
			if(marks>=total){
				foundJob.students.forEach(function(student){
					if(student._id.equals(req.user._id)){
						student.shortlisted = true;
						foundJob.save();
						req.flash("success", "Successfully submitted test");
						res.redirect("/jobs/" + req.params.id);
					}
				});
			} else {
				foundJob.students.forEach(function(student){
					if(student._id.equals(req.user._id)){
						student.rejected = true;
						foundJob.save();
						req.flash("success", "Successfully submitted test");
						res.redirect("/jobs/" + req.params.id);
					}
				});
			}
		}
	});
});


module.exports = router;