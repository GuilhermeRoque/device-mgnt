const ApplicationService = require("./applicationService")

module.exports = {
    create : (async (req, res, next) => {
        try {
            const organization = req.organization
            const application = req.body
            const applicationCreated = await new ApplicationService(organization).create(application)
            res.status(201).send(applicationCreated)   
        } catch (error) {
            next(error)
        }
    }),   
    get : (async (req, res, next) => {
        try {
            const organization = req.organization
            const applications = await new ApplicationService(organization).getAll()
            res.status(200).send(applications)   
        } catch (error) {
            next(error)
        }
    }),   
    delete : (async (req, res, next) => {
        try {
            const organization = req.organization
            const applicationId = req.params.applicationId
            await new ApplicationService(organization).deleteById(applicationId)
            res.sendStatus(204)   
        } catch (error) {
            next(error)
        }
    }),   
    update : (async (req, res, next) => {
        try {
            const organization = req.organization
            const applicationId = req.params.applicationId
            const newServiceProfile = req.body
            await new ApplicationService(organization).updateById(applicationId, newServiceProfile)
            res.status(200).send(newServiceProfile)   
        } catch (error) {
            next(error)
        }
    }),
    
    appendApplication: (async (req, res, next) =>{
        const organization = req.organization
        const applicationId = req.params.applicationId
        req.application = await new ApplicationService(organization).getById(applicationId)
        next()
    })
}