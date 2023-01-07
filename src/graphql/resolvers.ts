import { books } from '../database/mockdb'
// import { users } from '../database/mockdb'
import { 
  // getUsers,
  getUsers2
 } from '../utils'


// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers = {
    Query: {
      books: () => books,
      // users: async () => getUsers()
      users: async () => getUsers2()
    },
  };