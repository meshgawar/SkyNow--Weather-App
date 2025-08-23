let errmsg = "";

// Getting AQI
let token = "4f3002e3785f3e269645af5723dd4f94e2ae2e1d";
let getAQI = async (city) => {
  try {
    let res = await fetch(`https://api.waqi.info/feed/${city}/?token=${token}`);
    if (!res.ok) {
      errmsg = `HTTP error! ${res.status}`;
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const jsonRes = await res.json();
    return jsonRes.data.aqi;
  } catch (err) {
    errmsg = err.message;
    return { error: true, message: errmsg };
  }
};

// Getting Weather
let API_KEY = "3701ffee60fbac12ee8ae2679d26aad5";
let getweatherinfo = async (city) => {
  try {
    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) {
      errmsg = `HTTP error! ${res.status}`;
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const jsonRes = await res.json();
    return jsonRes;
  } catch (err) {
    const errmsg = `${err.message}`;
    return { error: true, message: errmsg };
  }
};

export { getAQI, getweatherinfo };
