'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typeEmployeeSchema = Schema({
    name: String
})

module.exports = mongoose.model('typeEmployees',typeEmployeeSchema)

