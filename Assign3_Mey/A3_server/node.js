// TCSS 460 A
// Assignment 3
// Mey Vo
// Import necessary modules
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: '*'
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Root route to display information about the REST Service
app.post('/', function (req, res) {
  res.status(200);
  res.send("<h1>This Fitness calculator can help you to estimate BMI, total body fat, ideal weight, and amount of daily calories burned with low activity. \nTo do so, fill out the form and click 'Calculate' button. </h1>");
  console.log("A request has been processed at / (root) ");
});

// Calculate BMI route
app.post('/bmi', (req, res) => {
  // Extract height and weight from the request body
  const { height, weight } = req.body;
  if (!height || !weight) {
    return res.status(400).json({ error: 'Height and weight are required to calculate' });
  }

  // Calculate BMI using the formula BMI = kg / (m * m)
  const bmi = weight / (height * height);
  const bmiResult = bmi.toFixed(2); //round to two decimal places

  // Send the BMI value in the response
  res.json({ bmi: bmiResult });
});

// Calculate body fat route
app.post('/bodyfat', (req, res) => {
  // Extract age, gender, and bmi from the request body
  const { age, gender, bmi } = req.body;
  if (!age || !gender || !bmi) {
    return res.status(400).json({ error: 'Age, gender, and bmi are required for body fat calculation' });
  }

  // Calculate body fat using Deurenberg formula
  let bodyFat;
  if (gender === "Male") {
    bodyFat = (1.20 * bmi) + (0.23 * age) - 10.8 - 5.4;
  } else {
    bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
  }
  const bodyFatResult = bodyFat.toFixed(2);

  // Send the body fat value in the response
  res.json({ bodyFat: bodyFatResult });
});

// Calculate ideal weight route
app.post('/idealweight', (req, res) => {
  // Extract height and gender from the request body
  const { height, gender } = req.body;
  if (!height || !gender) {
    return res.status(400).json({ error: 'Height and gender are required' });
  }

  // Calculate ideal weight using Robinson formula
  const heightInches = height * 39.37;
  let idealWeight;
  if (gender === 'male') {
    idealWeight = 52 + 1.9 * (heightInches - 60);
  } else if (gender === 'female') {
    idealWeight = 49 + 1.7 * (heightInches - 60);
  } else {
    return res.status(400).json({ error: 'Invalid gender. Please specify "male" or "female".' });
  }
  const idealWeightResult = idealWeight.toFixed(2);

  // Send the ideal weight value in the response
  res.json({ idealWeight: idealWeightResult });
});

// Calculate calories burned route
app.post('/caloriesburned', (req, res) => {
  // Extract age, gender, weight, and height from the request body
  const { age, gender, weight, height } = req.body;
  if (!age || !gender || !weight || !height) {
    return res.status(400).json({ error: 'Age, gender, weight, and height are required' });
  }

  // Calculate calories burned using Harris-Benedict formula
  let caloriesBurned;
  if (gender == "Male") {
    caloriesBurned = 66 + (6.2 * weight) + (12.7 * height) - (6.76 * age);
  } else {
    caloriesBurned = 655.1 + (4.35 * weight) + (4.7 * height) - (4.7 * age);
  }
  const caloriesBurnedResult = caloriesBurned.toFixed(2);

  // Send the calories burned value in the response
  res.json({ caloriesBurned: caloriesBurnedResult });
});

// Default route to handle invalid URLs
app.all('*', (req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(port, () => {
  return console.log(`Server is running on http://localhost:${port}`);
});
