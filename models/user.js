const mongoose              = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  username: {
    type: String,
    trim: true,
    required: true,
    unique: 32,
  },

  branch: {
    type: String,
    required: true
  },

  cgpa: {
    type: Number,
    required: true
  },

  personal_email: {
    type: String,
    sparse: true
  },

  mobile_number: {
    type: Number,
    sparse: true
  },

  selected: {
    type: Boolean,
    default: false
  },

  resume_link: {
    type: String,
    sparse: true
  },

  documents_link: {
    type: String,
    sparse: true
  },

  salt: String,
  hash: String,

  admin: {
    type: Boolean,
    default: false
  },

  last_login_date: {
    type: Date,
    default: Date.now
  },

  avatar: {
    type:String, 
    default: "/images/user_default.png"
  },

  appliedJobs: [
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Job"
		}
	]

});


module.exports = new mongoose.model("User", userSchema);