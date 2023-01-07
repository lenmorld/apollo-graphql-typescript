// const users = [{ id: 1, name: "Lenny" }, { id: 2, name: "Benny" }, { id: 3, name: "Jenny" }]

// SYNC function - fake logic
const getProjectsAssignedToUser = (userId) => [ { projectId: userId + 1 }, { projectId: userId + 2 }  ]

const results = users.map((user) => ({
    ...user,
    // if function is sync
    projects: getProjectsAssignedToUser(user.id).map(proj => proj.projectId)
}))

// ASYNC function 

console.log(results)

const users = [{ id: 1, name: "Lenny" }, { id: 2, name: "Benny" }, { id: 3, name: "Jenny" }]

const getProjectsAssignedToUserAsync = async (userId) => {
    // some async logic like fetching from API, DB
    return [ { projectId: userId + 1 }, { projectId: userId + 2 }  ]
}

// const resultsAsync = users.map((user) => ({
    // ...user,
    // if function is sync
    // cannot do map directly like getProjectsAssignedToUserAsync(user.id).map(proj => proj.projectId)
    // since it returns a Promise
    // projects: getProjectsAssignedToUserAsync(user.id) 
// }))

// solution: each map function should be async, so the Promise will be resolved per iteration
// Promise.all converts the array of Promises into a single promise
// then returns an array of resolved values

// returns Promise per iteration
// const resultsAsync = users.map(async (user) => {

// wrap with Promise.all to resolve group

const resultsAsync = await Promise.all(users.map(async (user) => {
    const projects =  await getProjectsAssignedToUserAsync(user.id)
    return ({
        ...user,
        projects
    })
}))

console.log(resultsAsync)

/*
[
    {
        "id": 1,
        "name": "Lenny",
        "projects": [
            2,
            3
        ]
    },
]

*/
