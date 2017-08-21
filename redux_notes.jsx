/*
  Redux:
  - predictable state container for JS apps, application data-flow architecture
  - maintains application state in a single immutable state tree (object) which can't be changed directly
  - when something changes, a new object is created (using actions and reducers)
  - doesn't have a dispatcher like Flux that broadcasts payloads to registered callbacks
  - benefits such as predictability of outcome (one source of truth/store), server rendering,
  dev tools to track actions to state changes, ease of testing small, pure, isolated functions
  - can be used with any other view library such as React, 2KB library
  - data flow: view events/user interaction -> action creator dispatching actions -> affects the store
  and application state with reducers -> new state updates the view/ui
  - three building parts:
  1. actions - events, send data from application to store, internal actions are simple JS objects with
  a type property (usually constant) and with payload
  - call actions with dispatch method i.e. dispatch(authUser(form));
  i.e. action
  { 
    type: LOGIN_FORM_SUBMIT,
    payload: { username: 'alfred', password: 'darkness' }
  }
  i.e. action creator
  function authUser(form) {
    return {
      type: LOGIN_FORM_SUBMIT,
      payload: form
    }; 
  }
  - created with action creators: functions that return actions
  2. store - object that holds the application state and provides few helper methods to access the state,
  dispatch actions, and register listeners (any action returns new state via reducers)
  i.e. import { createStore } from 'redux';
  let store = createStore(rootReducer);
  let authInfo = { username: 'Alfred', password: 'darkness' };
  store.dispatch(authUser(authInfo));
  3. reducers - based on array reduce method where it accepts a callback reducer and lets you get
  a single value out of multiple values, sums of integers, or an accumulation of streams of values
  -> pure functions that take the current state of the application and an action and returns a new state
  i.e.
  function handleAuth(state, action) {
    return _.assign({}, state, {
      auth: action.payload
    });
  }
  const rootReducer = combineReducers({
    handleAuth: handleAuth,
    editProfile: editProfile,
    changePassword: changePassword
  });
  - Redux DevTools to show state's changes over time, real-time changes, actions, and current state
  -> "time travel" features such as reset, revert, sweep, commit for debugging
*/
// Sample React/Redux set up
// Passing application state down to children components, registering the store listener with a subscribe helper method
// Reducer
const auth = function(state = { status: 'logged out', value: 'guest' }, action) {
  switch (action.type) {
    case 'LOGIN':
      return Object.assign({}, state, {
        status: 'logged in',
        value: action.value
      });
    case 'LOGOUT':
      return Object.assign({}, state, {
        status: 'logged out',
        value: action.value
      });
    default:
      return state;
  }
};

// Store
const { createStore } = Redux;
const store = createStore(auth);

// React Component
var Auth = React.createClass({
  handleLogin: function() {
    let username = this.refs.username.value;
    // Dispatch action
    store.dispatch({
      type: 'LOGIN',
      value: username
    });
  },
  handleLogout: function() {
    // Dispatch action
    store.dispatch({
      type: 'LOGOUT',
      value: 'guest'
    });
    this.refs.username.value = '';
  },
  render: function() {
    return (
      <div>
        <input type="text" ref="username"/>
        <input type="button" value="Login" onClick={this.handleLogin} />
        <h1>Current state is {this.props.state.status + ' as ' + this.props.state.value}</h1>
      </div>
    );
  }
});

