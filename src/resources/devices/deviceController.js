const crypto = require("crypto")
const deviceModel = require('./deviceModel')
const appModel = require("../application/applicationModel")
const serviceModel = require("../serviceProfile/serviceProfileModel")
const loraModel = require("../loraProfile/loraProfileModel")
const ttnApi = require('../../integrations/ttn/ttnApi')
const Device = deviceModel.deviceModel
const Application = appModel.applicationModel
const ServiceProfile = serviceModel.serviceProfileModel
const LoraProfile = loraModel.loraProfileModel
const isUpdateProvider = process.env.APP_ENV != "local"

const get_random_local_eui64 = () => {
    // random 64 bits
    const buffer = crypto.randomBytes(8)
    // set to local
    buffer[0] |= (1 << 1)
    buffer[0] &= ~(1 << 0)
    return buffer.toString('hex')
}

const get_random_appkey = () => {
    const buffer = crypto.randomBytes(16)
    return buffer.toString('hex')
}


const updateLoraSettings = async (applicationId, device, loraProfile) => {
    let respJoin = await ttnApi.setDeviceJoinSettings(applicationId, device.devId, device)
    let respNet = await ttnApi.setDeviceNetworkSettings(applicationId, device, loraProfile)
}

const addDeviceProvider = async (applicationId, device, loraProfile) => {
    console.log("Configuring device in TTN", applicationId, device, loraProfile)
    let respAdd = await ttnApi.addDevice(applicationId, device)
    console.log("Device added, updating lora settings")
    await updateLoraSettings(applicationId, device, loraProfile)
}

module.exports = {
    create : (async (req, res, next) => {
        try {
            const idApplication = req.params.idApplication
            const device = {...req.body}
            const organization = req.organization

            // find application
            const application =  organization.applications.id(idApplication)
            const loraProfile = organization.loraProfiles.id(device.loraProfileId)
            const serviceProfile = organization.serviceProfiles.id(device.serviceProfileId)
            
            device.loraProfile = loraProfile
            device.serviceProfile = serviceProfile

            // TODO: Move this to Model or Front-End?
            device.devEUI = device.devEUI?device.devEUI: get_random_local_eui64()
            device.joinEUI = device.joinEUI?device.joinEUI: "0000000000000000"
            device.appKey = device.appKey?device.appKey: get_random_appkey()
            
            application.devices.push(device)
            await organization.save()

            let respStatus = 201
            if (isUpdateProvider){
                try {                        
                    await addDeviceProvider(application.applicationId, device, loraProfile)
                } catch (error) {
                    console.log(error)
                    respStatus = 202
                }    
            }
            res.status(respStatus).send(device)      

        } catch (error) {
            // console.log("error.data", error.response.data.details, "\n\n")   
            console.log(error)         
            next("error")
        }
    }),

    update : (async (req, res, next) => {
        try {
            const idApplication = req.params.idApplication
            const idDevice = req.params.idDevice

            // find application here
            const device = {...req.body}
            const application =  await Application.findById(idApplication)
            const loraProfile = await LoraProfile.findById(device.loraProfileId)
            const serviceProfile = await ServiceProfile.findById(device.serviceProfileId)

            device.loraProfileName = loraProfile.name
            device.serviceProfileName = serviceProfile.name
            device.applicationName = application.name
            device.applicationId = idApplication

            await Device.findByIdAndUpdate(idDevice, device)

            let respStatus = 201
            if (isUpdateProvider){
                try {                        
                    await updateLoraSettings(application.applicationId, device, loraProfile)
                } catch (error) {
                    console.log(error)
                    respStatus = 202
                }
            }
            res.status(respStatus).send({...device, _id: idDevice})      

        } catch (error) {
            // console.log("error.data", error.response.data.details, "\n\n")   
            console.log(error)         
            next("error")
        }
    }),

    get : (async (req, res, next) => {
        const idApplication = req.params.idApplication
        res.status(200).send(req.organization.applications.id(idApplication).devices)      

    }),

    delete: (async (req, res, next) => {
        try {
            const idDevice = req.params.idDevice
            const idApplication = req.params.idApplication
            const application = await Application.findById(idApplication)
            const device = await Device.findByIdAndDelete(idDevice)
            if (isUpdateProvider){
                await ttnApi.deleteDevice(application.applicationId, device)
            }
            const index = application.devices.findIndex((device)=>{return device._id == idDevice})
            application.devices.splice(index, 1)
            await application.save()
            res.sendStatus(204)           
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }

    })


}