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

const configureLora = async (appId, device) => {
    resp = await ttnApi.setDeviceJoinSettings(appId, device.devId, device)
    console.log("setDeviceJoinSettings", resp.status, resp.data)
    resp = await ttnApi.setDeviceNetworkSettings(appId, device)
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

            // TODO: Move this to Model or Front-End?
            device.devEUI = device.devEUI?device.devEUI: get_random_local_eui64()
            device.joinEUI = device.joinEUI?device.joinEUI: "0000000000000000"
            device.appKey = device.appKey?device.appKey: get_random_appkey()
            
            const newDevice = new Device(device)
            
            let respStatus = 201
            try {                        
                let resp = await ttnApi.addDevice(application.applicationId, device)
                console.log("addDevice", resp.status, resp.data)
                await configureLora(application.applicationId, device)
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
            // find application here
            const application =  null 
            const device = {...req.body}
            const _device_index = application.devices.findIndex(dev=>{return dev._id.toString()===req.params.idDevice})
            const _device = application.devices[_device_index]

            console.log("ID ", req.params.idDevice)
            console.log("DEVICES", application.devices)
            console.log("DEVICE POST", device)
            console.log("DEVICE INDEX", _device_index)
            console.log("FOUND DEVICE", _device)

            
            const devie_to_add = {
                loraProfileId: device.loraProfile._id,
                serviceProfileId: device.serviceProfile._id,
                loraProfile: device.loraProfile.loraProfileId,
                serviceProfile: device.serviceProfile.serviceProfileId,
                appKey: _device.appKey,
                joinEUI: _device.joinEUI,
                devEUI: _device.devEUI,
                _id: _device._id,
                name: _device.name,
                devId: _device.devId
                
            }                        
            application.devices.splice(_device_index, 1)
            application.devices.push(devie_to_add)
            console.log("ADDING DEVICE", devie_to_add)

            await application.save()
                
            let respStatus = 201
            try {                        
                await configureLora(application.appId, device)
            } catch (error) {
                console.log(error)
                respStatus = 202
            }

            res.status(respStatus).send(devie_to_add)      

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

    })


}