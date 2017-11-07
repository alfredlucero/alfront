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
 * Tips and tricks for scaling React applications: directory structure by feature
 * for containers (stateful) and components (stateless) with actions, constants, reducers
 * - Can colocate the styles of component in their folder (CSS modules), call require/import and assign JSX tag a className
 * i.e. var styles = require('./styles.css'); <div className={styles.button}></div>
 * - To handle inherited styles such as line-height, can use reset style sheet such as Reset CSS, Normalize.css, sanitize.css
 * or we can have a reset for every component such as PostCSS Auto Reset (sets inherited properties to default values)
 * - Handle data-fetching with Redux Thunk but tough to test in actions or one can use redux-saga,
 * which utilizes Esnext generator functions to make async code look sync (like a separate thread)
 * don't need to mock anything or rely on network and just call gen.next() to move to next point
 * and we colocate the test files in the same folder too
 * - When you want to aggregate data form multiple children or to have two child components communicate with each other,
 * move the state upwards so that it lives in the parent component. The parent can then pass the state back down to the children via props,
 * so that the child components are always in sync with each other and with the parent
 * - Often pass a function down from the parent to the children so that a change in the children calls the parent function,
 * and the children receive the function through props and the parent function alters the state (controlled components)
 * - on* names for the handler prop names and handle* for their implementations
 * - usually do state/data change without mutation such as Object.assign({}, state, { newState: 'hello' }); or array.slice();
 * - map over arrays of items to render and use a key so React could identify each component and render changes
 * i.e. <li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
 */

 // Sample Structure of a Feature like navigation bar
 // Navbar - index.js (actual component), actions.js, constants.js, reducer.js, test -> actions.test.js, reducer.test.js

// Sample Functional Component
function Square(props) {
 	return (
 		<button className="square" onClick={props.onClick}>
 			{props.value}
 		</button>
 	);
}

// Sample Class Component
class Square extends React.Component {
	constructor() {
		super();
		this.state = {
			value: null
		};
	}

	render() {
		return (
			<button className="square" onClick={() => alert('click')}>
				{this.props.value}
			</button>
		);
	}
}

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

/*
	Setup:

	React:
	- npm install --save react@X.X.X react-dom@X.X.X
	
	Webpack: bundler, code splitting, optimizing builds
	- bundle third party dependencies like react, react-dom, babel, application code
	- break components into separate files, npm install -g webpack@X.X.X
	- i.e. webpack ./public/app.js ./
	Babel: Transpiler for JSX/ES6 features to browser compatible ES5
	- npm install --save-dev webpack@X.X.X babel-core@X.X.X babel-loader@X.X.X babel-preset-es2015@X.X.X
	- babel-preset-react@X.X.X (development dependencies only required locally)
	- webpack -w: listens for changes and automatically rebundles on changes
*/

// Gotta include bundle.js in index.html made from Webpack
// <script src="bundle.js"></script>
// Need to specify a config file to specify plugins like babel
// Sample webpack.config.js and just run webpack
module.exports = {
	// Entry point
	entry: './public/app.js',
	output: {
		path: __dirname // Path to the current folder,
		filename: './public/bundle.js'
	},
	resolve: {
		root: __dirname,
		// So you can just do require('Greeter')
		alias: {
			Greeter: 'public/components/Greeter.jsx'
		},
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
			{
				// Babel parses through react and run through es2015
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015']
				},
				test: /\.jsx?$/, // Check for jsx files
				exclude: /(node_modules|bower_components)/ // Babel ignores this
			}
		]
	}
};

// Sample setup of components
// Import it elsewhere like import GreeterMessage = require('./components/GreeterMessage');
var React = require('react');

var GreeterMessage = React.createClass({
	render: function() {
		return (
			<h1>Greetings!</h1>
		);
	}
});

module.exports = GreeterMessage;


/*
	React-router: to handle routing from page to page in SPA
*/
// Sample Main component
var React = require('react');
var Nav = require('Nav');

var Main = React.createClass({
	render: function() {
		return (
			<div>
				<Nav/>
				<h2>Main Component</h2>
				{this.props.children}
			</div>
		);
	}
});

module.exports = Main;

// Sample Nav
// Can add custom styles and classes to it, camelcase properties
// Differentiate which link is active and styling
// IndexLink so that other links aren't labeled as active too
var React = require('react');
var { Link, IndexLink } = require('react-router');

var Nav = React.createClass({
	render: function() {
		return (
			<div>
				<h2>Nav Component</h2>
				<IndexLink to="/" activeClassName="active" activeStyle={{ fontWeight: 'bold' }}>Get Weather</IndexLink>
				<Link to="/about" activeClassName="active">About</Link>
			</div>
		);
	}
});

module.exports = Nav;


var React = require('react');
var ReactDOM = require('react-dom');
var { Route, Router, IndexRoute, hashHistory } = require('react-router');
var Main = require('Main');
var About = require('About');

// Handle main and navigation, always rendered
// /about loads this
// Weather displayed as child to Main, shown when / only
ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Main}> 
			<Route path="about" component={About}/>
			<IndexRoute component={Weather}/> 
		</Route>
	</Router>,
	document.getElementById('app')
);

// Sample Form Submit
var React = require('react');

// Going to be instantiated like <WeatherForm onSearch={this.handleSearch}/>
var WeatherForm = React.createClass({
	onFormSubmit: function(e) {
		// Prevents entire page from reloading on submit
		e.preventDefault();

		var location = this.refs.location.value;

		if (location.length > 0) {
			this.refs.location.value = '';
			this.props.onSearch(location);
		}
	},
	render: function() {
		return (
			<div>
				<form onSubmit={this.onFormSubmit}>
					<input type="text" ref="location"/>
					<button>Get Weather</button>
				</form>
			</div>
		);
	}
});

module.exports = WeatherForm;

