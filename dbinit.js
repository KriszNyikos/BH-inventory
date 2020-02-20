const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connection is succesfull')
});

const products = [
    { id: 1, name: "Processzor", grouppi: 'számtech' },
    { id: 2, name: "Ledlámpa", grouppi: 'háztartás' },
    { id: 3, name: "Szappan", grouppi: 'virusellen' },
    { id: 4, name: "Kutya", grouppi: 'kiskedvenc' },
]

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS products ('name' VARCHAR(100), 'grouppi' VARCHAR(100))");
})

db.serialize(function(){
    products.forEach( e => {
        console.log(e)
        db.prepare('INSERT INTO products VALUES (?, ?)')
        .run(e.name, e.grouppi)
    })
})