'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    lastName: String,
    user: String,
    password: String,
    email: String,
    phone:Number,
    direction: String,
    role: Number,
    typeEmployee: {type: Schema.Types.ObjectId, ref:"typeEmployees"},
    rewiews:[{
        coment:String,
        idUserComent:{type: Schema.Types.ObjectId, ref:"users"}
    }]
    
})

module.exports = mongoose.model('users',userSchema)

