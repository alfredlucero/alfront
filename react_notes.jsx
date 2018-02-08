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

// Refs and the DOM
// - In typical React dataflow, props are the only way that parent components interact with their children
// - To modify child, you re-render it with new props
// - When to use refs: managing focus, text selection, media playback, triggering imperative animations, 
// integrating with third-party libraries
// - refs can attach to any special component, takes a callback function, executed immediately after
// component is mounted or unmounted; when used on HTML element, receives underlying DOM element as argument
class CustomTextInput extends React.Component {
	constructor(props) {
		super(props);
		this.focusTextInput = this.focusTextInput.bind(this);
	}

	focusTextInput() {
		 // Explicitly focus the text input using the raw DOM API
		 this.textInput.focus();
	}

	render() {
    // Use the `ref` callback to store a reference to the text input DOM
		// element in an instance field (for example, this.textInput).
		// called with DOM element on mount, null on unmount
    return (
      <div>
        <input
          type="text"
          ref={(input) => { this.textInput = input; }} />

        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}

// Simulating click and focus on input since it takes DOM element as argument from ref
// and setting it as property of the class
// - cannot use ref attribute on functional components because they don't have instances
// - generally not recommended to access child DOM node from parent component but you
// can do it by passing a ref callback to functional component
// - can use it as an escape hatch, findDOMNode() is discouraged too
// - legacy string refs should not be used because will be removed in future releases i.e. 
// this.refs.textInput and recommend callback pattern instead
// - ref callback will be called twice if used as inline function, first with null and again
// with DOM element, usually have callback as method bound on class instead
class AutoFocusTextInput extends React.Component {
  componentDidMount() {
    this.textInput.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput
        ref={(input) => { this.textInput = input; }} />

    );
  }
}

// Uncontrolled Components
// - recommend controlled components in which form data is handled by a React component
// - uncontrolled components has form data handled by DOM itself
// - can use a ref to get form values from the DOM rather than writing event handler for every state
// - specify defaultValue attribute for React to specify the initial value but leave subsequent updates
// uncontrolled
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input defaultValue="Set once" type="text" ref={(input) => this.input = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

// Optimizing Performance
// - Use the minified production build, dark background for icon on React DevTools
// - offer single-file builds of React and ReactDOM (.production.min.js)
// - uglify-js-brunch -> brunch build -p for production
// - webpack production plugin
new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
}),
new webpack.optimize.UglifyJsPlugin()
// - can observe Chrome Performance tab and press Record -> React events will be grouped
// under the User Timing label
// - avoid reconciliation by altering the shouldComponentUpdate() to not return true in 
// some cases as it is triggered before the re-rendering process
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
		// If only color props and count state changes, check those before re-rendering 
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
// Or one can do React.PureComponent for the same "shallow comparison" between all props and state
// to determine if the component should update -> be wary of arrays/objects with properties/elements mutated
// as it will not catch that
// - avoid mutating values used for props and state by using concat, spread operator, Object.assign
// - can use Immutable.js: immutable, persistent collections that work via structural sharing
// -> immutable: once created, a collection cannot be altered at another point in time
// -> persistent: new collections can be created from a previous collection and a mutation such as set; original
// collection is still valid after the new collection is created
// -> structural sharing: new collections created from a previous collection using as much of same structure as original
// collection as possible, reducing copying to a minimum to improve performance
// -> tracks changes on new objects by checking references to object changed in the shouldComponentUpdate

// React without ES6
// - can use create-react-class, getDefaultProps(), getInitialState(), don't need to call .bind(this), avoid mixins

// React without JSX
// - convenient when you don't want to set up compilation in your build environment
// - React.createElement(component, props, ...children); use Babel compiler to see JSX converted to JS

// Reconciliation
// - "diffing" algorithm for faster performance apps on component updates
// - render() creates a tree of React elements, returns a different one given different props or states
// and React needs to figure out how to efficiently update the UI
// - minimum number of operations to transform one tree into another is O(n^3) 
// - React uses a heuristic O(n) based on two assumptions
// 1. Two elements of different types will produce different trees
// 2. Developer can hint at which child elements may be stable across different renders with a key prop
// - Diffing algorithm: 
// -> first compares the root element: whenever elements have different types, it rebuilds the tree from scratch
// and old DOM nodes destroyed (componentWillUnmount()) and when building new tree it triggers componentWillMount
// and componentDidMount; any elements below the root will be unmounted with state destroyed
// --> for DOM elements of the same type, React looks at the attributes of both, keeps same underlying DOM node,
// and only updates the changed attributes; React then recurses its children
// --> for component elements of the same type: when a component updates, the instance stays the same so that state is
// maintained across renders; updates props of underlying component instance to match and triggers componentWillReceiveProps
// and componentWillUpdate and render method is called with diffing happening to previous and next results
// -> when recursing on children its best to add new list items to the end for better performance as it will re-render everything instead
// or one can just use the key attribute for React to match children in the original tree with children in the subsequent tree
// (key only has to be unique among its siblings); avoid using index as key for reorders
// -> takeaways: algorithm will not try to match subtrees of different component types (if similar output, may consider just one component type)
// -> keys should be stable, predictable and unique otherwise DOM nodes and component instances will be recreated, leading to performance
// degradation and lost state in child components

// Context
// - experimental API to help with not passing down props at every level -> probably use Redux of MobX instead
import PropTypes from 'prop-types';

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  color: PropTypes.string
};

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }

  render() {
    const children = this.props.messages.map((message) =>
      <Message text={message.text} />
    );
    return <div>{children}</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string
};

// Portals
// - first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component
ReactDOM.createPortal(child, container);
// - Normally, when you return an element from a component’s render method, it’s mounted into the DOM as a child of the nearest parent node
// - A typical use case for portals is when a parent component has an overflow: hidden or z-index style, 
// but you need the child to visually “break out” of its container. For example, dialogs, hovercards, and tooltips.
// - behaves like a normal React child even if outside the DOM hierarchy as it still exists in the React tree
// - an event fired inside the portal will propagate (event bubbling) to ancestors in the containing tree
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>

