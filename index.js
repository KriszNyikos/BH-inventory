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
        db.all("SELECT c.name AS catName, p.id, p.name, p.desc FROM categories c INNER JOIN products p ON p.cat_id = c.id", function (err, results) {
            if (err != null) {
                // hibakezelés
            }

            db.all('SELECT * FROM categories', function (err, cat) {

                console.log(results)
                console.log(cat)

                if (err != null) {
                    // hibakezelés
                }
                res.render('nav', {
                    cat: cat,
                    array: results,
                    products: true
                })
            })
        })
    })
})

app.delete('/products', (req, res) => {
    console.log(req.body)
    db.serialize(function () {

        db.run(`DELETE FROM inventory WHERE product_id = ${parseInt(req.body.id)}`, function (err) {
            if (err) {
                return console.error(err.message);
            }
        });

        db.run(`DELETE FROM products WHERE id = ${parseInt(req.body.id)}`, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row(s) deleted: ${this.changes}`);
            res.sendStatus(200)
        });

    })
})


app.post('/products', (req, res) => {
    console.log(req.body)
    var last_id = 0

    db.serialize(function () {
        db.all('SELECT COUNT(id) FROM products', (err, result) => {
            last_id = result[0]['COUNT(id)'] + 1

            db.prepare('INSERT INTO products VALUES (?, ?, ?, ?)')
                .run(last_id, req.body.name, req.body.description, parseInt(req.body.catlist))

            db.prepare('INSERT INTO inventory VALUES (?, ?)')
                .run(0, last_id)

            res.redirect('/products')
        })

    })

})

app.post('/products/:id', (req, res) => {
    console.log(req.body)
    console.log(req.params)

    if (req.body.catlist == 'none') {
        res.send('Nincs kategória megadva')
    }

    db.serialize(function () {
        db.run(`UPDATE products SET name = '${req.body.name}', cat_id = '${parseInt(req.body.catlist)}', desc='${req.body.description}' WHERE id = ${parseInt(req.params.id)}`, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row(s) updated: ${this.changes}`);
            res.redirect('/products')
        });

    })

})

app.get('/stocks', (req, res) => {

    db.serialize(function () {

        db.all("SELECT * FROM inventory;", function (err, results) {
            if (err != null) {
                // hibakezelés
            }
            console.log(results)

        })

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


app.post('/stocks/:id', (req, res) => {
    db.serialize(function () {
        db.run(`UPDATE inventory SET quantity = ${req.body.quantity} WHERE product_id = ${req.params.id}`, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row(s) updated: ${this.changes}`);
            res.redirect('/stocks')
        });
    })
})


app.get('/categories', (req, res) => {

    db.serialize(function () {

        db.all('SELECT * FROM categories', function (err, results) {

            console.log(results)

            if (err != null) {
                // hibakezelés
            }
            res.render('nav', {
                array: results,
                categories: true
            })
        })

    })
})


app.post('/categories', (req, res) => {
    console.log(req.body)
    var last_id = 0

    db.serialize(function () {
        db.all('SELECT COUNT(id) FROM products', (err, result) => {
            last_id = result[0]['COUNT(id)'] + 1

            db.prepare('INSERT INTO categories VALUES (?, ?)')
                .run(req.body.name, last_id)

            res.redirect('/categories')
        })

    })

})

app.post('/categories/:id', (req, res) => {
    db.serialize(function () {
        db.run(`UPDATE categories SET name = '${req.body.name}' WHERE id = ${parseInt(req.params.id)}`, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row(s) updated: ${this.changes}`);
            res.redirect('/categories')
        });
    })
})

app.delete('/categories', (req, res) => {
    console.log(req.body)
    db.serialize(function () {

        db.all(`SELECT p.id, c.id FROM products p INNER JOIN categories c ON c.id = p.cat_id WHERE c.id = ${req.body.id}`, function (err, results) {

            if (err != null) {
                // hibakezelés
            }
            console.log(results[0])

            delId = results[0].id

           db.run(`DELETE FROM inventory WHERE product_id = ${parseInt(delId)}`, function (err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Row(s) deleted: ${this.changes}`);
            });

            db.run(`DELETE FROM products WHERE id = ${parseInt(delId)}`, function (err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Row(s) deleted: ${this.changes}`);
            });

            db.run(`DELETE FROM categories WHERE id = ${parseInt(req.body.id)}`, function (err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Row(s) deleted: ${this.changes}`);
            });

            res.redirect('/categories')

        
        })
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))