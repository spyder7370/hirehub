const express = require('express'),
	isAuth = require('../controllers/authMiddlewares').isAuth,
	isAdmin = require('../controllers/authMiddlewares').isAdmin,
	methodOverride = require('method-override'),
	router = express.Router();

const Job = require('../models/job'),
	Question = require('../models/question'),
	User = require('../models/user');

const multer = require('multer'),
	{ storage } = require('../cloudinary/config'),
	upload = multer({ storage });

//USER PAGE SHOW ROUTE
router.get('/users/:id', isAuth, function(req, res) {
	User.findById(req.params.id).populate('appliedJobs').exec(function(err, foundUser) {
		if (err) {
			req.flash('error', 'Something went wrong in the database');
			console.log(err);
			res.redirect('/jobs');
		} else {
			// eval(require("locus"))
			res.render('users/show', { user: foundUser });
		}
	});
});

//USER PAGE EDIT ROUTE
router.get('/users/:id/edit', isAuth, checkUser, function(req, res) {
	User.findById(req.params.id, function(err, foundUser) {
		if (err) {
			req.flash('error', 'Something went wrong in the database');
			console.log(err);
			res.redirect('/jobs');
		} else {
			res.render('users/edit', { user: foundUser });
		}
	});
});

//USER PAGE UPDATE ROUTE
router.put('/users/:id', isAuth, checkUser, upload.single('image'), function(req, res) {
	if (!req.file) {
		User.findOneAndUpdate(
			{ _id: req.params.id },
			{
				$set: {
					personal_email: req.body.personal_email,
					mobile_number: req.body.mobile_number,
					resume_link: req.body.resume_link,
					documents_link: req.body.documents_link
				}
			},
			function(err, updatedUser) {
				if (err) {
					req.flash('error', 'Something went wrong in the database');
					console.log(err);
					res.redirect('/jobs');
					//res.redirect("/jobs");
				} else {
					req.flash('success', 'Successfully updated your profile!');
					res.redirect('/users/' + req.params.id);
				}
			}
		);
	} else {
		User.findOneAndUpdate(
			{ _id: req.params.id },
			{
				$set: {
					personal_email: req.body.personal_email,
					mobile_number: req.body.mobile_number,
					resume_link: req.body.resume_link,
					documents_link: req.body.documents_link,
					avatar: req.file.path
				}
			},
			function(err, updatedUser) {
				if (err) {
					req.flash('error', 'Something went wrong in the database');
					console.log(err);
					res.redirect('/jobs');
					//res.redirect("/jobs");
				} else {
					req.flash('success', 'Successfully updated your profile!');
					res.redirect('/users/' + req.params.id);
				}
			}
		);
	}
});

//MIDDLEWARE
function checkUser(req, res, next) {
	User.findById(req.params.id, function(err, foundUser) {
		if (err) {
			req.flash('error', 'Something went wrong in the database');
			console.log(err);
			res.redirect('back');
		} else {
			if (foundUser._id.equals(req.user._id) || req.user.admin) {
				next();
			} else {
				req.flash('error', "You don't have permission to do that!");
				console.log(err);
				res.redirect('back');
			}
		}
	});
}

module.exports = router;
