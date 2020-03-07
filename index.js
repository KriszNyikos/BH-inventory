const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3').verbose();
const products = require('./controller/products.js')
const stocks = require('./controller/stocks.js')
const categories = require('./controller/categories.js')


const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(express.static('views/images'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(products)
app.use(stocks)
app.use(categories)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))