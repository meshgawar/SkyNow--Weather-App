import { useState, useEffect } from "react";

export default function useLocation() {
    const [city, setCity] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {            // Success Code
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=10`,
                        { headers: { "User-Agent": "my-weather-app/1.0" } }
                    );
                    const data = await res.json();
                    const fetchedCity =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.municipality ||
                        null;
                    setCity(fetchedCity);
                } catch (err) {
                    setError("Failed to fetch city name.");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {          // Error Code
                setError(err.message);
                setLoading(false);
            }, {                // Customization
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
            }
        );
    }, []);


    return { city, error, loading };
}
