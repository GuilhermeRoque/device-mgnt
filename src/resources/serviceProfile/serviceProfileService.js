const {serviceProfileModel} = require('./serviceProfileModel')
const ServiceBaseSubDocument = require('./serviceBaseSubDocument')
const Organization = require('../organizations/organizationModel').organizationModel
const ServiceDevice = require('../devices/serviceDevice')
const applicationMgnt = require('../application/applicationMgnt')
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

    async updateById(id, newData, idOrganization){
        let result = await this._updateById(id, newData)
        updateAllDevices(id, newData, idOrganization)
        return result
    }
    
    async getAll(caller){
        return this._getAll()
    }

}
module.exports = ServiceProfileService

async function updateAllDevices(id, newData, idOrganization){
    const organization = await Organization.findById(idOrganization)
    for(const application of organization.applications){
        const devicesUpdated = []
        for(let device of application.devices){
            const serviceDevice = new ServiceDevice()
            if(device.serviceProfile._id.toString() === id){
                device = {...device.toObject()}
                device._id = device._id.toString()
                device.serviceProfile = newData
                device.serviceProfile._id = device.serviceProfile._id.toString()
                device.loraProfile._id = device.loraProfile._id.toString()
                device.configured = false
                console.log("Updating service device", device)
                await serviceDevice.update(organization, application, device, device._id)    
                devicesUpdated.push(device.devId)
            }else{
                console.log("Not Updating service device", device)
            }
        }
    }
    await applicationMgnt.distributeApplicationsToDevicesProxy()


}