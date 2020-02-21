const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connection is succesfull')
});

const products = [
    { id: 1, name: "Processzor", grouppi: 'pc' },
    { id: 2, name: "Sütő", grouppi: 'kitchen' },
    { id: 3, name: "Kazán", grouppi: 'warm' },
    { id: 4, name: "Függöny", grouppi: 'shadow' },
]

const inventory = [
    {product_id: 1, quantity: 30},
    {product_id: 2, quantity: 71},
    {product_id: 3, quantity: 863},
    {product_id: 4, quantity: 73}
]


db.serialize(function () {
    db.run("DROP TABLE products");
    db.run("DROP TABLE inventory");
})

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS products ('id' INTEGER PRIMARY KEY NOT NULL, 'name' VARCHAR(100), 'grouppi' VARCHAR(100));");
})

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS inventory ('quantity' INTEGER, 'product_id' INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products(id));");
})


db.serialize(function(){
    products.forEach( e => {
        db.prepare(`INSERT INTO products VALUES (?,?,?)`)
        .run(e.id, e.name, e.grouppi)
    })
})

db.serialize(function(){
    inventory.forEach( e => {
        db.prepare('INSERT INTO inventory VALUES (?,?)')
        .run(e.quantity, e.product_id)
    })
})

db.serialize(function () {

    db.all("SELECT p.id, p.name, i.quantity FROM products p INNER JOIN inventory i ON i.product_id = p.id ;", function (err, results) {
        if (err != null) {
            // hibakezelés
        }
        console.log(results)
    
    })
})