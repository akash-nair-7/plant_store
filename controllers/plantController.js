const asyncHandler = require("express-async-handler");
const Plant=require("../models/plantModel");
const cloudinary = require("../config/cloudinary");
const getPlants = asyncHandler(async (req,res)=>{
    const plants = await Plant.find();
    res.status(200).json(plants);
});



const addPlant = asyncHandler(async (req, res) => {
  const { name, price, category, stock, description } = req.body;

  

 

  const plant = await Plant.create({
    name,
    price,
    category,
    stock,
    description,
    createdBy: req.user.id
  });

  res.status(201).json(plant);
});


const getAPlant = asyncHandler(async (req,res)=>{
    const plant = await Plant.findById(req.params.id);
    if(!plant){
        res.status(404);
        throw new Error("Plant not found");
    }
    res.status(200).json(plant)
});

const updatePlant = asyncHandler(async (req,res)=>{
    const plant = await Plant.findById(req.params.id);
    if(!plant){
        res.status(404);
        throw new Error("Plant not found");
    }
    const updatedPlant = await Plant.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.status(200).json(updatedPlant);
});

const deletePlant = asyncHandler(async (req,res)=>{
    const plant=await Plant.findById(req.params.id);
    if(!plant){
        res.status(404);
        throw new Error("Plant not found")
    }
    await Plant.findByIdAndDelete(req.params.id);
    res.status(200).json(plant)
});

module.exports = {getPlants,addPlant,getAPlant,updatePlant,deletePlant};