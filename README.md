# Dev

```
npm run dev
```

Apollo sandbox /GraphiQL starts at http://localhost:4000/

# Database setup

You need Postgres running locally
If you're on Mac, recommend: https://postgresapp.com/

Also recommended to have PGAdmin
https://www.pgadmin.org/download/

Create database "project"

// set as default
export PGDATABASE=postgres

# Notes


## Schema
- collection of type definitions (typeDefs)
that together define the "shape" of the queries 
that can be executed against your data


### regular Type (object)
- defines the queryable fields for the book object in our data

type Book {
    title: String
    author: String
}

type Query {
    books: [Book]
}

### Query type
special type, which lists all the available queries (and return type) for clients


### Data set
- can connect to any source: DB, REST API, storage, another GraphQL server


### Resolver
- defines how to fetch the types defined in the schema


# Current position
https://www.youtube.com/watch?v=gt2Z6zAGtc8&list=PLASldBPN_pkAj8b0Ny5IGoYgsnqylP2c-&index=4