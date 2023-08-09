import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    fetchTrainSchedule();
  }, []);

  const fetchTrainSchedule = async () => {
    try {
      const response = await axios.get('/api/trains');
      setTrains(response.data);
    } catch (error) {
      console.error('Error fetching train data:', error);
    }
  };

  return (
    <div className="App">
      <h1>Train Schedule</h1>
      <ul>
        {trains.map((train) => (
          <li key={train.trainNumber}>
            <h3>{train.trainName}</h3>
            <p>Train Number: {train.trainNumber}</p>
            <p>Departure Time: {train.departureTime.Hours}:{train.departureTime.Minutes}</p>
            <p>Sleeper Seats Available: {train.seatsAvailable.sleeper}</p>
            <p>AC Seats Available: {train.seatsAvailable.AC}</p>
            <p>Sleeper Price: {train.price.sleeper}</p>
            <p>AC Price: {train.price.AC}</p>
            <p>Delayed By: {train.delayedBy} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

