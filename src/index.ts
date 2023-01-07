import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from './graphql/schema'
import { resolvers } from './graphql/resolvers'

import { 
  checkIfTableExists,
  // createUserTable, listTables, addUser, getUsers
  createUserTable2,
  findUserByEmail,
  addUser2,
  createProjectTable,
  // addProject,
  createAssignmentTable,
  // addAssignment
} from './utils'

// (
//   async function() {
//     await addUser2("User Three", "user3@example.com", "abc123")

//     const userByEmail = await findUserByEmail('user3@example.com')
//     console.log(userByEmail)
//   } 
// )()

(
  async function () {
    const usersTableExists = await checkIfTableExists('users');

    if (!usersTableExists) {
      console.log("table doesn't exist, create table")
      createUserTable2();
    }

    await addUser2("User Four", "user4@example.com", "abc123")

    const userByEmail = await findUserByEmail('user4@example.com')
    console.log("user found: ", userByEmail)

    const projTableExists = await checkIfTableExists('projects');

    if (!projTableExists) {
      console.log("table doesn't exist, create table")
      createProjectTable();
    }

    // addProject('Site upgrade', 'ACTIVE')
    // addProject('Design new login form', 'ACTIVE');
    // addProject('Database maintenance', 'COMPLETED');
    // addProject('Onboard new devs', 'ACTIVE');

    const assignmentsTableExists = await checkIfTableExists('assignments');

    if (!assignmentsTableExists) {
      console.log("table doesn't exist, create table")
      createAssignmentTable();
    }

    // will et an error if added twice
    // addAssignment('user3@example.com', 1, 'User Three')
    // addAssignment('user3@example.com', 2, 'User Three')
    // addAssignment('user4@example.com', 1, 'User Four')
  }
)()



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

  