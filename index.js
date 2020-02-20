const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connection is succesfull')
});

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(express.static('views/images'));


app.get('/', (req, res) => {

    let resultArray = []
    db.serialize(function(){
        
        db.all("SELECT * FROM products", function(err, results) {
            if (err != null) {
                // hibakezelés
            }
            console.log(results)
            resultArray = results
        })
    })

    
    res.render('home', { array: resultArray })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))