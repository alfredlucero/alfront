/*
 * React: frontend UI framework made by Facebook
 * Elements describe the tree (plain objects describing DOM nodes/components), take in type or props
 * Components encapsulate element trees, can be classes or functions
 * For a React component, props are the input, and an element tree is the output
 * It does a heuristic diffing algorithm to optimize the element trees and rerendering
 * Class components can store local state and perform custom logic when the corresponding
   DOM node is created or destroyed
 * Functional component has a single render() method
 * Can optimize for props that are immutable as well to not rerender those areas
 * Only class components are declared as instances and React creates it for us
 * Props flow from parent to children as the parent component returned an element with its type and props
 * An instance is what you refer to as 'this' in the component class to store local state and react to
   lifecycle events
 * To create elements, use React.createElement(), JSX, or an element factory helper
 * Updates through setState() cause the entire app to re-render or part through reconciling as a tree of nodes 
   that describe the app is generated and saved in memory
 * Pull-based approach for React to make decisions for you for scheduling renders to be implemented in Fiber
   as currently an update results in the entire subtree being re-rendered immediately
 * Fiber is a virtual stack frame and reimplementation of the stack specialized for React components to 
   potentially be used for concurrency or error boundaries
 */


/*
	i.e. Top-down reconciliation from Form -> Button -> 'button' type when calling
	 ReactDOM.render() or setState()
	 - Different component types assumed to generate different trees so replaces the old tree completely
	 - Diffing of lists is performed using keys that should be stable, predictable, and unique
*/

ReactDOM.render({
	type: Form,
	props: {
		isSubmitted: false,
		buttonText: 'OK!'
	}
}, document.getElementById('root'));

/*
	i.e. Setting up the web server
*/
var express = require('express');

// Create our app
var app = express();

app.use(express.static('public'));

app.listen(3000, function() {
	console.log('Express server is up on port 3000');

/*
	i.e. Adding Hello React
	<div id="app"></div>

	// Can also place in app.jsx and put src="app.jsx" in script
	<script type="text/babel">
		ReactDOM.render(
			<h1>Hello React!</h1>,
			document.getElementById('app')
		);
	</script>
	});
*/


/* 
	i.e. Creating React Components
	Use JSX to render in browser
	Pass input data through props/attributes on the components
	Every component needs a render function
*/
var Greeter = React.createClass({
	// Expects to return JSX to render in browser
	render: function() {
		return (
			<div>
				<h1>Hello React!</h1>
			</div>
		);
	}
});

ReactDOM.render(
	// Props = input data into components through HTML attributes
	<Greeter/>,
	document.getElementById('app')
);

// JSX Translation into ES5
'use strict';
var Greeter = React.createClass({
	displayName: 'Greeter',

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'h1',
				null,
				'Hello React!'
			)
		);
	}
});

ReactDom.render(React.createElement(Greeter, null), document.getElementById('app'));

/* 
	Using props to pass in data, props cannot be updated
	i.e. <Greeter name="Alfred"/>
*/
var Greeter = React.createClass({
	// Defaults if data not provided
	getDefaultProps: function() {
		return {
			name: 'React'
		};
	},

	render: function() {
		// Access props passed in from this.props
		var name = this.props.name;

		return (
			<div>
				<h1>Hello {name}!</h1>
				<p>We are learning!</p>
			</div>
		);
	}
});

ReactDOM.render(
	// Setting props through attributes
	<Greeter name="Alfred"/>,
	document.getElementById('app')
);


/*
	User events & callbacks
	
	Can provide callbacks for submit, click, etc.
	Props get passed into component as you initialize it, not updated
	State is internally maintained and updated by the component
*/
var Greeter = React.createClass({
	getDefaultProps: function() {
		name: 'React',
		message: 'This is the default message'
	},

	getInitialState: function() {
		return {
			name: this.props.name;
		};
	},

	// On submit event for the form, set the name properly and alert it
	onButtonClick: function() {
		// Prevents page from submitting and doing page refresh
		e.preventDefault();

		var nameRef = this.refs.name;
		var name = nameRef.value;

		// Empty out the input text 
		nameRef.value = '';

		if (typeof name === 'string' && name.length > 0) {
			// Can only set the state using setState({ ... })
			this.setState({
				name: name
			});
		}
	},

	render: function() {
		var name = this.state.name;
		var message = this.props.message;

		return (
			<div>
				<h1>Hello {name}!</h1>
				<p>{message + '!!'}</p>

				<form onSubmit={this.onButtonClick}>
					<input type="text" ref="name" />
					<button>Set Name</button>
				</form>
			</div>
		);
	}
});

ReactDOM.render(
	<Greeter name="Regine"/>,
	document.getElementById('app')
);

/*	
	Nested Components

	Container/class components contain state and render children
	Functional components just render to the browser and take in props
	Can pass functions through props to children 
*/
// Just takes in props and renders the message, still presentational only
var GreeterMessage = React.createClass({
	render: function() {
		var name = this.props.name;
		var message = this.props.message;

		return (
			<div>
				<h1>Hello {name}!</h1>
				<p>Message: {message}</p>
			</div>
		);
	}
});


// Takes in handleNewName function as props, still presentational only
var GreeterForm = React.createClass({
	onFormSubmit: function(e) {
		e.preventDefault();

		var name = this.refs.name.value;

		if (name.length > 0) {
			this.refs.name.value = '';
			// Pass the name to the function passed through the props from parent component
			this.props.onNewName(name);
		}
	},
	render: function() {
		<form onSubmit={this.onFormSubmit}>
			<input type="text" ref="name" />
			<button>Set Name</button>
		</form>
	}
});

// Maintains name state and sets it on valid form submission
var Greeter = React.createClass({
	getDefaultProps: function() {
		name: 'Regine',
		message: 'Hello darkness my old friend'
	},

	getInitialState: function() {
		return {
			name: this.props.name;
		};
	},

	// On new name retrieved from child component form, set the name in state
	// State takes in an object with as many properties to watch
	handleNewName: function() {
		this.setState({
			name: name
		});
	},

	render: function() {
		var name = this.state.name;
		var message = this.props.message;

		return (
			<div>
				<GreeterMessage name={name} message={message}/>
				<GreeterForm onNewName={this.handleNewName}/>
			</div>
		);
	}
});

ReactDOM.render(
	<Greeter name="Regine"/>,
	document.getElementById('app')
);






