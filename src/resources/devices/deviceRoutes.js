const express = require('express')
const router = express.Router({mergeParams:true})
const deviceController = require('./deviceController')

router.post('/', deviceController.create)
router.get('/', deviceController.get)
router.put('/:idDevice', deviceController.update)

module.exports = router;
