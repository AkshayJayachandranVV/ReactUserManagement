const adminController=require("../../server/src/controller/admin_Controller")
const express=require("express")
const router=express.Router()
const upload=require("../multer/multer")



router.post("/adminLogin",adminController.adminLogin)

router.get("/adminHome",adminController.adminHome)

router.post("/deleteUser",adminController.deleteUser)


module.exports=router


   