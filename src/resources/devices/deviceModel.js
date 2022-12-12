const mongoose = require('mongoose');
const serviceProfileSchema = require('../serviceProfile/serviceProfileModel').serviceProfileSchema
const loraProfileSchema = require('../loraProfile/loraProfileModel').loraProfileSchema

const deviceSchema = new mongoose.Schema({
    name: {
        type: String, 
        required:true
    },
    devId: {
        type: String, 
        required:true
    },
    devEUI: {
        type: String, 
    },
    joinEUI: {
        type: String, 
        required:true       
    },
    appKey: {
        type: String, 
    },
    loraProfile: {
        type: loraProfileSchema,
    },
    serviceProfile: {
        type: serviceProfileSchema
    },
    configured: {
        type: Boolean,
        required: true,
    }
}, { collection: 'device' })

module.exports = {
    deviceSchema: deviceSchema,
    deviceModel: mongoose.model("Device", deviceSchema)
}
