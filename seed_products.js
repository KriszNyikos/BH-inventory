

let pronouns = ['kerékfújó', 'sötétségmérő', 'kondenzátor', 'libegő', 'számítógép']

let adjectives = ['napelemes', 'hosszabbított', 'habiszti', 'komplex', 'redőzött']

let descriptions = [null, 'itt a sok habi', 'habihabi', 'ide is valamit', 'úgyseolvasod']

const products = []
const inventory = []
const categories = [
    { id: 1, catname: 'SzámítástechnikaF', parent_id: null },
    { id: 2, catname: 'KonyhatechnikaF', parent_id: null },
    { id: 3, catname: 'FűtéstechnikaF', parent_id: null },
    { id: 4, catname: 'ÁrnyékolástechnikaF', parent_id: null },
    { id: 5, catname: 'Hardver', parent_id: 1 },
    { id: 6, catname: 'Vágóeszközök', parent_id: 2 },
    { id: 7, catname: 'Radiátorok', parent_id: 3 },
]
const pro_cat = []

function productGenerator() {
    let prod = {}
    prod.id = products.length + 1
    prod.name = `${adjectives[simpleRandom(5)]} ${pronouns[simpleRandom(5)]}`
    prod.desc = descriptions[simpleRandom(5)]
    products.push(prod)
}

function inventoryGen() {

    products.forEach(product => {
        let element = {}
        element.product_id = product.id
        element.quantity = simpleRandom(300)
        inventory.push(element)
    })

}

function proCatGen() {

    for (let i = 0; i < products.length; i++) {

        let element = {}
        element.pro = randomBetween(1, products.length)
        element.cat = randomBetween(1, categories.length)
        pro_cat.push(element)

    }

}

function simpleRandom(num) {
    return Math.floor(Math.random() * Math.floor(num));
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


function allGenerator() {
    for (let i = 0; i < 100; i++) {
        productGenerator()

    }

    inventoryGen()

    proCatGen()
}

allGenerator()

/*
console.log(products)
console.log(inventory)
console.log(categories)
console.log(pro_cat)

*/
module.exports = {
    products : products,
    inventory : inventory,
    categories : categories,
    pro_cat : pro_cat
}