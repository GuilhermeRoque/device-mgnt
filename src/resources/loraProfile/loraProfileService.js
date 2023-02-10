const {loraProfileModel} = require('./loraProfileModel')
const ServiceBaseSubDocument = require('../serviceProfile/serviceBaseSubDocument')
const ServiceDevice = require('../devices/serviceDevice')
const Organization = require('../organizations/organizationModel').organizationModel

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

    async updateById(id, newData, idOrganization){
        let result = await this._updateById(id, newData)     
        updateAllDevices(id, newData, idOrganization)       
        return result
    }
    
    async getAll(caller){
        return this._getAll()
    }

}

async function updateAllDevices(id, newData, idOrganization){
    const organization = await Organization.findById(idOrganization)
    for(const application of organization.applications){
        for(let device of application.devices){
            const serviceDevice = new ServiceDevice()
            if(device.loraProfile._id.toString() === id){
                device = {...device.toObject()}
                device._id = device._id.toString()
                device.serviceProfile._id = device.serviceProfile._id.toString()
                device.loraProfile = newData
                device.loraProfile._id = device.loraProfile._id.toString()
                device.configured = false
                console.log("Updating loraProfile device", device)
                serviceDevice.update(organization, application, device, device._id)    
            }else{
                console.log("Not Updating loraProfile device", device)
            }
        }
    }
}
module.exports = LoraProfileService
  