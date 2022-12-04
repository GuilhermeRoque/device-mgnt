const express = require('express')
const router = express.Router({mergeParams:true})
const loraProfileController = require('./loraProfileController')

router.post('/', loraProfileController.create)
router.get('/', loraProfileController.get)
router.delete('/:loraProfileId', loraProfileController.delete)
router.put('/:loraProfileId', loraProfileController.update)
module.exports = router;
