const express = require('express')
const app = express()
var port = process.env.PORT || 3000
app.use(express.static('pages'))
app.use("/pages", express.static('pages'))

app.use('/assets',express.static('assets'))


app.get('/', (req, res) => res.sendFile(__dirname + '/pages/splash_page.html'))
app.get('/recipe_finder', (req, res) => res.sendFile(__dirname + '/pages/recipe_finder.html'))
app.get('/recipe', (req, res) => res.sendFile(__dirname + '/pages/recipe.html'))
app.get('/favorites_list', (req, res) => res.sendFile(__dirname + '/pages/favorites_list.html'))
app.get('/location_finder', (req, res) => res.sendFile(__dirname + '/pages/location_finder.html'))


app.listen(port, () => console.log(`Fresh Food Fast is listening on port: ${port}`))