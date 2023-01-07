users
id      |   name    |   email   |   password
abc123  |   Lenny   | lenny@example.com
def456  |   Benny   | benny@example.com


projects
id      | title     | status
1       
2
3

assignments
id  | project_id    | user_id   | user_name
1       1               abc123
5       1               def456
3       2               abc123



1. get the asignments by user id

SELECT * FROM users INNER JOIN assignments ON users.id = assignments.user_id

-> user (id, name, email), assignments (id, project_id, user_id, user_name)

        SELECT users.id as user_id, assignments.project_id as project_id 
        FROM users 
        INNER JOIN assignments ON users.id = assignments.user_id

-> 
user_id  project_id

"ab63aab3-cf88-4251-b07e-fb3d591afde4"	1
"ab63aab3-cf88-4251-b07e-fb3d591afde4"	2
"c30383c5-189c-460f-9108-c4f9dee18f50"	1


1. get project details from assignments, using results from 1

SELECT 
	users.id as user_id, 
	assignments.project_id as project_id, 
	projects.title as project_title, 
	projects.status as project_status
FROM (
	(users INNER JOIN assignments ON users.id = assignments.user_id)
	INNER JOIN projects ON projects.id = assignments.project_id
	)

user_id project_id project_title project_status
"ab63aab3-cf88-4251-b07e-fb3d591afde4"	1	"Site upgrade"	"ACTIVE"
"ab63aab3-cf88-4251-b07e-fb3d591afde4"	2	"Design new login form"	"ACTIVE"
"c30383c5-189c-460f-9108-c4f9dee18f50"	1	"Site upgrade"	"ACTIVE"

SELECT assignments.user_id, 
	users.name, 
	assignments.project_id, 
	projects.title, 
	projects.status
FROM ((users
	  INNER JOIN assignments
	   ON users.id = assignments.user_id)
	  INNER JOIN projects
	  ON assignments.project_id = projects.id
	  )