const express = require('express')
const products = express.Router()
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('/home/krisztiandev/Braining hub/BH-inventory/inventory', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Products: Database connection is succesfull')
});

products.get('/products',  (req, res)=> {

   db.serialize(function () {
         db.all(`SELECT DISTINCT p.id, p.name, p.desc, c.name AS category, c.parent_id 
                FROM products p 
                INNER JOIN pro_cat pc ON pc.product_id = p.id 
                INNER JOIN categories c ON c.id = pc.cat_id`, function (err, results) {
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


 products.delete('/products', (req, res) => {
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


products.post('/products', (req, res) => {
    console.log(req.body)

    if (req.body.catlist === undefined) {
        res.send('Nincs kategória megadva')
    }
    let last_id = 0

    db.serialize(function () {

        db.all('SELECT id FROM products ORDER BY id DESC', (err, result) => {
            last_id = result[0]['id'] + 1

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

products.post('/products/:id', (req, res) => {
    //  console.log(req.body)
    //  console.log(req.params)

    if (req.body.catlist === undefined) {
        res.send('Nincs kategória megadva')
    }

    db.serialize(function () {
        db.run(`UPDATE products SET name = '${req.body.name}', desc='${req.body.description}' 
                WHERE id = ${parseInt(req.params.id)}`, function (err) {
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

module.exports = products