// GraphQL and Relay Notes:

/* What problem are we trying to solve with GraphQL? */
// Previously with REST-ful Routing
// - Create, Read, Update, Delete Interfaces and URLs
// i.e. HTTP methods for handling posts
// /posts - POST - Create a new post
// /posts - GET - Fetch all posts
// /posts/14 - GET - Fetch post 14
// /posts/15 - PUT - Update post 15
// /posts/18 - DELETE - Delete post 18

// i.e. Restful conventions
// /<name> - POST/GET
// /<name>/:id - GET/PUT/DELETE

// - Heavily related/nested URLs gets complicated
// such as /users/23/posts/14 - Fetch post 14 of user 23

// i.e. See how complicated it could get to retrieve a user's friends'
// companies and positions
// User -> Company, Position Ids, other User attributes
// /users/23/friends -> to get each friend's position and company from ids
// -> /users/1/companies, /users/1/positions (multiple HTTP requests)

// Also it may return a lot of unnecessary data on the Company/Positions JSON objects
// returned, over-serving data tossed back to client

// - In summary: overfetching data, too many HTTP requests, complicated nested/related
// and lengthy RESTful request URLs


/* What is GraphQL? */
// - Imagine a graph of Users connected to each other and assigning a query to
// on specific User and then walk to all related Users (friends) and then walk
// to all friends companies to retrieve name attribute

// i.e. High-level query like walking through a graph to go from a user to friends'
// company names
query {
	user(id: "23") {
		friends {
			company {
				name
			}
		}
	}
}

// - Sample architecture: GraphQL query from web page -> Express/GraphQL Server -> Datastore
//   npm install --save express express-graphql graphql lodash

// i.e. Registering GraphQL with Express
// Express is an HTTP server, processes requests such as GraphQL/others and responses
// GraphQL can serve as a proxy to fetch data from many different outside servers/databases

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

// - GraphQL Schemas: tells GraphQL what type of data it's working with and how they're related

// i.e. Writing a schema
const graphql = require('graphql');
const _ = require('lodash');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = graphql;

const users = [
	{ id: '23', firstName: 'Bill', age: 20 },
	{ id: '47', firstName: 'Samantha', age: 21 }
];

// Order of definition matters
const CompanyType = new GraphQLObjectType({
	name: 'Company',
	// Circular reference will be undefined since UserType defined below
	// So we need to wrap fields in closure return function to make sure both types load first before
	// loading through fields property in GraphQL
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		// Helps us retrieve list of all users belonging to a specific company
		// like company(id: "2") { ... users { id firstName age } }
		users: {
			type: new GraphQLList(UserType),
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
					.then(response => response.data);
			}
		}
	})
});

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
		company: {
			type: CompanyType,
			// Returns the company associated with the given user
			resolve(parentValue, args) {
				// parentValue is user object that came back
				return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
					.then(res => res.data);
			}
		}
	})
});

// Can query the data like
{
	user(id: "23") {
		firstName
		company {
			id
			name
			description
		}
	}
}

// and get back this response in GraphiQL
{
	"data": {
		"user": {
			"firstName": "Alfred",
			"company": {
				"id": "1",
				"name": "SendGrid",
				"description": "Saas"
			}
		}
	}
}

// Sample flow: Find me a user with ID 23 from the Root Query -> resolve(null { id: 23 })
// -> Goes to User's resolve(user23, {}) to retrieve the Company data for that specific user

// - Root queries: allows us to jump into graph of data, say to find a user with ID 23, entry point
// into our data
// - The resolve function goes into the database and finds the user we are looking for to be returned

// i.e. Writing a root query to find a user with a certain ID
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString }},
			resolve(parentValue, args) {
				return _.find(users, { id: args.id });
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});

// i.e. Querying the users with properties you want back (id, age, firstName)
// If without arguments, receive an error
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

