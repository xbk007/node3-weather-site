const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const pdirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup staic directory to serve
app.use(express.static(pdirectory))

app.get('', (req, res) => {
    res.render('index',{
        title: 'Weather',
        name: 'Ark Tripathi'
    })
})

app.get('/about', (req, res) => {
    res.render('about',{
        title: 'About Me',
        name: 'Ark Tripathi'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Get Help',
        name: 'Ark Tripathi',
        helpMsg: 'Some text to help'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error : 'You must provide a address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, { weather, temp, feels, humidity} = {}) => {
            if(error){
                return res.send({ error })
            }
            res.send({
                forecast: `${weather} currently. Temparature is ${temp}. Feels like ${feels}. Humidity is ${humidity} `,
                location,
                address: req.query.address
            })
        })   
    })
})

app.get('/products',(req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    console.log(req.query)
    res.send({
        products : []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 error',
        error: 'Help article not found',
        name: 'Ark Tripathi'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 error',
        error: 'Page not found',
        name: 'Ark Tripathi'
    })
})

app.listen(port, () => {
    console.log('Server is up on port '+port)
})