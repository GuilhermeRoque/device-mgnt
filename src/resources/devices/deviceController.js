const ServiceDevice = require("./serviceDevice")

module.exports = {
    create : (async (req, res, next) => {
        try {
            const application = req.application
            const device = {...req.body}
            const organization = req.organization
            const serviceDevice = new ServiceDevice()
            const deviceCreated =  await serviceDevice.create(organization, application, device)   
            return res.status(201).send(deviceCreated)

        } catch (error) {
            next(error)
        }
    }),

    update : (async (req, res, next) => {
        try {
            const application = req.application
            const organization = req.organization
            const deviceId = req.params.idDevice
            const device = {...req.body}

            const serviceDevice = new ServiceDevice()
            const deviceUpdated =  await serviceDevice.update(organization, application, device, deviceId)
            return res.status(200).send(deviceUpdated)
        } catch (error) {       
            next(error)
        }
    }),

    get : (async (req, res, next) => {
        const application = req.application
        const serviceDevice = new ServiceDevice()
        const devices = await serviceDevice.get(application)
        return res.status(200).send(devices)
    }),

    delete: (async (req, res, next) => {
        try {
            const deviceId = req.params.idDevice
            const application = req.application
            const organization = req.organization
            const serviceDevice = new ServiceDevice()
            await serviceDevice.delete(organization, application, deviceId)
            return res.status(204).send()
        } catch (error) {
            next(error)
        }

    })


}