// i.e. Async resolve
const axios = require('axios');
// ...

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		// Look for specific user: user(id: "1") { ... }
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/users/${args.id}`)
					.then(response => response.data);
			}
		},
		// Look for specific company: adding multiple RootQuery entry points so we can do company(id: "23") { name }
		company: {
			type: CompanyType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${args.id}`)
					.then(response => response.data);
			}
		},
		// Bidirectional relation such as finding all users who belong to a specific company
		// like companies/:companyId/users and company(id: "23") { users { ... } }
	}
});

// Mutations to change data (CRUD operations) like addUser and deleteUser
const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		// addUser(firstName: String!, age: Int!, companyId: String): User
		addUser: {
			// Type of data we will eventually return from resolve function
			type: UserType,
			// Data passed into resolve function
			args: {
				// Must provide a firstName and age or else error will be thrown
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				companyId: { type: GraphQLString }
			},
			resolve(parentValue, { firstName, age }) {
				return axios.post(`http://localhost:3000/users`, { firstName, age	})
					.then(response => response.data)
		},
		deleteUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parentValue, { id }) {
				return axios.delete(`http://localhost:3000/users/${id}`)
					.then(response => response.data);
			}
		},
		editUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				firstName: { type: GraphQLString },
				age: { type: GraphQLInt },
				companyId: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				// Put would rewrite everything and set null if not provided all properties
				// so patch would update only specific properties
				return axios.patch(`http://localhost:3000/users/${args.id}`, args)
					.then(response => response.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation
});


// Query gotchas - can name queries something specific
query findCompany {
	company(id: "1") {
		id
		name
		description
		users {
			id
			firstName
			age
		}
	}
}

// Can have multiple queries but need a key
query {
	apple: company(id: "1") {
		id
		name
		description
	}
	google: company(id: "2") {
		id
		name
		description
	}
}

// => outputs this
{
	"data": {
		"apple": {
			"id": "1",
			// ...
		},
		"google": {
			// ...
		}
	}
}

// Query Fragments: a list of different properties you want to get access to
// need to specify which type you are asking properties from
fragment companyDetails on Company {
	id
	name
	description
}

// Can now make a query like this
{
	apple: company(id: "1") {
		...companyDetails
	}
}

// Calling mutations like addUser
mutation {
	addUser(firstName: "Alfred", age: 22) {
		id
		firstName
		age
	}
}

// => outputs 
{
	"data": {
		"addUser": {
			"id": "alfredid",
			"firstName": "Alfred",
			"age": 22
		}
	}
}

// deleteUser
mutation {
	deleteUser(id: "23") {
		id
	}
}

// => outputs
{
	"data": {
		"deleteUser": {
			"id": null
		}
	}
}

// editUser
mutation {
	editUser(id: "40", age: 10) {
		id
		age
		firstName
	}
}

// => outputs
{
	"data": {
		"editUser": {
			"id": "40",
			"age": 10,
			"firstName": "Alex"
		}
	}
}

// GraphQL Express: relatively stable
// colocates all types with resolve logic
const CompanyType = new GraphQLObjectType({
	name: 'Company',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		users: {
			type: new GraphQLList(UserType),
			resolve(parentValue, args) {
				return User.findById(args.id)
			}
		}
	})
});

// Sample Apollo Server: may change API a lot
// breaks apart types and resolvers in separate files
// Types File
type User {
	id: String!
	firstName: String
	age: Int
	company: Company
}

type Company {
	id: String!
	name: String
	employees: [User]
}

// Resolvers File
const resolveFunctions = {
	Query: {
		users() {
			return users;
		}
	}
}

// GraphQL Clients 
// Before we used GraphiQL (GraphQL Query) <-> Express/GraphQL server <-> datastore
// Lokka: basic queries, mutations, simple caching
// Apollo Client: good balance between features and complexity, produced by same guys as MeteorJS
// Relay: amazing performance for mobile, most complex
// Apollo Client Setup: Apollo Provider (wraps our react app, injects data from store to react app, glue layer) 
// -> Apollo Store (stores data on clientside) -> GraphQL server
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import App from './components/App';
import SongList from './components/SongList';
import SongCreate from'./components/SongCreate';