var Weather = React.createClass({
	getInitialState: function() {
		return {
			location: 'Miami',
			temp: 88,
			isLoading: false
		};
	},
	handleSearch: function(location) {
		var that = this;

		this.setState({ isLoading: true });

		openWeatherMap.getTemp(location).then(function(temp) {
			// Going to need to pass new location and temp into weather message
			that.setState({
				location: location,
				temp: temp,
				isLoading: false
			});
		}, function(errorMessage) {
			that.setState({ isLoading: false });
			alert(errorMessage);
		})
	},
	render: function() {
		var { isLoading, temp, location } = this.state;

		// Can add conditions by moving it to nested function for rendering logic
		// such as for loading state as request is sent out
		function renderMessage() {
			if (isLoading) {
				return <h3>Fetching weather...</h3>;
			} else if (temp && location) {
				return <WeatherMessage temp={temp} location={location}/>;
			}
		}

		return (
			<div>
				<h3>Weather Component</h3>
				<WeatherForm onSearch={this.handleSearch}/>
				{renderMessage()}
			</div>
		);
	}
});

var React = require('react');

var WeatherMessage = React.createClass({
	render: function() {
		var { temp, location } = this.props;
		return (
			<h3>It's {temp} in {location}</h3>
		);
	}
});

module.exports = WeatherMessage;

// Sample Axios request
var axios = require('axios');

const OPEN_WEATHER_MAP_URL = 'sample api key URI';

module.exports = {
	getTemp: function(location) {
		var encodedLocation = encodeURIComponent(location);
		var requestUrl = `${OPEN_WEATHER_MAP_URL}&q=${encodedLocation}`;

		axios.get(requestUrl).then(function(res) {
			if (res.data.cod && res.data.message) {
				throw new Error(res.data.message);
			} else {
				return res.data.main.temp;
			}
		}, function(res) {
			throw new Error(res.data.message);
		});
	}
};

/*
	Get Chrome extension for React Developer Tools, Redux Developer tools
	- Can see props and state going on, component hierarchy
	- $r accesses the component you're focusing to see props/refs/state
	- can source map by setting "devtool" property in webpack.config.js
	that is set to "inline-source-map" or "eval-source-map"
	- can type debugger; in your js and source map to see original code
*/

/*
	Functional Stateless Components
	- only define render method and no state
*/
var React = require('react');

var About = (props) => {
	return (
		<h3>About Component</h3>
	);
};

module.exports = About;

// Can easily refactor stateless components like this
var React = require('react');

var WeatherMessage = ({ temp, location }) => {
	return (
		<h3>It's {temp} degrees in {location}.</h3>
	);
};

module.exports = WeatherMessage;

/*
	Handle data-fetching with redux-saga (generators, testable) rather than redux-thunk (tough to test)
	put() dispatches an action from saga
 	take() pauses our sage until an action happens
 	select() gets a part of the redux state like mapStateToProps
 	call() calls function passed as first arg with remaining arguments
	- components now decoupled
*/
import { call, take, put } from 'redux-saga/effects';
function* fetchData() {
	yield take(FETCH_DATA); // wait until FETCH_DATA action happens
	var data = yield call(fetch, 'sample.com/endpoint'); // fetch from server
	put(dataLoaded(data)); // dispatch dataLoaded action with returned data
}

var sagaGenerator = fetchData();
// No need to mock out anything or rely on network
// .next() moves on to the next yield point
describe('fetchData saga', function() {
	it('should wait for the FETCH_DATA action', function() {
		expect(sagaGenerator.next()).to.equal(take(FETCH_DATA));
	});

	it('should fetch the data from the server', function() {
		expect(sagaGenerator.next()).to.equal(call(fetch, 'sample.com/endpoint'));
	});

	it('should dispatch the dataLoaded action when the data has loaded', function() {
		expect(sagaGenerator.next()).to.equal(put(dataLoaded()));
	});
});

// Sample Clock and Timer decoupled with redux-saga
// Clock.jsx
import { startButtonClicked } from '../Clock/actions';

class Clock extends React.Component {
	render: function() {
		return <button onClick={this.props.dispatch(startButtonClicked())}/>;
	}
}

// Timer.jsx
import { stopButtonClicked } from '../Timer/actions';

class Timer extends React.Component {
	render: function() {
		<button onClick={this.props.dispatch(stopButtonClicked(currentTime))}/>
	}
}

// sagas.js
import { call, take, put, select } from 'redux-saga/effects';

import { showTime } from '../Clock/actions';
import { START_BUTTON_CLICKED } from '../Clocks/constants';
import { startTimer } from '../Timer/actions';
import { STOP_BUTTON_CLICKED } from '../Timer/constants';

function* clockAndTimer() {
	// Wait for startButtonClicked actions of the Clock to be dispatched
	yield take(START_BUTTON_CLICKED);

	// When that happens, start the timer
	put(startTimer());

	// Then, wait for the stopButtonClick action of the Timer to be dispatched
	yield(STOP_BUTTON_CLICKED);

	// Get the current time of the timer from the global state
	var currentTime = select(function(state) {
		return state.timer.currentTime; 
	});

	// And show the time on the clock
	put(showTime(currentTime));
}

// Sample ErrorModal with Foundation
// css! loader and then put css on html with style!
// in app.jsx: require('style!css!foundation...') and require('style!css!sass!applicationStyles')
var React = require('react');

var ErrorModal = React.createClass({
	getDefaultProps: function() {
		return {
			title: 'Error'
		};
	},
	propTypes: {
		title: React.PropTypes.string,
		message: React.PropTypes.string.isRequired
	},
	componentDidMount: function() {
		var modal = new Foundation.Reveal($('#error-modal'));
		modal.open();
	},
	render: function() {
		var { title, message } = this.props;

		return (
			<div id="error-modal" className="reveal tiny text-center" data-reveal="">
				<h4>{title}</h4>
				<p>{message}</p>
				<p>
					<button className="button hollow" data-close="">
					Okay
					</button>
				</p>
			</div>
		);
	}
});

