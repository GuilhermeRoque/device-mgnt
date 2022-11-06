const application = require('./applicationModel')
const Application = application.applicationModel
const ttnApi = require("../../integrations/ttn/ttnApi")
const { ServiceError } = require('web-service-utils/serviceErrors')
const { HttpStatusCodes } = require("web-service-utils/enums")

class ApiTtnError extends ServiceError{
    constructor(error){
        const message = "Error during integration with TTN"
        const httpStatusCode = error.response.status
        const value = {
            url: error.config.url,
            auth: error.config.headers.Authorization,
            data: JSON.parse(error.config.data),
            details: []
        }
        const details = error.response.data.details
        for(const detail of details){
            value.details.push(detail.cause)
        }
        super(httpStatusCode, message, value)
    }
}

module.exports = {
    create : (async (req, res, next) => {
        try {
            const app = req.body
            app.organizationId = req.organizationId
            const application = new Application(app)                
            await application.save()
            try {
                await ttnApi.addApplication(app)                
            } catch (error) {
                // rollback
                await application.delete()
                throw new ApiTtnError(error)
            }
            res.status(201).send(application)
        } catch (error) {
            next(error)
        }
    }),
    get: (async (req, res, next) => {
        console.log("Looking for ", req.organizationId)
        console.log("Looking for ", Application.collection.modelName)
        const applications = await Application.find({organizationId:req.organizationId})
        res.status(200).send(applications)
    })
}