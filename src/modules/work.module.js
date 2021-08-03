'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    client: {type: Schema.Types.ObjectId, ref:"users"},
    employee: {type: Schema.Types.ObjectId, ref:"users"},
    typeEmployee: {type: Schema.Types.ObjectId, ref:"typeEmployees"},
    job: {type: Schema.Types.ObjectId, ref:"jobs"},
    descriptionJob:String,
    price:Number,
    status:String,
    changes:String,
    direction:String

})

module.exports = mongoose.model('works',userSchema)
