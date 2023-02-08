const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const deviceSchema = require("../devices/deviceModel").deviceSchema

const ttnRegex = /^[a-z0-9](?:[-]?[a-z0-9]){2,}$/

const applicationSchema = new mongoose.Schema({
    name: {
        type: String, 
        required:true
    },
    description: {
        type: String, 
    },
    apiKey: {
        type: String, 
    },
    applicationId: {
        type: String, 
        required:true,
        match: ttnRegex
    },
    configured: {
        type: Boolean,
        required: true,
    },
    devices: {
        type: [deviceSchema]
    }

}, { collection: 'applications' })

module.exports = {
    applicationSchema: applicationSchema,
    applicationModel: mongoose.model("Application", applicationSchema),
}
