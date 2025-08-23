function getWeatherBackground(condition) {
    const mapping = {
        "clear sky": "https://plus.unsplash.com/premium_photo-1727730047398-49766e915c1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xlYXIlMjBza3l8ZW58MHx8MHx8fDA%3D",
        "few clouds": "https://media.istockphoto.com/id/171225633/photo/deep-blue-view-on-a-lightly-clouded-day.jpg?s=612x612&w=0&k=20&c=KGV9ieDdP5wgx9unc_HwHmP5wuRmpgyDSA0h-3_gNNo=",
        "scattered clouds": "https://media.istockphoto.com/id/1028827352/photo/sky.jpg?s=612x612&w=0&k=20&c=IphiZJlyetOs3RuzTjBmc9gRGCavGvmdk20qFTNJX8A=",
        "broken clouds": "https://freerangestock.com/sample/119740/broken-white-clouds-over-blue-sky.jpg",
        "overcast clouds": "https://images.unsplash.com/photo-1663774718003-14c125ac0d1a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "shower rain": "https://img.freepik.com/free-vector/background-with-rain-dark-sky_1308-10107.jpg",
        "moderate rain": "https://static.vecteezy.com/system/resources/thumbnails/042/195/728/small_2x/ai-generated-rainy-sky-background-free-photo.jpg",
        "light rain": "https://t3.ftcdn.net/jpg/05/60/67/58/360_F_560675858_owDH9f8iCHRJHSD07bhx8qWAy6nXSzXD.jpg",
        "heavy intensity rain": "https://media.istockphoto.com/id/2183276741/photo/dark-overcast-sky-with-heavy-rain-and-lightning-intense-weather-phenomenon.jpg?s=612x612&w=0&k=20&c=RqTTHHbV5ffEbFWb4k-tQKo2poePybsESZKJfV5xNM4=",
        "rain": "https://static.vecteezy.com/system/resources/thumbnails/042/195/728/small_2x/ai-generated-rainy-sky-background-free-photo.jpg",
        "storm with rain": "https://t3.ftcdn.net/jpg/04/83/91/56/360_F_483915686_WdBjoPBPWIEfQ2BEjJoNMH8EvtaKO5NE.jpg",
        "thunderstorm": "https://media.istockphoto.com/id/517643357/photo/thunderstorm-lightning-with-dark-cloudy-sky.jpg?s=612x612&w=0&k=20&c=x3G3UijRPVGFMFExnlYGbnQtnlH6-oUoMU48BTkc0Os=",
        "snow": "https://img.freepik.com/premium-photo/three-tree-field-winter-with-falling-snow_507658-545.jpg",
        "light snow": "https://media.istockphoto.com/id/614332492/photo/snow-storm.jpg?s=612x612&w=0&k=20&c=UT779vnlT6q5tRGHR_JbweEC8L0tHbXMeogrAqJeQSo=",
        "mist": "https://media.istockphoto.com/id/538327557/photo/frozen-lake.jpg?s=612x612&w=0&k=20&c=ydmmGLEjOmDaLGuVMKPi-vqdDqKQA-ez0QfoY6fw-6w=",
        "haze": "https://media.istockphoto.com/id/1222088912/photo/blurred-soft-background-cumulus-clouds-in-a-haze.jpg?s=612x612&w=0&k=20&c=HNN6faK81H2JpcvIQa9PTgn-iL3DBcB1nKMMRjG37rU=",
        "fog": "https://static.vecteezy.com/system/resources/previews/008/130/306/non_2x/sky-blue-fog-or-smoke-color-isolated-background-for-effect-free-photo.jpg",
        "smoke": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxta-u9Lc--OseeDYD1RS09BXa2KcKX6_tpw&s",
    };

    // Normalize the condition text for matching
    const key = condition.toLowerCase().trim();

    return mapping[key] || "https://plus.unsplash.com/premium_photo-1727730047398-49766e915c1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xlYXIlMjBza3l8ZW58MHx8MHx8fDA%3D"; // fallback background
}
function getColor(condition) {
    const lightBackgrounds = [
        "light snow",
        "snow"
    ];

    const darkBackgrounds = [
        "overcast clouds",
        "clear sky",
        "scattered clouds",
        "few clouds",
        "broken clouds",
        "shower rain",
        "light rain",
        "moderate rain",
        "heavy intensity rain",
        "rain",
        "storm with rain",
        "thunderstorm",
        "mist",
        "haze",
        "fog",
        "smoke"
    ];

    const key = condition.toLowerCase().trim();

    if (lightBackgrounds.includes(key)) {
        return "black"; // better contrast on light backgrounds
    } else if (darkBackgrounds.includes(key)) {
        return "white"; // better contrast on dark backgrounds
    } else {
        return "white"; // fallback
    }
}

// Get Weather Icon For Info.jsx
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

// Data Filter Function For Info.jsx
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


function date(now) {

  // Format date as DD-MM-YYYY
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = now.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

export {getColor, getWeatherBackground, date, getWeatherIcon, WeekData, CurrWeather};