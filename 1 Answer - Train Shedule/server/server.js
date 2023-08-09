const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;

const API_BASE_URL = 'http://20.244.56.144/train/auth';
const {
  companyName,
  clientId,
  ownerName,
  rollNo,
  ownerEmail,
  clientSecret,
  accessToken
} = {
  companyName: "Train Central",
  clientId: "c8a7baa0-854e-4dc0-b6cf-9c25cff009de",
  ownerName: "Sanjeeb",
  rollNo: "vp22csci0200082",
  ownerEmail: "ssahoo3@gitam.in",
  clientSecret: "bvWLjZZAHQHWIGRY",
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTE1NjM4MzUsImNvbXBhbnlOYW1lIjoiVHJhaW4gQ2VudHJhbCIsImNsaWVudElEIjoiYTNhZTgzMjItNjljNi00ZTdkLTk5NDctMDU3YTMwMmU3NzQzIiwib3duZXJOYW1lIjoiIiwib3duZXJFbWFpbCI6IiIsInJvbGxObyI6InZwMjJjc2NpMDIwMDA4MiJ9.2hBX5yf2BLaCUYsLuj9zMCMDomeRhyBEawbHewLw-Nk"
};

app.use(express.json());

// Middleware to add authorization token to requests
app.use((req, res, next) => {
  req.headers['Authorization'] = `Bearer ${accessToken}`;
  next();
});

app.get('/api/trains', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trains`);
    const trains = response.data;

    // Trains departing in the next - 12 hours
    const now = new Date();
    const next12Hours = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const filteredTrains = trains.filter(train => {
      const departureTime = new Date(train.departureTime.Hours, train.departureTime.Minutes);
      return departureTime > now && departureTime <= next12Hours;
    });

    // Sorting logic:
    const sortedTrains = filteredTrains.sort((a, b) => {
      if (a.price.sleeper !== b.price.sleeper) {
        return a.price.sleeper - b.price.sleeper; // Ascending order of sleeper price
      }
      if (a.seatsAvailable.sleeper !== b.seatsAvailable.sleeper) {
        return b.seatsAvailable.sleeper - a.seatsAvailable.sleeper; // Descending order of sleeper seats
      }
      return b.departureTime.Hours * 60 + b.departureTime.Minutes - a.departureTime.Hours * 60 - a.departureTime.Minutes; // Descending order of departure time
    });

    res.json(sortedTrains);
  } catch (error) {
    console.error('Error fetching train data:', error);
    res.status(500).json({ error: 'Failed to fetch train data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
