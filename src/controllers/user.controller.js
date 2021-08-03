'use strict'
const User = require('../modules/user.module')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt.service')


function mainStart(req, res) {
  let userModel = new User();

  userModel.user = 'ADMIN'
  userModel.password = '123'
  userModel.email = 'mainAdmin@gmail.com'
  userModel.role = 0

  User.find({ user: userModel.user }, (err, userFind) => {
    if (err) return console.log("ERROR en la peticion")

    if (userFind && userFind.length >= 1) {
      console.log("Usuario Admin creado!")
    } else {
      bcrypt.hash(userModel.password, null, null, (err, passCrypt) => {
        userModel.password = passCrypt;
      })

      userModel.save((err, saveUser) => {
        if (err) return console.log("ERROR al crear el usuario Admin")

        if (saveUser) {
          console.log("Usuario Creado")
        }
      })
    }
  })
}

function login(req, res){
  let params = req.body;

  if (params.user && params.password) {
    User.findOne({ user: params.user }).populate('typeEmployee','name').exec( (err, userFound) => {
      if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
      if (userFound) {
        bcrypt.compare(params.password, userFound.password, (err, passCorrect) => {

          if (passCorrect) {
            if(userFound.role == 3) return res.status(400).send({mensaje: 'Su cuenta no ha sido aprobada'})
            userFound.password = undefined;
            return res.status(200).send({ token: jwt.userToken(userFound), userFound })
          } else {
            return res.status(404).send({ mensaje: 'Password incorrecta' })
          }
        })
      } else {
        return res.status(404).send({ mensaje: 'User no encontrado' })
      }
    })
  } else {
    return res.status(500).send({ mensaje: 'Ingrese todos los campos' })
  }


}

function registerClient(req, res) {
  let userModel = new User()
  let params = req.body
  if (params.user && params.password && params.email && params.name && params.lastName && params.phone && params.direction) {
    userModel.user = params.user;
    userModel.password = params.password;
    userModel.email = params.email;
    userModel.name = params.name;
    userModel.lastName = params.lastName;
    userModel.direction = params.direction;
    userModel.phone = params.phone;

    userModel.role = 1;

    User.find({ user: params.user }).exec((err, userFound) => {
      if (err) return res.status(500).send({ mensaje: 'Error en la busqueda de usuario' });
      if (userFound && userFound.length > 0) {
        return res.status(200).send({ mensaje: 'El usuario ya existe' })
      } else {
        bcrypt.hash(params.password, null, null, (err, passE) => {
          userModel.password = passE;
          userModel.save((err, userSaved) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion guardar' });
            if (userSaved) {
              return res.status(200).send({ userSaved })
            }

          })
        })
      }
    })

  } else {
    return res.status(500).send({ mensaje: 'Ingrese todos los campos' })
  }
}
function registerEmployee(req, res) { 

  let userModel = new User()
  let params = req.body
  
  if (params.user && params.password && params.email && params.name && params.lastName && params.phone && params.direction ) {
    userModel.user = params.user;
    userModel.password = params.password;
    userModel.email = params.email;
    userModel.name = params.name;
    userModel.lastName = params.lastName;
    userModel.direction = params.direction;
    userModel.phone = params.phone;
    userModel.typeEmployee = params.typeEmployee;
    userModel.role = 3;

    User.find({ user: params.user }).exec((err, userFound) => {
      if (err) return res.status(500).send({ mensaje: 'Error en la busqueda de usuario' });
      if (userFound && userFound.length > 0) {
        return res.status(200).send({ mensaje: 'El usuario ya existe' })
      } else {
        bcrypt.hash(params.password, null, null, (err, passE) => {
          userModel.password = passE;
          userModel.save((err, userSaved) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion guardar' });
            if (userSaved) {
              return res.status(200).send({ userSaved })
            }

          })
        })
      }
    })

  } else {
    return res.status(500).send({ mensaje: 'Ingrese todos los campos' })
  }

}

function addAdmin(req, res) {
  let params = req.body;
  let userModel = new User();
  if (req.user.role == 0) {
    if (params.email && params.password && params.user) {
      userModel.user = params.user;
      userModel.email = params.email;
      userModel.password = params.password
      userModel.role = 0;

      User.find({ user: params.user }).exec((err, userFound) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la busqueda de usuario' });
        if (userFound && userFound.length > 0) {
          return res.status(500).send({ mensaje: 'El usuario ya existe' })
        } else {
          bcrypt.hash(params.password, null, null, (err, passE) => {
            userModel.password = passE;
            userModel.save((err, userSaved) => {
              if (err) return res.status(500).send({ mensaje: 'Error en la peticion guardar' });
              if (userSaved) {
                return res.status(200).send({ userSaved })
              }

            })
          })
        }
      })
    } else {
      return res.status(500).send({ mensaje: 'Ingrese todos los campos' })
    }
  } else {
    return res.status(500).send({ mensaje: 'No posee permisos para agregar un administrador' })
  }
}