// These two containers are siblings in the DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This will fire when the button in Child is clicked,
    // updating Parent's state, even though button
    // is not direct descendant in the DOM.
    this.setState(prevState => ({
      clicks: prevState.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // The click event on this button will bubble up to parent,
  // because there is no 'onClick' attribute defined
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);

// Error Boundaries
// - JS error in part of the UI shouldn't break the whole app; React 16 introduces "error boundary"
// - Error boundaries are React components that catch JS errors anywhere in their child component tree,
// log those errors, and display a fallback UI instead of the component tree that crashed
// -> catch errors in rendering, lifecycle methods, constructors of whole tree below
// -> don't catch errors for event handlers, async code (setTimeout, requestAnimationFrame), server-side rendering,
// errors thrown in error boundary itself rather than children
// -> defines componentDidCatch(error, info)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

	// error is the error thrown
	// info is an object with componentStack key
  componentDidCatch(error, info) {
    // Display fallback UI
		this.setState({ hasError: true });
		/* Example stack information: info.componentStack
			in ComponentThatThrows (created by App)
			in ErrorBoundary (created by App)
			in div (created by App)
     	in App
  	*/
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
// Usage, only class components can be error boundaries
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
// - As of React 16, errors that were not caught by any error boundary will result in unmounting of the whole React component tree.
// - React 16 prints all errors that occurred during rendering to the console in development, even if the application accidentally swallows them. 
// In addition to the error message and the JavaScript stack, it also provides component stack traces.
// - don't use try/catch for rendering elements but rather for event hanlder errors because that's imperative rather than Error boundaries which are declarative

// Web Components
// - provide strong encapsulation for reusable components while React provides a declarative library that keeps DOM in sync with your data
// - use "class" instead of "className", often expose imperative API, need a ref to that DOM element, events may not propagate correctly 
// - may use a wrapper around third-party web components

// Higher-order Components
// - advanced technique to reuse component logic
// - HOC is a function that takes a component and returns a new component
// and transforms one component into another rather than just transforming props into UI
// - i.e. in Redux's connect and Relay's createContainer
// - pure function with zero side effects, wraps in a container component, entirely props-based
// - don't mutate original component, use composition
// - container components: manage things like subscriptions and state and pass props to components
// that handle things like rendering UI, separates responsibility between high-level and low-level concerns
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
// HOCs should pass through props that are unrelated to its specific concern.
/*
render() {
  // Filter out extra props that are specific to this HOC and shouldn't be
  // passed through
  const { extraProp, ...passThroughProps } = this.props;

  // Inject props into the wrapped component. These are usually state values or
  // instance methods.
  const injectedProp = someStateOrInstanceMethod;

  // Pass props to wrapped component
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
*/
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
// connect is a function that returns another function
const enhance = connect(commentListSelector, commentListActions);
// The returned function is a HOC, which returns a component that is connected
// to the Redux store
const ConnectedComment = enhance(CommentList);
// wrap display name for easy debugging with HOC
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// - don't use HOCs inside the render function as the entire subtree will unmount/remount every time
// and loses all the state
/*
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
*/
// - refs aren't passed through - not really a prop like key, references outermost component container not wrapped component
// - static methods must be copied over or else HOC loses it
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}

// Integrating with other libraries
// - React unaware of changes made to the DOM outside of React, determines updates based on its own internal representation
// - easiest way to avoid conflicts is to prevent the React component from updating
// -> attach ref to the root element, pass ref inside componentDidMount to jQuery plugin, return empty div
// from render method so React has no reason to update it
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

	// need to detach event listeners for jQuery to prevent memory leaks
  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
	}
}
// - can embed into other applications due to flexibility of ReactDOM.render() - can be called multiple times
// and Facebook uses this way and embed applications piece by piece
// - old pattern to describe chunks of DOM as a string and insert it into DOM like $el.html(htmlString)
// -> replace string-based rendering with React
// -> replacing Backbone view: typically use HTML strings or string-producing template functions to create content
// for their DOM elements
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
		// Unregisters event handlers
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
// -> can listen to Backbone models and collections by listening to change events and manually force an update
// --> listen to 'change' events for model changes and 'add'/'remove' for collections => this.forceUpdate()
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
// -> can also extract model's attributes as plain data when it changes, keep logic in single place
// and use a HOC that puts it into state and pass data into wrapped component
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
// Sample usage of this HOC pattern
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />

  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);

// Accessibility
// - a11y, design and creation of websites for everyone
// - WCAG: web content accessibility guidelines
// - WAI-ARIA (web accessibility initiative - accessible rich internet applications)
// -> all aria-* HTML attributes supported in JSX whereas most DOM properties and React
// attributes camelcased i.e. aria-label={...}
// -> need labeling on input forms for screen readers
{/* <label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/> */}
// -> focus control (using only keyboard to use application); can set outline: 0 and set 
// your own custom focus
// -> skiplinks for easier navigation, use landmark elements and roles like <main>, <aside>
// -> programmatically manage focus
// -> setting language, document title, ensure great color contrast
// -> try using your keyboard and using tab or shift+tab to navigate and pressing enter to activate elements
// -> can use react-axe (accessibility engine) to run accessibility tests and report to console
// -> test screen readers such as NVDA in Firefox, VoiceOver in Safari, JAWS in IE

// React Router Notes
// - Before we had static routing and declared routes as part of app's initialization before any rendering like Rails, Express,
// Ember, Angular, etc. - and so was React Router pre-v4
// - Dynamic routing: takes place as app is rendering, not in config/convention outside of running app, almost everything is component
import { BrowserRouter } from 'react-router-dom';

// Route will render <Dashboard {...props} />; otherwise it will render null
const App = () => (
	<div>
		<nav>
			<Link to="/dashboard">Dashboard</Link>
		</nav>
		<div>
			<Route path="/dashboard" component={Dashboard}/>
		</div>
	</div>
)

ReactDOM.render((
	<BrowserRouter>
		<App/>
	</BrowserRouter>
), el);

// For nested routes you just nest the Route like a div
const App = () => (
	<BrowserRouter>
		<div>
			<Route path="/tacos" component={Tacos} />
		</div>
	</BrowserRouter>
);

// when the url matches `/tacos` this component renders
const Tacos = ({ match }) => (
	<div>
		{/* Nested route match.url helps us make a relative path */}
		<Route
			path={match.url + '/carnitas'}
			component={Carnitas}
		/>
	</div>
);

// can think of routing as UI components, be more responsive
// i.e. can have set of valid routes change depending on the dynamic nature of mobile device
const App = () => (
  <AppLayout>
    <Route path="/invoices" component={Invoices}/>
  </AppLayout>
);

