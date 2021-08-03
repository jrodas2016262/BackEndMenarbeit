'use strict'
const User = require('../modules/user.module')
const Job = require('../modules/job.module')
const TypeEmployee = require('../modules/typeEmployee.module')
const Work = require('../modules/work.module')

function addWorkClient(req,res) {
let workModel = new Work()
let params = req.body;
console.log(req.user.sub)
console.log({params})
if( params.typeEmployee && params.job && params.description  ){
    
    User.find({_id:req.user.sub}).exec((err,clientFound)=>{
        if(err) return res.status(500).send({menssage:'Error en la solicitud buscar cliente'})
        if(clientFound.length <= 0) return res.status(500).send({menssage:'No se encontro el  cliente'})
        if(clientFound){
            TypeEmployee.find({_id:params.typeEmployee}).exec((err,typeFound)=>{
                if(err) return res.status(500).send({menssage:'Error en la solicitud buscar area de trabajo'})
                if(typeFound.length <= 0) return res.status(500).send({menssage:'No se encontro el  area de trabajo'})
                if(typeFound){
                    Job.find({_id:params.job}).exec((err,jobFound)=>{
                        if(err) return res.status(500).send({menssage:'Error en la solicitud buscar trabajo'})
                        if(jobFound.length <= 0) return res.status(500).send({menssage:'No se encontro el trabajo'})
                            if(jobFound){
                                workModel.client = req.user.sub;
                                workModel.typeEmployee = params.typeEmployee;
                                workModel.job = params.job;
                                workModel.descriptionJob = params.description;
                                workModel.price = jobFound[0]['price'];
                                workModel.status = 'SOLICITUD';
                                workModel.direction = params.direction;
                                
                                Work.find({client:req.user.sub, $or:[{status:'SOLICITUD'},{status:'CONFIRMADO_EMPLEADO'},{status:'CONFIRMADO_CAMBIOS'},{status:'CONFIRMADO'}]}).exec((err,workFound1)=>{
                                    if(err) return res.status(500).send({menssage:'Error en la solicitud buscar trabajos'})
                                    if(workFound1.length > 0) return res.status(500).send({menssage:'Ya posee un trabajo en curso'})
                                
                                workModel.save((err,workSaved)=>{
                                    if(err) return res.status(500).send({menssage:'Error en la solicitud guardar trabajo'})
                                    if(workSaved){
                                        return res.status(200).send({workSaved})
                                    }
                                })
                            })
                            }
                    })
                }

            })

        }
    })
}else{
    return res.status(500).send({menssage:'Debe llenar todos los campos'})
}
}
function aceptEmployee(req, res){
    let employee = req.user.sub;
    let params = req.body;
    if(req.user.role == 2){
        User.find({_id:req.user.sub}).exec((err,employeeFound)=>{
            if(err) return res.status(500).send({menssage:'Error en la solicitud buscar trabajador'})
            if(employeeFound.length <= 0) return res.status(500).send({menssage:'No se encontro el  trabajador'})
            if(employeeFound){
                Work.find({employee:req.user.sub , status:{$ne:'FINALIZADO'}}).exec((err,workFound1)=>{
                    if(err) return res.status(500).send({menssage:'Error en la solicitud buscar trabajos'})
                    if(workFound1.length > 0) return res.status(500).send({menssage:'No puede aceptar otro trabajo si tiene otro en proceso'})

                
                Work.findOne({_id:params}).exec((err,workFound)=>{
                    if(err) return res.status(500).send({menssage:'Error en la solicitud buscar trabajo'})
                    console.log(params)
                    if(!workFound ) return res.status(500).send({menssage:'No se encontro el  trabajo'})
                    if(workFound.length <= 0) return res.status(500).send({menssage:'No se encontro el  trabajo'})
                    if(workFound){
                        if(workFound['status'] != 'SOLICITUD' ) return res.status(500).send({menssage:'El trabajo ya ha sido aceptado'})

                        Work.findByIdAndUpdate(params,{employee:employee, status: 'CONFIRMADO_EMPLEADO'},{new:true},(err,workUpdated)=>{
                            if(err) return res.status(500).send({menssage:'Error en la solicitud aceptar empleado trabajo'})
                            if(workUpdated){
                                return res.status(200).send({workUpdated})
                            }

                        })
                    }
                })
            })
            }
        })
    } else {
        return res.status(500).send({menssage:'No es un trabajador'})
    }
}
function changeWork(req, res){
    let params = req.body;
    let idWork = req.params.idWork
    if(req.user.role == 2){
        User.find({_id:req.user.sub}).exec((err,employeeFound)=>{
            if(err) return res.status(500).send({menssage:'Error en la solicitud buscar trabajador'})
            if(employeeFound.length <= 0) return res.status(500).send({menssage:'No se encontro el  trabajador'})
            if(employeeFound){
                Work.findOne({_id:idWork}).exec((err,workFound)=>{
                    if(err) return res.status(500).send({menssage:'Error en la solicitud buscar trabajo'})
                    if(workFound.length <= 0) return res.status(500).send({menssage:'No se encontro el  trabajo'})
                    if(workFound){
                        if(workFound['status'] != 'SOLICITUD' ) return res.status(500).send({menssage:'El trabajo ya ha sido aceptado'})
                        Work.findByIdAndUpdate(idWork,{ employee:req.user.sub,status: 'CONFIRMADO_CAMBIOS',changes:params.changes,$inc:{price:params.price}},{ new: true },(err,workUpdated)=>{
                            if(err) return res.status(500).send({menssage:'Error en la solicitud aceptar empleado trabajo'})
                            if(workUpdated){
                                return res.status(200).send({workUpdated})
                            }

                        })
                    }
                })
            }
        })
    } else {
        return res.status(500).send({menssage:'no es empleado'})
    }
}
function confirmClientWork(req, res){
   let idWork = req.params.idWork;
   let status = 'CONFIRMADO'
    if(req.user.role == 1){
        Work.find({_id:idWork}).exec((err,workFound)=>{
            if(err) return res.status(500).send({menssage:'Erro en la solicitud buscar trabajo'})
            if(workFound.length > 0){
                if(workFound[0]['client'] != req.user.sub) return res.status(500).send({menssage:'No puede aceptar un trabajo el cual no le pertenece'})

                Work.findByIdAndUpdate(idWork,{status:status},{ new: true },(err,workUpdated)=>{
                    if(err) return res.status(500).send({menssage:'Error al actualizar work'})
                    return res.status(200).send({workUpdated})
                })

            } else{
                return res.status(500).send({menssage:'No se encontro el  trabajo'})
            }
        })
    }
}
function cancelWork(req, res) {
let idWork = req.params.idWork;
Work.find({_id:idWork}).exec((err,workFound)=>{
    if(err) return res.status(500).send({menssage:'Erro en la solicitud buscar trabajo'})
    if(workFound.length >0){
        if(workFound[0]['client'] != req.user.sub && workFound[0]['employee'] != req.user.sub) return res.status(500).send({menssage:'No puede aceptar un trabajo el cual no le pertenece'})

        Work.findByIdAndDelete(idWork,(err,workDeleted)=>{
            if(err) return res.status(500).send({menssage:'Error al actualizar work'})
            return res.status(200).send({workDeleted})
        })

    }else{
        return res.status(500).send({menssage:'No se encontro el trabajo'})
    }
})
}
function finishWork(req, res){
    let idWork = req.params.idWork;
    let status = 'FINALIZADO'
    if(req.user.role == 2){
    Work.find({_id:idWork}).exec((err,workFound)=>{
        if(err) return res.status(500).send({menssage:'Erro en la solicitud buscar trabajo'})
        if(workFound.length >0){
            if( workFound[0]['employee'] != req.user.sub) return res.status(500).send({menssage:'No puede finalizar un trabajo el cual no le pertenece'})
            Work.findByIdAndUpdate(idWork,{status:status},{ new: true },(err,workUpdated)=>{
                if(err) return res.status(500).send({menssage:'Error al actualizar work'})
                return res.status(200).send({workUpdated})
            })
    
        }else{
            return res.status(500).send({menssage:'No se encontro el trabajo'})
        }
    })
}
}

