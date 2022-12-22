import { gql } from '@apollo/client/core'

/*
    can use `#graphql <graphql string>`
    or
    gql` <graphql string>`
*/

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = gql`#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type User {
    id: Int,
    name: String,
    email: String,
    password: String,
    projects: [Project]
  }

  type Project {
    title: String
    active: Boolean,
    # make it required
    # active: Boolean!,
    members: [User]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book],
    users: [User]
  }
`;
