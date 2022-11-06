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

const configureLora = async (applicationId, device, loraProfile) => {
    resp = await ttnApi.setDeviceJoinSettings(applicationId, device.devId, device)
    console.log("setDeviceJoinSettings", resp.status, resp.data)
    resp = await ttnApi.setDeviceNetworkSettings(applicationId, device, loraProfile)
    console.log("setDeviceNetworkSettings", resp.status, resp.data)                
}

module.exports = {
    create : (async (req, res, next) => {
        try {
            const idApplication = req.params.idApplication
            const device = {...req.body}

            // find application
            const application =  await Application.findById(idApplication)
            const loraProfile = await LoraProfile.findById(device.loraProfileId)
            const serviceProfile = await ServiceProfile.findById(device.serviceProfileId)
            
            device.loraProfileName = loraProfile.name
            device.serviceProfileName = serviceProfile.name
            device.applicationName = application.name
            device.organizationId = req.organizationId
            device.applicationId = idApplication
             

            // TODO: Move this to Model or Front-End?
            device.devEUI = device.devEUI?device.devEUI: get_random_local_eui64()
            device.joinEUI = device.joinEUI?device.joinEUI: "0000000000000000"
            device.appKey = device.appKey?device.appKey: get_random_appkey()
            

            const newDevice = new Device(device)
            await newDevice.save()

            let respStatus = 201
            try {                        
                let resp = await ttnApi.addDevice(application.applicationId, device)
                console.log("addDevice", resp.status, resp.data)
                await configureLora(application.applicationId, device, loraProfile)
            } catch (error) {
                console.log(error)
                respStatus = 202
            }

            res.status(respStatus).send(newDevice)      

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
            try {                        
                await configureLora(application.applicationId, device, loraProfile)
            } catch (error) {
                console.log(error)
                respStatus = 202
            }

            res.status(respStatus).send(device)      

        } catch (error) {
            // console.log("error.data", error.response.data.details, "\n\n")   
            console.log(error)         
            next("error")
        }
    }),

    get : (async (req, res, next) => {
        const idApplication = req.params.idApplication
        const filter = {applicationId: idApplication, organizationId: req.organizationId}
        const devices = await Device.find(filter)
        console.log("filter", filter, 'devices', devices)
        res.status(200).send(devices)      

    }),

    delete: (async (req, res, next) => {
        try {
            const idDevice = req.params.idDevice
            const idApplication = req.params.idApplication
            const application = await Application.findById(idApplication)
            const device = await Device.findByIdAndDelete(idDevice)
            await ttnApi.deleteDevice(application.applicationId, device)     
            res.sendStatus(204)           
        } catch (error) {
            res.sendStatus(500)
        }

    })


}