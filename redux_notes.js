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
  2. store
  3. reducers
*/
