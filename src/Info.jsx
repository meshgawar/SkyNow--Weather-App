import '@fontsource/roboto/300.css';
import './Info.css';
import "./ToggleButton.css";
import { useEffect, useState } from 'react';
import Chart from "./Chart.jsx";
import WeatherInfoCard from './WeatherInfoCard.jsx';
import { getWeatherIcon, WeekData, CurrWeather } from './Helper.js';

// Default Function
export default function Info({ weatData, updateBackground, flag }) {
  const [selected, setSelected] = useState(0);
  const [btnData, setBtnData] = useState([]);
  const [chartData, setChartData] = useState();

  // Storing Data for buttons 
  useEffect(() => {
    if (weatData && weatData !== "") {
      const fullWeekData = WeekData(weatData);
      const now = new Date();
      const currentHour = now.getHours();

      const dayMap = {};

      // Group by full date (to prevent duplicate weekdays)
      for (let i = 0; i < fullWeekData.length; i++) {
        const data = fullWeekData[i];
        const dateKey = new Date(data.timestamp).toISOString().split("T")[0]; // "YYYY-MM-DD"
        if (!dayMap[dateKey]) {
          dayMap[dateKey] = [];
        }
        dayMap[dateKey].push(data);
      }

      const usedDays = new Set();
      const filtered = [];

      for (let dateKey in dayMap) {
        const entries = dayMap[dateKey];
        let closest = entries[0];
        let minDiff = Math.abs(entries[0].timestamp.getHours() - currentHour);

        for (let j = 1; j < entries.length; j++) {
          const diff = Math.abs(entries[j].timestamp.getHours() - currentHour);
          if (diff < minDiff) {
            minDiff = diff;
            closest = entries[j];
          }
        }

        // Get weekday name from timestamp
        const dayName = new Date(closest.timestamp).toLocaleDateString("en-US", {
          weekday: "long",
        });

        // Avoid duplicates of day name
        if (!usedDays.has(dayName)) {
          usedDays.add(dayName);
          filtered.push({
            day: dayName, // e.g., "Monday"
            weather: closest.weather,
            temp: Math.round(closest.temp),
            date_time: closest.timestamp,
            wind: closest.wind,
            humidity: closest.humidity,
            icon: getWeatherIcon(closest.weather),
            pop: closest.pop,
            visibility: closest.visibility,
          });
        }
      }
      setBtnData(filtered);
    }
  }, [weatData]);

  

  // default set for today data
  useEffect(() => {
    if (weatData && weatData !== "") {
      let today = new Date();
      const current = CurrWeather(weatData, today);
      const firstData = current[0] || current[1] || null; 
      // setResult(firstData ? [firstData] : []);            
      if (firstData) {
        updateBackground(firstData.weather);
      }
      setChartData(current);
    }
  }, [weatData]);



  const handleClick = (index) => {
    const selectedData = btnData[index];
    if (!selectedData) return;

    const date = new Date(selectedData.date_time);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dataForChart = CurrWeather(weatData, dayStart);

    setSelected(index);
    setChartData(dataForChart);
    updateBackground(selectedData.weather);
  };


  useEffect(() => {
    if (btnData && btnData.length > 0) {
      handleClick(0);  // ✅ Activate first button
    }
  }, [btnData]);

  

  return (
    <div className='info-cont'>
      <div className="c1">
        <div className="c1a">
          <div className='d2'>
            <WeatherInfoCard result={btnData} city={weatData.city.name} idx={selected} />
          </div>
        </div>
        <div className="c1b" >
          {flag ?
            <div className="button-container" >
              {btnData.map((w, index) => (
                <button
                  key={index}
                  className={`day-button ${selected === index ? "active" : ""}`}
                  onClick={() => handleClick(index)}
                >
                  <span className="material-symbols-outlined">{w.icon}</span>
                  <div className="weather-info">
                    <h4>{w.day}</h4>
                    <p style={{color:"gray"}}>{w.weather}</p>
                  </div>
                  <span className="temp">{w.temp}&deg;</span>
                </button>
              ))}
            </div>
            : null}
        </div>
      </div>
      <div className="c2">
        <Chart cData={chartData} />
      </div>
    </div>
  );
}
