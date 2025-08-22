// Getting AQI
  let getAQI = async (city) => {
    let token = "4f3002e3785f3e269645af5723dd4f94e2ae2e1d";
    let res = await fetch(`https://api.waqi.info/feed/${city}/?token=${token}`);
    let jsonRes = await res.json();

    return jsonRes.data.aqi;
}

// Getting Weather
  let getweatherinfo = async (city) => {
    let API_KEY = "3701ffee60fbac12ee8ae2679d26aad5"
    let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
    let jsonRes = await res.json();

    return jsonRes;
  }

export {getAQI,getweatherinfo};