const Invoices = () => (
  <Layout>

    {/* always show the nav */}
    <InvoicesNav/>

    <Media query={PRETTY_SMALL}>
      {screenIsSmall => screenIsSmall
        // small screen has no redirect
        ? <Switch>
            <Route exact path="/invoices/dashboard" component={Dashboard}/>
            <Route path="/invoices/:id" component={Invoice}/>
          </Switch>
        // large screen does!
        : <Switch>
            <Route exact path="/invoices/dashboard" component={Dashboard}/>
            <Route path="/invoices/:id" component={Invoice}/>
            <Redirect from="/invoices" to="/invoices/dashboard"/>
          </Switch>
      }
    </Media>
  </Layout>
);

// Quick Start
// - npm install react-router-dom
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
);

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
    </div>
  </Router>
);
export default BasicExample

// Server Rendering
// - Rendering on server is stateless, so you use <StaticRouter> instead of
// <BrowserRouter>, passing in requested url from server so routes can match and a context prop
// Client
<BrowserRouter>
	<App />
</BrowserRouter>
// Server
<StaticRouter
	location={req.url}
	context={context}
>
	<App />
</StaticRouter>
//  router only adds context.url, can handle different status redirects
const RedirectWithStatus = ({ from, to, status }) => (
	<Route render={({ staticContext }) => {
		// there is not staticContext on the client so need guard against that
		if (staticContext)
			staticContext.status = status;
		return <Redirect from={from} to={to}/>
	}}/>
);

const App = () => (
	<Switch>
		<RedirectWithStatus
			status={301}
			from="/users"
			to="/profiles"
		/>
		<RedirectWithStatus
			status={302}
			from="/courses"
			to="/dashboards"
		/>
	</Switch>
);

// on the server
const context = {};

const markup = ReactDOMServer.renderToString(
	<StaticRouter context={context}>
		<App/>
	</StaticRouter>
);

if (context.url) {
	redirect(context.status, context.url);
}

// 404, 401, or other status
const Status = ({ code, children }) => (
	<Route render={({ staticContext }) => {
		if (staticContext)
			staticContext.status = code;
		return children;
	}}
	/>
);

// <Route component={NotFound}/>
const NotFound = () => (
	<Status code={404}>
		<div>
			<h1>Sorry, can't find that.</h1>
		</div>
	</Status>
);

// General pieces to put it all together
import { createServer } from 'http';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';

createServer((req, res) => {
	const context = {};

	const html = ReactDOMServer.renderToString(
		<StaticRouter
			location={req.url}
			context={context}
		>
			<App/>
		</StaticRouter>
	);
	
	if (context.url) {
		res.writeHead(301, {
			location: context.url
		});
		res.end();
	} else {
		res.write(`
			<!doctype html>
			<div id="app">${html}</div>	
		`);
		res.end();
	}
}).listen(3000);
// client
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render((
	<BrowserRouter>
		<App/>
	</BrowserRouter>
), document.getElementById('app'));

// load data before you render, exports matchPath static function to match locations to routes
// -> can use this function on server to help determine what your data dependencies will be before rendering
const routes = [
	{
		path: '/',
		component: Root,
		loadData: () => getSomeData(),
	}
];

import { routes } from './routes';

const App = () => (
	<Switch>
		{routes.map(route => (
			<Route {...route}/>
		))}
	</Switch>
);

import { matchPath } from 'react-router-dom';
const promises = [];
// use 'some' to imitate '<Switch>' behavior of selecting the first to match
routes.some(route => {
	const match = matchPath(req.url, route);
	if (match) {
		promises.push(route.loadData(match));
	}
	return match;
});

Promise.all(promises).then(data => {
	// do something with data so client can access it then render app
});

// Code Splitting
// - like incrementally downloading the app like with webpack and bundle loader
// - can make a component that loads dynamic imports as user navigates to it
import loadSomething from 'bundle-loader?lazy!./Something';

<Bundle load={loadSomething}>
	{(mod) => (
		{/* do something with module */}
	)}
</Bundle>

// Takes prop load we get from webpack bundle loader
// when the component mounts or gets a new load prop,
// it will call load, then place the returned value in state
// and calls back render with module
<Bundle load={loadSomething}>
	{(Components) => (Components
		? <Components />
		: <Loading />
	)}
</Bundle>

import React, { Component } from 'react';

class Bundle extends Component {
	state = {
		mod: null
	}

	componentWillMount() {
		this.load(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.load !== this.props.load) {
			this.load(nextProps);
		}
	}

	load(props) {
		this.setState({
			mod: null
		});
		props.load((mod) => {
			this.setState({
				// handle both es imports and cjs
				mod: mod.default ? mod.default : mod
			})
		});
	}

	render() {
		// Returns null state on render before module has been fetched
		// can indicate loading instead
		return this.state.mod ? this.props.children(this.state.mod) : null;
	}
}

export default Bundle;

// There is also import() that can be used too
// - benefit of bundle loader is that second time it calls back synchronously
//  which prevents flashing the loading screen every time you vist a code-split screen
// - component handles the code loading when it render and now you just render a <Bundle>
//  wherever you want to load code dynamically
<Bundle load={() => import('./something')}>
	{(mod) => ()}
</Bundle>

// - Bundle component great for loading as you approach a new screen but also beneficial
// to preload the rest of the app in the background
import loadAbout from 'bundle-loader?lazy!./loadAbout';
import loadDashboard from 'bundle-loader?lazy!./loadDashboard';

// components load their module for initial visit
const About = (props) => (
	<Bundle load={loadAbout}>
		{(About) => <About {...props}/>}
	</Bundle>
);

const Dashboard = (props) => (
	<Bundle load={loadDashboard}>
		{(Dashboard) => <Dashboard {...props}/>}
	</Bundle>
);

class App extends React.Component {
	componentDidMount() {
		// preloads the rest
		loadAbout(() => {})
		loadDashboard(() => {})
	}

	render() {
		return (
			<div>
				<h1>Welcome!</h1>
				<Route path="/about" component={About}/>
				<Route path="/dashboard" component={Dashboard}/>
			</div>
		);
	}
}
// - when and how much of your app to load is your own decision
// and doesn't need to be tied to specific routes, possibly when user is inactive
// -> when they visit a route maybe preload the rest of app after initial render
ReactDOM.render(<App/>, preloadTheRestOfTheApp);

// - code-splitting and server rendering too tough, need synchronous module resolution on server
// so you can get those bundles in initial render
// -> need to load all bundles in client that involved in server render before rendering so client render is same as server render
// -> need async resolution for rest of client app's life
// -> probably better to do code-splitting + service worker caching

