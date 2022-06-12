const express = require('express'),
	isAuth = require('../controllers/authMiddlewares').isAuth,
	isAdmin = require('../controllers/authMiddlewares').isAdmin,
	methodOverride = require('method-override'),
	router = express.Router();

const Job = require('../models/job'),
	Notification = require('../models/notification'),
	User = require('../models/user');

const jobController = require('../controllers/job');
//LANDING PAGE
// router.get("/", function (req, res) {
// 	res.render("landing");
// })

//JOB INDEX ROUTE
router.get('/jobs', isAuth, jobController.jobIndex);
//JOB NEW FORM ROUTE
router.get('/jobs/new', isAdmin, jobController.newJobForm);
//JOB CREATE ROUTE
router.post('/jobs', isAdmin, jobController.createNewJob);
//JOB SHOW ROUTE
router.get('/jobs/:id', isAuth, jobController.showJob);
//JOB EDIT PAGE ROUTE
router.get('/jobs/:id/edit', isAdmin, jobController.editJobForm);
//JOB UPDATE ROUTE
router.put('/jobs/:id', isAdmin, jobController.updateJob);
//JOB DELETE ROUTE
router.delete('/jobs/:id', isAdmin, jobController.destroyJob);
//USER APPLY FOR JOB ROUTE
router.get('/jobs/:id/apply/:userID', isAuth, jobController.applyForJob);
//JOB STATUS ACTIVE ROUTE
router.get('/jobs/:id/active', isAdmin, jobController.jobSetActive);
//JOB STATUS INTERVIEW ROUTE
router.get('/jobs/:id/inter', isAdmin, jobController.jobSetInterview);
//JOB STATUS ACTIVE ROUTE
router.get('/jobs/:id/over', isAdmin, jobController.jobSetOver);

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;
