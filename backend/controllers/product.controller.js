import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js"

export const getAllProducts = async (req, res) =>{
  try {
    const products = await Product.find({});
    res.status(200).send(products);
  } catch (error) {
    console.log("Error in getAllProducts", error.message)
    res.status(500).json({message: "Internal Server Error", error: error.message});
  }
}

export const getFeaturedProducts = async (req, res) =>{
  try {
    let featuredProducts = await redis.get("featured_products");
    if(featuredProducts){
      return res.json(JSON.parse(featuredProducts));
    }

    featuredProducts = await Product.find({isFeatured: true}).lean();
    // .lean() returns a plain javascript object instead of a mongodb document which is good for performance

    if(!featuredProducts){
      return res.status(404).json({message: "No featured products found"});
    }
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts", error.message)
    res.status(500).json({message: "Internal Server Error", error: error.message});
  }
};

export const createProduct = async (req, res)=>{
  try {
    const {name, description, price, image, category} =req.body;

    let cloudinaryResponse = null;
    if(image){
      cloudinaryResponse = await cloudinary.uploader.upload(image, {folder:"products"});
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
      category
    })

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct", error.message)
    res.status(500).json({message: "Internal Server Error", error: error.message});
  }
};

export const deleteProduct = async (req, res) =>{
  try {
    const {id} = req.params;

    const product = await Product.findById(id);

    if(!product){
      return res.status(404).json({message: "Product not found"});
    }

    if(product.image){
      const publicId = product.image.split("/").pop().split(".")[0];// this will get us the id of the image uploaded to cloudinary
      
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);// this will delete the image from cloudinary
        console.log("Image deleted from cloudinary");
      } catch (error) {
        console.log("Error in deleting image from cloudinary", error.message)
      }
    }

    await Product.findByIdAndDelete(id);

    res.json({message: "Product deleted successfully"});

  } catch (error) {
    console.log("Error in deleteProduct", error.message)
    res.status(500).json({message: "Internal Server Error", error: error.message});
  }
}

export const getRecommendedProducts = async (req, res) =>{
  try {
    const products = await Product.aggregate([
      {$sample: {size: 3}},
      {$project: {_id: 1, name: 1,description:1, image: 1, price: 1}}
    ])

    res.json(products)
  } catch (error) {
    console.log("Error in getRecommendedProducts", error.message)
    res.status(500).json({message: "Internal Server Error", error: error.message});
  }
}

export const getProductsByCategory = async (req, res) =>{
  try {
    const {category} = req.params;
    const products = await Product.find(category);

    res.json(products);
  } catch (error) {
    console.log("Error in getProductsByCategory", error.message)
    res.status(500).json({message: "Internal Server Error", error: error.message});
  }
}

export const toggleFeatureProduct = async (req, res) =>{
  try {
    const product = await Product.findById(req.body.id);
    if(product){
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(product);
    }else{
      res.status(404).json({message: "Product not found"});
    }
  } catch (error) {
    console.log("Error in toggleFeatureProduct", error.message)
    res.status(500).json({message: "Internal Server Error", error: error.message});
  }
}

async function updateFeaturedProductsCache(){
  try {
    // .lean() returns a plain javascript object instead of a mongodb document which is good for performance
    const featuredProducts = await Product.find({isFeatured: true}).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts)); 
  } catch (error) {
    console.log("Error in updateFeaturedProductsCache", error.message)
    res.status(500).json({message: "Internal Server Error", error: error.message});
  }
}