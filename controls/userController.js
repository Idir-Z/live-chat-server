const usermodel = require("../models/userModel")
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")


const createToken = (id) => {
    const jwtKey = process.env.JWT_SECRET_KEY
    return jwt.sign({id},jwtKey,{expiresIn:"3d"})
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
    let user = await userModel.findOne({ email })
    if (user) return res.status(400).json("user already exists, email in use")
    if(!name || !email||!password) return res.status(400).json("all fields are required")
    if (!validator.isEmail(email))
        return res.status(400).json("email is not valid")
    if (!validator.isStrongPassword(password))
        return res.status(400).json("password is not strong")

    user = new userModel({ name, email, password })
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()
    const token = createToken(user.id)
    res.status(200).json({ id: user.id, name: user.name, email: user.email,token : token})
    
    } catch (err) {
        console.log(err);
    }
    
}
const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        let user = await userModel.findOne({ email })
        if (!user)
            res.status(400).json("no user with the given email address")
        else {
            const jwtKey = process.env.JWT_SECRET_KEY
            const passwordTest = await verifyPassword(password, user.password)
            console.log('user password :', user.password);
            console.log("password test result",passwordTest);
            if (!passwordTest) {
                return res.status(400).json("invalid password")
            }
            else {
                const token = createToken(user.id)
                res.status(200).json({ message: "login succesfull", token: token })
            }
        }
    }
    catch (err) {
        console.log("error at catch level",err);
        res.status(500)
    }
}

const findUser =async (req, res) => {
    const userId = req.params.userId
    if(!userId) return res.status(400).json("userId must be specified in request params")
    try {
        const user =await userModel.findById(userId)
        if (user) {
            const name = user.name
            const email = user.email
            res.json({name,email})
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json("server error")
    }
}

const findListOfUsers = (req, res) => {
    const { pageNumber, pageSize } = req.params
    
}

async function verifyPassword(password,hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
            
        });
    });
}


module.exports = {
    registerUser,
    loginUser,
    findUser
}
