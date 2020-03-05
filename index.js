const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3').verbose();
//const product = require('controller/product.js')


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

   // product.productList()


    db.serialize(function () {
        db.all("SELECT DISTINCT p.id, p.name, p.desc, c.name AS category, c.parent_id FROM products p INNER JOIN pro_cat pc ON pc.product_id = p.id INNER JOIN categories c ON c.id = pc.cat_id", function (err, results) {
            if (err != null) {
                // hibakezelés
            }

            // console.log(results)

            db.all('SELECT * FROM categories', function (err, cat) {


                let categories = []
                //         console.log(results)
                //console.log(cat)

                cat.forEach(c => {
                    if (c.parent_id === null) {
                        // console.log(c)
                        categories.push({ name: c.name, subs: [], id: c.id })
                    }
                })

                cat.forEach(c => {
                    if (c.parent_id) {
                        //console.log(c)

                        categories.forEach(cat => {
                            if (cat.id === c.parent_id) {
                                cat.subs.push({ name: c.name, id: c.id })
                            }
                        })

                    }
                })

                console.log(categories)

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
    //console.log(req.body)
    db.serialize(function () {

        db.run(`DELETE FROM pro_cat WHERE product_id = ${parseInt(req.body.id)}`, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`pro_cat table Row(s) deleted ${this.changes}`);

        })

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

    if (req.body.catlist === undefined) {
        res.send('Nincs kategória megadva')
    }
    let last_id = 0

    db.serialize(function () {

        db.all('SELECT COUNT(id) FROM products', (err, result) => {
            last_id = result[0]['COUNT(id)'] + 1

            db.prepare('INSERT INTO products VALUES (?, ?, ?)')
                .run(last_id, req.body.name, req.body.description)


            db.all("SELECT * FROM products;", function (err, results) {
                if (err != null) {
                    // hibakezelés
                }
                //  console.log(results)

            })

            db.all("SELECT * FROM pro_cat;", function (err, results) {
                if (err != null) {
                    // hibakezelés
                }
                console.log(results)

            })

            db.prepare('INSERT INTO inventory VALUES (?, ?)')
                .run(0, last_id)


            db.all("SELECT * FROM inventory;", function (err, results) {
                if (err != null) {
                    // hibakezelés
                }
                //         console.log(results)

            })

            if (typeof req.body.catlist === "string") {
                db.prepare('INSERT INTO pro_cat VALUES (?, ?)')
                    .run(last_id, req.body.catlist)
            } else {
                req.body.catlist.forEach(c => {
                    console.log(c)
                    db.prepare('INSERT INTO pro_cat VALUES (?, ?)')
                        .run(last_id, c)
                });
            }

            res.redirect('/products')
        })

    })

})

app.post('/products/:id', (req, res) => {
    //  console.log(req.body)
    //  console.log(req.params)

    if (req.body.catlist === undefined) {
        res.send('Nincs kategória megadva')
    }

    db.serialize(function () {
        db.run(`UPDATE products SET name = '${req.body.name}', desc='${req.body.description}' WHERE id = ${parseInt(req.params.id)}`, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row(s) updated: ${this.changes}`);

        });

        db.run(`DELETE FROM pro_cat WHERE product_id = ${req.params.id}`, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`pro_cat table Row(s) deleted ${this.changes}`);
        })



        if (typeof req.body.catlist === "string") {
            db.prepare('INSERT INTO pro_cat VALUES (?, ?)')
                .run(req.params.id, req.body.catlist)
        } else {
            req.body.catlist.forEach(c => {
                //               console.log(c)
                db.prepare('INSERT INTO pro_cat VALUES (?, ?)')
                    .run(req.params.id, c)
            });
        }



        res.redirect('/products')
    })

})

app.get('/stocks', (req, res) => {

    db.serialize(function () {

        db.all("SELECT * FROM inventory;", function (err, results) {
            if (err != null) {
                // hibakezelés
            }
            //          console.log(results)

        })

        db.all("SELECT p.id, p.name, i.quantity FROM products p INNER JOIN inventory i ON i.product_id = p.id ;", function (err, results) {
            if (err != null) {
                // hibakezelés
            }
            //         console.log(results)
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

            //         console.log(results)

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
        db.all('SELECT COUNT(id) FROM categories', (err, result) => {
            last_id = result[0]['COUNT(id)'] + 1
            let parentid = 1
        
            db.prepare('INSERT INTO categories VALUES (?, ?, ?)')
               .run(req.body.name, parentid, last_id)

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
    //  console.log(req.body.id)
    db.serialize(function () {

        db.run(`DELETE FROM pro_cat WHERE cat_id = ${req.body.id}`, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`pro_cat table Row(s) deleted ${this.changes}`);
        })

        db.run(`DELETE FROM categories WHERE id = ${req.body.id}`, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(` categories table Row(s) deleted ${this.changes}`);
        })

        res.sendStatus(200)
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))