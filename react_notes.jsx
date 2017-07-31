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

/* Using props to pass in data */
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