function listProfile(req, res) {
  User.find({ _id: req.user.sub }).exec((err, userFound) => {
    if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
    return res.status(200).send({ userFound })

  })
}

function listUsers(req, res) {
  if (req.user.role == 0) {
    User.find({$or:[{role:1},{role:0}]}).exec((err, usersFound) => {
      if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
      return res.status(200).send({ usersFound })

    })

  } else {
    return res.status(500).send({ mensaje: 'No posee permisos' })
  }
}

function listEmployees(req, res) {
  if (req.user.role == 0) {
    User.find({role:2}).exec((err, usersFound) => {
      if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
      return res.status(200).send({ usersFound })

    })

  } else {
    return res.status(500).send({ mensaje: 'No posee permisos' })
  }
}
function listEmployeesProcess(req, res){
  if (req.user.role == 0) {
    User.find({role:3}).exec((err, usersFound) => {
      if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
      return res.status(200).send({ usersFound })

    })

  } else {
    return res.status(500).send({ mensaje: 'No posee permisos' })
  }

}

function deleteProfile(req, res) {
  User.findByIdAndDelete(req.user.sub, (err, userDeleted) => {
    if (err) return res.status(500).send({ mensaje: 'error en la peticion eliminar' })
    if (!userDeleted) return res.status(500).send({ mensaje: 'error al eliminar usuario' })
    return res.status(200).send({ userDeleted })
  })
}

function deleteUsers(req, res) {
  var idUser = req.params.idUser;

  if (req.user.role == 0) {
    User.findByIdAndDelete(idUser, (err, userDeleted) => {
      if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar eliminar usuario' })
      if (!userDeleted) return res.status(500).send({ mensaje: 'ERROR al eliminar al usuario' })

      return res.status(200).send({ mensaje: 'Usuario eliminado' })
    })
  } else {
    return res.status(500).send({ mensaje: 'No puede modificar este usuario' })
  }
}

function updateUsers(req, res) {
  var idUser = req.params.idUser;
  var params = req.body;

  
    User.find({user:params.user}).exec((err, userUpdated) => {
      if (err) return res.status(500).send({ mensaje: 'ERROR en la solicitud de datoss' })
      if (userUpdated.length > 0 ) return res.status(500).send({ mensaje: 'El nombre del usuario ya existe' })
      console.log(params)
    User.findByIdAndUpdate(idUser, params, { new: true }, (err, userFind) => {
      if (err) return res.status(500).send({ mensaje: 'ERROR en la solicitud de datos' })
      if (!userFind) return res.status(500).send({ mensaje: 'Error al actualizar usuario' })
      return res.status(200).send({ userFind })
    })
  })
  
}
function updateProfile(req, res) {
  let params = req.body
  var idUser = req.user.sub;
console.log(params)
  User.find({user:params.user}).exec((err, userUpdated) => {
    if (err) return res.status(500).send({ mensaje: 'ERROR en la solicitud de datos' })
    if (userUpdated.length > 0 ) return res.status(500).send({ mensaje: 'El nombre del usuario ya existe' })

  User.findByIdAndUpdate(idUser, params, { new: true }, (err, userFind) => {
    if (err) return res.status(500).send({ mensaje: 'ERROR en la solicitud de datosss' })
    if (!userFind) return res.status(500).send({ mensaje: 'Error al actualizar perfil' })
    return res.status(200).send({ userFind })
  })
})
}
function findUserId(req, res) {
  var idUser = req.params.idUser;

  User.findOne({ _id: idUser }).populate('typeEmployee','name').exec((err, userFind) => {
    if (err) return res.status(500).send({ mensaje: 'Error al solicitar usuario' })
    if (userFind) {
      return res.status(200).send({ userFind })
    } else {
      return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
    }
  })
}


function employeeUpdateRole(req, res) {
  let idUser = req.params.idUser;
  
    if (idUser) {
      User.findByIdAndUpdate(idUser, { role: 2 }, { new: true }, (err, userUpdated) => {
        if (err) return res.status(500).send({ menssage: 'error en la peticion aaprobar rol' })
        return res.status(200).send({ userUpdated })

      })
    } else {
      return res.status(500).send({ mensaje: 'Ingrese el id del empleado' })
    }
  
}





module.exports = {
  mainStart,
  registerClient,
  registerEmployee,
  login,
  addAdmin,
  listProfile,
  listEmployees,
  listUsers,
  deleteProfile,
  deleteUsers,
  updateUsers,
  updateProfile,
  findUserId,
  listEmployeesProcess,
  employeeUpdateRole
}