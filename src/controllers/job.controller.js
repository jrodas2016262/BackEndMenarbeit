'use strict'
const Job = require('../modules/job.module')
const TypeEmployee = require('../modules/typeEmployee.module')
 
function addJob(req,res) {

    let jobModel = new Job();
    let params = req.body;
    if (req.user.role == 0) {
        if (params) {

            TypeEmployee.find({_id:params.typeEmployee }).exec((err, employee) =>{
                if (err) return res.status(500).send({ mensaje: 'Error en la busqueda de area de trabajao' });
                console.log({params})
                if (employee.length <= 0) return res.status(500).send({ mensaje: 'no existe un area de trabajo con id'})


            if (params.name && params.description && params.price) {
                jobModel.name = params.name;
                jobModel.description = params.description;
                jobModel.price = params.price;
                jobModel.typeEmployee = params.typeEmployee;


                Job.find({ name: params.name }, (err, jobFind) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la busqueda de trabajo' });

                    if (jobFind && jobFind.length > 0) {
                        return res.status(200).send({ mensaje: 'Ya existe un trabajo con este nombre' })
                    } else {
                        jobModel.save((err, jobSaved) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion guardar' });
                            if (jobSaved) {
                                return res.status(200).send({ jobSaved })
                            }
                        })
                    }
                })
            } else {
                return res.status(500).send({ message: 'Ingrese todos los campos' })
            }
        })
        } else {
            return res.status(500).send({ message: 'El valor del id no se ha mandado por la ruta' })
        }
    }
}
function updateJob(req, res) {
    var idJob = req.params.idJob;
    var params = req.body;

    if (req.user.role == 0) {
        Job.findByIdAndUpdate(idJob, params, { new: true }, (err, jobFind) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR en la solicitud de datos' })
            if (!jobFind) return res.status(500).send({ mensaje: 'Error al actualizar trabajo' })
            return res.status(200).send({ jobFind })
        })
    } else {
        return res.status(500).send({ mensaje: 'Este usuario no puede modificar' })
    }
}

function listJobsByType(req, res) {
    var idTypeE = req.params.idTypeE;

    Job.find({ typeEmployee: idTypeE }, (err, jobsFind) => {
        if (err) return res.status(500).send({ message: 'ERROR al solicitar trabajos' })
        if (jobsFind && jobsFind.length > 0) {
            return res.status(200).send({jobsFind})
        } else {
            return res.status(500).send({ message: 'No hay trabajos para listar' })
        }
    })
}

function deleteJob(req,res) {
    var idJob = req.params.idJob;

    if (req.user.role == 0) {
        Job.findByIdAndDelete(idJob, (err, jobDeleted) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar eliminar trabajo' })
            if (!jobDeleted) return res.status(500).send({ mensaje: 'ERROR al eliminar trabajo' })

            return res.status(200).send({ mensaje: 'Trbajo eliminado' })
        })
    } else {
        return res.status(500).send({ mensaje: 'No tiene permisos para eliminar' })
    }
}

function findJobId(req, res) {
    let idJob = req.params.idJob;
  
    Job.findOne({ _id: idJob }, (err, jobFind) => {
      if (err) return res.status(500).send({ mensaje: 'Error al solicitar job' })
      if (jobFind) {
        return res.status(200).send({ jobFind })
      } else {
        return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
      }
    })
  }

  function listJob(req, res) {
    if(req.user.role == 0){
        Job.find().populate('typeEmployee','name').exec((err, jobsFind) => {
            if (err) return res.status(500).send({ message: 'ERROR al solicitar trabajos' })
            if (jobsFind && jobsFind.length > 0) {
                return res.status(200).send({jobsFind})
            } else {
                return res.status(500).send({ message: 'No hay trabajos para listar' })
            }
        })
    
    } else{
        return res.status(500).send({ message: 'no posee permisos'})
    }
}




module.exports ={
addJob,
updateJob,
listJobsByType,
deleteJob,
findJobId,
listJob
}