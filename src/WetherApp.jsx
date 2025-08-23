import { useState, useEffect } from "react";
import Info from "./Info";
import SearchBox from "./SearchBox";
import useLocation from "./Location";
import ErrorBoundary from "./ErrorBoundary";
import '@fontsource/roboto/300.css';
import "./WeatherApp.css";
import { getweatherinfo } from "./API";
import { getColor, getWeatherBackground } from "./Helper";

// Default Function
function WeatherApp() {
    let [getWeatherData, setWeatherData] = useState("");
    let [getBack, setBack] = useState({ image: "https://plus.unsplash.com/premium_photo-1727730047398-49766e915c1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xlYXIlMjBza3l8ZW58MHx8MHx8fDA%3D", color: "white" });
    let [getFlag, setFlag] = useState(false);
    const [errmsg, setErrmsg] = useState("");

    const { city, error, loading } = useLocation(); // Fetching GeoLocation


    // let updateWeatherInfo = (newData) => {
    //     setWeatherData(newData);
    // }
    let getData = async (city) => {
        let newdata = await getweatherinfo(city);
        if (newdata.error) {
            setErrmsg(newdata.message);
        } else {
            setWeatherData(newdata);
        }
    }


    // Update Background Image
    let updateBackground = (back) => {
        let image = getWeatherBackground(back);
        let color = getColor(back);
        if (image != "" && image != null) {
            setBack({
                image: image,
                color: color,
            });
        }
    }


    // For toggling buttons of info component by searchBox button
    function toggle() {
        setFlag(prevflag => !prevflag);
    }

    // Getting Error
    function errormsg(msg) {
        setErrmsg(msg);
    }

    // Reset Error
    function reset() {
        setErrmsg('');
        setWeatherData('');
        setBack({ image: "https://plus.unsplash.com/premium_photo-1727730047398-49766e915c1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xlYXIlMjBza3l8ZW58MHx8MHx8fDA%3D", color: "white" });
    }

    return (
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
            <div style={{ backgroundImage: `url(${getBack.image})`, color: `${getBack.color}` }} className={getWeatherData ? "sty" : "sty2"}>
                {!errmsg && (
                    <SearchBox getData={getData} toggle={toggle} clr={getBack.color} geoCity={city} sendError={errormsg} />
                )}

                {/* Checking for Errors */}
                {errmsg && (
                    <div className="error-box">
                        <span className="material-symbols-outlined">error</span>
                        <h1>{errmsg}</h1>
                        <button style={{ backgroundColor: "blue", color: "white", height: 35, width: 150, borderRadius: 5, fontWeight: 'bold' }} onClick={reset}>Go To HomePage</button>
                    </div>
                )}

                {/* Fetching Current Location */}
                {!errmsg && !getWeatherData && (
                    <div className="free">
                        {loading ? (<h1>Fetching Current Location...</h1>) :
                            error ? (<h1>An Error Occured! Search For The Weather</h1>) :
                                city ? ("") : (<h1>Can't Find Current Location Search For The Weather</h1>)}
                    </div>)
                }

                {/* Showing Weather Information */}
                {getWeatherData && !errmsg && (
                    <Info weatData={getWeatherData} updateBackground={updateBackground} flag={getFlag} />
                )
                }
            </div>
        </ErrorBoundary>
    );
}

export default WeatherApp;