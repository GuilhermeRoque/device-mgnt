const ServiceProfileService = require("./serviceProfileService")

module.exports = {
    create : (async (req, res, next) => {
        try {
            const organization = req.organization
            const serviceProfile = req.body
            const serviceProfileCreated = await new ServiceProfileService(organization).create(serviceProfile)
            res.status(201).send(serviceProfileCreated)   
        } catch (error) {
            next(error)
        }
    }),   
    get : (async (req, res, next) => {
        try {
            const organization = req.organization
            const serviceProfiles = await new ServiceProfileService(organization).getAll()
            res.status(200).send(serviceProfiles)   
        } catch (error) {
            next(error)
        }
    }),   
    delete : (async (req, res, next) => {
        try {
            const organization = req.organization
            const serviceProfileId = req.params.serviceProfileId
            await new ServiceProfileService(organization).deleteById(serviceProfileId)
            res.sendStatus(204)   
        } catch (error) {
            next(error)
        }
    }),   
    update : (async (req, res, next) => {
        try {
            const organization = req.organization
            const serviceProfileId = req.params.serviceProfileId
            const newServiceProfile = req.body
            await new ServiceProfileService(organization).updateById(serviceProfileId, newServiceProfile, req.params.organizationId)
            res.status(200).send(newServiceProfile)   
        } catch (error) {
            next(error)
        }
    }),  
}