const render = function() {
  ReactDOM.render(
    <Auth state={store.getState()}/>,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();

/*
  Problems Redux solves:
  - Need to pass data down from parent to the components
  - Need parent to have a lot of handler methods to pass to children
  and communicate
  How?
  - We dispatch actions from our components that update our state and pass it to the components
  that rely on the new state
  - Makes it simpler and not maintain as many things, returns a new object for state, pure functions
*/
// redux-example.jsx
var redux = require('redux');

var stateDefault = {
  name: 'Anonymous',
  hobbies: []
};
var nextHobbyId = 1;

// Given state and action, return new state
// Starts with @INIT with defaults first then any succeeding actions dispatched
var reducer = (state = stateDefault, action) => {
  switch (action.type) {
    case 'CHANGE_NAME':
      return {
        ...state,
        name: action.name
      };
    case 'ADD_HOBBY':
      return {
        ...state,
        hobbies: [
          ...state.hobbies,
          {
            id: nextHobbyId++,
            hobby: action.hobby
          }
        ]
      };
    case 'REMOVE_HOBBY':
      return {
        ...state,
        hobbies: state.hobbies.filter(hobby => hobby.id !== action.id);
      };
    default:
      return state;
  }
};

// Creates single store of application state
var store = redux.createStore(reducer, redux.compose(
  // Lets you take advantage of Redux Dev Tools
  window.devToolsExtension ? window.devToolsExtension() : f => f;
));

var currentState = store.getState();

// Subscribe to changes
var unsubscribe = store.subscribe(() => {
  var state = store.getState();

  document.getElementById('app').innerHTML = state.name;
});

// Dispatching an action
var action = {
  type: 'CHANGE_NAME',
  name: 'Alfred Lucero'
};

store.dispatch(action);

store.dispatch({
  type: 'ADD_HOBBY',
  hobby: 'Running'
});

store.dispatch({
  type: 'REMOVE_HOBBY',
  id: 1
});

unsubscribe();

// Working with multiple reducers, using combineReducers
// Using action generators to help with dispatching actions easier
var nameReducer = (state = 'Anonymous', action) => {
  // Not returning an object anymore but a property value that will
  // go into name: nameReducer in combineReducers
  switch (action.type) {
    case 'CHANGE_NAME':
      return action.name;
    default: 
      return state;
  }
};

var changeName = (name) => {
  return {
    type: 'CHANGE_NAME',
    name
  };
};

// To call action: store.dispatch(changeName('Alfred'));

// Way simpler now that state is only array, not object with properties
// we do not care about for these actions
// can go into hobbies reducer file
var hobbiesReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_HOBBY':
      return [
        ...state,
        {
          id: nextHobbyId++,
          hobby: action.hobby
        }
      ];
    case 'REMOVE_HOBBY':
      return state.filter(hobby => hobby.id !== action.id);
    default:
      return state;
  }
};

// Can go into hobbies actions file
var addHobby = (hobby) => {
  return {
    type: 'ADD_HOBBY',
    hobby
  };
};

var removeHobby = (id) => {
  return {
    type: 'REMOVE_HOBBY',
    id
  };
};

// To call actions: store.dispatch(addHobby('running'));
// store.dispatch(removeHobby(1));

// Asynchronous reducers and actions
var mapReducer = (state = { isFetching: false, url: undefined }, action) => {
  switch (action.type) {
    case 'START_LOCATION_FETCH':
      return {
        isFetching: true,
        url: undefined
      };
    case 'COMPLETE_LOCATION_FETCH';
      return {
        isFetching: false,
        url: action.url
      };
    default:
      return state;
  }
};

var startLocationFetch = () => {
  return {
    type: 'START_LOCATION_FETCH'
  };
};

var completeLocationFetch = (url) => {
  return {
    type: 'COMPLETE_LOCATION_FETCH',
    url
  };
};

var fetchLocation = () => {
  // Might render a loading wheel here
  store.dispatch(startLocationFetch());

  // Make asynchronous request to third party API
  // using axios
  axios.get('http://ipinfo.io').then(function(res) {
    var loc = res.data.loc;
    var baseUrl = 'http://maps.google.com?q=';

    // Finish the loading and render data related to location
    store.dispatch(completeLocationFetch(baseUrl + loc));
  });
};

var reducer = redux.combineReducers({
  // name state managed by nameReducer
  name: nameReducer,
  // hobbies array state managed by hobbiesReducer
  hobbies: hobbiesReducer,
  map: mapReducer
});

var unsubscribe = store.subscribe(() => {
  var state = store.getState();

  if (state.map.isFetching) {
    document.getElementById('app').innerHTML = 'Loading...'; 
  } else if (state.map.url) {
    document.getElementById('app').innerHTML = '<a href="' + state.map.url + '" target="_blank">View your Location</a>';
  }
});

// Sample directory structure
// actions folder, components folder, reducers folder, store folder
// index.jsx inside actions, reducers; configureStore.jsx inside store

// Actions to test
export var setSearchText = (searchText) => {
  return {
    type: 'SET_SEARCH_TEXT',
    searchText
  };
};

export var addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    text
  };
};

// Creating and Testing Actions
var expect = require('expect');
var actions = require('actions');

describe('Actions', () => {
  it('should generate search text action', () => {
    var action = {
      type: 'SET_SEARCH_TEXT',
      searchText: 'Some search text'
    };
    
    var result = actions.setSearchText(action.searchText);
    expect(result).toEqual(action);
  });

  it('should generate add todo action', () => {
    var action = {
      type: 'ADD_TODO',
      text: 'Todo text'
    };

    var result = actions.addTodo(action.text);
    expect(result).toEqual(action);
  });
});

// Creating and testing reducers
// Can use deep-freeze-strict to make sure arguments aren't changed
// or updated like setting action.something = 2 -> would fail when calling df(argument)
export var searchTextReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_SEARCH_TEXT':
      return action.searchText;
    default:
      return state;
  }
};

var expect = require('expect');
var reducers = require('reducers');

