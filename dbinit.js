const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connection is succesfull')
});

const products = [
    { id: 1, name: "Processzor", desc: 'itt a sok habi' },
    { id: 2, name: "Késkészlet", desc: 'habihabi' },
    { id: 3, name: "Kisradiátor", desc: 'ideis' },
    { id: 4, name: "Függöny", desc: 'nanemááááááá' }
]

const inventory = [
    {product_id: 1, quantity: 30},
    {product_id: 2, quantity: 71},
    {product_id: 3, quantity: 863},
    {product_id: 4, quantity: 73}
]

const categories = [
    { id: 1, catname: 'SzámítástechnikaF', parent_id: null },
    { id: 2, catname: 'KonyhatechnikaF' , parent_id: null },
    { id: 3, catname: 'FűtéstechnikaF' , parent_id: null},
    { id: 4, catname: 'ÁrnyékolástechnikaF' , parent_id: null },
    { id: 5, catname: 'Hardver' , parent_id: 1 },
    { id: 6, catname: 'Vágóeszközök' , parent_id: 2 },
    { id: 7, catname: 'Radiátorok' , parent_id: 3 },
]

const pro_cat = [
    {pro: 1, cat : 5},
    {pro: 2, cat : 6},
    {pro: 3, cat : 7},
    {pro: 4, cat : 4}

]

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



db.serialize(function(){
    pro_cat.forEach( e => {
        db.prepare(`INSERT INTO pro_cat VALUES (?,?)`)
        .run(e.pro, e.cat)
    })
})

db.serialize(function(){
    categories.forEach( e => {
        db.prepare(`INSERT INTO categories VALUES (?,?,?)`)
        .run(e.catname, e.parent_id, e.id)  
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

    db.all("SELECT DISTINCT p.id, p.name, p.desc, i.quantity, c.name AS category FROM products p INNER JOIN inventory i ON i.product_id = p.id INNER JOIN pro_cat pc ON pc.product_id = i.product_id INNER JOIN categories c ON c.id = pc.cat_id", function (err, result) {
        if (err != null) {
            // hibakezelés
        }
        console.log(result)
    
    })
})
