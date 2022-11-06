const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const ttnRegex = /^[a-z0-9](?:[-]?[a-z0-9]){2,}$/

const applicationSchema = new mongoose.Schema({
    name: {
        type: String, 
        required:true
    },
    description: {
        type: String, 
    },
    organizationId:{
        type: Object,
        required: true,
        ref: 'Organization'
    },
    apiKey: {
        type: String, 
    },
    applicationId: {
        type: String, 
        required:true,
        unique:true,
        match: ttnRegex
    },
    devices: {
        type: [ObjectId],
        ref: 'Device'
    }

}, { collection: 'applications' })

module.exports = {
    applicationSchema: applicationSchema,
    applicationModel: mongoose.model("Application", applicationSchema),
}
