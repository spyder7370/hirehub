const mongoose              = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');


const notificationSchema = new mongoose.Schema({

    description: {
        type: String,
        trim: true
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    },

	author: String

})


module.exports = new mongoose.model("Notification", notificationSchema);

