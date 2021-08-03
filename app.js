'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")

const user_route = require("./src/routes/user.route")
const typeEmployee_route = require("./src/routes/typeEmployee.route")
const work_route = require("./src/routes/work.route")


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(cors())

app.use('/api', user_route)
app.use('/api', typeEmployee_route)
app.use('/api', work_route)


module.exports= app;