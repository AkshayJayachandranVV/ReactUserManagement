const express=require("express")
const router=express.Router()
const userController=require("../src/controller/user_Controller")
const upload=require("../multer/multer")



router.post("/signup",upload.single("image"),userController.userSignup)

router.post("/login",userController.loginPost)

router.get("/home",userController.home)

router.post("/editUser",upload.single("image"),userController.editUser)




module.exports=router







