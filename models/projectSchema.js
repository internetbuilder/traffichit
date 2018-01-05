const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userSchema');


const projectSchema = new Schema({
    
        id:{type:String, required:true},
        url: {type:String, required:true},
        anchor_text: {type:String, required:false},
        traffic:{type:Number, default:0},
        clicked_by: [{type:Schema.Types.ObjectId, ref:'User'}],
        created_by: {type:String},
        _created_by: {type:Schema.Types.ObjectId, ref:'User' },
        created_at: {type:Date, default:Date.now}
    
});


module.exports = mongoose.model('Project', projectSchema);