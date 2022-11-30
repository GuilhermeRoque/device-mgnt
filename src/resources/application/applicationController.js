const application = require('./applicationModel')
const Application = application.applicationModel
const ttnApi = require("../../integrations/ttn/ttnApi")
const { ServiceError } = require('web-service-utils/serviceErrors')
const { HttpStatusCodes } = require("web-service-utils/enums")
const isUpdateProvider = process.env.APP_ENV != "local"

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
            const application = new Application(app)                
            const organization = req.organization
            organization.applications.push(application)
            await organization.save()
            if (isUpdateProvider){
                try {
                    await ttnApi.addApplication(app)                
                } catch (error) {
                    // rollback
                    await application.delete()
                    throw new ApiTtnError(error)
                }
            }
            res.status(201).send(application)
        } catch (error) {
            next(error)
        }
    }),
    get: (async (req, res, next) => {
        const applications = req.organization.applications
        res.status(200).send(applications)
    })
}