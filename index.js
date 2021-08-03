'use strict'
const mongoose = require('mongoose')
const app = require('./app');
const userControler = require('./src/controllers/user.controller');



mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://admin:admin@clustermenarbeit.sbqll.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Conexion:Correcto');
    userControler.mainStart();

    app.listen(process.env.PORT || 3000, function () {

        console.log('Servidor:Correcto')

    })
}).catch(err => console.log(err))


