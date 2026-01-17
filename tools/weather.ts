import { tool } from "ai";
import axios from "axios";
import { z } from "zod";

const weatherDetailsTool = tool({
    description: "Get detailed weather information for a specific location.",
    inputSchema: z.object({
        location: z.string().describe("The name of the city or location to get the weather for."),
    }),
    execute: async ({ location }) => {
        console.log({ location });

        const coordinateDetails = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}`);

        const weatherDetails = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinateDetails.data[0].lat}&lon=${coordinateDetails.data[0].lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);

        console.log({ weatherDetails });

        return {
            location: location,
            weather: weatherDetails.data.weather[0].main,
            temperature: weatherDetails.data.main.temp,
            humidity: weatherDetails.data.main.humidity,
            windSpeed: weatherDetails.data.wind.speed,
        }

    }
});

export default weatherDetailsTool;