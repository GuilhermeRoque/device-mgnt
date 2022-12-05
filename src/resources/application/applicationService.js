const {applicationModel} = require('./applicationModel')
const ServiceBaseSubDocument = require('../serviceProfile/serviceBaseSubDocument')
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

class ApplicationService extends ServiceBaseSubDocument{
    constructor(parent){
        const model = applicationModel
        const collection = parent.applications
        super(parent, collection, model)
    }

    async create (application, caller){
        if (isUpdateProvider){
            try {
                await ttnApi.addApplication(application)
            } catch (error) {
                throw new ApiTtnError(error)
            }  
        }    
        return this._create(application)
    }

    async deleteById(id, caller){
        if (isUpdateProvider){
            const application =  await this._getById(id)
            try {
                await ttnApi.deleteApplication(application)
            } catch (error) {
                throw new ApiTtnError(error)
            }  
        }
        return this._deleteById(id)
    }

    async getById(id, caller){
        return this._getById(id)
    }

    async updateById(id, newData){
        return this._updateById(id, newData)
    }
    
    async getAll(caller){
        return this._getAll()
    }

}
module.exports = ApplicationService