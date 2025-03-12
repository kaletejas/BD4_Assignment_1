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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
