import "./SearchBox.css";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputBase from '@mui/material/InputBase';
import { useEffect, useState } from 'react';
import VoiceRec from "./VoiceRec";

function date(now) {

  // Format date as DD-MM-YYYY
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = now.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}
function Time(now) {

  // Format time as H:MM
  let hours = now.getHours();
  let minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
}

export default function SearchBox({ updateWeatherInfo, clr, toggle, geoCity }) {
  let [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [cityDate, setCityDate] = useState("");

  useEffect(() => {
    setCity(geoCity);
  },[geoCity]);

  let API_KEY = "3701ffee60fbac12ee8ae2679d26aad5"
  let nowDateTime = new Date();

  // Getting Weather
  let getweatherinfo = async () => {
    let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
    let jsonRes = await res.json();

    return jsonRes;
  }

  // Getting AQI
  let getAQI = async (lat,lon) => {
    let token = "4f3002e3785f3e269645af5723dd4f94e2ae2e1d";
    let res = await fetch(`https://api.waqi.info/feed/${city}/?token=${token}`);
    let jsonRes = await res.json();

    return jsonRes.data.aqi;
  }

  // Handling Changes Of Input Box
  function handleChange(e) {
    let val = e.target.value;
    if (!/^[a-zA-Z\s]+$/.test(val)) {
      setError('Only alphabetic characters are allowed');
    } else {
      setError('');
    }
    setCity(e.target.value);
  }
  let handleSubmit = async (e) => {
  e.preventDefault();

  if (!city || city.trim() === "" || city.trim() === "Error") {
    console.error("City name cannot be empty");
    return;
  }

  setCityDate({
    currCity: city.toUpperCase(),
    currDate: date(nowDateTime),
  });

  let newdata = await getweatherinfo();
  updateWeatherInfo(newdata);
  
  let AQI = await getAQI();
  console.log(AQI);
  
  console.log(newdata)
  setCity(""); // Set city to empty 
};

  // Custom Styling
  let sx1 = {
    border: 'none',
    outline: 'none',
    padding: '4px 8px',
    backgroundColor: 'transparent',
    width: '20rem'
  }

  // Update City From VoiceRec.jsx File
  function updateCity(cityname) {
    if (cityname != "Error" && cityname != null && cityname != "") {
      setCity(cityname);
    }
  }



  return (
    <div className="header">
      <form className="form-cont" onSubmit={handleSubmit} style={error ? { border: '1px solid red' } : { border: `1px solid ${clr}` }} >
        <button type='submit'><SearchOutlinedIcon style={{ color: clr, cursor: 'pointer' }} /></button>
        <InputBase placeholder="City Name" id="city" onChange={handleChange} sx={sx1} value={city} style={error ? { color: "red" } : { color: clr }} />
        <VoiceRec clr={clr} updateCity={updateCity} />
      </form>
      {cityDate.currCity ?
        <div className="city-detail">
          <span id="sp1">
            <p>{cityDate.currCity}</p>
            <p>{cityDate.currDate}</p>
            <button onClick={toggle} style={{ color: clr }}><span className="material-symbols-outlined">menu</span></button>
          </span>
        </div> : null}

    </div>
  );
}
