import '@fontsource/roboto/300.css';
import './Info.css';
import "./ToggleButton.css";
import { use, useEffect, useState } from 'react';
import Chart from "./Chart.jsx";
import WeatherInfoCard from './WeatherInfoCard.jsx';

function CurrWeather(obj, now = new Date()) {
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 00:00 of `now`
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(startOfDay.getDate() + 1); // 00:00 of next day

  const result = [];

  for (let i = 0; i < obj.list.length; i++) {
    const forecastDateTime = new Date(obj.list[i].dt_txt);

    if (forecastDateTime >= startOfDay && forecastDateTime < endOfDay) {
      result.push({
        date_time: obj.list[i].dt_txt,
        temp: obj.list[i].main.temp,
        tempMin: obj.list[i].main.temp_min,
        tempMax: obj.list[i].main.temp_max,
        humidity: obj.list[i].main.humidity,
        feelsLike: obj.list[i].main.feels_like,
        weather: obj.list[i].weather[0].description,
        wind: obj.list[i].wind?.speed || "N/A",
        pop: obj.list[i].pop,
        visibility: obj.list[i].visibility,
      });
    }
  }

  return result;
}



function WeekData(obj) {
  let result = [];

  for (let i = 0; i < obj.list.length; i++) {
    const rawDateStr = obj.list[i].dt_txt;
    const dateObj = new Date(rawDateStr);

    result.push({
      date: `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`,
      time: `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`,
      day: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
      temp: obj.list[i].main.temp,
      pop: obj.list[i].pop,
      visibility: obj.list[i].visibility,
      tempMax: obj.list[i].main.temp_max,
      humidity: obj.list[i].main.humidity,
      feelsLike: obj.list[i].main.feels_like,
      weather: obj.list[i].weather[0].description,
      wind: obj.list[i].wind?.speed || "N/A",
      timestamp: dateObj,
    });
  }

  return result;
}

function getWeatherIcon(condition) {
  const mapping = {
    "clear sky": "wb_sunny",
    "few clouds": "partly_cloudy_day",
    "scattered clouds": "cloud",
    "broken clouds": "cloud_queue",
    "shower rain": "rainy",
    "rain": "rainy",
    "thunderstorm": "thunderstorm",
    "snow": "ac_unit",
    "mist": "foggy",
    "haze": "blur_on",
    "smoke": "smoking_rooms",
    "overcast clouds": "filter_drama",
    "light rain": "rainy",
    "moderate rain": "rainy",
    "heavy intensity rain": "thunderstorm",
    "light snow": "ac_unit",
    "storm with rain": "storm",
  };

  // Normalize the condition text for matching
  const key = condition.toLowerCase().trim();

  return mapping[key] || "help"; // fallback icon
}


export default function Info({ weatData, updateBackground, flag }) {
  const [selected, setSelected] = useState(0);
  let [result, setResult] = useState("");
  const [btnData, setBtnData] = useState([]);
  const [chartData, setChartData] = useState();
  const [cardData, setCardData] = useState();

  // complete data for each and every day and time
  const res = weatData && weatData !== "" ? WeekData(weatData) : null;
  let weekData = Array.isArray(res) ? res : [];

  // Setting up currTime and Date
  const now = new Date();

  // Storing Data for buttons 
  useEffect(() => {
    if (weatData && weatData !== "") {
      const fullWeekData = WeekData(weatData);
      const now = new Date();
      const currentHour = now.getHours();
      const current = CurrWeather(weatData);

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
      setResult(current);
    }
  }, [weatData]);

  

  // default set for today data
  useEffect(() => {
    if (weatData && weatData !== "") {
      let today = new Date();
      const current = CurrWeather(weatData, today);
      const firstData = current[0] || current[1] || null; 
      setResult(firstData ? [firstData] : []);            
      if (firstData) {
        updateBackground(firstData.weather);
      }
      setChartData(current);
    }
  }, [weatData]);



  const handleClick = (index) => {
    const selectedData = btnData[index];
    if (!selectedData) return;

    let selectedDate = new Date(selectedData.date_time);
    const formatDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );
    const dataForChart = CurrWeather(weatData, formatDate);

    setSelected(index);
    setResult(selectedData ? [selectedData] : []); 
    setChartData(dataForChart);
    updateBackground(selectedData.weather);
  };


  useEffect(() => {
    if (btnData && btnData.length > 0) {
      handleClick(0);  // ✅ Activate first button
    }
  }, [btnData]);

  useEffect(() => {
    setCardData(btnData);
  },[btnData]);


  console.log(selected)

  return (
    <div className='info-cont'>
      <div className="c1">
        <div className="c1a">
          <div className='d2'>
            <WeatherInfoCard result={cardData} city={weatData.city.name} idx={selected} />
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
