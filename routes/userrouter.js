let express= require("express")
let userrouter= express.Router();
let bcrypt= require("bcrypt")
let jwt= require("jsonwebtoken");
const { User } = require("../models/models");
let nodemailer= require("nodemailer");
const auth = require("../middleware/Authmiddleware");


userrouter.post("/signup", async(req,res)=>{
  try{   
    let {password,email}= req.body

    let exituser = await User.findOne({email})

    if(exituser) return res.json({message:"user already exists with this email 🙂‍↔️🤦‍♂️", success:false})

    let myPlaintextPassword = password
    let salt = 10

    bcrypt.hash(myPlaintextPassword, salt, async function(err, hash) {

      if(err){
        return res.json({message:"some error occured in bcrypt signup", success:false})
      }

      let newuser = new User({...req.body, password:hash})
      let user = await newuser.save()

      res.json({message:"Account created successfully ❤️😃😃🎉", success:true, user:user})
    });

  }catch(e){
    res.json({
      success: false,
      message:"some error occured 😣😫, please trye again",
      error: e.message
    })
  }
})

// userrouter.post("/login", async(req,res)=>{
//   try{   
//     let {password,email}= req.body
// // console.log(req.body)
//     let exituser = await User.findOne({email})

//     if(!exituser) return res.json({message:"please signup, user does not exit with this account", success:false})

//     let myPlaintextPassword = password
//     let salt = 10
// let hash=exituser.password
//     bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
//     // result == true
// if(result){
// let accesstoken= jwt.sign({userId:exituser._id, role:exituser.role, email:exituser.email}, 'shhhhh', { expiresIn: 60 * 60 });
// let refreshtoken= jwt.sign({userId:exituser._id, email:exituser.email, role:exituser.role},'shhhhh', { expiresIn: "7d" })
// res.json({email:exituser.email, name:exituser.name, accesstoken:accesstoken, refreshtoken:refreshtoken})
// }else{
//   res.json(
//     {success:false, message:err.message}
//   )
// }
// });

//   }catch(e){
//     res.json({
//       success: false,
//       message:"error occured in catch signup",
//       error: e.message
//     })
//   }
// })

userrouter.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;
console.log("hit login api")
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });






    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid password" });

    const accesstoken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWTSECRET,{ expiresIn: "15m" });

    const refreshtoken = jwt.sign( { userId: user._id, role: user.role },  process.env.JWTSECRET, { expiresIn: "7d" } );


res.cookie("accessToken", accesstoken, {
  httpOnly: true,          
  secure: true,            
  sameSite: "strict",       
  maxAge: 5*60 * 60 * 1000   
});


res.cookie("refreshToken", refreshtoken, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000 
});


let cart = [];
if (user.cart && user.cart.length > 0) {
  const cartData = await User.aggregate([
    { $match: { _id: user._id } },
    {
      $unwind: {
        path: "$cart",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "products", 
        localField: "cart.productId",
        foreignField: "_id",
        as: "product"
      }
    },
    {
      $unwind: {
        path: "$product",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        cartItem: {
          productId: "$product._id",
          productname: "$product.productname",
          productImages: "$product.productImages",
          qty: "$cart.qty",
          price: "$cart.price"
        }
      }
    },
    {
      $group: {
        _id: null,
        cart: {
          $push: {
            $cond: [
              { $ifNull: ["$cartItem.productId", false] },
              "$cartItem",
              "$$REMOVE"
            ]
          }
        }
      }
    }
  ]);

  cart = cartData[0]?.cart || [];
}




 res.json({success: true,email: user.email,name: user.name,role: user.role,cart, message:"user login successfully"});


  } catch (e) {
    console.error("🔥 LOGIN API ERROR:", e);
  res.status(500).json({
    success: false,
    message: e.message,
    stack: e.stack
  });
  }
});



userrouter.post("/logout", (req, res) => {
 
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0, 
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
  });

  res.status(200).json({ message: "Logged out successfully" });
});

let transported= nodemailer.createTransport({
service:"gmail",
auth:{
  user:process.env.USER,
  pass:process.env.PASSWORD
}
})



userrouter.post("/forgot_password" ,async (req,res,next)=>{

let {email}=req.body
try{
let user= await User.findOne({email})
if(!user) {
  return res.json({success:false, message:"User Not Found For This Account"})
}
let resetpasswordtoken= jwt.sign({userId:user._id, role:user.role},process.env.JWTSECRET, {expiresIn:15*60})

let resetpasswordlink= `http://localhost:5173/Reset_password?token=${resetpasswordtoken}`

console.log("forget password route",req.body, user)


await transported.sendMail({
  from: `IMAANI PERFUMES <${process.env.USER}>`,
  to:email,
  subject: "Password Reset Link For Imaani Perfumes",
  html:`

    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #2e6ddf;">🔐 Password Reset Request</h2>
    <p>Hi there,</p>
    <p>You recently requested to reset your password for your Imaani Perfumes account.</p>
    <p style="color:green;  "><strong>This link is valid for the next 10 minutes</strong>. After that, it will expire for security reasons.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetpasswordlink}" style="display: inline-block; padding: 12px 24px; background-color: #2e6ddf; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Your Password</a>
    </div>

    <p style="color:red;">If you did not request this, you can safely ignore this email.</p>
    <p style="color: #555;">Thanks & regards,<br/><strong>Imaani Perfumes Team</strong></p>
  </div>
  `
})

res.json({success:true, message:"Link has sent to your email , Please check your email"})

}catch(e){
console.log(e.message)
res.json({message:e.message, success:false})
next(e)
}

})

userrouter.post("/reset_password", (req, res,next) => {
  try{
    let { token } = req.query;
  let { password } = req.body;

  let decoded = jwt.verify(token, process.env.JWTSECRET);
if(!decoded){
 return res.json({success:false, message:"Token has expired, please resend link"})
}

  let saltRounds = 10;
  let myPlaintextPassword = password;

  bcrypt.hash(myPlaintextPassword, saltRounds, async function (err, hash) {
    if (err) {
      res.json({ success: false, message: err.message });
    } else {
      await User.findByIdAndUpdate(
        { _id: decoded.userId },
        { password: hash }
      );

      res.json({
        success: true,
        message: "Password reset successfully",
      });
    }
  });
  }catch(e){
res.json({success:false, message:e.message})
next(e)
  }

});



userrouter.post("/update-profile", auth("user","admin") ,async (req,res,next)=>{
try{

let updated= await User.findByIdAndUpdate(req.userId, {...req.body},{ new:true})
res.json({success:true, message:"updated scuccessfully", updated})
}catch(e){
res.json({message:e.message, success:false})
}

})




module.exports=userrouter




