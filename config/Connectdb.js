let mongoose= require("mongoose")

async function Connectdb() {

try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to mongodb")
}catch(e){
console.log("connect to have db", e.message)
}  
}


module.exports=Connectdb