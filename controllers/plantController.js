const asyncHandler = require("express-async-handler");
const Plant=require("../models/plantModel");
const cloudinary = require("../config/cloudinary");
const getPlants = asyncHandler(async (req,res)=>{

    res.json({message:"Get all plants"});
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
    res.json({message:"Get a plant by ID"});
});

const updatePlant = asyncHandler(async (req,res)=>{
    res.json({message:"Update a plant"});
});

const deletePlant = asyncHandler(async (req,res)=>{
    res.json({message:"Delete a plant"});
});

module.exports = {getPlants,addPlant,getAPlant,updatePlant,deletePlant};