const client = new ApolloClient({});

const Root = () => {
	return (
		<ApolloProvider client={client}>
			<Router history={hashHistory}>
				<Route path="/" component={App}>
					<IndexRoute component={SongList} />
					<Route path="songs/new" component={SongCreate}/>
				</Route>
			</Router>
		</ApolloProvider>
	);
};

ReactDOM.render(
	<Root/>,
	document.querySelector('#root')
);

// SongList.js
// GraphQL + React Strategy:
// Identify the data required, write query in Graphiql (for practice) and in component file
// Bond query + component, access data
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';

class SongList extends Component {
	onSongDelete(id) {
		this.props.mutate({ variables: { id } })
			// Refetching queries to rerender this current component with proper data
			.then(() => this.props.data.refetch());
	}

	renderSongs() {
		// this.props.data.songs.map will be undefined when query first issued and no results back yet and errors
		return this.props.data.songs.map(({ id, title }) => {
			return (
				<li key={id} className="collection-item">
					{title}
					<i 
						className="material-icons"
						onClick={() => this.onSongDelete(id)}
					>
						Delete
					</i>
				</li>
			);
		});
	}

	render() {
		// So check for when the query is loading before mapping through results
		if (this.props.data.loading) { return <div>Loading...</div>; }

		return (
			<div>
			<ul>
				{this.renderSongs()}
			</ul>
			<Link
				to="/songs/new"
				className="btn-floating btn-large red right"
			>
				<i className="material-icons">Add</i>
			</Link>
			</div>
		);
	}
}

// Retrieve all song titles
const query = gql`
	{
		songs {
			id
			title
		}
	}
`;

const mutation = gql`
	mutation DeleteSong($id: ID) {
		deleteSong(id: $id) {
			id
		}
	}
`;

// Executes query when component rendered to the screen
// Component rendered -> query issued -> query complete -> rerender component
// Results of query placed inside the props of the component
// There is a data.loading: true and no songs property until query completed
export default graphql(mutation)(
	graphql(query)(SongList)
);

// App.js
import React from 'react';
import { hashHistory } from 'react-router';

export default ({ children }) => {
	return <div className="container">{children}</div>;
}

// SongCreate.js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import query from './queries';


class SongCreate extends Component {
	constructor(props) {
		super(props);

		this.state = { title: '' }
	}

	onSubmit(event) {
		event.preventDefault();

		// This will call our gql mutation with proper variable passed in
		// need to clear cached queries too to refresh the SongList
		this.props.mutate({
			variables: {
				title: this.state.title
			},
			// Need to refresh fetching of songs to make sure list is updated in UI
			// This updates a different component not associated with this component
			refetchQueries: [{ query }]
		}).then(() => hashHistory.push('/'))
			.catch(() => console.error('Failed to add song'));
	}

	render() {
		return (
			<div>
				<h3>Create a new song</h3>
				<form onSubmit={this.onSubmit.bind(this)}>
					<label>Song Title:</label>
					<input 
						onChange={event => this.setState({ title: event.target.value })}
						value={this.state.title}
					/>
				</form>
			</div>
		);
	}
}

// Can add query parameters/variable to call addSong with proper title
const mutation = gql`
	mutation AddSong($title: String) {
		addSong(title: $title) {
			title
		}
	}
`;

export default graphql(mutation)(SongCreate);

// fetchSong
// export default gql`
// 	query SongQuery($id: ID) {
// 		song(id: $id) {
// 			id
// 			title
// 		}
// 	}
// `;

// SongDetail.js: fetching like songs/:id
// ...
class SongDetail extends Component {
	render() {
		// URI params in props.params
		console.log(this.props);
		return (
			<div>
				<h3>Song Detail</h3>
			</div>
		);
	}
}

// ReactRouter passes props with params of URI id -> graphql (props) -> SongDetail
export default graphql(fetchSong, {
	// props passed into fetchSong query to get the id query param and get specific song details
	options: (props) => { return { variables: { id: props.params.id } } }
})(SongDetail);
