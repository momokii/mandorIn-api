//const Day = require('../models/days')
const statusCode = require('../utils/status-code').httpStatus_keyValue
// * ganti ke mongo
const Day = require('../models/day')
const axios = require('axios')

// * ------------------------------ FUNCTION ------------------------------ * //

function throw_err(code, msg) {
    const err = new Error(msg)
    err.statusCode = code
    throw err
}

// * ------------------------------ CONTROLLER ------------------------------ * //

exports.get_days = async (req, res, next) => {
    try{
        const days = await Day.find()

        const data = days.map(data => {
            return {
                id: data._id,
                nama: data.name
            }
        })

        // * ------------- coba get API weather check
        /*
            * praktiknya nanti -> tetap butuh long lat manual yang mungkin bisa di get dari DATA PROJECT detail
         */
        const LONG = -6.25
        const LAT = 106.816
        const api_url = "https://api.open-meteo.com/v1/forecast?latitude=" + LONG.toString() +  "&longitude=" + LAT.toString() + "&hourly=temperature_2m,precipitation_probability&timezone=Asia%2FBangkok&forecast_days=1"
        const response = await axios.get(api_url)
        const response_data = response.data // response asli


        // * format response get data
        const timezone = response_data.timezone // * sesuaikan sendiri
        const elevation = response_data.elevation // * berapa mdpl long lat terkait
        const temperature = response_data.hourly.temperature_2m // * data asli 1 hari
        const precipitation_prob = response_data.hourly.precipitation_probability
        // format untuk dapatkan date dari response api
        let date_forecast = response_data.hourly.time[0]
        const indexT = date_forecast.indexOf("T")
        date_forecast = date_forecast.substring(0, indexT)

        // * tidak perlu format, tetap berikan number (untuk prep dan temperature) dan diformat di FE saja
        const hourly_str = response_data.hourly.time.map(data => {
            const index_T = data.indexOf("T")
            return data.substring(index_T + 1)
        })

        // response formatted
        const weather_forecast = {
            timezone : timezone,
            elevation : elevation,
            long : LONG,
            lat : LAT,
            unit : {
                temperature : "°C",
                precipitation: "%"
            },
            date : date_forecast,
            hourly : hourly_str,
            temp_forecast : temperature,
            precipitation_probability : precipitation_prob,
        }


        // * -------------

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Dapatkan data day (hari)',
            data: data,
            weather: weather_forecast
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}