// Scroll restoration
// - browsers starting to handle scroll restoration with history.pushState like in chrome
// -> starting to handle the "default case"
// - "scroll to the top" i.e. <ScrollToTop> component that will scroll window up on every navigation
// and be sure to wrap it in withRouter to give it access to router's props
class ScrollToTop extends Component {
	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			window.scrollTo(0, 0);
		}
	}

	render() {
		return this.props.children;
	}
}

export default withRouter(ScrollToTop);

// then render at top of your app but below Router
// or render anywhere you want but just one
const App = () => (
	<Router>
		<ScrollToTop>
			<App />
		</ScrollToTop>
	</Router>
);

// for tab interfaces you may not want to be scrolling to top when they switch tabs
class ScrollToTopOnMount extends Component {
	componentDidMount(prevProps) {
		window.scrollTo(0, 0);
	}

	render() {
		return null;
	}
}

class LongContent extends Component {
	render() {
		<div>
			<ScrollToTopOnMount />
			<h1>Here is long content page</h1>
		</div>
	}
}

<Route path="/long-content" component={LongContent} />

// Generic solution to scroll up on navigation so you don't start a new screen scrolled to bottom
// -> restoring scroll positions of window and overflow elements on "back" and "forward" clicks but not Link clicks

// Testing
// - relies on React context to work, affects how you can test your components that use our components
// - when using <Link> or <Route>, etc. it may get errors and warnings about context so you should
// wrap your unit test in a <StaticRouter> or <MemoryRouter>
test('it expands when the button is clicked' () => {
	render(
		<MemoryRouter>
			<Sidebar />
		</MemoryRouter>
	);
	click(theButton);
	expect(theThingToBeOpen);
});

// <MemoryRouter> supports initialEntries and initialIndex props so you can boot up app
// or smaller part of app at a specific location
test('current user is active in sidebar', () => {
	render(
		<MemoryRouter initialEntries={['/users/2']}>
			<Sidebar />
		</MemoryRouter>
	);
	expectUserToBeActive(2);
});

// Redux Integration
// - occasionally an app can have a component that doesn't update when the location changes (child routes or active nav links)
// -> happens if the component is connected to redux via connect()(Component)
// -> component is not a "route component" meaning it is not rendered like <Route component={SomeConnectedThing} />
// -> problem is Redux implements shouldComponentUpdate and no indication if anything changed if it isn't receiving props from the router
// -> solution: find where you connect your component and wrap it in withRouter
// before
export default connectToBackboneModel(mapStateToProps)(Something);
// after
import { withRouter } from 'react-router-dom';
export default withRouter(connectToBackboneModel(mapStateToProps)(Something));
// - can just pass the history object provided to route components to actions and navigate with it there rather than dispatching actions to navigate
// -> routing data is already a prop of most components
// - react-router-redux@next and history to keep state in sync with router v5 with react-router-v4
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';

import reducers from './reducers';

// Create a history of your choosing (using browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

// Add the reducer to your store on the router key
// also apply our middleware for navigating
const store = createStore(
	combineReducers({
		...reducers,
		router: routerReducer
	}),
	applyMiddleware(middleware)
);

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))
ReactDOM.render(
	<Provider store={store}>
		{/* ConnectedRouter will use store from Provider automatically */}
		<ConnectedRouter history={history}>
			<div>
				<Route exact path="/" component={Home} />
				<Route path="/about" component={About} />
				<Route path="/topics" component={Topics} />
			</div>
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root')
);

// Redux Documentation Notes 
// - predictable state container for JS apps, live code editing combined with time traveling debugger
// - (2kB including dependencies), evolves ideas of Flux and takes inspiration from Elm
// - npm install --save redux, npm install --save react-redux, --save-dev redux-devtools
// - whole state of your app is stored in object tree inside a single store
// -> change state tree by emitting an action = object describing what happened
// -> to specify how the actions transform the state tree, you write pure reducers
import { createStore } from 'redux';

// reducer: pure function with (state, action) => state signature
// shape of state can be primitive, array, object, or Immutable.js data structure
//  -> should not mutate the state object but return new object if state changes
function counter(state = 0, action) {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1;
		case 'DECREMENT': 
			return state - 1;
		default:
			return state;
	}
}

// Create a Redux store holding the state of your app
// API is { subscribe, dispatch, getState }
let store = createStore(counter);

// Can use subscribe() to update the UI in response to state changes
// -> normally use view binding library like React Redux
// -> can be handy to persist current state in localStorage
store.subscribe(() =>
	console.log(store.getState())
);

// The only way to mutate the internal state is to dispatch an action
// -> actions can be serialized, logged or stored and later replayed
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });

// * summary: specify the mutations you want to happen with plain objects called actions
// and then write special function called reducer to decide how every action transforms the entire application's state
// - Redux doesn't have a Dispatcher or support many stores, but a single store with single root reducing function
// -> instead of adding stores, you split the root reducer into smaller reducers independently operating on the
//  different parts of the state tree like how we have one root component in React app but composed of many small components

// Motivation
// - handling mutation and asynchronicity, managing state in complex SPA, making state mutations predictable
// Core Concepts
// - app's state as a plain object; changing state by dispatching an action = plain JS object that describes what happened
const addTodoAction = { type: 'ADD_TODO', text: 'Go study at le cafe' };
// - reducer is a function that takes state and action as arguments and returns the next state of the app
function visibilityFilter(state = 'SHOW_ALL', action) {
	if (action.type === 'SET_VISIBILITY_FILTER') {
		return action.filter;
	} else {
		return state;
	}
}

function todos(state = [], action) {
	switch (action.type) {
		case 'ADD_TODO':
			return state.concat([{ text: action.text, completed: false }]);
		case 'TOGGLE_TODO':
			return state.map(
				(todo, index) =>
					action.index === index
						? { text: todo.text, completed: !todo.completed }
						: todo
			);
		default:
			return state;
	}
}
// another reducer manages the complete state of our app by calling those two reducers for the corresponding state keys
function todoApp(state = {}, action) {
	return {
		todos: todos(state.todos, action),
		visibilityFilter: visibilityFilter(state.visibilityFilter, action)
	};
}
// * summary: describe how your state is updated over time in response to action objects

// Three principles
// 1. Single source of truth: state of whole app is stored in an object tree within a single store
// 2. State is read-only: only way to change state is to emit an action, object describing what happened, express intent to transform state
// 3. Changes are made with pure functions: to specify how state tree is transformed by actions, you write pure reducers that take previous
// state and an action and then return the next state
import { combineReducers, createStore } from 'redux';
const reducer = combineReducers({ visibilityFilter, todos });
const store = createStore(reducer);

