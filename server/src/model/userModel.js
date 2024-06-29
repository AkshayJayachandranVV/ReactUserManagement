const mongoose=require("mongoose")

mongoose.connect(process.env.MONGO_URL)    
.then(()=>{console.log("Connection established with DB")})
.catch((e)=>{console.error(e.message)})


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true 
    },
    password:{
        type:String,
        required:true
    },
    email:{
         type: String, 
        required: true 
    },
    phone:{
         type: Number, 
        required: true 
    },
    isAdmin:{
        type:Number,
        required:true
    },image:{
        type: String, 
        required: true 
    }
})


const User=mongoose.model("UserDetails",userSchema)
module.exports=User