const express = require("express")

const router = express.Router()
const {registerUser,loginUser,findUser} = require("../controls/userController")
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/find/:userId',findUser)
module.exports = router