// Actions
// - actions are payloads of information that send data from your application to your store
// - only source of information for the store, send them to store with store.dispatch()
const ADD_TODO = 'ADD_TODO';
const addTodoAction = {
	type: ADD_TODO,
	text: 'Build my first Redux app'
};
// - plain JS objects that must have a type property that indicates the type of action being performed
// typically defined as string constants and may want to move them into separate module
import { ADD_TODO, REMOVE_TODO } from '../actionTypes';
// - action creators are functions that create actions and return an action
function addTodo(text) {
	return {
		type: ADD_TODO,
		text
	};
}
// usually we pass result of action creator to dispatch function
dispatch(addTodo(text));
// - can create bound action creator that automatically dispatches
const boundAddTodo = text => dispatch(addTodo(text));
const boundCompleteTodo = index => dispatch(completeTodo(index));
// - can access dispatch function directly through store.dispatch or just use
// react-redux's connect() to access it or use bindActionCreators() to automatically bind many action creators
// to a dispatch() function

// Reducers
// - specify how application's state changes in response to actions sent to the store (all app state stored as single object)
// - in modeling app state, keep it as normalized as possible without any nesting and with objects storied with ID as a key and IDs
// to reference other entities or lists, app's state as a database
// (previousState, action) => newState (Array.prototype.reducer(reducer, ?initialValue)), pure function so you should never
//  mutate its args, perform side effects like API calls and routing transitions, call non-pure functions like Date.now(), Math.random()
// - need to define initial state or else state will be undefined on the first time 
// -> can do reducer composition to give reducer a slice of state to manage
function todoApp(state = initialState, action) {
	switch (action.type) {
		case SET_VISIBILITY_FILTER:
			// can also use object spread operator
			return Object.assign({}, state, {
				visibilityFilter: action.fitler
			});
		case ADD_TODO:
			return Object.assign({}, state, {
				todos: todos(state.todos, action)
			});
		case TOGGLE_TODO:
			return Object.assign({}, state, {
				todos: todos(state.todos, action)
			});
		default:
			return state;
	}
}
// - Can break out visibility filter actions and todo actions such that it looks like this instead
function todoAppRefactored(state = {}, action) {
	return {
		visibilityFiler: visibilityFilter(state.visibilityFilter, action),
		todos: todos(state.todos, action)
	};
}
// - Eventually can split them out into separate files and keep them independent and manage different data domains
// and it's equivalent to the above reducer
// -> combineReducers() generates a function that calls your reducers with slices of state selected according to their keys
//  and combining results into single object again
import { combineReducers } from 'redux';

const todoApp = combineReducers({
	visibilityFilter,
	todos
});

export default todoApp;
// i.e. can give them different keys 
const reducer = combineReducers({
	a: doSomethingWithA,
	b: processB,
	c: c
});
// i.e. can call functions differently
function reducer(state = {}, action) {
	return {
		a: doSomethingWithA(state.a, action),
		b: processB(state.b, action),
		c: c(state.c, action)
	};
}

// Store
// - object that brings them together, holds application state, allows access via getState()
// - allows state to be updated via dispatch(action)
// - registers listeners via subscribe(listener)
// - handles unregistering of listeners via function returned by subscribe(listener)
// - single store in Redux app, use reducer composition instead of many stores for data handling logic
import { createStore } from 'redux';
import todoApp from './reducers';
let store = createStore(todoApp);
// - can also specify initial state to hydrate state of client with server state
let store = createStore(todoApp, window.STATE_FROM_SERVER);

import {
	addTodo,
	toggleTodo,
	setVisibilityFilter,
	VisibilityFilters
} from './actions';

// Log the initial state
console.log(store.getState());

// Every time state changes, log it
// subscribe() returns a function for unregistering the listener
const unsubscribe = store.subscribe(() =>
	console.log(store.getState())
);

// Dispatch some actions
store.dispatch(addTodo('Learn more about action'));

// Stop listening to state updates
unsubscribe();

// Data Flow
// - strict unidirectional data flow
// 1. call store.dispatch(action)
// 2. Redux store calls the reducer function you gave it
// -> store passes two arguments to reducer: current state tree and action; computes next state as pure function
// 3. root reducer may combine output of multiple reducers into single state tree
// -> combineReducers() to "split" the root reducer into separate functions that each manage one branch of the state tree
// 4. Redux store saves the complete state tree returned by the root reducer
// -> every listener registered with store.subscribe(listener) will be invoked and listeners may call store.getState() to get current state
// -> React Redux: component.setState(newState) is called

// Usage with React
// - works well with React because they let you describe UI as a function of state and Redux emits state updates in response to actions
// - npm install --save react-redux
// - embrace idea of separating presentational and container components
// -> presentational: how things look like markup/styles, not aware of Redux, read data from props, invoke callbacks from props, written by hand
// -> container: how things work (data fetching, state updates), aware of Redux, subscribe to Redux state, dispatch Redux actions, generated by React Redux
// - should design the UI hierarchy to match the shape of the root state object
// - presentational components describe the look but don't know where the data comes from or how to change it, only render what's given
// - container components connect the presentational components to Redux
// - use functional stateless components unless you need to use local state or lifecycle methods
// i.e. Todo presentational components
import React from 'react';
import PropTypes from 'prop-types';

const Todo = ({ onClick, completed, text }) => (
	<li
		onClick={onClick}
		style={{
			textDecoration: completed ? 'line-through' : 'none'
		}}
	>
		{text}
	</li>
);

Todo.propTypes = {
	onClick: PropTypes.func.isRequired,
	completed: PropTypes.bool.isRequired,
	text: PropTypes.string.isRequired
};

export default Todo;

import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map((todo, index) => (
      <Todo key={index} {...todo} onClick={() => onTodoClick(index)} />
    ))}
  </ul>
)

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onTodoClick: PropTypes.func.isRequired
}

export default TodoList

// i.e. container components with React Redux
// - does a lot of performance optimizations to prevent unnecessary re-renders and no implementing
// shouldComponentUpdate
// - connect() defines a special function called mapStateToProps that tells how to transform the current
// Redux store state into the props you want to pass to a presentational component you are wrapping
const getVisibleTodos = (todos, filter) => {
	switch (filter) {
		case 'SHOW_COMPLETED':
			return todos.filter(t => t.completed);
		case 'SHOW_ACTIVE':
			return todos.filter(t => !t.completed);
		case 'SHOW_ALL':
		default:
			return todos;
	}
};

