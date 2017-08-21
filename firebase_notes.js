/*
  Firebase:
  - JSON store for your data, more like NoSQL
  - npm install --save firebase
  - Create a new project on google.firebase.com
  - See data and rules sections under database tab (set .read and .write to true)
*/
// Index.js
import firebase from 'firebase';

var config = {
  apiKey: 'apikey_goes_here',
  authDomain: 'sample-app-number.firebaseapp.com',
  databaseURL: 'https://sample-app-number.firebaseio.com',
  storageBucket: 'sample-app-number.appspot.com'
};

firebase.initializeApp(config);

// Sets some data in the database
var firebaseRef = firebase.database().ref();

// Have promise returned for success and failed with .then
firebaseRef.set({
  app: {
    name: 'Todo App',
    version: '1.0.0'
  },
  isRunning: true,
  user: {
    name: 'Alfred',
    age: '22'
  }
}).then(() => {
  console.log('Set worked!');
}, (error) => {
  console.error('Set failed!');
});

// Wipes the previous data at current reference with set
// firebaseRef.set({
//   appName: 'Todo Application'
// });

// Lets you specify which child you want to reference 
// and set new properties
firebaseRef.child('user').set({
  name: 'Regine',
  age: '21'
});

// Wipes the version and only as name property now
firebaseRef.child('app').set({
  name: 'Todo Application'
});

// This updates specifically the isRunning property and doesn't wipe other shtuff
// Can also do multipath update solution like app/name -> app: { name: ... }
firebaseRef.update({
  isRunning: false,
  'app/name': 'Todo Applicacion'
}).then(() => {
  console.log('Update worked!');
}, (error) => {
  console.log('Update failed!');
});

// To remove the age property, can either call remove() or update property to null
firebaseRef.child('user/age').remove();
// OR
firebaseRef.child('user').update({
  name: 'Alfred',
  age: null
});
// firebaseRef.remove(); to clear the whole database

// Fetching data using once() to retrieve snapshot of data
firebaseRef.once('value').then((snapshot) => {
  console.log('Got entire database', snapshot.val());
}, (error) => {
  console.error('Unable to fetch whole database value', error);
});

// Can also fetch subset of data
firebaseRef.child('app').once('value').then((snapshot) => {
  console.log('Got database app property', snapshot.key, snapshot.val());
}, (error) => {
  console.error('Unable to fetch app value', error);
});

// Listening for changes in Firebase database with .on()
firebaseRef.on('value', (snapshot) => {
  console.log('New value', snapshot.val());
});

// Turn off event listener with firebaseRef.off();
// Can also turn off one specific listener like firebaseRef.off(eventListenerFunction);

// Problems of read and write conflicts with arrays, so Firebase uses objects
// and the keys will be the unique id and property will be the data fields
var notesRef = firebaseRef.child('notes');

// Event listener fired everytime a new note added
notesRef.on('child_added', (snapshot) => {
  console.log('Child_added', snapshot.key, snapshot.val());
});

notesRef.on('child_changed', (snapshot) => {
  console.log('Child_changed', snapshot.key, snapshot.val());
});

notesRef.on('child_removed', (snapshot) => {
  console.log('Child_removed', snapshot.key, snapshot.val());
});

// Push to objects instead for new items
var newNoteRef = notesRef.push();
newNoteRef.set({
  text: 'Write react app'
});

notesRef.push({
  text: 'Walk my doge'
});

console.log('Todo id', newNoteRef.key);

// Sample integrating it with Redux asynchronous actions and redux thunk
export var startAddTodo = (text) => {
  return (dispatch, getState) => {
    var todo = {
      text,
      completed: false,
      createdAt: moment().unix(),
      completedAt: null
    };
    var todoRef = firebaseRef.child('todos').push(todo);

    return todoRef.then(() => {
      dispatch(addTodo({
        ...todo,
        id: todoRef.key
      }));
    });
  }
}

// Sample adding todos in the beginning from Firebase
export var startAddTodos = () => {
  return (dispatch, getState) => {
    var todosRef = firebaseRef.child('todos');

    // Retrieve todos from Firebase
    return todosRef.once('value').then((snapshot) => {
      var todos = snapshot.val() || {};
      var parsedTodos = [];

      Object.keys(todos).forEach((todoId) => {
        parsedTodos.push({
          id: todoId,
          ...todos[todoId]
        });
      });

      // Update redux store to re-render the display
      // with todos retrieved from Firebase
      dispatch(addTodos(parsedTodos));
    });
  };
};

// Sample testing this for add todo and update todo
it('should create todo and dispatch ADD_TODO', (done) => {
  const store = createMockStore({});
  const todoText = 'My todo item';

  store.dispatch(actions.startAddTodo(todoText)).then(() => {
    const actions = store.getActions();
    expect(actions[0]).toInclude({
      type: 'ADD_TODO'
    });
    expect(actions[0].todo).toInclude({
      text: todoText
    });
    done();
  }).catch(done);
});


describe('Tests with firebase todos', () => {
  var testTodoRef;

  beforeEach((done) => {
    testTodoRef = firebaseRef.child('todos').push();

    testTodoRef.set({
      text: 'Something',
      completed: false,
      createdAt: 1234123
    }).then(() => done());
  });

  afterEach((done) => {
    testTodoRef.remove().then(() => done());
  });

  it('should toggle todo and dispatch UPDATE_TODO action', (done) => {
    const store = createMockStore({});
    const action = actions.startToggleTodo(testTodoRef.key, true);

    store.dispatch(action).then(() => {
      const mockActions = store.getActions();

      expect(mockActions[0]).toInclude({
        type: 'UPDATE_TODO',
        id: testTodoRef.key
      });

      expect(mockActions[0].updates).toInclude({
        completed: true
      });

      expect(mockActions[0].updates.completedAt).toExist();

      done();
    }, done);
  });
});

// Sample Login/Logout Authentication with Github
export var startLogin = () => {
  return (dispatch, getState) => {
    return firebase.auth().signInWithPopup(githubProvider).then((result) => {
      console.log('Auth worked!', result);
    }, (error) => {
      console.log('Unable to auth', error);
    });
  };
};

export var startLogout = () => {
  return (dispatch, getState) => {
    return firebase.auth().signOut().then(() => {
      console.log('Logged out!');
    });
  };
};

// For redirects on logged in vs. logged out
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(actions.login(user.uid))
    store.dispatch(actions.startAddTodos());
    hashHistory.push('/todos');
  } else { 
    store.dispatch(actions.logout());
    hashHistory.push('/');
  }
});

var requireLogin = (nextState, replace, next) => {
  if (!firebase.auth().currentUser) {
    replace('/');
  }
  next();
};

var redirectIfLoggedIn = (nextState, replace, next) => {
  if (firebase.auth().currentUser) {
    replace('/todos');
  }
  next();
};

// Firebase rules
{
  "rules": {
    ".read": "auth !== null",
    ".write": "auth !== null",
    "users": {
      "$user_id": {
        ".read": "$user_id === auth.uid",
        ".write": "$user_id === auth.uid"
      }
    }
  }
}

// <Route path="todos" component={TodoApp} onEnter={requireLogin}/>
// <IndexRoute component={Login} onEnter={redirectIfLoggedIn}/>
