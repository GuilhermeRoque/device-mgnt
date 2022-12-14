const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const serviceProfileSchema = new mongoose.Schema({
    name: {
        type: String, 
        required:true
    },
    description: {
        type: String,
    },
    dataType: {
        type: Number, 
        required:true
    },
    channelType: {
        type: Number, 
        required:true
    },
    channelParam: {
        type: Number,
    },
    acquisition: {
        type: Number,
        required: true
    },
    period: {
        type: Number,
        required: true
    }

}, { collection: 'serviceProfile' })

module.exports = {
    serviceProfileSchema: serviceProfileSchema,
    serviceProfileModel: mongoose.model("ServiceProfile", serviceProfileSchema)
}
