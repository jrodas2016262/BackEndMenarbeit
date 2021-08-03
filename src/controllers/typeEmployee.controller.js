'use strict'
const TypeEmployee =require('../modules/typeEmployee.module')
const Job = require('../modules/job.module')


function addTypeEmployee (req, res) {
    let typeEModel = new TypeEmployee();
    let params = req.body;

    if (req.user.role == 0) {
        if (params.name) {
            typeEModel.name = params.name;

            TypeEmployee.find({ name: params.name }, (err, typeEFind) => {
                if (err) return res.status(500).send({ message: 'ERROR al buscar áreas de trabajo' })

                if (typeEFind && typeEFind.length > 0) {
                    return res.status(200).send({ mensaje: 'Ya existe un área con este nombre' })
                } else {
                    typeEModel.save((err, typeESaved) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion guardar' });

                        if (typeESaved) {
                            return res.status(200).send({ typeESaved })
                        }
                    })
                }
            })
        } else {
            return res.status(500).send({ message: 'Campos sin llenar' })
        }
    } else {
        return res.status(500).send({ message: 'No puede realizar esta acción' })
    }

}
function listTypeEmployee(req, res) {
    TypeEmployee.find((err, typeEFind) => {
        if (err) return res.status(500).send({ message: 'ERROR al solicitar áreas de trabajo' })
        if (typeEFind && typeEFind.length > 0) {
            return res.status(200).send({typeEFind})
        } else {
            return res.status(500).send({ message: 'No se pudieron listar las áreas de trabajo' })
        }
    })
}
function updateTypeEmployee(req, res) {
    let params = req.body;
    var idTypeE = req.params.idTypeE;

    if (req.user.role == 0) {
        TypeEmployee.find({name: params.name}).exec((err,TypeEmployeeFound)=>{
            if (err) return res.status(500).send({ mensaje: 'ERROR en la solicitud de datos' })
            if (TypeEmployeeFound.length > 0 ) return res.status(500).send({ mensaje: 'El nombre del usuario ya existe' })

        TypeEmployee.findByIdAndUpdate(idTypeE, params, { new: true }, (err, typeUpdated) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion xads' })

            if (!typeUpdated) return res.status(500).send({ mensaje: 'error al actualizar perfil' })
            return res.status(200).send({ typeUpdated })
        })
    })
    } else {
        return res.status(500).send({ mensaje: 'No puede hacer uso de esta ruta' })
    }

}
function deleteTypeEmployee(req, res){
        var idTypeE = req.params.idTypeE;
      
        if (req.user.role == 0) {
            TypeEmployee.findByIdAndDelete(idTypeE, (err, typeEmployeeDeleted) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar eliminar area de trabajo' })
            if (!typeEmployeeDeleted) return res.status(500).send({ mensaje: 'ERROR al eliminar area de trabajo' })
                Job.deleteMany({typeEmployee:idTypeE}).exec((err, Jobdeleted)=>{
                    if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar eliminar los trabajos de esta area' })
    
            return res.status(200).send({ mensaje: 'Area de trabajo eliminada' ,typeEmployeeDeleted})
          })
        })
        } else {
          return res.status(500).send({ mensaje: 'No tiene permisos' })
        }
      


}

function findTypeEmployeeId(req, res) {
    let idTypeE = req.params.idTypeE;
  
    TypeEmployee.findOne({ _id: idTypeE }, (err, typeEmployeeFind) => {
      if (err) return res.status(500).send({ mensaje: 'Error al solicitar tipo de empleado' })
      if (typeEmployeeFind) {
        return res.status(200).send({ typeEmployeeFind })
      } else {
        return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
      }
    })
  }

module.exports ={
    addTypeEmployee,
    listTypeEmployee,
    updateTypeEmployee,
    deleteTypeEmployee,
    findTypeEmployeeId
}