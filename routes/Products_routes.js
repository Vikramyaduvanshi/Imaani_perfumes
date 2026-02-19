let express= require("express")
const auth = require("../middleware/Authmiddleware")
const { Product } = require("../models/models")
const { Imagestorage, cloudinary } = require("../config/cloudniray.config")
let Productrouter= express.Router()
let multer=require("multer")
let users=["user", "admin"]
 
Productrouter.get("/all-products", async (req, res) => {

  try {
    let { page = 1, limit = 20, productname="", price, rating, minprice, maxprice, minrating , category, producttype} = req.query;

    //learned: MATCH me agar kuch  nhi diya to sabhi products result me ayenge , leking sort me nhi dena hoga nhi to sort ko use mat kro, 
    let productsearch = {};
if(category){
  productsearch["category"]=category.toLowerCase()
}
if(producttype){
  productsearch["producttype"]=producttype.toLowerCase()
}

    if (productname && productname.trim() !== "") {
      productsearch.productname = { $regex: productname, $options: "i" };
    }
if(minrating){
    
    productsearch["rating.rate"]={$gte:Number(minrating)}
}


    if (minprice || maxprice) {
      productsearch.price = {};
      if (minprice) productsearch.price.$gte = Number(minprice);
      if (maxprice) productsearch.price.$lte = Number(maxprice);  
    }


    let sortObject = {};

    if (price) {
      sortObject.price = price === "enc" ? 1 : -1;
    }

    if (rating) {
      sortObject["rating.rate"] = rating === "enc" ? 1 : -1;
    }


    let skip = (Number(page) - 1) * Number(limit);

    let total=await Product.countDocuments()
    let result;

    if (Object.keys(sortObject).length > 0) {
      result = await Product.aggregate([{ $match: productsearch }, { $sort: sortObject }, { $skip: skip }, { $limit: Number(limit) } ]);
    } else {
      result = await Product.aggregate([{ $match: productsearch }, { $skip: skip }, { $limit: Number(limit) }]);
    }
    res.json({success: true,message: "fetch successful",data: result,total:total});

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
Productrouter.get("/all-perfume", async (req, res) => {
  try {
    let { page = 1, limit = 20, productname, price, rating, minprice, maxprice, minrating, category, producttype} = req.query;

    //learned: MATCH me agar kuch  nhi diya to sabhi products result me ayenge , leking sort me nhi dena hoga nhi to sort ko use mat kro, 
    let productsearch = {};
    if(category){
      productsearch["category"]=category
    }
    if(producttype){
      productsearch["producttype"]=producttype
    }
productsearch.producttype="perfume"  
    if (productname) {
      productsearch.productname = { $regex: productname, $options: "i" };
    }
if(minrating){
    
    productsearch["rating.rate"]={$gte:Number(minrating)}
}

    if (minprice || maxprice) {
      productsearch.price = {};
      if (minprice) productsearch.price.$gte = Number(minprice);
      if (maxprice) productsearch.price.$lte = Number(maxprice);  
    }


    let sortObject = {};

    if (price) {
      sortObject.price = price === "enc" ? 1 : -1;
    }

    if (rating) {
      sortObject["rating.rate"] = rating === "enc" ? 1 : -1;
    }


    let skip = (Number(page) - 1) * Number(limit);

    
    let result;

    if (Object.keys(sortObject).length > 0) {
      result = await Product.aggregate([{ $match: productsearch }, { $sort: sortObject }, { $skip: skip }, { $limit: Number(limit) } ]);
    } else {
      result = await Product.aggregate([{ $match: productsearch }, { $skip: skip }, { $limit: Number(limit) }]);
    }
    res.json({success: true,message: "fetch successful",data: result});

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

Productrouter.get("/all-cosmetic", async (req, res) => {
  try {
    let { page = 1, limit = 20, productname, price, rating, minprice, maxprice, minrating ,category, producttype} = req.query;

    //learned: MATCH me agar kuch  nhi diya to sabhi products result me ayenge , leking sort me nhi dena hoga nhi to sort ko use mat kro, 
    let productsearch = {};
        if(category){
      productsearch["category"]=category
    }
    if(producttype){
      productsearch["producttype"]=producttype
    }
productsearch.producttype="cosmetic"
    if (productname) {
      productsearch.productname = { $regex: productname, $options: "i" };
    }
if(minrating){
    
    productsearch["rating.rate"]={$gte:Number(minrating)}
}

    if (minprice || maxprice) {
      productsearch.price = {};
      if (minprice) productsearch.price.$gte = Number(minprice);
      if (maxprice) productsearch.price.$lte = Number(maxprice);  
    }


    let sortObject = {};

    if (price) {
      sortObject.price = price === "enc" ? 1 : -1;
    }

    if (rating) {
      sortObject["rating.rate"] = rating === "enc" ? 1 : -1;
    }


    let skip = (Number(page) - 1) * Number(limit);

    
    let result;

    if (Object.keys(sortObject).length > 0) {
      result = await Product.aggregate([{ $match: productsearch }, { $sort: sortObject }, { $skip: skip }, { $limit: Number(limit) } ]);
    } else {
      result = await Product.aggregate([{ $match: productsearch }, { $skip: skip }, { $limit: Number(limit) }]);
    }
    res.json({success: true,message: "fetch successful",data: result});

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


let upload = multer({storage:Imagestorage})
// Productrouter.post("/product-images",upload.array("productImages", 10), auth("admin"), async (req, res) => {
//     try {
//       // Cloudinary me upload ke baad har image ka data req.files me hota hai
//       const files = req.files.map(file => {url:file.path, file.filename});

//       res.json({success: true,message: "Images uploaded successfully",images: files});
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );


Productrouter.delete("/delete-image/:public_id",auth("admin"), async (req, res) => {
  try {
    let id = req.params.public_id;

    const result = await cloudinary.uploader.destroy(id);

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


Productrouter.post( "/create-products", auth("admin"), upload.array("productImages", 10),async (req, res, next) => {
    try {
      console.log("REQ BODY 👉", req.body);
      console.log("FILES 👉", req.files);
console.log("api hit creating")
      const { productname,  producttype, size, description, price, category} = req.body;

      if (!productname || !producttype || !size || !price || !category) {
        return res.status(400).json({success: false, message: "Required fields missing" });  }

      const images = req.files.map(file => ({  url: file.path,imageId: file.filename }));

   let pricing = [];

if (req.body.pricing) {
  if (typeof req.body.pricing === "string") {
    pricing = JSON.parse(req.body.pricing); // React + FormData
  } else if (Array.isArray(req.body.pricing)) {
    pricing = req.body.pricing; // React direct
  } else {
    pricing = Object.values(req.body.pricing); // Postman
  }

  pricing = pricing.map(item => ({
    quantity: Number(item.quantity),
    price: Number(item.price)
  }));
}

      const product = await Product.create({
        productname,
        producttype,
        size,
        description,
        price,
        category,
        pricing,
        productImages: images
      });

      res.status(201).json({ success: true, product });

    } catch (err) {
      next(err);
    }
  }
);

Productrouter.get("/product/:prid", async(req,res,next)=>{

try{

let id= req.params.prid;

let product=  await Product.findById(id)
res.json({success:true, message:"product fetched successfully", product})

}catch(e){
res.json({success:false,err:e.message, message:"some error occured in sigle product"})

}




})




Productrouter.put( "/update-product/:id", auth("admin"),  upload.array("productImages", 10), async (req, res) => {
    try {
      const { id } = req.params;

    
      const pricing = req.body.pricing ? JSON.parse(req.body.pricing) : [];

      const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];

 
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false,  message: "Product not found" });
      }

   
      const removedImages = product.productImages.filter(
        img =>
          !existingImages.some(
            e => e.imageId === img.imageId
          )
      );


      await Promise.all( removedImages.map(img =>  cloudinary.uploader.destroy(img.imageId) ) );

  
      const newImages = req.files.map(file => ({
        url: file.path,
        imageId: file.filename
      }));

  
      const finalImages = [...existingImages, ...newImages];

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          productname: req.body.productname,
          producttype: req.body.producttype,
          size: req.body.size,
          description: req.body.description,
          price: req.body.price,
          category: req.body.category,
          pricing,
          productImages: finalImages
        },
        { new: true }
      );

      res.json({  success: true,  message: "Product updated successfully",  updatedProduct });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false,   message: "Update failed",   error    })
      }
  }
);




Productrouter.delete( "/delete-product/:id", auth("admin"), async (req, res,next) => {
    try {
      const { id } = req.params;
console.log("hit deleted route")
     
      const product = await Product.findByIdAndDelete(id);
console.log(product)
      if (!product) {
      return res.status(404).json({  success: false,  message: "Product not found"  });
      }

    
      if (product.productImages?.length > 0) {
        await Promise.all(
         product.productImages.filter((img)=> img.imageId).map((img)=>cloudinary.uploader.destroy(img.imageId))
        );
      }

      return res.json({ success: true,   message: "Product deleted successfully", deletedproduct: product  });

    } catch (error) {
      // console.error(error);
      next(error)
      return res.status(500).json({  success: false,  message: "Error deleting product",  error  });
    }
  }
);











module.exports=Productrouter







