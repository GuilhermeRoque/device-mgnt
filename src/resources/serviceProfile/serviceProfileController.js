const serviceProfile = require('./serviceProfileModel')
const ServiceProfile = serviceProfile.serviceProfileModel

module.exports = {
    create : (async (req, res, next) => {
        try {
            const serviceProfile = new ServiceProfile(req.body)
            const organization = req.organization
            organization.serviceProfiles.push(serviceProfile)
            await organization.save()
            res.status(201).send(serviceProfile)   
        } catch (error) {
            next(error)
        }
    }),   
    get : (async (req, res, next) => {
        try {
            res.status(200).send(req.organization.serviceProfiles)   
        } catch (error) {
            next(error)
        }
    }),   
}