describe('Reducers', () => {
  describe('searchTextReducer', () => {
    it('should set searchText', () => {
      var action = {
        type: 'SET_SEARCH_TEXT',
        searchText: 'dog'
      };

      var res = reducers.searchTextReducer('', action);
      expect(res).toEqual(action.searchText);
    });
  });

  describe('todosReducer', () => {
    it('should add new todo', () => {
      var action = {
        type: 'ADD_TODO',
        text: 'Walk the dog'
      };
      var res = reducers.todosReducer(df([]), df(action));

      expect(res.length).toEqual(1);
      expect(res[0].text).toEqual(action.text);
    });
  });
});

// Wiring up redux in a TodoApp 
var React = require('react');
var ReactDOM = require('react-dom');
var { Provider } = require('react-redux');
var { Route, Router, IndexRoute, hashHistory } = require('react-router');

var TodoApp = require('TodoApp');

var actions = require('actions');
var store = require('configureStore').configure();

store.subscribe(() => {
  console.log('New state', store.getState());
  // Taking advantage of localStorage here
  TodoApi.setTodos(state.todos);
});

store.dispatch(actions.addTodo('Clean the yard'));
store.dispatch(actions.setSearchText('yard'));
store.dispatch(actions.toggleShowCompleted());

$(document).foundation();

require('style!css!sass!applicationStyles');

// Provider lets all of our components under
// TodoApp access the store and dispatch actions
ReactDOM.render(
  <Provider store={store}>
    <TodoApp/>
  </Provider>,
  document.getElementById('app');
);

// Sample TodoList.jsx, no need to pass data down from TodoApp anymore
var React = require('react');
var { connect } = require('react-redux');
var Todo = require('Todo');

var TodoList = React.createClass({
  render: function() {
    var { todos } = this.props;
    var renderTodos = () => {
      if (todos.length === 0) {
        return (
          <p className="container__message">Nothing To Do</p>
        );
      }

      // We also don't need to pass the toggleHandler anymore down to the Todo component
      // because it will only dispatch an action now
      return todos.map((todo) => {
        return (
          <Todo key={todo.id} {...todo}/>
        );
      })
    };

    return (
      <div>
        {renderTodos()}
      </div>
    );
  }
});

// Connecting TodoList to our Provider to request
// data it needs to render; first argument in connect
// corresponds to the state data it wants back and passed through props
module.exports = connect(
  (state) => {
    return {
      todos
    };
  }
)(TodoList);

// Sample Todo.jsx
var React = require('react');
var { connect } = require('react-redux');
var moment = require('moment');
var actions = require('actions');

export var Todo = React.createClass({
  render: function() {
    var { id, text, completed, createdAt, completedAt, dispatch } = this.props;
    var todoClassName = completed ? 'todo todo-completed' : 'todo';
    var renderDate = () => {
      var message = 'Created ';
      var timestamp = createdAt;

      if (completed) {
        message = 'Completed ';
        timestamp = completedAt;
      }

      return message + moment.unix(timestamp).format('MMM Do YYYY @ h:mm a');
    };

    return (
      <div className={todoClassName} onClick=(() => {
        dispatch(actions.toggleTodo(id));
      })>
        <div>
          <input type="checkbox" checked={completed}/>
        </div>
        <div>
          <p>{text}</p>
          <p className="todo__subtext">{renderDate()}</p>
        </div>
      </div>
    );
  }
});

// Doesn't need more data since already passed through props from TodoList
// but we can also get access to dispatch method from props
export default connect()(Todo);

// Sample Todo.test.jsx
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var expect = require('expect');
var $ = require('jquery');

var { Todo } = require('Todo');

describe('Todo', () => {
  it('should exist', () => {
    expect(Todo).toExist();
  });

  it('should dispatch TOGGLE_TODO action on click', () => {
    var todoData = {
      id: 199,
      text: 'Write todo.test.jsx test',
      completed: true
    };

    var spy = expect.createSpy();
    var todo = TestUtils.renderIntoDocument(<Todo {...todoData} dispatch={spy}/>);
    var $el = $(ReactDOM.findDOMNode(todo));

    TestUtils.Simulate.click($el[0]);

    expect(spy).toHaveBeenCalledWith({
      type: 'TOGGLE_TODO',
      id: todoData.id
    });
  });
});

// Sample TodoApp.test.jsx
var React = require('react');
var ReactDOM = require('react-dom');
var { Provider } = require('react-redux');
var TestUtils = require('react-addons-test-utils');
var expect = require('expect');
var $ = require('jquery');

var configureStore = require('configureStore');
var TodoApp = require('TodoApp');
var TodoList = require('TodoList');

