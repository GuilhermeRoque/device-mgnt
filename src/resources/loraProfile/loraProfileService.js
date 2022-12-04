const {loraProfileModel} = require('./loraProfileModel')
const ServiceBaseSubDocument = require('../serviceProfile/serviceBaseSubDocument')

class LoraProfileService extends ServiceBaseSubDocument{
    constructor(parent){
        const model = loraProfileModel
        const collection = parent.loraProfiles
        super(parent, collection, model)
    }

    async create (loraProfile, caller){
        return this._create(loraProfile)
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
module.exports = LoraProfileService