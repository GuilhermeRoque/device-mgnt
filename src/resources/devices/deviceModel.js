const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

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

    loraProfileName: {
        type: String,
        required: true,
    },
    loraProfileId: {
        type: ObjectId,
        required: true,
        ref: 'LoraProfile'
    },

    serviceProfileId: {
        type: ObjectId,
        required: true,
        ref: 'ServiceProfile'
    },
    serviceProfileName: {
        type: String,
        required:true,
    },
    organizationId: {
        type: ObjectId,
        required: true,
        ref: 'Organization'
    },
    organizationName: {
        type: String,
        required:true,
    },
    applicationId: {
        type: ObjectId,
        required: true,
        ref: 'Application'
    },
    applicationName: {
        type: String,
        required:true,
    },

}, { collection: 'device' })

module.exports = {
    deviceSchema: deviceSchema,
    deviceModel: mongoose.model("Device", deviceSchema)
}