const mapStateToProps = state => {
	return {
		todos: getVisibleTodos(state.todos, state.visibilityFilter)
	}
};
// - can also dispatch actions, mapDispatchToProps
const mapDispatchToProps = dispatch => {
	return {
		onTodoClick: id => {
			dispatch(toggleTodo(id));
		}
	};
};
// - need to call connect() and pass those two functions to VisibleTodoList component
import { connect } from 'react-redux';

const VisibleTodoList = connect(
	mapStateToProps,
	mapDispatchToProps
)(TodoList);

export default VisibleTodoList;

// Can use <Provider> to magically make store available to all container components in the application without
// passing it explicitly; only need to use it once when rendering the root component
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
	document.getElementById('root'));
	
// Async Actions
// - two crucial moments for async API
// 1. moment you start the call
// 2. moment when you receive an answer or a timeout
// - need three different kinds of actions
// 1. action informing the reducers that the request began
// i.e. reducer may handle action by toggling isFetching flag in state so you can show spinner in UI
// 2. action informing the reducers that the request finished successfully
// i.e. reducers may handle this action by merging new data into state they manage and reset isFetching
// and hide the spinner and display fetched data
// 3. action informing the reducers that the request failed
// i.e. reducer may handle this action by resetting isFetching and store error message so UI can display it
// -> may use status field with single action type
// { type: 'FETCH_POSTS' }
// { type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
// { type: 'FETCH_POSTS', status: 'success', response: { ... } }
// OR with multiple action types
// { type: 'FETCH_POSTS_REQUEST' }
// { type: 'FETCH_POSTS_FAILURE', error: 'Oops' }
// { type: 'FETCH_POSTS_SUCCESS', response: { ... } }
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT';

export function selectSubreddit(subreddit) {
	return {
		type: SELECT_SUBREDDIT,
		subreddit
	};
}
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  }
}
export const REQUEST_POSTS = 'REQUEST_POSTS'

function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}
export const RECEIVE_POSTS = 'RECEIVE_POSTS'

function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}
// - think about structuring app state tree with lists
// -> store each subreddit's information separately so we can cache every subreddit and when we switch between
// them the update will be instant, no need to worry about all these items in memory unless dealing with tens of thousands of items
// -> for every list of items you'll want to store isFetching to show a spinner, didInvalidate so you can later toggle it when the data
// is stale, lastUpdated so you know when it was fetched the last time, and items
// -> also want to store pagination state like fetchedPageCount and nextPageUrl
// -> can consider normalizing with normalizr for dynamic apps
const store = {
  selectedSubreddit: 'frontend',
  postsBySubreddit: {
    frontend: {
      isFetching: true,
      didInvalidate: false,
      items: []
    },
    reactjs: {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 1439478405547,
      items: [
        {
          id: 42,
          title: 'Confusion about Flux and Relay'
        },
        {
          id: 500,
          title: 'Creating a Simple Application Using React JS and Flux Architecture'
        }
      ]
    }
  }
};

import { combineReducers } from 'redux'
import {
  SELECT_SUBREDDIT,
  INVALIDATE_SUBREDDIT,
  REQUEST_POSTS,
  RECEIVE_POSTS
} from '../actions'

function selectedSubreddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit
    default:
      return state
  }
}

function posts(
  state = {
    isFetching: false,
    didInvalidate: false,
    items: []
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function postsBySubreddit(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.subreddit]: posts(state[action.subreddit], action)
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit
})

export default rootReducer

// - can handle network requests with Redux Thunk middleware (redux-thunk)
// -> action creator can return a function instead of an action object so the action creator becomes a thunk
// -> that returned function will get executed by Redux Thunk middleware, can have side effects, async API calls
// -> can also dispatch actions
import fetch from 'cross-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  }
}

// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))

export function fetchPosts(subreddit) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestPosts(subreddit))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.log('An error occurred.', error)
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receivePosts(subreddit, json))
      )
  }
}

import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { selectSubreddit, fetchPosts } from './actions'
import rootReducer from './reducers'

const loggerMiddleware = createLogger()

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

store.dispatch(selectSubreddit('reactjs'))
store
  .dispatch(fetchPosts('reactjs'))
	.then(() => console.log(store.getState()))
	
	import fetch from 'cross-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  }
}

function fetchPosts(subreddit) {
  return dispatch => {
    dispatch(requestPosts(subreddit))
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(subreddit, json)))
  }
}

function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

export function fetchPostsIfNeeded(subreddit) {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchPosts(subreddit))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}
// Other middleware like redux-promise, redux-observable, redux-sage, redux-pack, etc.

// Async Flow
// - without middleware, Redux store only supports synchronous data flow by default with createStore()
// - can applyMiddleware(), async middleware like redux-thunk wraps the store's dispatch() method and allows you
// to dispatch something other than actions like functions or Promises
// - when the last middleware in the chain dispatches an action, it has to be a plain object so synchronous Redux data flow takes place

// Middleware
// - middleware is some code you can put between the framework receiving a request and the framework generating a response
// i.e. Express or Koa middleware to add CORS headers, logging, compression, etc.
// - composable in a chain and can use multiple independent third-party middleware in single project
// - Redux middleware provides third-party extension point between dispatching an action and the moment it reaches the reducer
// -> used for logging, crash reporting, talking to async API, routing, etc.
// - problems with logging actions dispatched: tough to log manually, wrap the dispatch in function to output action and nextState,
//  and monkeypatching dispatch function
// - problems with crash reporting: may want to apply transformations to dispatch to report JS errors in prod
// -> window.onerror event not reliable without stack information on some older browsers
// i.e. sample Redux middleware under the hood using the next dispatch() function and returns a dispatch() and currying
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}
import { createStore, combineReducers, applyMiddleware } from 'redux'

let todoApp = combineReducers(reducers)
let store = createStore(
  todoApp,
  // applyMiddleware() tells createStore() how to handle middleware
  applyMiddleware(logger, crashReporter)
)
// Will flow through both logger and crashReporter middleware!
// store.dispatch(addTodo('Use Redux'))