describe('TodoApp', () => {
  it('should exist', () => {
    expect(TodoApp).toExist();
  });

  it('should render TodoList', () => {
    var store = configureStore.configure();
    var provider = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TodoApp/>
      </Provider>
    );

    var todoApp = TestUtils.scryRenderedComponentsWithType(provider, TodoApp)[0];
    var todoList = TestUtils.scryRenderedComponentsWithType(todoApp, TodoList);

    expect(todoList.length).toEqual(1);
  });
});

// Refactored TodoSearch.jsx
var React = require('react');
var { connect } = require('react-redux');
var actions = require('actions');

export var TodoSearch = React.createClass({
  render: function() {
    var { dispatch, showCompleted, searchText } = this.props;

    return (
      <div className="container__header">
        <div>
          <input type="search" ref="searchText" placeholder="Search todos" value={searchText} onChange={() => {
            var searchText = this.refs.searchText.value;
            dispatch(actions.setSearchText(searchText))
          }}/>
        </div>
        <div>
          <label>
            <input type="checkbox" ref="showCompleted" checked={showCompleted} onChange={() => {
              dispatch(actions.toggleShowCompleted());
            }}/>
            Show Completed Todos
          </label>
        </div>
      </div>
    );
  }
});

export default connect(
  (state) => {
    return {
      showCompleted,
      searchText
    };
  }
)(TodoSearch);

// Sample TodoSearch.test.jsx
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var expect = require('expect');
var $ = require('jquery');

import { TodoSearch } from 'TodoSearch';

describe('TodoSearch', () => {
  it('should exist', () => {
    expect(TodoSearch).toExist();
  });

  it('should dispatch SET_SEARCH_TEXT on input change', () => {
    var searchText = 'Hello';
    var action = {
      type: 'SET_SEARCH_TEXT',
      searchText
    };
    var spy = expect.createSpy();
    var todoSearch = TestUtils.renderIntoDocument(<TodoSearch dispatch={spy}/>);

    todoSearch.refs.searchText.value = searchText;
    TestUtils.Simulate.change(todoSearch.refs.searchText);

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should call onSearch with proper checked value', () => {
    var action = {
      type: 'TOGGLE_SHOW_COMPLETED'
    };
    var spy = expect.createSpy();
    var todoSearch = TestUtils.renderIntoDocument(<TodoSearch dispatch={spy}/>);

    todoSearch.refs.showCompleted.checked = true;
    TestUtils.Simulate.change(todoSearch.refs.showCompleted):

    expect(spy).toHaveBeenCalledWith(action)
  });
});

/*
  Store is created with the createStore() factory which accepts three parameters:
  1. Root reducer: master reducer combining all your reducers
  2. Initial state: initial state of app determined by reducers
  3. Middleware/enhancers: third party libraries which intercept each redux action
  dispatched to the redux store and then does stuff such as redux-logger
  i.e. Router middleware to keep routes in sync with redux store
  redux saga to manage side-effects of dispatching actions asynchronously or
  accessing browser data
  - mapDispatchToProps(): provide outgoing action creators to the react component through this method
  - mapStateToProps(): provide incoming state from Redux store to the react components through this method
  and this can be filtered by selectors and will not provide irrelevant data
  - sample flow of changeUsername action function:
  1. changeUsername() sends text to the Redux store
  2. store consults with corresponding reducer
  3. that reducer computes a new state tree and the store will update its state with the newly typed data
  4. an update has occurred in the state, therefore mapStateToProps() will be triggered and your react component
  will get the new data
  5. updated data will be set as the value to your component say <Input />
*/

/*
  Reselect: library used for slicing redux state and providing only the relevant sub-tree to
  a react component
  - provides computational power, memoization, composability
  - filters original array, caches results, and can combine multiple selectors
*/

/*
  Redux Saga: helps with side-effect management when interacting with some back-end application for data
  - typically before for every API call, we define three kinds of action creators
  API_REQUEST: Upon dispatching this, your application should show a spinner to let the user know that something's happening
  API_SUCCESS: Upon dispatching this, your application should show the data to the user
  API_FAILURE: Upon dispatching this, your application should show an error message to the user
  - What if there was a background process that handles multiple actions simultaneously, communicates
  with redux store and react containers at the same time?
  -> saga is like a separate thread in your application that's solely responsible for side effects
  - redux middleware which means this thread can be started, paused, and cancelled from the main application with normal redux actions,
  has access to full redux application state and it can dispatch redux actions as well
  - basically ES6 generator functions with yield, used to make API calls and intercept actions dispatched to Redux store
  (can be "paused" and "resumed" at any point in time)
  - declarative API for managing asynchronous operations
  - you can fork a saga to send it to the background so your code won't get blocked when sage is continuously running
  - takeLatest is used for listening for a particular action
*/