// Sample Navigation with Foundation
// Can import multiple files for styles for the components
// root app.scss to load in the other files that do the work
// base folder to have files such as _variables.scss
// and components folder to have files such as _navigation.scss - partials to be imported
// i.e. @import "base/variables" and @import "components/navigation"
var React = require('react');
var { Link, IndexLink } = require('react-router');

var Navigation = () => {
	return (
		<div className="top-bar">
			<div className="top-bar-left">
				<ul className="menu">
					<li className="menu-text">
						React Timer App
					</li>
					<li>
						<IndexLink to="/" activeClassName="active-link">Timer</IndexLink>
					</li>
					<li>
						<Link to="/" activeClassName="active-link">Countdown</Link>
					</li>
				</ul>
			</div>
			<div className="top-bar-right">
				<ul className="menu">
					<li className="menu-text">
						Created by <a href="#" target="_blank">Alfred Lucero</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

module.exports = Navigation;

/*
	Testing with webpack and React
	- Karma test runner - npm install karma karma-mocha karma-chrome-launcher karma-sourcemap-loader karma-webpack
	- Mocha testing framework like the describe/it
	- expect assertion library like toBe, toBeA
*/
// karma.conf.js
// run karma start
var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
	config.set({
		browsers: ['Chrome'],
		singleRun: true,
		frameworks: ['mocha'],
		files: ['app/tests/**/*.test.jsx'],
		preprocessors: {
			'app/tests/**/*.txt.jsx': ['webpack', 'sourcemap']
		},
		reporters: ['mocha'],
		client: {
			mocha: {
				timeout: '5000'
			}
		},
		webpack: webpackConfig,
		webpackServer: {
			noInfo: true
		}
	});
};

// app.test.jsx
var expect = require('expect');

describe('App', () => {
	it('should properly run tests', () => {
		expect(1).toBe(1);
	});
});

// Sample Clock.test.jsx
var React = require('react');
var ReactDOM = require('react-dom');
var expect = require('expect');
var $ = require('jQuery');
var TestUtils = require('react-addons-test-utils');

var Clock = require('Clock');

describe('Clock', () => {
	it('should exist', () => {
		expect(Clock).toExist();
	});

	describe('render', () => {
		it('should render clock to output', () => {
			var clock = TestUtils.renderIntoDocument(<Clock totalSeconds={62}/>);
			var $el = $(ReactDOM.findDOMNode(clock));
			var actualText = $el.find('.clock-text').text();

			expect(actualText).toBe('01:02');
		});
	});

	describe('formatSeconds', () => {
		it('should format seconds', () => {
			var clock = TestUtils.renderIntoDocument(<Clock/>);
			var seconds = 615;
			var expected = '10:15';
			var actual = clock.formatSeconds(seconds);

			expect(actual).toBe(expected);
		});

		it('should format seconds when min/sec are less than 10', () => {
			var clock = TestUtils.renderIntoDocument(<Clock/>);
			var seconds = 61;
			var expected = '01:01';
			var actual = clock.formatSeconds(seconds);

			expect(actual).toBe(expected);
		});
	});
});

// Sample Clock.jsx
var React = require('react');

var Clock = React.createClass({
	getDefaultProps: function() {
		totalSeconds: 0
	},
	propTypes: {
		totalSeconds: React.PropTypes.number
	},
	formatSeconds: function(totalSeconds) {
		var seconds = totalSeconds % 60;
		var minutes = Math.floor(totalSeconds / 60);

		if (seconds < 10) {
			seconds = '0' + seconds;
		}

		if (minutes < 10) {
			minutes = '0' + minutes;
		}

		return minutes + ':' + seconds;
	},
	render: function() {
		var { totalSeconds } = this.props;

		return (
			<div className="clock">
				<span className="clock-text">
					{this.formatSeconds(totalSeconds)}
				</span>
			</div>
		);
	}
});

module.exports = Clock;

// Sample Countdown.jsx
var React = require('react');
var Clock = require('Clock');
var CountdownForm = require('CountdownForm');
var Controls = require('Controls');

var Countdown = React.createClass({
	getInitialState: function() {
		return { 
			count: 0,
			countdownStatus: 'stopped'
		};
	},
	// Called everytime state/props updated
	componentDidUpdate: function(prevProps, prevState) {
		if (this.state.countdownStatus !== prevState.countdownStatus) {
			switch (this.state.countdownStatus) {
				case 'started':
					this.startTimer();
					break;
				case 'stopped':
					this.setState({ count: 0 });
				case 'paused':
					clearInterval(this.timer);
					this.timer = undefined;
					break;
			}
		}
	},
	componentWillUnmount: function() {
		clearInterval(this.timer);
		this.timer = undefined;
	},
	startTimer: function() {
		this.timer = setInterval(() => {
			var newCount = this.state.count - 1;
			this.setState({
				count: newCount >= 0 ? newCount : 0
			});

			if (newCount === 0) {
				this.setState({ countdownStatus: 'stopped' });
			}
		}, 1000)
	},
	handleSetCountdown: function(seconds) {
		this.setState({
			count: seconds,
			countdownStatus: 'started'
		});
	},
	handleStatusChange: function(newStatus) {
		this.setState({ countdownStatus: newStatus });
	},
	render: function() {
		var { count, countdownStatus } = this.state;
		var renderControlArea = () => {
			if (countdownStatus !== 'stopped') {
				return <Controls countdownStatus={countdownStatus} onStatusChange={this.handleStatusChange}/>;
			} else {
				return <CountdownForm onSetCountdown={this.handleSetCountdown}/>;
			}
		};

		return (
			<div>
				<Clock totalSeconds={count}/>
				{renderControlArea()}
			</div>
		);
	}
});

// Sample Countdown.test.jsx
var React = require('react');
var ReactDOM = require('react-dom');
var expect = require('expect');
var $ = require('jQuery');
var TestUtils = require('react-addons-test-utils');

var Countdown = require('Countdown');

describe('Countdown', () => {
	it('should exist', () => {
		expect(Countdown).toExist();
	});


	describe('handleSetCountdown', () => {
		it('should set state to started and countdown', (done) => {
			var countdown = TestUtils.renderIntoDocument(<Countdown/>);
			countdown.handleSetCountdown(10);

			expect(countdown.state.count).toBe(10);
			expect(countdown.state.countdownStatus).toBe('started');

			setTimeout(() => {
				expect(countdown.state.count).toBe(9);
				done();
			}, 1001)
		});

		it('should never set count less than zero', (done) => {
			var countdown = TestUtils.renderIntoDocument(<Countdown/>);
			countdown.handleSetCountdown(1);

			setTimeout(() => {
				expect(countdown.state.count).toBe(0);
				done();
			}, 2001)
		});

		it('should pause countdown on paused status', (done) => {
			var countdown = TestUtils.renderIntoDocument(<Countdown/>);
			countdown.handleSetCountdown(3);
			countdown.handleStatusChange('paused');

			setTimeout(() => {
				expect(countdown.state.count).toBe(3);
				expect(countdown.state.countdownStatus).toBe('paused');
				// Need to call done because asynchronous timeout
				done();
			}, 1001);
		});

		it('should reset on stopped status', (done) => {
			var countdown = TestUtils.renderIntoDocument(<Countdown/>);
			countdown.handleSetCountdown(2);
			countdown.handleStatusChange('stopped');

			setTimeout(() => {
				expect(countdown.state.count).toBe(0);
				expect(countdown.state.countdownStatus).toBe('stopped');
			}, 1001);
		});
	});
});


// Sample CountdownForm.jsx
var React = require('react');

var CountDownForm = React.createClass({
	onSubmit: function(e) {
		e.preventDefault();
		var strSeconds = this.refs.seconds.value;

		if (strSeconds.match(/^[0-9]*$/)) {
			this.refs.seconds.value = '';
			this.props.onSetCountdown(parseInt(strSeconds, 10));
		},
		render: function() {
			return (
				<div>
					<form ref="form" onSubmit={this.onSubmit} className="countdown-form">
						<input type="text" ref="seconds" placeholder="Enter time in seconds"/>
						<button className="button expanded">Start</button>
					</form>
				</div>
			);
		}
	}
});

module.exports = CountdownForm;

// Sample CountdownForm.test.jsx using spies
// Spies created by expect library and can assert what function was called and if it was called
// i.e. expect(spy).toHaveBeenCalled([message]), expect(spy).toNotHaveBeenCalled([message])
// i.e. expect(spy).toHaveBeenCalledWith('foo', 'bar');
var expect = require('expect');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var $ = require('jQuery');

var CountdownForm = require('CountdownForm');

describe('CountdownForm', () => {
	it('should exist', () => {
		expect(CountdownForm).toExist();
	});

	it('should call onSetCountdown if valid seconds entered', () => {
		var spy = expect.createSpy();
		var countdownForm = TestUtils.renderIntoDocument(<CountdownForm onSetCountdown={spy}/>);
		var $el = $(ReactDOM.findDOMNode(countdownForm));

		countdownForm.refs.seconds.value = '109';
		TestUtils.Simulate.submit($el.find('form')[0]);

		expect(spy).toHaveBeenCalledWith(109);
	});

	it('should not call onSetCountdown if invalid seconds entered', () => {
		var spy = expect.createSpy();
		var countdownForm = TestUtils.renderIntoDocument(<CountdownForm onSetCountdown={spy}/>);
		var $el = $(ReactDOM.findDOMNode(countdownForm));

		countdownForm.refs.seconds.value = 'invalid seconds';
		TestUtils.Simulate.submit($el.find('form')[0]);

		expect(spy).toNotHaveBeenCalled();
	});
});

// Sample Controls.jsx
var React = require('react');

var Controls = React.createClass({
	propTypes: {
		countdownStatus: React.PropTypes.string.isRequired,
		onStatusChange: React.PropTypes.func.isRequired
	},
	// Currying pattern: using a function to generate a different function that onClick calls passed by the parent via props
	onStatusChange: function(newStatus) {
		return () => {
			this.props.onStatusChange(newStatus);
		}
	},
	render: function() {
		var { countdownStatus } = this.props;
		var renderStartStopButton = () => {
			if (countdownStatus === 'started') {
				return <button className="button secondary" onClick={this.onStatusChange('paused')}>Pause</button>
			} else if (countdownStatus === 'paused') {
				return <button className="button primary" onClick={this.onStatusChange('started')}>Start</button>;
			}
		};

		return (
			<div className="controls">
				{renderStartStopButton()}
				<button className="button alert hollow" onClick={this.onStatusChange('stopped')}>Clear</button>
			</div>
		);
	}
});

module.exports = Control;

// Sample Controls.test.jsx
var expect = require('expect');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var $ = require('jQuery');

var Controls = require('Controls');

describe('Controls', () => {
	it('should exist', () => {
		expect(Controls).toExist();
	});

	describe('render', () => {
		it('should render pause when started', () => {
			var controls = TestUtils.renderIntoDocument(<Controls countdownStatus="started"/>);
			var $el = $(ReactDOM.findDOMNode(controls));
			var $pauseButton = $el.find('button:contains(Pause)');

			expect($pauseButton.length).toBe(1);
		});

		it('should render start when paused', () => {
			var controls = TestUtils.renderIntoDocument(<Controls countdownStatus="paused"/>);
			var $el = $(ReactDOM.findDOMNode(controls));
			var $startButton = $el.find('button:contains(Start)');

			expect($startButton.length).toBe(1);
		});
	});
});


/*
	Component Lifecycle
	- componentWillUpdate(nextProps, nextState): takes the next props and next state
	- componentDidUpdate(prevProps, prevState): whenever state/props change
	- componentWillUnmount: happens before removing component from DOM
	- componentWillMount: called just before component shown on the screen, no access to refs/DOM
	- componentDidMount: after rendering to DOM, access to all refs
	- componentWillReceiveProps(newProps): 
	- componentWillMount, componentDidMount, componentWillUnmount
*/

// Sample TodoList
var React = require('react');
var Todo = require('Todo');

// Takes in list of todos object with id for key and other properties to pass
// down as props to todo
var TodoList = React.createClass({
	render: function() {
		var { todos } = this.props;
		var renderTodos = () => {
			return todos.map((todo) => {
				// Spread property lets us spread each object property on todo
				// down as a prop to the Todo component
				return (
					<Todo key={todo.id} {...todo} />
				);
			});
		};

		return (
			<div>
				{renderTodos()}
			</div>
		);
	}
});

module.exports = TodoList;

// Sample Todo, takes in props with text to render
var React = require('react');

var Todo = React.createClass({
	render: function() {
		var { text } = this.props;

		return (
			<div>
				{text}
			</div>
		);
	}
});

module.exports = Todo;

// Sample TodoList.test.jsx
// Can npm install node-uuid to take advantage of universally unique ids
// like uuid() for the id property of the todos
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var expect = require('expect');
var $ = require('jquery');

var TodoList = require('TodoList');
var Todo = require('Todo');

describe('TodoList', () => {
	it('should exist', () => {
		expect(TodoList).toExist();
	});

	it('should render on Todo component for each todo item', () => {
		var todos = [
			{
				id: 1,
				text: 'Hello'
			},
			{
				id: 2,
				text: 'Darkness'
			}
		];

		var todoList = TestUtils.renderIntoDocument(<TodoList todos={todos}/>);
		// This finds all instances of components with type equal to componentClass
		var todosComponents = TestUtils.scryRenderedComponentsWithType(todoList, Todo);

		expect(todosComponents.length).toBe(todos.length);
	});
});

// Sample TodoApp.test.jsx
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var expect = require('expect');
var $ = require('jquery');

var TodoApp = require('TodoApp');

describe('TodoApp', () => {
	it('should exist', () => {
		expect(TodoApp).toExist();
	});

	it('should add todo to the todos state on handleAddTodo', () => {
		var todoText = 'test text';
		var todoApp = TestUtils.renderIntoDocument(<TodoApp/>);

		todoApp.setState({ todos: [] });
		todoApp.handleAddTodo(todoText);

		expect(todoApp.state.todos[0].text).toBe(todoText);
	});
});

// Saving to localStorage and using componentDidUpdate to 
// retrieve your localStorage state and set state to keep
// state after refreshing the browser
var $ = require('jquery');

module.exports = {
	setTodos: function() {
		if ($.isArray(todos)) {
			localStorage.setItem('todos', JSON.stringify(todos));
		}
	},
	getTodos: function() {
		var stringTodos = localStorage.getItem('todos');
		var todos = [];

		try {
			todos = JSON.parse(stringTodos);
		} catch (e) {

		}

		return $.isArray(todos) ? todos : [];
	}
};

// Can use moment.js for time formatting given unix timestamp
// i.e. moment.unix(timestamp).format('MMM Do YYYY @ h:mm a');

// ES6 Classes and React
import React from 'react';

class ComponentOne extends React.Component {
	// New way to set initial state
	constructor(props) {
		super(props);
		this.state = {
			count: props.count
		};

		// Set the binding for this context here in constructor or in props
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.setState({
			count: this.state.count + 1
		});
	}

	render() {
		return (
			<div>
				<h3>Component One Using React.Component</h3>
				<h4>{this.state.count} woes!</h4>
				<button className="button" onClick={this.onClick}>Count + 1</button>
			</div>
		);
	}
}

ComponentOne.defaultProps = {
	count: 121
};

ComponentOne.propTypes = {
	count: React.PropTypes.number
};

export default ComponentOne;

// Higher order functions: takes function as argument and returns function
// Function that modifies the behavior of another function
var add = (a, b) => a + b;

var callAndLog = (func) => {
	return function() {
		var res = func.apply(undefined, arguments);
		console.log('Result is ' + res);
		return res;
	};
};

var addAndLog = callAndLog(add);
addAndLog(44, -3);

// Higher order components: passing in component into another component
// like connect({ ... })(Component)
var isAdmin = false;
var adminComponent = (Component) => {
	return class Admin extends React.Component {
		render() {
			if (isAdmin) {
				// Passes props from component argument
				// can also do {super.render()} if extends Component
				return (
					<div>
						<Component {...this.props}/>
					</div>
				);
			} else {
				return null;
			}
		}
	}
}

export default adminComponent(ComponentOne);

// Styled components
// i.e. Button.jsx -> building small components to edit and only
// need to pass down primary in props and not know the class implementation
// and one file to change
// - should split container and presentational components
// - have single-use class names
// - remove the mapping between styles and components and writing CSS in JS
// - takes advantage of tagged template literals and call functions with backticks 
// like styled.h1``
// - themes, passing in props, extending styles, keyframes animations, media templates, refs, etc.
function Button(props) {
	const className = `btn${props.primary ? ' btn--primary' : ''}`;
	return (
		<button className={className}>{props.children}</button>
	);
}

// <Button primary/>
const Button = styled.button`
	font-size: ${props => props.primary ? '2em' : '1em'};
`;

// Basic example of styled components
// styled.h1 call returns a React component that has the styles applied that you pass to
// the template literal
const Title = styled.h1`
	color: palevioletred;
	font-size: 1.5em;
	text-align: center;
`;

<Wrapper>
	<Title>Hello World, this is my first styled component!</Title>
</Wrapper>

// Sample tagged template literal
// It actually passes in the function rather than to-Stringify if passed in like (...)
const favoriteFood = 'pizza'
// -> ["I like ", "."] "pizza"
logArgs`I like ${favoriteFood}`

// For example, execFuncArgs gets passed the actual function and executes it
// styled-components at render time passes the props into all interpolated functions to allow
// users to change the styling based on the props
// -> Executed!
// execFuncArgs`Hi, ${() => { console.log('Executed!') }`

// // There is full CSS support and it generates a class name and injects CSS into the DOM
// // styled.input()
// const Input = styled.input`
// 	font-size: 1.25em;
// 	border: none;
// 	background: papayawhip;
// 	/* ... more styles here ... */

// 	&:hover {
// 		box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1);
// 	}

// 	@media (min-width: 650px) {
// 		font-size: 1.5em;
// 	}
// `;

// const Button = styled.button`
// 	border-radius: 3px;
// 	padding: 0.25 em 1em;
// 	margin: 0 1em;
// 	background: transparent;
// 	color: palevioletred;
// 	border: 2px solid palevioletred;

// 	${props => props.primary && css`
// 		background: palevioletred;
// 		color: white;
// 	`}
// `;



// React Documentation Notes //
// Introducing JSX:
// syntax extension to JS, produces React "elements"
// prevents injection attacks (XSS) as ReactDOM escapes any values embedded in JSX before rendering them (converted to string)
// Babel compiles JSX down to React.createElement() calls, React reads these objects to construct the DOM
const element = <h1>Hello, world!</h1>
const sameElement = React.createElement(
	'h1',
	'Hello, world!'
);
const elementObject = {
	type: 'h1',
	props: {
		children: 'Hello, world!'
	}
};
// can embed any JS expression in JSX
// after compilation, JSX expressions become regular JS objects
// can specify attributes with JS expression/string literals (don't put quotes around curly braces when embedding)
// use camelCase for attribute names like className or tabIndex
function formatName(user) {
	return user.firstName + ' ' + user.lastName;
}

const user = { firstName: 'Alfred', lastName: 'Lucero' };
const embedElement = <h2>{formatName(user)}</h2>;
ReactDOM.render(
	embedElement,
	document.getElementById('root')
);

// Rendering Elements
// - elements are plain objects
// - React DOM takes care of updating DOM to match React elements
// - integrating React into an existing app you may have as many isolated root DOM nodes as you like
// - elements are immutable, can't change its children or attributes once created, represents UI at certain point in time
// - most apps only call ReactDOM.render() once, compares element and its children to previous one and only applies
// DOM updates necessary to bring DOM to desired state
const element = <h1>Hello, world</h1>;
ReactDOM.render(
	element,
	document.getElementById('root')
);

// Components and Props
// - Components: let you split UI into independent, reusable pieces, and think about each piece in isolation
// - like js functions that accept arbitrary inputs  called props and return React elements describing what should appean on screen
// - typically have one App components and rest underneath
// Functional Components
function Welcome(props) {
	return <h1>Hello, {props.name}</h1>;
}
// Class component
class Welcome extends React.Component {
	render() {
		return <h1>Hello, {this.props.name}</h1>;
	}
}
// Usage
<Welcome name="Alfred" />;

// Breaking up components into smaller ones
// Before sample Comment component
function Comment(props) {
	return (
		<div className="Comment">
			<div classNaem="UserInfo">
				<img className="Avatar"
					src={props.author.avatarUrl}
					alt={props.author.name}
				/>
				<div className="UserInfo-name">
					{props.author.name}
				</div>
			</div>
			<div className="Comment-text">
				{props.text}
			</div>
			<div>
				{formatDate(props.date)}
			</div>
		</div>
	);
}
// Splitting it up like; name props from the component's own point of view
// i.e. Avatar, Button, Panel, App, FeedStory, Comment
function Avatar(props) {
	return (
		<img className="Avatar"
			src={props.user.avatarUrl}
			alt={props.user.name}
		/>
	);
}
function UserInfo(props) {
	return (
		<div className="UserInfo">
			<Avatar user={props.user} />
			<div className="UserInfo-name">
				{props.user.name}
			</div>
		</div>
	)
}
// Props are read-only when declaring component as function or a class, "pure"
// as they don't attempt to change their inputs and always return same result
// - all React components must act like pure functions with respect to their props
// - state allows components to change their output over time in response to user actions,
// network responses, etc.

// State and Lifecycle
// - state is private and fully controlled by the component
// - local state only available to classes
// - lifecycle hooks
// - if you don't use something in render(), it shouldn't be in state
// - don't modify state directly, the only place where you can assign this.state is the constructor
// - state updates may be asynchronous
// - state updates are merged upon calling setState() - merges the object you provide into the current state
class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.state = { date: new Date() };
	}

	// When Clock is rendered to DOM for the first time - "mounting"
	// runs after component output has been rendered to the DOM
	componentDidMount() {
		// Can have additional fields to this
		this.timerID = setInterval(
			() => this.tick(),
			1000
		);
	}

	// When DOM produced by Clock is removed - "unmounting"
	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	tick() {
		// React calls render() again upon new state
		this.setState({
			date: new Date()
		});
	}

	render() {
		return (
			<div>
				<h1>Hello, world!</h1>
				<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
			</div>
		)
	}
}

