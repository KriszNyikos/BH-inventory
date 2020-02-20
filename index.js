const express = require('express')
const app = express()
const port = 4000
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connection is succesfull')
});

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main', 
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}
    
));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(express.static('views/images'));


app.get('/products', (req, res) => {

   db.serialize(function(){
        
        db.all("SELECT * FROM products", function(err, results) {
            if (err != null) {
                // hibakezelés
            }
            console.log(results)
            res.render('products', {array: results})
        })
    })
})

app.post('/products', (req, res)=>{

})

app.get('/stocks', (req, res) => {

   db.serialize(function(){
        
        db.all("SELECT * FROM products", function(err, results) {
            if (err != null) {
                // hibakezelés
            }
            console.log(results)
            res.render('stocks', {array: results})
        })
    })

    
    
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))