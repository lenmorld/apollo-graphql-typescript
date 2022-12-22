# Dev

```
npm run dev
```

Apollo sandbox /GraphiQL starts at http://localhost:4000/



# Notes


Schema
- collection of type definitions (typeDefs)
that together define the "shape" of the queries 
that can be executed against your data


regular Type
- defines the queryable fields for the book object in our data

type Book {
    title: String
    author: String
}

type Query {
    books: [Book]
}

Query -
special type, which lists all the available queries (and return type) for clients


Data set
- can connect to any source: DB, REST API, storage, another GraphQL server


Resolver
- defines how to fetch the types defined in the schema