// Handling asynchronous updates
// Wrong way
this.setState({
	counter: this.state.counter + this.props.increment,
});
// Correct way, consistent previous state as first argument and props at time update is applied
this.setState((prevState, props) => ({
	return {
		counter: prevState.counter + props.increment
	};
}));

// Updating several variables, shallow merging, leaves other properties intact
componentDidMount() {
	fetchPosts().then(response => {
		this.setState({
			posts: response.posts
		});
	});

	fetchComments().then(response => {
		this.setState({
			comments: response.comments
		});
	});
}

// Data flows down; neither parent nor child components can know if certain component is stateful or stateless and shouldn't care
// - state is often local or encapsulated, component may pass its state down as props to child components
// - "top-down" or "unidirectional" data flow
// - any state owned by some specific component and any data or UI derived from that state can only affect components "below" them in the tree
<FormattedDate date={this.state.date} />
// All components isolated
function App() {
	// Each Clock sets up its own timer and updates independently
	return (
		<div>
			<Clock />
			<Clock />
			<Clock />
		</div>
	)
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);

// Handling events
// - React events named using camelCase
// - with JSX you pass a function as the event handler, rather than a string
function ActionLink() {
	function handleClick(e) {
		// e is a synthetic event defined according to W3C spec with cross-browser compatibility
		e.preventDefault();
		console.log('The link was clicked');
	}

	return (
		<a href="#" onClick={handleClick}>
			Click me
		</a>
	);
}

