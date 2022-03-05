var mongoose = require("mongoose");


var questionSchema = new mongoose.Schema({

    description: String,

    option1: {
        type: String,
        index: {
            type: Number,
            default: 1
        }
    },

    option2: {
        type: String,
        index: {
            type: Number,
            default: 2
        }
    },

    option3: {
        type: String,
        index: {
            type: Number,
            default: 3
        }
    },

    option4: {
        type: String,
        index: {
            type: Number,
            default: 4
        }
    },

    correctAns: String
    
});


module.exports = mongoose.model("Question", questionSchema);