import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from './graphql/schema'
import { resolvers } from './graphql/resolvers'

import { 
  // createUserTable, listTables, addUser, getUsers
  createUserTable2,
  findUserByEmail,
  addUser2
} from './utils'

(
  async function() {
    await addUser2("User Three", "user3@example.com", "abc123")

    const userByEmail = await findUserByEmail('user3@example.com')
    console.log(userByEmail)
  } 
)()

// createUserTable2();

// createUserTable()
// listTables()
// addUser(2, "User Two", "user2@example.com", "abc123")
// getUsers()

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests

  (async () => {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });
    
    console.log(`🚀  Server ready at: ${url}`);
  })()

  