const express = require('express')
const app = express()
const path = require('path')

app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/style.css")
})

app.get('/js/midiInp.js', function(req, res) {
    res.sendFile(path.join(__dirname + "/js/midiInp.js"))
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"))
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.sendFile(path.join(__dirname + "/index.html"))
})

app.get('/license', (req, res) => {
    res.sendFile(path.join(__dirname + "/license.html"))
})

app.listen(8000);