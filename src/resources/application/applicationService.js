const {applicationModel} = require('./applicationModel')
const ServiceBaseSubDocument = require('../serviceProfile/serviceBaseSubDocument')
const ttnApi = require("../../integrations/ttn/apiTtn")
const isUpdateProvider = process.env.APP_ENV != "local"
const ApiTtnError = require("../../integrations/ttn/apiTtnError")
const applicationMgnt = require("./applicationMgnt")

class ApplicationService extends ServiceBaseSubDocument{
    constructor(parent){
        const model = applicationModel
        const collection = parent.applications
        super(parent, collection, model)
    }

    async create (application, caller){
        if(!application.apiKey){
            application.configured = false
            if (isUpdateProvider){
                try {
                    await ttnApi.addApplication(application)
                    application.configured = true
                } catch (error) {
                    throw new ApiTtnError(error)
                }  
            }        
        }else{
            application.configured = true
        }
        let result = await this._create(application)
        applicationMgnt.distributeApplicationsToDevicesProxy()
        return result
    }

    async deleteById(id, caller){
        if (isUpdateProvider){
            const application =  await this._getById(id)
            try {
                await ttnApi.deleteApplication(application.applicationId)
            } catch (error) {
                throw new ApiTtnError(error)
            }  
        }
        let result = await this._deleteById(id)
        applicationMgnt.distributeApplicationsToDevicesProxy()
        return result
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