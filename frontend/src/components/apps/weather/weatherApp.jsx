import React, { useState, useEffect } from "react";

function WeatherForecast() {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherGif, setWeatherGif] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const apiKey = "9f47e57c2815f2c97baf32e9af37a1c0";

  useEffect(() => {
    // Fetch weather data based on user's geolocation
    const fetchWeatherData = async () => {
      try {
        // Get user's coordinates
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          // Fetch weather data based on coordinates
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );
          const data = await response.json();
          console.log(data);
          setWeatherData(data);
          updateTimeOfDay(data);
        });
      } catch (error) {
        setErrorMsg("Error fetching weather data:", error);
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [apiKey]);

  useEffect(() => {
    if (timeOfDay && weatherData) {
      updateWeatherGif(weatherData);
    }
  }, [timeOfDay, weatherData]);

  const updateTimeOfDay = (data) => {
    const currentTime = new Date().getTime() / 1000; // Convert milliseconds to seconds
    const sunriseTime = data.sys.sunrise;
    const sunsetTime = data.sys.sunset;

    if (currentTime >= sunriseTime && currentTime < sunsetTime) {
      setTimeOfDay("day");
    } else {
      setTimeOfDay("night");
    }
  };

  const updateWeatherGif = (data) => {
    const weatherDescription = data.weather[0].main.toLowerCase();
    let gifMap;

    if (timeOfDay === "night") {
      gifMap = {
        // clouds: "https://i.pinimg.com/originals/b0/45/fc/b045fc647b6a4a4bc2dd3d31f4a948ef.gif",
        clouds:
          "https://i.pinimg.com/originals/17/43/59/174359d6c7e31330affd9322a828e20b.gif",
        rain: "https://i.pinimg.com/originals/0e/db/60/0edb6064ea5e7fc57bd7159e94aad20c.gif",
        clear:
          "https://i.pinimg.com/originals/3d/29/18/3d291877ec002841315d22d08a125374.gif",
      };
    } else {
      gifMap = {
        clear:
          "https://www.shutterstock.com/image-photo/blue-sky-600nw-173509772.jpg",
        clouds:
          "https://www.icegif.com/wp-content/uploads/2023/08/icegif-886.gif",
        clouds: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/c81fed16071075.562a501d5e911.gif",
        rain: "https://media2.giphy.com/media/Q5kC7hjJQOHTUzDJnw/giphy.gif",
        sunny: "https://i.gifer.com/68J.gif",
      };
    }

    setWeatherGif(gifMap[weatherDescription] || null);
  };

  return (
    <div style={{ margin: "auto", textAlign: "left", width: "50%" }}>
      <h2>Weather Forecast</h2>
      {weatherData ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "100%" }}>
            <p>City: {weatherData.name}</p>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Description: {weatherData.weather[0].description}</p>
            <p>Time of Day: {timeOfDay}</p>
          </div>
          <div style={{ width: "100%" }}>
            {weatherGif && (
              <img
                src={weatherGif}
                alt="Weather GIF"
                style={{ maxWidth: "100%", width: "100%", borderRadius: "7px" }}
              />
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>{errorMsg}</p>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default WeatherForecast;
