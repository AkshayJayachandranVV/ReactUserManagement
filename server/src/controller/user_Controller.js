const userData=require("../model/userModel")
const bcrypt = require('bcrypt')
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")



const userSignup=async(req,res)=>{
    try{
      console.log(" withe user signup")
      console.log(req.body,"pppppppppppppppppppppppppppppppp")
      console.log(req.file)
      const path=req.file.path.replace(/\\/g,'/')
      console.log(path + " -------------------------------------")
      const newPath=path.replace('C:/Users/hp/Desktop/BOCAMP WEEKS/Week 19/User_ManagementReact/server/public', 'http://localhost:4000')
      const hashedPassword=await bcrypt.hash(req.body.password,10)
      const user=new userData({
        username:req.body.userName,
        email:req.body.email,
        phone:req.body.phone,
        password:hashedPassword,
        isAdmin:0,
        image:newPath
      })
      await user.save()
      console.log(user)
      res.json({ data: 'data recived success' })    
    }catch(e){
        console.log("Problem withe the userSignup"+e)
    }
}



const loginPost=async(req,res)=>{
  try{
    console.log("entered to the loginPost")
     console.log(req.body)
     const user=await userData.findOne({email:req.body.email})
     console.log(user)
     if(user){
        const passCheck= await bcrypt.compare(req.body.password,user.password)
        // const password = await bcrypt.compare(req.body.password, userData.password);
        console.log(passCheck)
        if(passCheck){
          let resp={
            id:user.id,
            display_name:user.username
          }
          let token=jwt.sign(resp,process.env.JWT_SECRET_KEY)
          res.json({success:true, data:user,token:token })
        }else{
                res.json({success:false,message:"Invalid Password"})
        }
     }else{
                res.json({success:false,message:"Invalid email"})
     }
  }catch(e){
    console.log("Problem with the loginPost"+e)
  }
}


const home=async(req,res)=>{
  try{
      console.log("home is called !!")
      const authHeader=req.headers.authorization
      const token=authHeader && authHeader.split(' ')[1];
      console.log(token)
      if(!token){
        res.json({success:false,message:"No token please login"})
      }else{
        jwt.verify(token,process.env.JWT_SECRET_KEY,async(err,data)=>{
          if(err){
            console.log("ivalid tokenn in verification")
            res.json({ success: false, message: 'invalid token' })
          }else{
               console.log(data)
               console.log(data.display_name)
               const objectId = new mongoose.Types.ObjectId(data.id);
               const userValue=await userData.findOne({_id:objectId}) 
               console.log(userValue+ "        value in the home")
               res.json({ success: true, message: 'token verification success!!', value: userValue});
          }
        })    
      }
  }catch(e){
    console.log("Problem with the home"+e)
  }
}


const editUser=async(req,res)=>{
  try{
    console.log("enterd to the editUser============================================================================")
    console.log(req.body)
    console.log(req.file)
    const updateUser=await userData.updateOne({email:req.body.email},{$set:{username:req.body.name,email:req.body.email,phone:req.body.phone}})
    console.log(updateUser)
    if(req.file){
      const path=req.file.path.replace(/\\/g,'/')
      console.log(path + "kittti -------------------------------------")
      const newPath=path.replace('C:/Users/hp/Desktop/BOCAMP WEEKS/Week 19/User_ManagementReact/server/public', 'http://localhost:4000')
      console.log(newPath)
      const updateImage=await userData.updateOne({email:req.body.email},{image:newPath})
      console.log(updateImage )
    }

    const updatedData=await userData.findOne({email:req.body.email})
  
    console.log(updatedData)

    res.json({msg:"data updated successfully",data:updatedData})

  }catch(e){
    console.log("problem with the editUser"+e)
  }
}


module.exports={
    userSignup,
    loginPost,
    home,
    editUser
}