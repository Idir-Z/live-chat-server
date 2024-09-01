const express = require("express")
const cors = require("cors")
require("dotenv").config()
const mongoose = require('mongoose');
const userRouter = require("../server/routers/userRouter")

const port  = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(cors())


app.use("/user", userRouter)


const uri = process.env.MONGO_CONNECTION_STRING
console.log(uri);

app.get('/', (req, res) => {
    res.send("welcome to our chat api")
})

app.listen(port, () => {
    console.log(`server running on port : ${port}`);
})

mongoose.connect(uri).then(() => {
    console.log('connected to mongodb succesfully');
}).catch((error) => {
    console.log('connection to mongodb failed ',error.message);
})
