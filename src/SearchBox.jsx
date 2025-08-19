import "./SearchBox.css";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputBase from '@mui/material/InputBase';
import { useState } from 'react';

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

export default function SearchBox({ updateWeatherInfo, clr }) {
  let [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [cityDate, setCityDate] = useState("");

  let API_KEY = "3701ffee60fbac12ee8ae2679d26aad5"
  let nowDateTime = new Date();

  let getweatherinfo = async () => {
    let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
    let jsonRes = await res.json();

    return jsonRes;
  }

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
    let value = e.target.value
    setCityDate({
      currCity: city.toUpperCase(),
      currDate: date(nowDateTime),
    })
    setCity("");
    let newdata = await getweatherinfo();
    updateWeatherInfo(newdata)
  }
  let sx1 = {
    border: 'none',
    outline: 'none',
    padding: '4px 8px',
    backgroundColor: 'transparent',
    width: '20rem'
  }
  return (
    <div className="header">
      <form className="form-cont" onSubmit={handleSubmit} style={error ? { border: '1px solid red' } : { border: `1px solid ${clr}` }} >
        <InputBase placeholder="City Name" id="city" onChange={handleChange} sx={sx1} value={city} style={error ? { color: "red" } : { color: clr }} />
        <button type='submit'><SearchOutlinedIcon style={{ color: clr, cursor: 'pointer' }} /></button>
      </form>
      {cityDate.currCity ?
        <div className="city-detail">
          <span>
            <p>{cityDate.currCity}</p>
            <p>{cityDate.currDate}</p>
          </span>
        </div> : null}

    </div>
  );
}
