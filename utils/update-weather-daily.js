const axios = require('axios');
const Weather = require('../models/weather')


// TODO move update weather flow in function
exports.update_weather_daily = async (project) => {
    try{

        const weather = await Weather.findOne({
            id_project : project._id.toString()
        })

        const LONG = project.long
        const LAT = project.lat
        const API_URL = "https://api.open-meteo.com/v1/forecast?latitude=" + LONG.toString() +  "&longitude=" + LAT.toString() + "&hourly=temperature_2m,precipitation_probability&timezone=Asia%2FBangkok&forecast_days=1"
        const response = await axios.get(API_URL)
        if(response.status !== 200){
            throw new Error("GET API Data Error")
        }

        const response_data = response.data 

        // * get date API data 
        let date_forecast = response_data.hourly.time[0]
        const indexT = date_forecast.indexOf("T")

        // * number and format on FE
        const hourly_str = response_data.hourly.time.map(data => {
            const index_T = data.indexOf("T")
            return data.substring(index_T + 1)
        })

        // * format response API data
        weather.timezone = response_data.timezone  
        weather.elevation = response_data.elevation 
        weather.temp_forecast = response_data.hourly.temperature_2m 
        weather.precipitation_probability = response_data.hourly.precipitation_probability // * data 1 hari 
        weather.hourly = hourly_str
        weather.date = date_forecast.substring(0, indexT)
        
        return {
            status: true,
            message: "Sukses update weather",
            data: weather
        }

    } catch(e){
        console.log(e) 
        return {
            status: false,
            message: e.message
        }
    }
}