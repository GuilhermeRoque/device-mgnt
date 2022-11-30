const mongoose = require('mongoose');
const applicationSchema = require("../application/applicationModel").applicationSchema
const loraProfileSchema = require("../loraProfile/loraProfileModel").loraProfileSchema
const serviceProfileSchema = require("../serviceProfile/serviceProfileModel").serviceProfileSchema

const organizationSchema = new mongoose.Schema({
    organizationId: {
        type: String, 
        required:true,
        unique:true
    },
    applications: {
        type: [applicationSchema]
    },
    serviceProfiles: {
        type: [serviceProfileSchema]
    },
    loraProfiles: {
        type: [loraProfileSchema]
    },
    bucket: {
        type: String
    },
    username: {
        type: String
    },
    token: {
        type: String
    },
    password: {
        type: String
    },

}, { collection: 'organizations' })

module.exports = {
    organizationSchema: organizationSchema,
    organizationModel: mongoose.model("Organization", organizationSchema),
}
