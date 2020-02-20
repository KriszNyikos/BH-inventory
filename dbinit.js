const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connection is succesfull')
});

const products = [
    { id: 1, name: "Processzor", grouppi: 'számitástechnika' },
    { id: 2, name: "Sütő", grouppi: 'konyhatechnika' },
    { id: 3, name: "Kazán", grouppi: 'fűtestechnika' },
    { id: 4, name: "Függöny", grouppi: 'árnyékolástechnika' },
]

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS products ('id' VARCHAR(100),'name' VARCHAR(100), 'grouppi' VARCHAR(100))");
})

db.serialize(function(){
    products.forEach( e => {
        console.log(e)
        db.prepare('INSERT INTO products VALUES (?, ?, ?)')
        .run(e.id, e.name, e.grouppi)
    })
})