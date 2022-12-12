const express = require('express')
const router = express.Router({mergeParams:true})
const deviceRouter = require("../devices/deviceRoutes")
const applicationController = require('./applicationController')

router.get('/', applicationController.get)
router.post('/', applicationController.create)
router.put('/:applicationId', applicationController.update)
router.delete('/:applicationId', applicationController.delete)
router.use("/:applicationId/devices", applicationController.appendApplication)
router.use("/:applicationId/devices", deviceRouter)

module.exports = router;
