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

var reducer = redux.combineReducers({
  // name state managed by nameReducer
  name: nameReducer,
  // hobbies array state managed by hobbiesReducer
  hobbies: hobbiesReducer
});
