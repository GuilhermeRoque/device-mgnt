const express = require('express')
const router = express.Router({mergeParams:true})
const serviceProfileController = require('./serviceProfileController')

router.post('/', serviceProfileController.create)
router.get('/', serviceProfileController.get)
router.delete('/:serviceProfileId', serviceProfileController.delete)
router.put('/:serviceProfileId', serviceProfileController.update)

module.exports = router;
