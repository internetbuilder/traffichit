const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userSchema');


const projectSchema = new Schema({
    
        url: {type:String, required:true},
        traffic:{type:Number, default:0},
        clicked_by: [{type:Schema.Types.ObjectId, ref:'User'}],
        created_by: {type:String},
        _created_by: {type:Schema.Types.ObjectId, ref:'User' },
        created_at: {type:Date, default:Date.now},
        updated_at:[],
        active:{type:Boolean,default:true}
    
});


module.exports = mongoose.model('Project', projectSchema);