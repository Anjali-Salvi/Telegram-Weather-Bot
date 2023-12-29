const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('"WeatherTeller is your go-to weather bot, delivering real-time forecasts, tailored weather alerts, and personalized insights. Stay one step ahead with instant updates on atmospheric conditions, ensuring you are prepared for any weather event. WeatherTeller: Your Weather, Your Way."');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const token = "6802697620:AAEzpKLgj1wgLkWzdu9cg7eMmkJ7sKTtMH0";

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userInput = msg.text.toLowerCase();;

  if (userInput === "hi" || userInput === "hii" || userInput === "hello") {
    bot.sendMessage(chatId, "Hello! Please enter a city name for weather information.");
    return;
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=aabac3f7d1b682773b6c053eebe5f88f
      `
    );
    const data = response.data;
    const weather = data.weather[0].description;
    const temperature = data.main.temp - 273.15;
    const city = data.name;
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const windSpeed = data.wind.speed;
    const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(2)}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;

    bot.sendMessage(chatId, message);
  } catch (error) {
    bot.sendMessage(chatId, "City doesn't exist.");
  }
});