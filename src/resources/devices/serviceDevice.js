const crypto = require("crypto")
const ttnApi = require('../../integrations/ttn/apiTtn')
const isUpdateProvider = process.env.APP_ENV != "local"
const {ServiceError} = require("web-service-utils/serviceErrors")
const ApiTtnError = require("../../integrations/ttn/apiTtnError")
const Device = require("./deviceModel").deviceModel

class FailedSanityCheckError extends ServiceError{
    constructor(message, value){
        const httpStatusCode = 400
        super(httpStatusCode, message, value)
    }
}

class ServiceDevice{
    async create(organization, application, device){
        if(!device.devEUI & device.configured){
            throw new FailedSanityCheckError("If device is already configured the device EUI must be provided", device)
        }

        const loraProfile = organization.loraProfiles.id(device.loraProfileId)
        const serviceProfile = organization.serviceProfiles.id(device.serviceProfileId)
        
        device.loraProfile = loraProfile
        device.serviceProfile = serviceProfile
        delete device.loraProfileId
        delete device.serviceProfileId

        // TODO: Move this to Model or Front-End?
        device.devEUI = device.devEUI?device.devEUI: ServiceDevice.get_random_local_eui64()
        device.joinEUI = device.joinEUI?device.joinEUI: "0000000000000000"
        device.appKey = device.appKey?device.appKey: ServiceDevice.get_random_appkey()

        const deviceToAdd = Device(device)

        if (isUpdateProvider & !deviceToAdd.configured){
            try {
                await ServiceDevice.addDeviceProvider(application.applicationId, deviceToAdd, loraProfile)
                deviceToAdd.configured = true
            } catch (error) {
                console.log(new ApiTtnError(error))
            }    
        }
        application.devices.push(deviceToAdd)
        await organization.save()
        return deviceToAdd
    } 

    async update(organization, application, device, idDevice){
        const deviceToUpdate = application.devices.id(idDevice)
        
        const loraProfile = device.loraProfileId?organization.loraProfiles.id(device.loraProfileId):null
        const serviceProfile = device.serviceProfileId?organization.serviceProfiles.id(device.serviceProfileId):null
        device.serviceProfile = serviceProfile
        device.loraProfile = loraProfile
        delete device.loraProfileId
        delete device.serviceProfileId
        
        for(const k of Object.keys(device)){
            deviceToUpdate[k] = device[k]
        }

        if (isUpdateProvider & !deviceToUpdate.configured){
            try {                        
                await ServiceDevice.updateLoraSettings(application.applicationId, device, loraProfile)
                deviceToUpdate.configured = true                    
            } catch (error) {
                throw new ApiTtnError(error)
            }
        }
        await organization.save()
        return deviceToUpdate

    }
    async get(application){
        return application.devices

    }

    async delete(organization, application, idDevice){
        const device = application.devices.id(idDevice)
        if (device.configured & isUpdateProvider){
            try {
                await ttnApi.deleteDevice(application.applicationId, device)
            } catch (error) {            
                throw new ApiTtnError(error)
            }    
        }
        device.remove()
        await organization.save()
    }



    static get_random_local_eui64 = () => {
        // random 64 bits
        const buffer = crypto.randomBytes(8)
        // set to local
        buffer[0] |= (1 << 1)
        buffer[0] &= ~(1 << 0)
        return buffer.toString('hex').toLocaleUpperCase()
    }
    
    static get_random_appkey = () => {
        const buffer = crypto.randomBytes(16)
        return buffer.toString('hex').toLocaleUpperCase()
    }
    
    
    static updateLoraSettings = async (applicationId, device, loraProfile) => {
        let respJoin = await ttnApi.setDeviceJoinSettings(applicationId, device.devId, device)
        let respNet = await ttnApi.setDeviceNetworkSettings(applicationId, device, loraProfile)
    }
    
    static addDeviceProvider = async (applicationId, device, loraProfile) => {
        console.log("Configuring device in TTN", applicationId, device, loraProfile)
        let respAdd = await ttnApi.addDevice(applicationId, device)
        console.log("Device added, updating lora settings")
        await ServiceDevice.updateLoraSettings(applicationId, device, loraProfile)
    }
    
}

module.exports = ServiceDevice