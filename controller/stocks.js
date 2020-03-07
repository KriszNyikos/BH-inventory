const express = require('express')
const stocks = express.Router()
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('/home/krisztiandev/Braining hub/BH-inventory/inventory', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Stocks: Database connection is succesfull')
});

stocks.get('/stocks', (req, res) => {

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


stocks.post('/stocks/:id', (req, res) => {
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


module.exports = stocks