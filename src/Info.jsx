import '@fontsource/roboto/300.css';
import './Info.css';
import "./ToggleButton.css";
import { useEffect, useState } from 'react';
import Chart from "./Chart.jsx";

function CurrWeather(obj, now = new Date()) {
  console.log("now: ", now)
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
      });
    }
  }

  return result;
}



function WeekData(obj) {
  let result = [];

  for (let i = 0; i < obj.list.length; i++) {
    const rawDateStr = obj.list[i].dt_txt;
    const dateObj = new Date(rawDateStr); // Ensure it's a Date object

    result.push({
      date: `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`,
      time: `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`,
      day: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
      temp: obj.list[i].main.temp,
      tempMin: obj.list[i].main.temp_min,
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


export default function Info({ weatData, updateBackground }) {
  const [selected, setSelected] = useState(null);
  let [result, setResult] = useState("");
  const [btnData, setBtnData] = useState([]);
  const [chartData, setChartData] = useState();

  // Large and complete data for each and every day and time
  const res = weatData && weatData !== "" ? WeekData(weatData) : null;
  let weekData = Array.isArray(res) ? res : [];

  // console.log(weekData)
  // Setting up currTime and Date
  const now = new Date();
  const currTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Storing Data for buttons at a same time
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
          });
        }
      }

      setBtnData(filtered);
      setResult(current);
    }
  }, [weatData]);


  // console.log(btnData)

  useEffect(() => {
    if (weatData && weatData !== "") {
      let today = new Date();
      const current = CurrWeather(weatData, today);
      console.log(current)
      setResult(current[1]);
      updateBackground(current[1].weather)
      setChartData(current);
    }
  }, [weatData]);

  
  const handleClick = (index) => {
    const selectedData = btnData[index];
    let selectedDate = new Date(selectedData.date_time)
    const formatDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );
    const dataForChart = CurrWeather(weatData, formatDate);

    console.log(dataForChart)

    setSelected(index);
    setResult(selectedData);
    setChartData(dataForChart);
    updateBackground(selectedData.weather)
    console.log("Updated Result: ", selectedData); // Logs the correct selected data
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
          <div id='temp-cont'>
            <h1 id='temp'>{result ? Math.round(result.temp) : "--"}</h1>
            <p>&deg;C</p>
          </div>
          <h1>{result ? result.weather : "Loading..."}</h1>
          <div className='d2'>
            <span className='spn'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="material-symbols-outlined">air</span>
                <h4>Wind</h4>
              </div>
              <p>{result ? `${result.wind} Km/h` : "--"}</p>
            </span>
            <span className='spn'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="material-symbols-outlined">humidity_percentage</span>
                <h4>Humidity</h4>
              </div>
              <p>{result ? `${result.humidity}%` : "--"}</p>
            </span>
          </div>
        </div>
        <div className="c1b" >
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
                  <p>{w.weather}</p>
                </div>
                <span className="temp">{w.temp}&deg;</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="c2">
        <Chart cData={chartData} />
      </div>
    </div>
  );
}
