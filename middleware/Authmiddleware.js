const jwt = require("jsonwebtoken");

function auth(...allowedRole){
  return async(req,res,next)=>{
    try{

      const token = req.cookies?.accessToken;
      console.log("before catch in auth",req.cookies)
      if(!token){
        return res.status(401).json({message:"token not found"})
      }

      const decode = jwt.verify(token, process.env.JWTSECRET);
console.log("decode data from jwt token",decode)
      if(!allowedRole.includes(decode.role)){
        return res.json({success:false, message:"permission denied"})
         
      }else{
      req.userId = decode.userId;
      req.role = decode.role;
         return next();
      }
    }catch(e){

      if(e.message === "jwt expired"){
          // try using refresh token
          try{
            const refreshToken = req.cookies?.refreshToken;
            // console.log(req.cookies)
            if(!refreshToken){
              return res.json({success:false, message:"refresh token missing"})
            }

            const decodeRefresh = jwt.verify(refreshToken, process.env.JWTSECRET);
console.log("before catch in auth",decodeRefresh)

            const newAccessToken = jwt.sign(
               {userId:decodeRefresh.userId, role:decodeRefresh.role},
               process.env.JWTSECRET,
               {expiresIn:"7d"}
            );

            // send new cookie
            res.cookie("accessToken", newAccessToken, {
              httpOnly:true,
              secure:true,
              sameSite:"strict",
              maxAge:7 * 24 * 60 * 60 * 1000
            })

            req.userId = decodeRefresh.userId;
            req.role = decodeRefresh.role;

            return next();


          }catch(e){
            return res.json({success:false, message:"refresh expired please login again"})
          }
      }

      return res.json({success:false, message:e.message})
    }
  }
}

module.exports = auth;
