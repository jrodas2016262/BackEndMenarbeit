'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jobSchema = Schema({
    typeEmployee: {type: Schema.Types.ObjectId, ref:"typeEmployees"},
    name:String,
    description:String,
    price: Number
})

module.exports = mongoose.model('jobs', jobSchema)