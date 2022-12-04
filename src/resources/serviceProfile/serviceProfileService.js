const {serviceProfileModel} = require('./serviceProfileModel')
const ServiceBaseSubDocument = require('./serviceBaseSubDocument')

class ServiceProfileService extends ServiceBaseSubDocument{
    constructor(parent){
        const model = serviceProfileModel
        const collection = parent.serviceProfiles
        super(parent, collection, model)
    }

    async create (serviceProfile, caller){
        return this._create(serviceProfile)
    }

    async deleteById(id, caller){
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
module.exports = ServiceProfileService