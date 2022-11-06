const express = require('express')
const router = express.Router({mergeParams:true})
const loraProfileController = require('./loraProfileController')

router.post('/', loraProfileController.create)
router.get('/', loraProfileController.get)
module.exports = router;
