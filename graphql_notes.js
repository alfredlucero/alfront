GraphQL and Relay Notes:

/* What problem are we trying to solve with GraphQL? */
Previously with REST-ful Routing
- Create, Read, Update, Delete Interfaces and URLs
i.e. HTTP methods for handling posts
/posts - POST - Create a new post
/posts - GET - Fetch all posts
/posts/14 - GET - Fetch post 14
/posts/15 - PUT - Update post 15
/posts/18 - DELETE - Delete post 18

i.e. Restful conventions
/<name> - POST/GET
/<name>/:id - GET/PUT/DELETE

- Heavily related/nested URLs gets complicated
such as /users/23/posts/14 - Fetch post 14 of user 23

i.e. See how complicated it could get to retrieve a user's friends'
companies and positions
User -> Company, Position Ids, other User attributes
/users/23/friends -> to get each friend's position and company from ids
-> /users/1/companies, /users/1/positions (multiple HTTP requests)

Also it may return a lot of unnecessary data on the Company/Positions JSON objects
returned, over-serving data tossed back to client

- In summary: overfetching data, too many HTTP requests, complicated nested/related
and lengthy RESTful request URLs


/* What is GraphQL? */
- Imagine a graph of Users connected to each other and assigning a query to
on specific User and then walk to all related Users (friends) and then walk
to all friends companies to retrieve name attribute

i.e. High-level query like walking through a graph to go from a user to friends'
company names
query {
	user(id: "23") {
		friends {
			company {
				name
			}
		}
	}
}

- Sample architecture: GraphQL query from web page -> Express/GraphQL Server -> Datastore
  npm install --save express express-graphql graphql lodash

i.e. Registering GraphQL with Express
Express is an HTTP server, processes requests such as GraphQL/others and responses
GraphQL can serve as a proxy to fetch data from many different outside servers/databases

const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

// Middlewares: intercept and modify requests to give responses
app.use('/graphql', expressGraphQL({
	schema,
	graphiql: true
}));

app.listen(4000, () => {
	console.log('Listening');
});

- GraphQL Schemas: tells GraphQL what type of data it's working with and how they're related

i.e. Writing a schema
const graphql = require('graphql');
const _ = require('lodash');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema
} = graphql;

const users = [
	{ id: '23', firstName: 'Bill', age: 20 },
	{ id: '47', firstName: 'Samantha', age: 21 }
];

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt }
	}
});

- Root queries: allows us to jump into graph of data, say to find a user with ID 23, entry point
into our data
- The resolve function goes into the database and finds the user we are looking for to be returned

i.e. Writing a root query to find a user with a certain ID
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return _.find(users, { id: args.id });
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});

i.e. Querying the users with properties you want back (id, age, firstName)
If without arguments, receive an error
{
	user(id: "23") {
		id,
		firstName,
		age
	}
}

// Outputs (returns null if not found)
{
	"data": {
		"user": {
			"id": "23",
			"firstName": "Bill",
			"age": 20
		}
	}
}

i.e. Async resolve
const axios = require('axios');
...

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/users/${args.id}`)
					.then(response => response.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});