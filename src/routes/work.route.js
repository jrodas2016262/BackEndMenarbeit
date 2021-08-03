'use strict'
const express = require('express');

const workController = require('../controllers/work.controller')
var md_authentication = require('../middlewares/authenticated.middleware')
var api = express.Router();



api.post('/addWorkClient',md_authentication.ensureAuth,workController.addWorkClient);
api.put('/aceptEmployee',md_authentication.ensureAuth,workController.aceptEmployee)
api.get('/cancelChangesWorks/:idWork',md_authentication.ensureAuth,workController.cancelChangesWork)


api.put('/changeWork/:idWork',md_authentication.ensureAuth,workController.changeWork)
api.get('/confirmClientWork/:idWork',md_authentication.ensureAuth,workController.confirmClientWork)
api.delete('/cancelWork/:idWork',md_authentication.ensureAuth,workController.cancelWork)
api.get('/finishWorkEmployee/:idWork',md_authentication.ensureAuth,workController.finishWork)
api.get('/getRecord',md_authentication.ensureAuth,workController.getWorkCompletedUser)
api.get('/getProcessWork',md_authentication.ensureAuth,workController.getWorkProcessUser)

api.get('/getWorkAvailable',md_authentication.ensureAuth,workController.getWorkAvailable)

api.get('/findWorkId/:idWork',workController.findByIdWork)

api.put('/addComentUser/:idUser',md_authentication.ensureAuth,workController.addComentUser)

api.get('/getWorkUser/:idWork',workController.listWorksUser)



module.exports  = api;  