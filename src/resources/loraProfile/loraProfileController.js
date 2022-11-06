const loraProfile = require('./loraProfileModel')
const LoraProfile = loraProfile.loraProfileModel

module.exports = {
    create : (async (req, res, next) => {
        try {
            const loraProfile = new LoraProfile(req.body)
            loraProfile.organizationId = req.organizationId
            await loraProfile.save()
            res.status(201).send(loraProfile)   
        } catch (error) {
            next(error)
        }
    }),
    get : (async (req, res, next) => {
        const applications = await LoraProfile.find({organizationId:req.organizationId})
        res.status(200).send(applications)
    }),
    
}