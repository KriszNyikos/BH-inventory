const sqlite3 = require('sqlite3').verbose();

const bigDB = require('./seed_products') 

const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connection is succesfull')
});

/*
// Old database
const products = [
    { id: 1, name: "Processzor", desc: 'itt a sok habi' },
    { id: 2, name: "Késkészlet", desc: 'habihabi' },
    { id: 3, name: "Kisradiátor", desc: 'ideis' },
    { id: 4, name: "Függöny", desc: 'nanemááááááá' }
]

const inventory = [
    { product_id: 1, quantity: 30 },
    { product_id: 2, quantity: 71 },
    { product_id: 3, quantity: 863 },
    { product_id: 4, quantity: 73 }
]

const categories = [
    { id: 1, catname: 'SzámítástechnikaF', parent_id: null },
    { id: 2, catname: 'KonyhatechnikaF', parent_id: null },
    { id: 3, catname: 'FűtéstechnikaF', parent_id: null },
    { id: 4, catname: 'ÁrnyékolástechnikaF', parent_id: null },
    { id: 5, catname: 'Hardver', parent_id: 1 },
    { id: 6, catname: 'Vágóeszközök', parent_id: 2 },
    { id: 7, catname: 'Radiátorok', parent_id: 3 },
]

const pro_cat = [
    { pro: 1, cat: 5 },
    { pro: 2, cat: 6 },
    { pro: 3, cat: 7 },
    { pro: 4, cat: 4 }

]*/

const {products, inventory, categories, pro_cat} = bigDB

db.serialize(function () {
    db.run("DROP TABLE products");
    db.run("DROP TABLE inventory");
    db.run("DROP TABLE categories");
    db.run("DROP TABLE pro_cat");
})

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS categories ('name' TEXT, parent_id INTEGER NULL, 'id' INTEGER PRIMARY KEY NOT NULL);");
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



db.serialize(function () {
    pro_cat.forEach(e => {
        db.run(`INSERT INTO pro_cat VALUES (?,?)`,[e.pro, e.cat])
    })



    categories.forEach(e => {
        db.run(`INSERT INTO categories VALUES (?,?,?)`, [e.catname, e.parent_id, e.id])
    })




    products.forEach(e => {
        db.run(`INSERT INTO products VALUES (?,?,?)`, [e.id, e.name, e.desc])
    })



    inventory.forEach(e => {
        db.run('INSERT INTO inventory VALUES (?,?)', [e.quantity, e.product_id])
    })


    db.all("SELECT DISTINCT p.id, p.name, p.desc, i.quantity, c.name AS category FROM products p INNER JOIN inventory i ON i.product_id = p.id INNER JOIN pro_cat pc ON pc.product_id = i.product_id INNER JOIN categories c ON c.id = pc.cat_id", function (err, result) {
        if (err != null) {
            // hibakezelés
        }
        console.log('PRODUCTS', result)

    })

    db.all("SELECT * FROM categories", function (err, result) {
        if (err != null) {
            // hibakezelés
        }
        console.log('CATEGORIES', result)

    })

    db.all("SELECT * FROM pro_cat", function (err, result) {
        if (err != null) {
            // hibakezelés
        }
        console.log('PRO_CAT', result)

    })

    db.all("SELECT * FROM inventory", function (err, result) {
        if (err != null) {
            // hibakezelés
        }
        console.log('INVENTORY', result)

    })

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
})