function getWorkCompletedUser(req,res){
    Work.find({status:'FINALIZADO',$or:[{ employee:req.user.sub},{client:req.user.sub}]}).populate('typeEmployee','name').populate('job','name').populate('client','name').populate('employee','name').exec((err,workFound)=>{
        if (err) return res.status(500).send({menssage:'Error al solicitar historial'})
        if(workFound.length <=0) return res.status(500).send({menssage:'No posee trabajos'})
        return res.status(200).send({workFound})
    })

}
function getWorkProcessUser(req,res){
    
    Work.find( {status:{$ne:'FINALIZADO'},$or:[{ employee:req.user.sub},{client:req.user.sub}]})
    .populate('client','name').populate('employee','name').populate('typeEmployee', 'name').populate('job','name')
    .exec((err,workFound)=>{
        if (err) return res.status(500).send({menssage:'Error al solicitar historial'})
        if(workFound.length <=0) return res.status(500).send({menssage:'No posee trabajos'})
        return res.status(200).send({workFound})
    })

}

function getWorkAvailable(req, res){
    if(req.user.role == 2){
        User.find({_id:req.user.sub}).exec((err,employeeFound)=>{
            if(err) return res.status(500).send({menssage:'Error en la solicitud buscar trabajador'})
            if(employeeFound.length <= 0) return res.status(500).send({menssage:'No se encontro el  trabajador'})
            console.log(employeeFound)
            Work.find({$or:[{typeEmployee:employeeFound[0]['typeEmployee'] , status:'SOLICITUD'},{typeEmployee:employeeFound[0]['typeEmployee'],employee:req.user.sub ,status:{$ne:'FINALIZADO'}}]})
            .populate('client','name').populate('employee','name').populate('typeEmployee', 'name').populate('job','name').exec((err,workFound)=>{
                if(err) return res.status(500).send({menssage:'Error en la solicitud buscar trabajador'})
                if(workFound.length <= 0) return res.status(500).send({menssage:'No existen trabajos en su area'})
                return res.status(200).send({workFound})

            })
        })
    } else {
        return res.status(500).send({menssage:'No es trabajador'})
    }
}