// Usage with React Router
// - Redux will be source of truth for your data and React Router will be source of truth for your URL
// - okay to have the separate unless you need to time travel and rewind actions that trigger URL change
// - npm install --save react-router-dom
// - need to configure development server since it may be unaware of declared routes in React Router configuration
// i.e. serving index.html from Express
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});
// i.e. serving index.html from WebpackDevServer
// devServer: { historyApiFallback: true }
// - wrap <Route /> in <Router /> so that when URL changes, <Router /> will match a branch of its routes and render configured
// components; <Route /> is used to declaratively map routes to application's component hierarchy
import { BrowserRouter as Router, Route } from 'react-router-dom';
// - need <Provider /> higher-order component provided by React Redux to bind Redux to React
import { Provider } from 'react-redux';

const Root = ({ store }) => (
	<Provider store={store}>
		<Router>
			<Route path="/:filter?" component={App} />
		</Router>
	</Provider>
);

Root.propTypes = {
	store: PropTypes.object.isRequired
};

export default Root;

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import todoApp from './reducers';
import Root from './components/Root';

let store = createStore(todoApp);
render(
	<Root store={store} />,
	doucment.getElementById('root')
);
// - <Link /> components lets you navigate around your application (<NavLink /> if you want style props like activeStyle)
import React from 'react';
import { NavLink } from 'react-router-dom';

const FilterLink = ({ filter, children }) => (
	<NavLink
		to={filter === 'SHOW_ALL' ? '/' : `/${filter}`}
		activeStyle={ {
			textDecoration: 'none',
			color: 'black'
		} }
	>
		{children}
	</NavLink>
);

