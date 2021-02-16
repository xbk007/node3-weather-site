const request = require('postman-request')

const forecast = (lat, long, callback) => {

    const url = 'http://api.weatherstack.com/current?access_key=48ad53298f62b07627104e3e5612b0c3&query='+encodeURIComponent(lat)+','+encodeURIComponent(long)+'&units=m'

    request({ url, json: true}, (error, {body} = {}) => {
        if(error){
            callback('Unable to connect to weather service')
        } else if(body.error){
            callback('Unable to find location')
        } else{
            callback(undefined, {
                weather: body.current.weather_descriptions[0],
                temp: body.current.temperature,
                feels: body.current.feelslike,
                humidity: body.current.humidity
            })
        }
    })

}

module.exports = forecast