// Using event handlers with classes
class Toggle extends React.Component {
	constructor(props) {
		super(props);
		this.state = { isToggleOn: true };

		// This binding is necessary to make 'this' work in the callback
		// class methods are not bound by default, will be undefined otherwise
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState(prevState => ({
			isToggleOn: !prevState.isToggleOn
		}));
	}

	render() {
		return (
			<button onClick={this.handleClick}>
				{this.state.isToggleOn ? 'ON' : 'OFF'}
			</button>
		);
	}
}

ReactDOM.render(
	<Toggle />,
	document.getElementById('root')
);

// Passing arguments to event handlers like a row ID
<div>
	<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
	<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
</div>

// Conditional Rendering
// - create distinct components that encapsulate behavior you need and render only some of them depending
// on state of your application
// - can use variables to store elements
// - to prevent a component from rendering, return null instead of its render output, doesn't affect firing of component's
// lifecycle methods and componentWillUpdate and componentDidUpdate will still be called
function UserGreeting(props) {
	return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
	return <h1>Please sign up.</h1>;
}

function Greeting(props) {
	const isLoggedIn = props.isLoggedIn;
	if (isLoggedIn) {
		return <UserGreeting />;
	}
	
	return <GuestGreeting />;
}

ReactDOM.render(
	<Greeting isLoggedIn={false} />,
	document.getElementById('root')
);
// may embed any expressions in JSX by wrapping in curly braces and use logical && operator
// true && expression evaluates to expression
// condition ? true : false
function Mailbox(props) {
	const unreadMessages = props.unreadMessages;
	return (
		<div>
			<h1>Hello!</h1>
			{unreadMessages.length > 0 &&
				<h2>
					You have {unreadMessages.length} unread messages.
				</h2>
			}
		</div>
	);
}

