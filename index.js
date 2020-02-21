const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./inventory', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connection is succesfull')
});

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}

));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(express.static('views/images'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/products', (req, res) => {

    db.serialize(function () {

        db.all("SELECT * FROM products", function (err, results) {
            if (err != null) {
                // hibakezelés
            }
            console.log(results)
            res.render('nav', {
                array: results,
                products: true
            })
        })
    })
})

app.post('/products', (req, res) => {
    console.log(req.body)
    var  last_id = 0

    db.serialize(function () {
        db.all('SELECT COUNT(id) FROM products', (err, result) =>{
            last_id = result[0]['COUNT(id)'] + 1

            db.prepare('INSERT INTO products VALUES (?, ?, ?)')
            .run(last_id, req.body.name, req.body.catlist)

            db.prepare('INSERT INTO inventory VALUES (?, ?)')
            .run(0, last_id)

            console.log(last_id)
        })
        
    })

})

app.get('/stocks', (req, res) => {

    db.serialize(function () {

        db.all("SELECT p.id, p.name, i.quantity FROM products p INNER JOIN inventory i ON i.product_id = p.id ;", function (err, results) {
            if (err != null) {
                // hibakezelés
            }
            console.log(results)
            res.render('nav', {
                array: results,
                stocks: true
            })
        })
    })



})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))