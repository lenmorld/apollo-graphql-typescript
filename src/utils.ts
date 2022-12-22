// import { pool } from './database/postgres'
import { pool } from './database/postgres'
import { v4 as uuidv4 } from 'uuid';

// pool.connect()

export const createUserTable = async () => {
    const query = `
        CREATE TABLE users (
            id int primary key,
            email varchar,
            name varchar,
            password varchar
        );
    `;

    try {
        const res = await pool.query(query)
        console.log("Table has been created")
    } catch (err) {
        console.error(err)
    } finally {
        // no need to close anymore, since we're using pool
        // it's automatically returned to the pool
        // client.end()
    }
}

export const addUser = async (id: number, name: string, email: string, password: string) => {
    const query = {
        text: 'INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4)',
        values: [id, name, email, password],
      }

    try {
        const res = await pool.query(query)
        console.error("users inserted: ", res.rows)
    } catch (err) {
        console.error(err)
    } finally {
        // client.end()
    }
}

export const listTables = async() => {
    const query = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
    `;

    try {
        const res = await pool.query(query)
        console.log("table names: ", res.rows)
    } catch (err) {
        console.error(err)
    } finally {
        // client.end()
    }
}

export const getUsers = async() => {
    const query = `
        SELECT * FROM users;
    `;

    try {
        const res = await pool.query(query)
        console.log("users: ", res.rows)
        return res.rows
    } catch (err) {
        console.error(err)
    } finally {
        // client.end()
    }
}

// pool.connect()
 
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   // client.end()
// })

// ------------------
// GIST of code - utils
// -------------------

export const readQuery = async (query: string) => {

    try {
        const res = await pool.query(query);
        return res.rows;
    } catch (err) {
        console.error(err);
    } 
}

export const createUserTable2 = async () => {

    const query = `
    CREATE TABLE users (
        id varchar primary key,
        name varchar,
        email varchar,
        password varchar
    )
    `;

    return readQuery(query);
}

// user table in the DB, not the typedefs in GraphQL
// note that there's no Projects here, since Projects is not saved in the User table
// it's a relation
interface User {
    id: string
    name: string
    email: string
    password: string
}

export const findUserByEmail = async (email: string): Promise<User[]> => {
    const query = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email]
    }

    try {
        const res = await pool.query(query);
        return res.rows;
    } catch (err) {
        console.error(err);
    }

    // need a default return type
    return []
    // return [{
    //     id: '0',
    //     name: "J Doe",
    //     email: 'jdoe@zcorp.com',
    //     password: 'passwordz'
    // }]
}

export const addUser2 = async (name: string, email: string, password: string ) => {
    const query = {
        text: 'INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4)',
        values: [uuidv4(), name, email, password]
    }

    const user = await findUserByEmail(email)

    if(user?.length === 0) {
        try {
            const res = await pool.query(query)
            console.log("user added: ", user.name)
        } catch (err) {
            console.error(err)
        }
    } else {
        console.log("User email already exists. Check email address.")
    }
}

export const findSomething = async (email: string) => {
    return "Hi"
}