// List and Keys
// - use map() function, can build collections of elements and include them in JSX using curly braces
// - need a key for list items - special string attribute to include when creating lists of elements
// - keys help with identifying which items changed/added/removed, use unique IDs and indexes as last resort
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
	<li>{number}</li>
);

function NumberList(props) {
	const numbers = props.numbers;
	const listItems = numbers.map((number) => 
		<li key={number.toString()}>
			{number}
		</li>
	);
	return (
		<ul>{listItems}</ul>
	);
}
// Correct key usage with components
// - keys must only be unique among siblings but not globally unique
// - keys serve as a hint to React but don't get passed to your components
// - can also inline the map() in curly braces
function ListItem(props) {
	// Don't specify key here
	return <li>{props.value}</li>;
}
function NumberList(props) {
	const numbers = props.numbers;
	const listItems = numbers.map((number) =>
		<ListItem key={number.toString()}
							value={number} />
	);
	return (
		<ul>
			{listItems}
		</ul>
	)
}

// Forms
// - by default HTML forms browse to a new page when user submits the form
// - can have "controlled components" to access data the user entered into form
// - typically <input>, <textarea>, <select> maintain their own state and update based on user input
// - in React, mutable state is kept in state property of components and updatd with setState
class NameForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: '' };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({
			value: event.target.value.toUpperCase()
		});
	}

	handleSubmit(event) {
		alert('A name was submitted: ' + this.state.value);
		event.preventDefault();
	}

	render() {
		// form value attribute gets state.value
		// handleChange runs on every keystroke to update React state
		// every state mutation has an associated handler function
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Name:
					<input
						type="text"
						value={this.state.value}
						onChange={this.handleChange}
					/>
				</label>
				<input type="submit" value="Submit"/>
			</form>
		);
	}
}

