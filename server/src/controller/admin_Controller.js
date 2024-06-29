const userModel=require("../model/userModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")


const adminLogin=async(req,res)=>{
    try{
     console.log("entered to the adminLogin ......")
     console.log(req.body)
     const adminData=await userModel.findOne({email:req.body.email})
     if(adminData){
        const passCheck= await bcrypt.compare(req.body.password,adminData.password)
        if(passCheck){
            if(adminData.isAdmin){
            const Data = {
                name: adminData.username,
                email: adminData.email,
                mobile: adminData.phone,
                image: adminData.image,
            }
            const token = jwt.sign(Data,process.env.JWT_SECRET_KEY)
            res.json({success:true, token:token})
        }else{
            res.json({success:false, msg:"you are not Autherized"})
        }
        }else{
            res.json({success:false, msg:"Invalid Password"})
        }
     }else{
        res.json({success:false, msg:"Invalid Username"})
     }
    }catch(e){
        console.log("Problem with the adminLogin ...."+e)
    }
}


const adminHome=async(req,res)=>{
    try{
       console.log("entered to the adminHome")
       const headers = req.headers.authorization;
       const token = headers && headers.split(' ')[1]
       if (!token) {
        res.json({ success: false, message: "NO token please login" })
    } else {
        jwt.verify(token,process.env.JWT_SECRET_KEY, async (err, data) => {
            if (err) {
                res.json({ success: fasle })
            } else {
                const allUser=await userModel.find({})
                res.json({success:true, data:allUser})
            }
        })
    }
  

    }catch(e){
        console.log("problem with the adminHome"+e)
    }
}


const deleteUser=async(req,res)=>{
    try{
        const user=await userModel.deleteOne({email:req.body.email})
        console.log(user)
        res.json({ success: true, data: 'email got' })
    }catch(e){
        console.log("Problem with the delete user"+e)
    }
}

module.exports={
    adminLogin,
    adminHome,
    deleteUser
}
