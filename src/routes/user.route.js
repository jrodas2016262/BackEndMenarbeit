'use strict'
const express = require('express');

const userController = require('../controllers/user.controller')
var md_authentication = require('../middlewares/authenticated.middleware')
var api = express.Router();


api.put('/employeeUpdateRole/:idUser',userController.employeeUpdateRole)

api.post('/registerClient',userController.registerClient)
api.post('/registerEmployee',userController.registerEmployee)
api.post('/registerAdmin',md_authentication.ensureAuth,userController.addAdmin)
api.post('/login',userController.login)

api.get('/listProfile',md_authentication.ensureAuth,userController.listProfile)
api.get('/listUsers',md_authentication.ensureAuth,userController.listUsers)
api.get('/listEmployees',md_authentication.ensureAuth,userController.listEmployees)
api.get('/listEmployeesProcess',md_authentication.ensureAuth,userController.listEmployeesProcess)
api.get('/findUserId/:idUser', userController.findUserId);

api.put('/updateProfile',md_authentication.ensureAuth,userController.updateProfile)
api.put('/updateUsers/:idUser',md_authentication.ensureAuth,userController.updateUsers)


api.delete('/deleteProfile',md_authentication.ensureAuth,userController.deleteProfile)
api.delete('/deleteUsers/:idUser',md_authentication.ensureAuth,userController.deleteUsers)








module.exports  = api;  