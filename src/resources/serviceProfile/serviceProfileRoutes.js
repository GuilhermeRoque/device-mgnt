const express = require('express')
const router = express.Router({mergeParams:true})
const serviceProfileController = require('./serviceProfileController')

router.post('/', serviceProfileController.create)
router.get('/', serviceProfileController.get)
module.exports = router;
