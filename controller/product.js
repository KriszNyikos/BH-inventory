const sqlite3 = require('sqlite3').verbose();

function productList(req, res) {

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

}

module.exports = {
    productList: productList
}