// Typically <textarea>children...</textarea>
// in React we use value attribute and similar to single-line input
class EssayForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 'Please write an essay here.'
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}

	handleSubmit(event) {
		alert('An essay was submitted: ' + this.state.value);
		event.preventDefault();
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Name:
					<textarea value={this.state.value} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Submit"/>
			</form>
		);
	}
}

// typically <select> with <option> children and value="..." and selected attribute
// creates a dropdown list
// - React uses a value attribute on the root select tag
class FlavorForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: 'coconut' };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}

	handleSubmit(event) {
		alert('Your favorite flavor is: ' + this.state.value);
		event.preventDefault();
	}

	// Can also pass an array into the value attribute and put multiple={true}
	// to handle multiple selected options
	// i.e. <select multiple={true} value={['B', 'C']}
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Pick your favorite La Croix flavor:
					<select value={this.state.value} onChange={this.handleChange}>
						<option value="grapefruit">Grapefruit</option>
						<option value="coconut">Coconut</option>
					</select>
				</label>
				<input type="submit" value="Submit"/>
			</form>
		);
	}
}

// Handling multiple inputs by setting name attribute to distinguish between them
// and observing event.target.name in the handler function
class Reservation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isGoing: true,
			numberOfGuests: 2
		};

		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	render() {
		return (
			<form>
				<label>
					Is going:
					<input
						name="isGoing"
						type="checkbox"
						checked={this.state.isGoing}
						onChange={this.handleInputChange}
					/>
				</label>
				<br/>
				<label>
					Number of guests:
					<input
						name="numberOfGuests"
						type="text"
						value={this.state.numberOfGuests}
						onChange={this.handleInputChange}
					/>
				</label>
			</form>
		);
	}
}

