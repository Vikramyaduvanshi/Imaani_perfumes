let express= require("express");

const auth = require("../middleware/Authmiddleware");
const { User } = require("../models/models");
let cartrouter= express.Router();


cartrouter.post("/add-cart", auth("admin","user"),async(req,res,next)=>{
try{
    console.log("array", req.body.array)
let arr = req.body.array

console.log(arr)

let id= req.userId
let user= await User.findById(id)
user.cart=[...user?.cart, ...arr]
let cart=await user.save()
 res.json({success:true, message:"cart added successfully",cart})
res.json({success:true})
}catch(e){
res.json({success:false, message:e.message})
next()
}
})
cartrouter.post("/delete-cart", auth("admin","user"),async(req,res,next)=>{
try{
    console.log("array", req.body.array)
let arr = req.body.array

console.log(arr)

let id= req.userId
let deletedproduct=await User.findByIdAndUpdate(
  id,
  { $pull: { cart: { productId: { $in: arr } } } },
  { new: true }
);
res.json({message:"deleted successfull", success:true})
console.log("deleted product",deletedproduct)
}catch(e){
res.json({success:false, message:e.message})
next()
}
})

module.exports = cartrouter