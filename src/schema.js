var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors')



var products = [
    {
        id: 1,
        name: "coffee",
        quantity: 1,
        date: "1/11/2021",
        receivedBy: { name: "raghav", id: 1, code: "1111" }
    },
    {
        id: 2,
        name: "coffee",
        quantity: 1,
        date: "2/11/2021",
        receivedBy: {
            name: "kiran", id: 2, code: "2222"
        }
    },
    {
        id: 3,
        name: "coffee",
        quantity: 1,
        date: "2/11/2021",
        receivedBy: { name: "Hari", id: 3 }
    },
    {
        id: 4,
        name: "tea",
        quantity: 1,
        date: "3/11/2021",
        receivedBy: { name: "raghav", id: 1 }
    },
    {
        id: 5,
        name: "tea",
        quantity: 1,
        date: "2/12/2021",
        receivedBy: { name: "kiran", id: 2 }
    },
    {
        id: 6,
        name: "tea",
        quantity: 1,
        date: "2/10/2021",
        receivedBy: { name: "Hari", id: 3 }
    }
]

var schema = buildSchema(`
interface identity {
    id: String!
    name: String!
}
type Person implements identity {
    id: String!
    name: String!
    code: String
}
input PersonInput {
    id: String!
    name: String!
    code: String
}
type Product {
    id: String
    name: String
    quantity: Int
    receivedBy: Person
    deliveredBy: Person
    date:String
}
enum PRODUCTTYPE {
    TEA
    COFFEE
}

type AvailableProduct {
    id:PRODUCTTYPE!,
    name:PRODUCTTYPE!
}
type Query {
    products(filterProduct:String,filterUser:String) : [Product]
    availableProducts : [AvailableProduct]
}

type Mutation {
    createProduct(name:String,id:String!,date:String,receivedBy:PersonInput): [Product]
}

`);

var root = {
    createProduct: (args) => {
        products.push(args)
        console.log(products)
        const x = products[products.length - 1]
        console.log(x)
        return [x]
    },
    availableProducts: () => {
        return [{ id: "TEA", name: "TEA" }, { id: "COFFEE", name: "COFFEE" }]
    },
    products: (args) => {
        if (/all/.test(args.filterProduct)) {
            return products
        }
        if (args.filterUser || args.filterProduct) {
            return products.filter(prod =>
                (args.filterUser && prod.receivedBy?.name.match(new RegExp(args.filterUser, "i")))
                || (args.filterProduct && prod.name.match(new RegExp(args.filterProduct, "i")))
            )
        }
        return products
    },
    Person: (args) => {
        const people = new Map()
        people.set(1, { name: "raghav", id: 1 })
        people.set(2, { name: "kiran", id: 2 })
        return people.get(args.id)
    }
}



var app = express();
app.use(cors())
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
