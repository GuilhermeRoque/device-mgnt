const serviceProfile = require('./serviceProfileModel')
const ServiceProfile = serviceProfile.serviceProfileModel

module.exports = {
    create : (async (req, res, next) => {
        try {
            const serviceProfile = new ServiceProfile(req.body)
            await serviceProfile.save()
            res.status(201).send(serviceProfile)   
        } catch (error) {
            next(error)
        }
    }),   
}