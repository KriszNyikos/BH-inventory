const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connection is succesfull')
});

const products = [
    { id: 1, name: "Processzor", cat_id: 1, desc: 'itt a sok habi' },
    { id: 2, name: "Sütő", cat_id: 2, desc: 'habihabi' },
    { id: 3, name: "Kazán", cat_id: 3, desc: 'ideis' },
    { id: 4, name: "Függöny", cat_id: 4, desc: 'nanemááááááá' },
]

const inventory = [
    {product_id: 1, quantity: 30},
    {product_id: 2, quantity: 71},
    {product_id: 3, quantity: 863},
    {product_id: 4, quantity: 73}
]

const categories = [
    { id: 1, catname: 'Számítástechnika' },
    { id: 2, catname: 'Konyhatechnika' },
    { id: 3, catname: 'Fűtéstechnika'},
    { id: 4, catname: 'Árnyékolástechnika'},
]

const pro_cat = [
    {pro: 1, cat : 1},
    {pro: 2, cat : 2},
    {pro: 3, cat : 3},
    {pro: 4, cat : 4}

]

db.serialize(function () {
    db.run("DROP TABLE products");
    db.run("DROP TABLE inventory");
    db.run("DROP TABLE categories");
})

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS categories ('name' TEXT, 'id' INTEGER PRIMARY KEY NOT NULL);");
})

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS pro_cat ('product_id' INTEGER, 'cat_id' INTEGER);");
})

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS products ('id' INTEGER PRIMARY KEY NOT NULL, 'name' VARCHAR(100), 'desc' VARCHAR(200));");
})

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS inventory ('quantity' INTEGER, 'product_id' INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products(id));");
})



db.serialize(function(){
    pro_cat.forEach( e => {
        db.prepare(`INSERT INTO pro_cat VALUES (?,?)`)
        .run(e.pro, e.cat)
    })
})

db.serialize(function(){
    categories.forEach( e => {
        db.prepare(`INSERT INTO categories VALUES (?,?)`)
        .run(e.catname, e.id)
    })
})


db.serialize(function(){
    products.forEach( e => {
        db.prepare(`INSERT INTO products VALUES (?,?,?)`)
        .run(e.id, e.name, e.desc )
    })
})

db.serialize(function(){
    inventory.forEach( e => {
        db.prepare('INSERT INTO inventory VALUES (?,?)')
        .run(e.quantity, e.product_id)
    })
})

db.serialize(function () {

    db.all("SELECT p.id, p.name AS productname, i.quantity, p.desc, c.id AS cat_id, c.name AS cat_name FROM categories c INNER JOIN products p ON p.cat_id = c.id INNER JOIN inventory i ON i.product_id = p.id;", function (err, result) {
        if (err != null) {
            // hibakezelés
        }
        console.log(result)
    
    })
})
/*
db.serialize(function () {

    db.all("SELECT p.id, p.name AS productname, i.quantity, p.desc, c.id AS cat_id, c.name AS cat_name FROM products p INNER JOIN inventory i ON i.product_id = p.id INNER JOIN pro_cat ON pro_cat product_id =;", function (err, result) {
        if (err != null) {
            // hibakezelés
        }
        console.log(result)
    
    })
})

*/