export default FilterLink;
// can use ownProps to pass in the URL parameters
// -> params property is an object with every param specified in the url with the match object like match.params 
const mapStateToProps = (state, ownProps) => {
  return {
    todos: getVisibleTodos(state.todos, ownProps.filter) // previously was getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
// can access it like so
const App = ({ match: { params } }) => {
  return (
    <div>
      <AddTodo />
      <VisibleTodoList filter={params.filter || 'SHOW_ALL'} />
      <Footer />
    </div>
  )
}

// Writing Tests
// - easy to test pure Redux functions without mocking
// - action creators are functions which return plain objects
// i.e. test whether the correct action creator was called and also whether the right action was returned
export function addTodo(text) {
	return {
		type: 'ADD_TODO',
		text
	};
}

import * as actions from '../../actions/TodoActions';
import * as types from '../../constants/ActionTypes';

describe('actions', () => {
	it('should create an action to add a todo', () => {
		const text = 'Finish docs';
		const expectedAction = {
			type: types.ADD_TODO,
			text
		};
		expect(actions.addTodo(text)).toEqual(expectedAction);
	});
});

// - for async action creators using Redux Thunk or other middleware, best to completely mock the Redux store
// for tests and you can apply the middleware to a mock store using redux-mock-store or use fetch-mock to mock HTTP requests
// i.e. testing fetchTodos
import 'cross-fetch/polyfill'

function fetchTodosRequest() {
  return {
    type: FETCH_TODOS_REQUEST
  }
}

function fetchTodosSuccess(body) {
  return {
    type: FETCH_TODOS_SUCCESS,
    body
  }
}

function fetchTodosFailure(ex) {
  return {
    type: FETCH_TODOS_FAILURE,
    ex
  }
}

export function fetchTodos() {
  return dispatch => {
    dispatch(fetchTodosRequest())
    return fetch('http://example.com/todos')
      .then(res => res.json())
      .then(body => dispatch(fetchTodosSuccess(body)))
      .catch(ex => dispatch(fetchTodosFailure(ex)))
  };
}
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/TodoActions'
import * as types from '../../constants/ActionTypes'
import fetchMock from 'fetch-mock'
import expect from 'expect' // You can use any testing library

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('creates FETCH_TODOS_SUCCESS when fetching todos has been done', () => {
    fetchMock
      .getOnce('/todos', { body: { todos: ['do something'] }, headers: { 'content-type': 'application/json' } })


    const expectedActions = [
      { type: types.FETCH_TODOS_REQUEST },
      { type: types.FETCH_TODOS_SUCCESS, body: { todos: ['do something'] } }
    ]
    const store = mockStore({ todos: [] })

    return store.dispatch(actions.fetchTodos()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
// Testing reducers that return the new state after applying the action to the previous state
import { ADD_TODO } from '../constants/ActionTypes';

const initialState = [
	{
		text: 'Use Redux',
		completed: false,
		id: 0
	}
];

export default function todos(state = initialState, action) {
	switch (action.type) {
		case ADD_TODO:
			return [
				{
					id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
					completed: false,
					text: action.text
				},
				...state
			]

			default:
				return state;
	}
}
import reducer from '../../reducers/todos';
import * as types from '../../constants/ActionTypes';

describe('todos reducer', () => {
	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual([
			{
				text: 'Use Redux',
				completed: false,
				id: 0
			}
		]);
	});

	it('should handle ADD_TODO', () => {
		expect(
			reducer([], {
				type: types.ADD_TODO,
				text: 'Run the tests'
			})
		).toEqual([
			{
				text: 'Run the tests',
				completed: false,
				id: 0
			}
		]);
		expect(
      reducer(
        [
          {
            text: 'Use Redux',
            completed: false,
            id: 0
          }
        ],
        {
          type: types.ADD_TODO,
          text: 'Run the tests'
        }
      )
    ).toEqual([
      {
        text: 'Run the tests',
        completed: false,
        id: 1
      },
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
	});
})
// - since React components are usually small and only rely on props so they're easy to test
// npm install --save-dev enzyme, enzyme-adapter-react-16; setup() helper to pass stubbed callbacks as props and
// renders the component with shallow rendering such that tests can assert on whether the callbacks were called when
// expected
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TodoTextInput from './TodoTextInput';

class Header extends Component {
	handleSave(text) {
		if (text.length !== 0) {
			this.props.addTodo(text);
		}
	}

	render() {
		return (
			<header className="header">
				<h1>todos</h1>
				<TodoTextInput
					newTodo={true}
					onSave={this.handleSave.bind(this)}
					placeholder="What needs to be done?"
				/>
			</header>
		);
	}
}

Header.propTypes = {
	addTodo: PropTypes.func.isRequired
};

export default Header;
// Test with enzyme like this
// -> shallow rendering lets you instantiate a component and effectively get the result of its render method just a single
// level deep instead of rendering components recursively to a DOM, useful for unit tests where you test a particular
// component only and not its children
// --> changing the children won't affect tests for parent component but testing a component and all of its children can
// be accomplished with mount() method which allows for full DOM rendering
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from '../../components/Header';

Enzyme.configure({ adapter: new Adapter() });

function setup() {
	const props = {
		addTodo: jest.fn()
	};

	const enzymeWrapper = mount(<Header {...props} />);

	return {
		props,
		enzymeWrapper
	};
}

describe('components', () => {
	describe('Header', () => {
		it('should render self and subcomponents', () => {
			const { enzymeWrapper } = setup();

			expect(enzymeWrapper.find('header').hasClass('header')).toBe(true);

			expect(enzymeWrapper.find('h1').text()).toBe('todos');

			const todoInputProps = enzymeWrapper.find('TodoTextInput').props();
			expect(todoInputProps.newTodo).toBe(true);
			expect(todoInputProps.placeholder).toEqual('What needs to be done?');
		});

		it('should call addTodo if length of text is greater than 0', () => {
      const { enzymeWrapper, props } = setup();
      const input = enzymeWrapper.find('TodoTextInput');
      input.props().onSave('');
      expect(props.addTodo.mock.calls.length).toBe(0);
      input.props().onSave('Use Redux');
      expect(props.addTodo.mock.calls.length).toBe(1);
    });
	});
});
// If using Redux React and connect(), you're only importing the wrapper component returned by connect()
// - you can wrap it in a <Provider> with a store created specifically for the unit test but other times
// may want to test just the rendering of the component without a Redux store
// -> recommend you to also export the undecorated component
import { connect } from 'react-redux';

// Use named export for unconnected component (for tests)
export class App extends Component {}

// Use default export for the connected component (for app)
export default connect(mapStateToProps)(App);

// Import both like this
import ConnectedApp, { App } from './App';

// For middleware functions that wrap the behavior of dispatch calls in Redux, we need to mock behavior of dispatch call
const thunk = ({ dispatch, getState }) => next => action => {
	if (typeof action === 'function') {
		return action(dispatch, getState);
	}

	return next(action);
}
// - create fake getState, dispatch, and next functions with jest.fn()
const create = () => {
	const store = {
		getState: jest.fn(() => ({})),
		dispatch: jest.fn(),
	};
	const next = jest.fn();
	const invoke = (action) => thunk(store)(next)(action);

	return { store, next, invoke };
}
// Using Immutable.js for immutability and performance
// - data encapsulated is never mutated but a new copy is always returned
// - immutable objects like maps, lists, sets, records, etc. and methods to sort/filter/group/reverse/flatter/subset
// - performance optimizations to large nested Redux state tree by cleverly sharing data structures under surface
// and minimizing the need to copy data; enables chains of operations without creating unnecessary and costly cloned
// intermediate data that will be thrown away
// -> the intermediate data generated within Immutable.JS from a chained sequence of method calls that
// is free to be mutated
// - issues with being difficult to interoperate with other JS objects since immutable
// -> need to use get()/getIn() methods with array of string properties, toJS() method that is slow
// -> will be spread throughout your codebase including components and difficult to remove in the future
// though you can uncouple your app logic from data structures
// -> no destructuring or spread operators so much more verbose code
// -> not suitable for small values that change often but suitable for large collections of data
// -> difficult to debug as inspecting will show entire nested hierarchy of Immutable.JS specific properties
// but you can use browser extension Immutable.js Object Formatter
// -> breaks object references causing poor performance but it allows shallow equality checking
// - helps with problems related to mutating state object from Redux reducer and seeing why components re-render for no reason
// -> performance, rich API for data manipulation
// - best practices with Immutable.JS
// -> never mix plain JS objects with Immutable.js
// -> make your entire Redux state tree an Immutable.js object
// --> create tree using Immutable.js fromJS() function
// --> use Immutable.js-aware version of the combineReducers function such as redux-immutable as Redux itself expects the state
// tree to be a plain JS object
// --> when adding JS objects to Immutable.js map or list using its update, merge, or set methods, ensure that object being added is
// first converted to an Immutable object using fromJS()
const newObj = { key: value };
const newState = state.setIn(['prop1'], fromJS(newObj));
// newObj is now an Immutable.js Map
// -> use Immutable.JS everywhere (smart components, selectors, sagas/thunks, action creators, reducers) except your dumb components
// -> limit your use of toJS() - expensive and negates purpose of using it
// -> your selectors should return Immutable.js objects always
// -> use Immutable.js objects with smart components = access the store via React Redux's connect function must use the
// Immutable.js values returned by your selectors, memoize selectors using library such as reselect if necessary
// -> never use toJS() in mapStateToProps as it returns new object every time causing the component to believe that the object
// has changed every time the state tree changes and trigger an unnecessary re-render
// -> never use Immutable.js in your dumb components as they should be pure, don't pass Immutable.js object as a prop
// -> use higher order component to convert your smart component's immutable.js props to your dumb component's JS props
// --> takes Immutable.js props from smart component, converts them using toJS() to plain JS props passed to dumb component
// i.e. HOC
import React from 'react'
import { Iterable } from 'immutable'

export const toJS = WrappedComponent => wrappedComponentProps => {
  const KEY = 0
  const VALUE = 1

  const propsJS = Object.entries(
    wrappedComponentProps
  ).reduce((newProps, wrappedComponentProp) => {
    newProps[wrappedComponentProp[KEY]] = Iterable.isIterable(
      wrappedComponentProp[VALUE]
    )
      ? wrappedComponentProp[VALUE].toJS()
      : wrappedComponentProp[VALUE]
    return newProps
  }, {})

  return <WrappedComponent {...propsJS} />
}
// - for portability, maintainability and easier testing
import { connect } from 'react-redux'

import { toJS } from './to-js'
import DumbComponent from './dumb.component'

const mapStateToProps = state => {
  return {
    // obj is an Immutable object in Smart Component, but it’s converted to a plain
    // JavaScript object by toJS, and so passed to DumbComponent as a pure JavaScript
    // object. Because it’s still an Immutable.JS object here in mapStateToProps, though,
    // there is no issue with errant re-renderings.
    obj: getImmutableObjectFromStateTree(state)
  }
}
export default connect(mapStateToProps)(toJS(DumbComponent))
// -> use Immutable Object Formatter Chrome Extension to aid debugging

// Code Structure
// - Rails-style: separate folders for "actions", "constants", "reducers", "containers", "components"
// - Domain-style: separate folders per feature or domain, possibly with sub-folders per file type
// - "Ducks": similar to domain style but tying together actions and reducers often by defining them in same file
// -> selected defined alongside reducers and exported and then reused elsewhere like in mapStateToProps functions
// async action creators, sagas to colocate all the code that knows about the actual shape of state tree in reducer files

