'use strict'
const express = require('express');
const typeEmployeeController = require('../controllers/typeEmployee.controller')
const jobController = require('../controllers/job.controller')
var md_authentication = require('../middlewares/authenticated.middleware')
var api = express.Router();

api.post('/addTypeEmployee',md_authentication.ensureAuth, typeEmployeeController.addTypeEmployee)
api.get('/listTypeEmployee',typeEmployeeController.listTypeEmployee)
api.put('/updateTypeEmployee/:idTypeE',md_authentication.ensureAuth, typeEmployeeController.updateTypeEmployee)
api.delete('/deleteTypeEmployee/:idTypeE',md_authentication.ensureAuth, typeEmployeeController.deleteTypeEmployee)
api.get('/findTypeEmployeeId/:idTypeE', typeEmployeeController.findTypeEmployeeId)

api.post('/addJob',md_authentication.ensureAuth, jobController.addJob)
api.put('/updateJob/:idJob',md_authentication.ensureAuth, jobController.updateJob)
api.get('/listJobsByType/:idTypeE',md_authentication.ensureAuth, jobController.listJobsByType)
api.delete('/deleteJob/:idJob',md_authentication.ensureAuth, jobController.deleteJob)
api.get('/findJobId/:idJob',jobController.findJobId)
api.get('/listJobs',md_authentication.ensureAuth,jobController.listJob)

module.exports  = api;          