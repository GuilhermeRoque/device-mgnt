var logger = require('morgan');
const express = require('express');
const applicationsRouter = require('./resources/application/applicationRoutes')
const loraProfilesRouter = require('./resources/loraProfile/loraProfileRoutes')
const serviceProfilesRouter = require('./resources/serviceProfile/serviceProfileRoutes')
const organizationRouter = express.Router({mergeParams:true})
const { HttpStatusCodes } = require('web-service-utils/enums');
const { ServiceError } = require('web-service-utils/serviceErrors');

const app = express(); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

organizationRouter.use(async(req,res,next)=>{
    req.organizationId = req.params.organizationId
    next()
})
organizationRouter.use('/lora-profiles', loraProfilesRouter)
organizationRouter.use('/service-profiles', serviceProfilesRouter)
organizationRouter.use('/applications', applicationsRouter)

app.use("/organizations/:organizationId", organizationRouter)

app.use(async (error, req, res, next) =>{
    console.log("Handling error...")
    console.log(error)
    console.log(error.message)
    console.log(error.value)

    if (error instanceof ServiceError){
        res.status(error.httpStatusCode).send({
            message: error.message, 
            value: error.value
        })    
    }else{
        const message = 'Unexpected error'
        console.log(message)
        res.status(HttpStatusCodes.INTERNAL_SERVER).send({
            message: message, 
        })    
    }
})





// app.use('/applications', applicationsRouter);
// app.use("/lora-profiles", loraProfilesRouter);
// app.use('/service-profiles', serviceProfilesRouter);

module.exports = app