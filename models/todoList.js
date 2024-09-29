const mongoose = require('mongoose');
const {Schema} = mongoose;

const todoSchema = new Schema({
    title: { type:String,required:true},
    description: {type:String, required:true},
    isCompleted:{type:Boolean,required:true},
    comletedOn: String,
    createdBy: {
        ref:"User",
        type:Schema.ObjectId
    }
    
    },
     {
        timestamps:true
     }
);

const ToDo = mongoose.model("ToDo",todoSchema);
module.exports = ToDo;