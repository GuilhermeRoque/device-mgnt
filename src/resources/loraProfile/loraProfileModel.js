const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const loraProfileSchema = new mongoose.Schema({
    name: {
        type: String, 
        required:true
    },
    description: {
        type: String,
    },
    freqPlanId: {
        type: String, 
        required:true
    },
    macVersion: {
        type: Number, 
        required:true
    },
    phyVersion: {
        type: Number, 
        required:true
    },
    isClassB: {
        type: Boolean,
        required: true
    },
    isClassC: {
        type: Boolean,
        required: true
    },
    isOTAA: {
        type: Boolean,
        required: true
    }

}, { collection: 'loraProfile' })

module.exports = {
    loraProfileSchema: loraProfileSchema,
    loraProfileModel: mongoose.model("LoraProfile", loraProfileSchema)
}
