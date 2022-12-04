const LoraProfileService = require("./loraProfileService")

module.exports = {
    create : (async (req, res, next) => {
        try {
            const organization = req.organization
            const loraProfile = req.body
            const loraProfileCreated = await new LoraProfileService(organization).create(loraProfile)
            res.status(201).send(loraProfileCreated)   
        } catch (error) {
            next(error)
        }
    }),   
    get : (async (req, res, next) => {
        try {
            const organization = req.organization
            const loraProfiles = await new LoraProfileService(organization).getAll()
            res.status(200).send(loraProfiles)   
        } catch (error) {
            next(error)
        }
    }),   
    delete : (async (req, res, next) => {
        try {
            const organization = req.organization
            const loraProfileId = req.params.loraProfileId
            await new LoraProfileService(organization).deleteById(loraProfileId)
            res.sendStatus(204)   
        } catch (error) {
            next(error)
        }
    }),   
    update : (async (req, res, next) => {
        try {
            const organization = req.organization
            const loraProfileId = req.params.loraProfileId
            const newServiceProfile = req.body
            await new LoraProfileService(organization).updateById(loraProfileId, newServiceProfile)
            res.status(200).send(newServiceProfile)   
        } catch (error) {
            next(error)
        }
    }),  
}