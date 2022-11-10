var mongoose = require('mongoose');
var jobSchema = new mongoose.Schema({
	name: {
		type: String,
		default: 'blank job'
	},

	logo: {
		type: String,
		default: 'not given'
	},

	status: {
		type: String,
		default: 'Active'
	},

	eligibility: {
		type: String,
		default: 'not given'
	},

	description: {
		type: String,
		default: 'not given'
	},

	responsibilities: {
		type: String,
		default: 'not given'
	},

	requirements: {
		type: String,
		default: 'not given'
	},

	location: {
		type: String,
		default: 'unknown'
	},

	time: {
		type: String,
		default: 'Full-Time'
	},

	deadline: {
		type: Date
	},

	category: {
		type: String,
		default: 'Software Engineer'
	},

	experience: {
		type: String,
		default: 'Entry Level'
	},

	companySize: {
		type: String,
		default: 'unknown'
	},

	companyPhone: {
		type: String,
		default: 'unknown'
	},

	companyEmail: {
		type: String,
		default: 'unknown'
	},

	companyWebsite: {
		type: String,
		default: 'unknown'
	},

	stipend: {
		type: String,
		default: 'unknown'
	},

	createdAt: {
		type: Date,
		default: Date.now
	},

	students: [
		{
			id: {
				type: mongoose.Schema.Types.ObjectID,
				ref: 'User'
			},
			shortlisted: {
				type: Boolean,
				default: false
			},
			rejected: {
				type: Boolean,
				default: false
			},
			name: String
		}
	],

	questions: [
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: 'Question'
		}
	]
});

module.exports = mongoose.model('Job', jobSchema);
