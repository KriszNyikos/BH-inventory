
const express = require('express')
const categories = express.Router()
const sqlite3 = require('sqlite3').verbose();

categories.use(express.json())
categories.use(express.urlencoded({ extended: true }))

const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Categories: Database connection is succesfull')
});


categories.get('/categories', (req, res) => {

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


categories.post('/categories', (req, res) => {
     console.log(req.body)
    var last_id = 0

    db.serialize(function () {
        db.all('SELECT id FROM categories ORDER BY id DESC', (err, result) => {
            last_id = result[0]['COUNT(id)'] + 1
            let parentid = 1
        
            db.prepare('INSERT INTO categories VALUES (?, ?, ?)')
               .run(req.body.name, parentid, last_id)

            res.redirect('/categories')
        })

    })

})

categories.post('/categories/:id', (req, res) => {
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

categories.delete('/categories', (req, res) => {
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

module.exports = categories