// Lifting State Up
// - when several components need to reflect the same changing data, we recommend
// lifting the shared state up to their closest comment ancestor
// - the parent components will be the source of truth of shared state to update children components
// and keep them in sync
// - pass in state from parent to keep in sync through read-only props in the children
// and children components will be passed down a callback through props to update state in the parent
class Calculator extends React.Component {
	constructor(props) {
		super(props);
		this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
		this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
		this.state = {
			temperature: '',
			scale: 'c'
		};
	}

	handleCelsiusChange(temperature) {
		this.setState({ scale: 'c', temperature });
	}

	handleFahrenheitChange(temperature) {
		this.setState({ scale: 'f', temperature });
	}

	// inside temperatureinput to update parent's state from changed input
	// handleChange(e) { this.props.onTemperatureChange(e.target.value) }
	render() {
		const scale = this.state.scale;
		const temperature = this.state.temperature;
		const celsius = scale === 'f' ? tryConvert(temperature, toCelsius): temperature;
		const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;
		
		return (
			<div>
				<TemperatureInput
					scale="c"
					temperature={celsius}
					onTemperatureChange={this.handleCelsiusChange}
				/>

				<TemperatureInput
					scale="f"
					temperature={celsius}
					onTemperatureChange={this.handleFahrenheitChange}
				/>

				<BoilingVerdict
					celsius={parseFloat(celsius)}
				/>
			</div>
		)
	}	
}

// Composition vs. Inheritance
// - use composition instead of inheritance to reuse code between components
// - use special children prop to pass children elements into output for components that may not know its children
// - favor composition and props rather than component inheritance hierarchis
// - to reuse non-UI functionality create JS module to import 
function FancyBorder(props) {
	return (
		<div className={'FancyBorder FancyBorder-' + props.color}>
			{props.children}
		</div>
	);
}

function WelcomeDialog() {
	return (
		<FancyBorder color="blue">
			<h1>Children underneath</h1>
		</FancyBorder>
	)
}

// Sometimes may need multiple holes instead of using children
function SplitPane(props) {
	return (
		<div className="SplitPane">
			<div className="SplitPane-left">
				{props.left}
			</div>
			<div className="SplitPane-right">
				{props.right}
			</div>
		</div>
	)
}

function App() {
	return (
		<SplitPane
			left={
				<Contacts />
			}
			right={
				<Chat />
			}
		/>
	);
}

// Thinking in React
// - 1. break UI into component hierarchy
// -> single responsibility principle - component should ideally do only one thing
// -> map JSON data model to UI in your mock
// - 2. build static version in React with no interactivity, pass data using props, don't use state at all (reserved for interactivity)
// -> easier to go bottom-up and write tests as you build with larger projects; top-down for simple examples, only have render() methods
// -> one-way data flow to keep it modular and fast
// - 3. identify the minimal (but complete) representation of UI state
// -> think of the minimal set of mutable state app needs (DRY)
// -> ask these questions: Is it passed in from a parent via props? If so, it probably isn't state
// Does it remain unchanged over time? If so, it probably isn't state; Can you compute it based on any other state or props in your component?
// If so, it isn't state; examples of state are like search text input, value of checkbox, etc.
// - 4. identify where your state should live
// -> see which component mutates or owns this state
// -> identify every component that renders something based on state, find common owner component (single component above all components
// that need the state in the hierarchy), either the common owner or another component higher up in the hierarchy should own the state
// - 5. add inverse data flow
// - forms deep in hierarchy need to update state in components in higher level through callbacks in onChange events and using setState

// JSX in Depth
// - provides syntactic sugar for React.createElement(component, props, ...children) function
// - React must be in scope, can use dot notation for JSX type, make sure capitalized so React knows it's a component
// - can pass in any JS expression as prop by surrounding it with {}, if/for aren't expressions and can be done outside
// - can pass in string literal as prop, if you pass no value for a prop, it defaults to true
// - can use ...props to pass whole props object
<div>
<MyButton color="blue" shadowSize={2}>
	Click me
</MyButton>
<div className="sidebar" />
</div>
// compiles into this
React.createElement(
	MyButton,
	{color: 'blue', shadowSize: 2},
	'Click me'
);

React.createElement(
	'div',
	{className: 'sidebar'},
	null
);
// can choose type at runtime
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
	photo: PhotoStory,
	video: VideoStory
};

function Story(props) {
	const SpecificStory = components[props.storyType];
	return <SpecificStory story={props.story} />;
}
// in JSX expressions that contain both an opening and closing tag, content between those tags is passed as props.children
// - pass through string literals, unescaped HTML
// - removes whitespace at beginning and end of line, blank lines, etc.
// - booleans, null, undefined ignored - must convert to string if you want it to render
<MyComponent>Children of MyComponent</MyComponent>
// - can also return an array of elements
render() {
	// no need to wrap list items in an extra element
	return [
		<li key="A">First Item</li>
		<li key="B">Second Item</li>
		<li key="C">Third Item</li>
	];
}
// - rendering list of JSX expressions
function Item(props) {
	return <li>{props.message}</li>;
}
function TodoList() {
	const todos = ['finish doc', 'submit pr'];
	return (
		<ul>
			{todos.map((message) => <Item key={message} message={message} />)}
		</ul>
	);
}
// sample conditional rendering of React elements, 0 will still be rendered
<div>
	{showHeader && <Header />}
	<Content />
</div>

// Typechecking with PropTypes
// - since v15.5 React.PropTypes is in prop-types library, some features like Flow or TypeScript
import PropTypes from 'prop-types';

class Greeting extends React.Component {
	render() {
		return (
			<h1>Hello, {this.props.name}</h1>
		);
	}
}

// typechecking will also apply to this
Greeting.defaultProps = {
	name: 'Stranger'
};

// can export a range of validators like isRequired, any, func, etc.
// PropTypes.element specifies only single child passed to a component as children
Greeting.propTypes = {
	name: PropTypes.string
};


