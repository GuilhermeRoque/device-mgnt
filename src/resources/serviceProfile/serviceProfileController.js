const serviceProfile = require('./serviceProfileModel')
const ServiceProfile = serviceProfile.serviceProfileModel

module.exports = {
    create : (async (req, res, next) => {
        try {
            const serviceProfile = new ServiceProfile(req.body)
            serviceProfile.organizationId = req.organizationId
            await serviceProfile.save()
            res.status(201).send(serviceProfile)   
        } catch (error) {
            next(error)
        }
    }),   
    get : (async (req, res, next) => {
        try {
            const serviceProfiles = await ServiceProfile.find({organizationId:req.organizationId})
            res.status(200).send(serviceProfiles)   
        } catch (error) {
            next(error)
        }
    }),   
}