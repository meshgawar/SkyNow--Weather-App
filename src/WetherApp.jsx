import { useState, useEffect } from "react";
import Info from "./Info";
import SearchBox from "./SearchBox";
import '@fontsource/roboto/300.css';
import "./WeatherApp.css";

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


export default function WeatherApp() {
    let [getWeatherData, setWeatherData] = useState("");
    let [getBack, setBack] = useState({ image: "https://plus.unsplash.com/premium_photo-1727730047398-49766e915c1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xlYXIlMjBza3l8ZW58MHx8MHx8fDA%3D", color: "white" });
    let [getFlag, setFlag] = useState(false);

    let updateWeatherInfo = (newData) => {
        setWeatherData(newData);
    }


    let updateBackground = (back) => {
        console.log("background is:", back);
        let image = getWeatherBackground(back);
        let color = getColor(back);
        if (image != "" && image != null) {
            setBack({
                image: image,
                color: color,
            });
        }
        console.log("background image is:", image);
    }
    let sty = {
        backgroundImage: `url(${getBack.image})`,
        color: `${getBack.color}`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        fontFamily: 'roboto',
        height: "100vh",
    }
    let sty2 = {
        backgroundImage: `url(${getBack.image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        fontFamily: 'roboto',
        height: "100vh",
        color: `${getBack.color}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }

    function toggle() {
        setFlag(prevflag => !prevflag);
    }

    useEffect(() => {
        console.log("Flag changed:", getFlag);
    }, [getFlag]);


    return (
        <div style={getWeatherData ? sty : sty2}>
            <SearchBox updateWeatherInfo={updateWeatherInfo} toggle={toggle} clr={getBack.color} />
            {getWeatherData ? null :
                <div className="free">
                    <h1>Search For The Weather</h1>
                </div>
            }
            {getWeatherData ?
                <Info weatData={getWeatherData} updateBackground={updateBackground} flag={getFlag}/>
                : null}
        </div>
    )
}