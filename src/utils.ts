// import { pool } from './database/postgres'
import { pool } from './database/postgres'
import { v4 as uuidv4 } from 'uuid';

// pool.connect()

// These are just (types) TS interfaces that we can use in the function returns, params
// user table in the DB, not the typedefs in GraphQL
// note that there's no Projects here, since Projects is not saved in the User table
// it's a relation
interface User {
    id: string
    name: string
    email: string
    password: string
}

interface Project {
    id: String
    title: String
    status: String
}

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
        console.log(res.body)
        console.log("Table has been created")
    } catch (err) {
        console.error(err)
    } finally {
        // no need to close anymore, since we're using pool
        // it's automatically returned to the pool
        // client.end()
    }
}

// serial - gives us an integer, auto-incremented for each new created object
export const createProjectTable = async () => {
    const query = `
        CREATE TABLE projects (
            id serial primary key,
            title varchar,
            status varchar
        )
    `;

    return readQuery(query) ? "Table created." : "Unable to create table.";
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

// SCRATCH: better to do this logic on SQL side
export const getProjectsAssignedToUser = async (userId: string): Promise<Project[]>  => {

    const query = `
            SELECT project_id FROM assignments 
            WHERE user_id = '${userId}';`
    try {
        const res = await pool.query(query)
        // console.log(`projects assigned to user ${userId}: `, res.rows)

        // rows returned: [ { project_id: 1 }, { project_id: 2 } ]
        return res.rows.map((proj: {project_id: Number}) => proj.project_id)
    } catch (err) {
        console.error(err)
    }

    return []
}

export const getUsers = async() => {
    const query = `
        SELECT * FROM users;
    `;
    
    try {
        const res = await pool.query(query)
        console.log("users: ", res.rows)

        // TODO: get projects of users
        // ad to payload

        // return res.rows.map((user: User) => ({
        //     ...user,
        //     // projects: <Array<Project>> []
        //     projects: getProjectsAssignedToUser(user.id).map()
        // }))

        return Promise.all(res.rows.map(async (user: User) => {
            const projects = await getProjectsAssignedToUser(user.id)

            console.log("projects assigned to user: ", projects)

            return {
                ...user,
                // projects: <Array<Project>> []
                projects
        }}))
    } catch (err) {
        console.error(err)
    } finally {
        // client.end()
    }

    return []
}

interface Assignment {
    user_id: string,
    project_id: string
    project_title: string
    project_status: string
}

export const getAssignments = async () => {
    const query = `
        SELECT 
        users.id as user_id, 
        assignments.project_id as project_id, 
        projects.title as project_title, 
        projects.status as project_status
        FROM (
                (users INNER JOIN assignments ON users.id = assignments.user_id)
                INNER JOIN projects ON projects.id = assignments.project_id
            )
    `

    return readQuery(query)
}


export const getUsersFromUsersTable = async () => {
    const query = `
    SELECT * FROM users;
    `;
    
    return readQuery(query);
    
}

export const getUsers2 = async () => {
    // get all users, then all assignments
    // then loop over all users, for each, get assigned projects
    // using the assignments

    const usersFromTable = await getUsersFromUsersTable()
    const assignments = await getAssignments()

    const users = await usersFromTable?.map(async (user: User) => {
        // from user.id, get project assigned in assignments
        const projects: object [] = []

        assignments.forEach((assignment: Assignment) => {
            if (user.id === assignment.user_id) {
                projects.push({
                    id: assignment.project_id,
                    title: assignment.project_title,
                    status: assignment.project_status
                })
            }
        })

        return {
            ...user,
            projects: projects
        }
    })

    return users
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

export const checkIfTableExists = async (tableName: string) => {
    const query = `
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_name = '${tableName}'
        )
    `

    const result = await readQuery(query)
    console.log(result)

    return result[0].exists;
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
            console.log(res.rows)
            console.log("user added: ", user)
        } catch (err) {
            console.error(err)
        }
    } else {
        console.log("User email already exists. Check email address.")
    }
}

export const addProject = async (title: string, status: string) => {
    const query = {
        text: 'INSERT INTO projects(title, status) VALUES($1, $2)',
        values: [title, status],
    }

    try {
        await pool.query(query);
        console.log("Project added.");
    } catch (err) {
        console.error(err);
    } 
}

/*
table for relationship of users to projects
projects are assigned to users
users are part of projects

id | user_email | project_id | user_name

foreign keys: 
- project_id from projects table
- user_id from users table

primary key pair: project_id, user_id
    together should be unique
*/

export const createAssignmentTable = async () => {
    const query = `
    CREATE TABLE assignments (
        id serial,
        project_id int references projects (id),
        user_id varchar references users (id),
        primary key (project_id, user_id),
        user_name varchar
    )`

    return readQuery(query) ? "Table created" : "Unable to create table"
}

// to make it easier, 
// use email instead of uuid,
// find uuid by email
export const addAssignment = async (user_email: string, project_id: number, user_name: string) => {
    let user_id: string = ''
    const user = await findUserByEmail(user_email)

    if (!user?.length) {
        console.log("User not found")
    } else {
        user_id = user[0].id
    }

    const query = {
        text: `INSERT INTO assignments(project_id, user_id, user_name) 
                VALUES($1, $2, $3)`,
        values: [project_id, user_id, user_name]
    }

    try {
        await pool.query(query)
        console.log('Assignment created')
    } catch (err) {
        console.error(err)
    }
}

export const findSomething = async (email: string) => {
    return "Hi"
}