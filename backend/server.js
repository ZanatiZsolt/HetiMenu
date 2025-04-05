const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;


app.use(cors());


app.use(express.json());


const foodsFilePath = path.join(__dirname, 'foods.json');


const loadFoods = () => {
  try {
    const data = fs.readFileSync(foodsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Hiba a foods.json betöltésekor:", err.message);
    throw err;
  }
};


app.get('/foods', (req, res) => {
  try {
    const foods = loadFoods();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt az étkezések betöltésekor' });
  }
});


app.post('/addFood', (req, res) => {
  const { name, weekend } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Az étel neve kötelező!" });
  }

  const newFood = { name, weekend };

  const loadFoods = () => {
    try {
      const data = fs.readFileSync(foodsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error("Hiba a foods.json betöltésekor:", err.message);
      throw err; 
    }
  };
});

// Szerver indítása
app.listen(port, () => {
  console.log(`Szerver fut: http://localhost:${port}`);
});
