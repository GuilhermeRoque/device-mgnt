const loraProfile = require('./loraProfileModel')
const LoraProfile = loraProfile.loraProfileModel

module.exports = {
    create : (async (req, res, next) => {
        try {
            const loraProfile = new LoraProfile(req.body)
            organization.loraProfiles.push(loraProfile)
            await organization.save()
            res.status(201).send(loraProfile)   
        } catch (error) {
            next(error)
        }
    }),

    
}