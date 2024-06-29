const express=require("express")
const app=express()
require("dotenv").config()
const bodyParser =require('body-parser')
const userRouter=require("./routes/user_Route")
const adminRouter=require("./routes/admin_Route")
const path=require("path")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json());
const cors = require('cors')


// Increase the payload size limit for body parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use("/user",userRouter)
app.use("/admin",adminRouter)

app.use(express.static(path.join(__dirname, 'public')))







app.listen(4000,()=>{
    console.log("Port is running")
})


