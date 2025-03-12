const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const { open } = require('sqlite');
const { resolveSoa } = require('dns');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database,
  });
})();

//fn 1
async function fetchAllRestaurants(){
  let query = 'SELECT * FROM restaurants'
  let response = await db.all(query, [])
  return { restaurants : response}
}
//Exercise 1: Get All Restaurants
app.get('/restaurants', async (req,res)=>{
  try{
    let results = await fetchAllRestaurants();
    if(results.restaurants.length === 0){
      return res.status(404).json({message : 'Restuarants not found'})
    }
    res.status(200).json(results)
  }catch(error){
    return res.status(500).json({error : error.message})
  }
})

//fn 2
async function fetchRestaurantsById(id){
  let query = 'SELECT * FROM restaurants WHERE id = ?'
  let response = await db.all(query, [id]);
  return {restaurants : response}
}

//Exercise 2: Get Restaurant by ID
app.get('/restaurants/details/:id', async (req,res)=>{
  let id = req.params.id;
  try{
    let results = await fetchRestaurantsById(id)
    if(results.restaurants.length === 0){
      return res.status(404).json({message : 'Restaurants not found for id: '+ id})
    }
    res.status(200).json(results)
  }catch(error){
    return res.status(500).json({error : error.message})
  }
})
//fn 3
async function fetchRestaurantsByCuisine(cuisine){
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?'
  let response = await db.all(query, [cuisine]);
  return {restaurants : response}
}

//Exercise 3: Get Restaurants by Cuisine
app.get('/restaurants/cuisine/:cuisine', async (req,res)=>{
  let cuisine = req.params.cuisine;
  try{
    let results = await fetchRestaurantsByCuisine(cuisine)
    if(results.restaurants.length === 0){
      return res.status(404).json({message : 'Restaurants not found for cuisine: '+ cuisine})
    }
    res.status(200).json(results)
  }catch(error){
    return res.status(500).json({error : error.message})
  }
})

//fn 4
async function filterRestaurants(isVeg,hasOutdoorSeating,isLuxury){
  let query = 'SELECT * FROM restaurants WHERE isVeg =? AND hasOutdoorSeating=? AND isLuxury=?'
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return {restaurants : response}
}
//Exercise 4: Get Restaurants by Filter
app.get('/restaurants/filter', async (req,res)=>{
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try{
    let results = await filterRestaurants(isVeg,hasOutdoorSeating,isLuxury);
    if(results.restaurants.length === 0){
      return res.status(404).json({message : 'Restaurants not found for specified filter'})
    }
    res.status(200).json(results)
  }catch(error){
    return res.status(500).json({error : error.message})
  }
})

//fn 5
async function sortRestaurantsByRating(){
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC'
  let response = await db.all(query, []);
  return {restaurants : response}
}

//Exercise 5: Get Restaurants Sorted by Rating
app.get('/restaurants/sort-by-rating', async (req,res)=>{
  try{
    let results = await sortRestaurantsByRating();
    if(results.restaurants.length === 0){
      return res.status(404).json({message : 'Restaurants not found'})
    }
    res.status(200).json(results)
  }catch(error){
    return res.status(500).json({error : error.message})
  }
})

//fn 6
async function fetchAllDishes(){
  let query = 'SELECT * FROM dishes'
  let response = await db.all(query, []);
  return {dishes : response}
}
//Exercise 6: Get All Dishes
app.get('/dishes', async (req,res)=>{
  try{
    let results = await fetchAllDishes();
    if(results.dishes.length === 0){
      return res.status(404).json({message : 'Dishes not found'})
    }
    res.status(200).json(results)
  }catch(error){
    return res.status(500).json({error : error.message})
  }
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
