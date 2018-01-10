const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./projectSchema');

const userSchema = new Schema({
    
            google:{
                id:{type:String, required:true},
                email: {type:String, required:true},
                name: {type:String, required:true},
                token: {type:String, required:true},
                imageUrl: String
            },
            points: {type:Number, default:0},
            permission:[],
            created_at: {type:Date, default:Date.now}
});

module.exports = mongoose.model('User', userSchema);