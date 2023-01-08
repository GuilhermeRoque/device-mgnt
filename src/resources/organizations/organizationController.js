const Organization = require('./organizationModel').organizationModel

module.exports = {
    create : (async (req, res, next) => {
        try {
            const data = req.body
            console.log("data", data)
            const organization = new Organization(data)                
            await organization.save()
            res.status(201).send(organization)
        } catch (error) {
            next(error)
        }
    }),
    get: (async (req, res, next) => {
        const organization = await Organization.findById(req.params.organizationId)
        req.organization = organization
        res.status(200).send(organization)
    }),
    subdoc: (async (req, res, next) => {
        const organization = await Organization.findById(req.params.organizationId)
        req.organization = organization
        next()
    }),

}