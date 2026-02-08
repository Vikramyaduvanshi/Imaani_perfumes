let mongoose= require("mongoose")


// usechema
let userschema= new mongoose.Schema({
name:{type:String, required:true},
email:{type:String, required:true},
password:{type:String, required:true},
phone:{type:String, required:true},
profile:{type:String, default:"Not uploaded"},
role:{type:String, enum:["admin","user"],default:"user"},
cart:[{productId:{type:mongoose.Schema.Types.ObjectId, ref:"Product",required:true}, qty:{type:Number, required:true, default:1}, price:{type:Number,required:true} }]
})
let User= mongoose.model("User",userschema);

                                                                         
let Productschema= new mongoose.Schema({
productname:{type:String, required:true},
producttype:{type:String,enum:["perfume","cosmetic"], required:true},
size:{type:String,required:true},
description:{type:String},
pricing:[{quantity:{type:Number, required:true},price:{type:Number, required:true}}],
price:{type:Number,required:true},
category:{type:String, enum:["men","women"], required:true},
specialpramotion:{type:Boolean, default:false},
productImages:[{url:{type:String},imageId:{type:String}}],
rating:{rate:{type:Number,default:4},count:{type:Number,default:0}},

})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
let Product= mongoose.model("Product",Productschema)





let Ratingschema= new mongoose.Schema({
ratedBy:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
rate:{type:String, required:true},
feedback:{type:String}
})

let Rating = new mongoose.model("Rating", Ratingschema)




// Order schema 

// const orderSchema = new mongoose.Schema(
//   {
//     orderId: {type: String,required: true,unique: true },

//     customer: {name: String,email: String,phone: String,address: String},

//     items: [{productId: String,productName: String,quantity: Number,price: Number}],

//     totalAmount: {type: Number,required: true},

//     currency: {type: String,default: "ZAR"},

//     paymentStatus: {type: String,enum: ["PENDING", "PAID", "FAILED"],default: "PENDING"},

//     paymentMethod: {type: String,default: "PAYFAST"}
//   },
//   { timestamps: true }
// );

// let Order= mongoose.model("Order",orderSchema )



// //  payment schema
// const paymentSchema = new mongoose.Schema(
//   {
// orderId: {type: String,required: true},
// paymentStatus: String, 
// pf_payment_id: String,
// payment_method: String,
// amount_gross: Number,
// amount_fee: Number,
// amount_net: Number,
// payer_email: String,
// rawResponse: Object 
//   },
//   { timestamps: true }
// );

// let Payment= mongoose.model("Payment", paymentSchema)







module.exports={Product, User,Rating}