function listWorksUser(req, res){
    let idWork = req.params.idWork;
     Work.find({_id:idWork},(err, workFind) => {
        if (err) return res.status(500).send({ mensaje: 'Error al solicitar work' })
        if (workFind) {
          return res.status(200).send({ workFind })
        } else {
          return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        }
      })
}


function findByIdWork(req,res) {
    let idWork = req.params.idWork;

    Work.findOne({ _id: idWork }).populate('client','name').populate('employee','name').populate('typeEmployee', 'name').populate('job','name').exec((err, workFind) => {
      if (err) return res.status(500).send({ mensaje: 'Error al solicitar work' })
      if (workFind) {
        return res.status(200).send({ workFind })
      } else {
        return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
      }
    })
}

function cancelChangesWork(req, res){
    let idWork = req.params.idWork;
    if(req.user.role == 1 || req.user.role == 2) {
        Work.find({_id:idWork}).exec((err,workFound1)=>{
            if(err) return res.status(500).send({menssage:'error en la peticion buscar'})
            if(workFound1.length <= 0) return res.status(500).send({menssage:'No existe el trabajo'})
            Job.find({_id:workFound1[0]['job']}).exec((err,jobFound)=>{
                if(err) return res.status(500).send({menssage:'error en la peticion buscar job'})
    
        Work.findByIdAndUpdate(idWork,{status:'SOLICITUD' ,$unset:{ employee:"",changes:""},price:jobFound[0]['price']},{ new: true },(err,workUpdated)=>{
            if(err) return res.status(500).send({menssage:'error en la peticion actualizar'})
            return res.status(200).send({workUpdated})
         })
        })
    })
    } else{
        return res.status(500).send({menssage:'no es un cliente'})
    }
    
    }



    function addComentUser(req,res) {
        let params = req.body;
        let idUser = req.params.idUser
        
        User.find({_id:idUser}).exec((err,userFound)=>{
            if(err) return res.status(500).send({menssage:'error al buscar usuario'})
            if(!userFound) return res.status(500).send({menssage:'No existe el usuario'})
            User.findByIdAndUpdate(idUser,{$push:{rewiews:{coment:params.coment, idUserComent:req.user.sub}}},{new:true}, (err,comentAdd)=>{
                if(err) return res.status(500).send({menssage:'error al agregar coment'})
                return res.status(200).send({comentAdd})
    
            })
        })
    
    
    }

    function listRecord(req, res){
         Work.find({$or:[{employee:req.user.sub , status:'FINALIZADO'},{client:req.user.sub,status:'FINALIZADO'}]}).exec((err,workFind) => {
            if (err) return res.status(500).send({ mensaje: 'Error al solicitar work' })
            if (workFind) {
              return res.status(200).send({ workFind })
            } else {
              return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
            }
          })
    }






module.exports = {
    addWorkClient,
    aceptEmployee,
    changeWork,
    confirmClientWork,
    cancelWork,
    finishWork,
    getWorkCompletedUser,
    getWorkProcessUser,
    getWorkAvailable,
    findByIdWork,
    listWorksUser,
    cancelChangesWork,
    addComentUser,
    listRecord
}
