const express = require('express')
const router = express.Router({mergeParams:true})
const organizationController = require('./organizationController')
const applicationRouter = require("../application/applicationRoutes")
const loraProfilesRouter = require("../loraProfile/loraProfileRoutes")
const serviceProfilesRouter = require("../serviceProfile/serviceProfileRoutes")

router.get('/', organizationController.get)
router.post('/', organizationController.create)
router.use("/:organizationId", organizationController.subdoc)
router.use("/:organizationId/applications", applicationRouter)
router.use('/:organizationId/lora-profiles', loraProfilesRouter)
router.use('/:organizationId/service-profiles', serviceProfilesRouter)

module.exports = router;
