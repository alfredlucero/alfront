// Unit Testing: practice of testing the smallest possible units of our code, functions
// with Jest to run tets and make assertions
// - describe a unit of your code and expect it to do the correct thing

// Sample unit testing add function with Jest
import { add } from './add.js';

describe('add()', () => {
  it('adds two numbers', () => {
    expect(add(2, 3).toEqual(5));
  });

  it('does not add the third number', () => {
    expect(add(2, 3, 5)).toEqual(add(2, 3));
  });
});

// Sample unit testing redux actions and reducers with Jest
// actions.js
import { TOGGLE_NAV } from './constants.js';

export function toggleNav() {
  return { type: TOGGLE_NAV };
}

// reducer.js
import { TOGGLE_NAV } from './constants.js';

const initialState ={
  open: false
};

function NavBarReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_NAV:
      return Object.assign({}, state, {
        open: !state.open
      });
    default:
      return state;
  }
}

export default NavBarReducer;

// reducer.test.js
import NavBarReducer from '../reducer';
import { TOGGLE_NAV } from '../constants';

describe('NavBarReducer', () => {
  it('returns the initial state', () => {
    // We have to explicitly write the inital state
    // so we can use Jest snapshots so we don't have to manually update when it changes
    // expect(NavBarReducer(undefined, {})).toEqual({
    //   open: false
    // });
    expect(NavBarReducer(undefined, {})).toMatchSnapshot();
  });

  it('handles the toggleNav action', () => {
    // ...
  });
});

// actions.test.js
import { toggleNav } from '../actions';
import { TOGGLE_NAV } from '../constants';

describe('Navbar actions', () => {
  describe('toggleNav', () => {
    it('should return the correct constant', () => {
      expect(toggleNav()).toEqual({
        type: TOGGLE_NAV
      });
    });
  });
});

// Component Testing
// Shallow Rendering: renders a React component one level deep, great with isolating the problem's cause since we don't
// render any other components other than the one we're testing, all assertions have to be done manually and can't do anything
// that needs the DOM
// Enzyme is a testing utility that gives us a nice assertion/traversal/manipulation API (wrapper around React shallow renderer and jsdom)

// Button.react.js
import CheckmarkIcon from './CheckmarkIcon.react';

function Button(props) {
  return (
    // <button className="btn" onClick={props.onClick}>
    //   // Won't be rendered
    //   <CheckmarkIcon/>
    //   { React.Children.only(props.children) }
    // </button>
  );
}

export default Button;

// Sample Button.test.js
describe('<Button />', () => {
  it('renders a <button>', () => {
    const renderedComponent = shallow(<Button></Button>);
    expect(
      renderedComponent.find("button").node
    ).toBeDefined();
  });

  it('renders its children', () => {
    const text = "Click me!";
    const renderedComponent = shallow(
      <Button>{ text }</Button>
    );
    expect(
      renderedComponent.contains(text)
    ).toEqual(true);
  });

  it('handles clicks', () => {
    // Spy is a function that knows if, and how often, it has been called
    // Here we pass it as the onClick handler to our component, simulate a click on the rendered <button> element
    // and see that our Spy was called
    const onClickSpy = jest.fn();
    const renderedComponent = shallow(<Button onClick={onClickSpy} />);
    renderedComponent.find('button').simulate('click');
    expect(onClickSpy).toHaveBeenCalled();
  });
});

// (in react-boilerplate)
// Remote testing with ngrok -> will start a server and tunnel it with ngrok and will show
// the version of your application in the build folder and accessible publicly


// Using Enzyme with React 16 - JS testing utility for React to make it easier to assert, manipulate, and traverse
// your React Components' output, mimics jQuery's API for DOM manipulation and traversal
// npm i --save react@16 react-dom@16
// npm i --save-dev react-test-renderer@16
// npm i --save-dev enzyme enzyme-adapter-react-16
// Setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Test file
import { shallow, mount, render } from 'enzyme';
const wrapper = shallow(<Foo />);

// Shallow Rendering - useful to constrain yourself to testing a component as a unit and to ensure that your tests aren't
// indirectly asserting on behavior of child components
import { shallow } from 'enzyme';
import sinon from 'sinon';

describe('<MyComponent />', () => {
  it('should render three <Foo /> components', () => {
    const wrapper = shallow(<MyComponent />);
    expect(wrapper.find(Foo)).to.have.length(3);
  });

  it('should render an `.icon-start`', () => {
    const wrapper = shallow(<MyComponent />);
    expect(wrapper.find('.icon-start')).to.have.length(1);
  });

  it('should render children when passed in', () => {
    const wrapper = shallow((
      <MyComponent> 
        <div className="unique" />
      </MyComponent>
    ));
    expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  });

  it('simulates click events', () => {
    const onButtonClick = sinon.spy();
    const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
    wrapper.find('button').simulate('click');
    expect(onButtonClick.calledOnce).to.equal(true);
  });
});

// Full DOM rendering (mount(...)) - ideal for use cases where you have components that may interact with ODM APIs or require
// the full lifecycle in order to fully test the component (i.e. componentDidMount, etc);
// - requires a full DOM API to be available at global scope, environment needs to look like a browser like "jsdom" - headless browser
// - actually mounts the component in the DOM which means that tests can affect each other if all using same DOM
// - use .unmount() if necessary for cleanup
import { mount } from 'enzyme';
import sinon from 'sinon';
import Foo from '../Foo';

describe('<Foo />', () => {
  it('calls componentDidMount', () => {
    sinon.spy(Foo.prototype, 'componentDidMount');
    const wrapper = mount(<Foo />);
    expect(Foo.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  it('allows us to set props', () => {
    const wrapper = mount(<Foo bar="baz" />);
    expect(wrapper.props().bar).to.equal('baz');
    wrapper.setProps({ bar: 'foo' });
    expect(wrapper.props().bar).to.equal('foo');
  });

  it('simulates click events', () => {
    const onButtonClick = sinon.spy();
    const wrapper = mount((
      <Foo onButtonClick={onButtonClick} />
    ));
    wrapper.find('button').simulate('click');
    expect(onButtonClick.calledOnce).to.equal(true);
  });
});

// Static rendering with render function to render react components to static HTML and analyze the resulting HTML structure
// - render returns a wrapper that uses a third party HTML parsing and traversal library Cheerio
import React from 'react';
import { render } from 'enzyme';
import PropTypes from 'prop-types';

describe('<Foo />', () => {
  it('renders three `.foo-bar`s', () => {
    const wrapper = render(<Foo />);
    expect(wrapper.find('.foo-bar')).to.have.length(3);
  });

  it('rendered the title', () => {
    const wrapper = render(<Foo title="unique" />);
    expect(wrapper.text()).to.contain('unique');
  });

  it('can pass in context', () => {
    function SimpleComponent(props, context) {
      const { name } = context;
      return <div>{name}</div>;
    }
    SimpleComponent.contextTypes = {
      name: PropTypes.string,
    };

    const context = { name: 'foo' };
    const wrapper = render(<SimpleComponent />, { context });
    expect(wrapper.text()).to.equal('foo');
  });
});

// Selectors
// 1. Valid CSS selector for class syntax, tag syntax, id syntax, prop syntax
// contextual selectors and combining selectors
const wrapper = mount((
  <div>
    <span foo={3} bar={false} title="baz" />
  </div>
));

wrapper.find('[foo=3]');
wrapper.find('[bar=false]');
wrapper.find('[title="baz"]');

// 2. React Component Constructor
function MyComponent() {
  return <div />;
}

// find instances of MyComponent
const myComponents = wrapper.find(MyComponent);

// 3. React Component's displayName
// displayName must start with a capital letter and is a string
function MyComponent() {
  return <div />;
}
MyComponent.displayName = 'My Component';

// find instances of MyComponent
const myComponents = wrapper.find('My Component');

// 4. Object Property Selector
// find components and nodes based on a subset of their properties
const wrapper = mount((
  <div>
    <span foo={3} bar={false} title="baz" />
  </div>
));

wrapper.find({ foo: 3 });
wrapper.find({ bar: false });
wrapper.find({ title: 'baz' });
// undefined properties are not allowed in the object property selector and will cause an error
// to search by undefined use .findWhere()



// Jest - js testing for React, snapshot, watch mode for changed files, parallelizes test runs and sandboxed
// code coverage reports with --coverage, mocking library, works with typescript, integrates with babel
// npm install --save-dev jest
// Using Matchers
// - let you test values in different ways
// i.e. exact equality
test('two plus two is four', () => {
  // toBe -> ===
  expect(2 + 2).toBe(4);
});

// i.e. checking value of an object with toEqual, recursively chcks every field of an object or array
test('object assignment', () => {
  const data = { one: 1 };
  data['two'] = 2;
  expect(data).toEqual({one: 1, two: 2});
});

// i.e. testing the opposite of the match with not
test('ading positive numbers is not zero', () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});

// Truthiness for undefined, null, false
test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

// Comparing numbers
test('two plus two', () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);

  // toBe and toEqual are equivalent for numbers
  expect(value).toBe(4);
  expect(value).toEqual(4);
});

test('adding floating point numbers', () => {
  const value = 0.1 + 0.2;
  expect(value).not.toBe(0.3); // rounding error
  expect(value).toBeCloseTo(0.3);
});

// Strings with toMatch
test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});

// Arrays with toContain
const shoppingList = [ 'beer', 'food' ];
test('shopping list has beer on it', () => {
  expect(shoppingList).toContain('food');
});

// Exceptions with toThrow
function comipleAndroidCode() {
  throw new ConfigError('You are using the wrong JDK');
}

test('compiling android goes as expected', () => {
  expect(compileAndroidCode).toThrow();
  expect(compileAndroidCode).toThrow(ConfigError);

  // Can also use the exact error message or regexp
  expect(compileAndroidCode).toThrow('you are using the wrong JDK');
  expect(compileAndroidCode).toThrow(/JDK/);
});

// Testing Asynchronous Code
// Callbacks and using done()
test('the data is peanut butter', done => {
  function callback(data) {
    expect(data).toBe('peanut butter');
    done();
  }

  fetchData(callback);
});

// Promises - if promise rejected, test automatically fails
test('the data is peanut butter', () => {
  expect.assertions(1);
  // need to return the promise or else test will complete before fetchData completes
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
// If you expect promise to be rejected, use the .catch method and add expect.assertions to verify that a certain
// number of assertions are called otherwise a fulfilled promise would not fail the test
test('the fetch fails with an error', () => {
  expect.assertions(1);
  return fetchData().catch(e => {
    expect(e).toMatch('error');
  });
});
// Can also use .resolves and Jest will wait for that promise to resolve; if rejected, fail automatically
test('the data is peanut butter (resolves)', () => {
  expect.assertions(1);
  return expect(fetchData()).resolves.toBe('peanut butter');
});
// Can use .rejects for opposite case
test('the fetch fails with an error', () => {
  expect.assertions(1);
  return expect(fetchData()).rejects.toMatch('error');
});

// Async/Await by using async keyword in front of the function passed to test
// can also use with .resolves or .rejects
test('the data is peanut butter', async () => {
  expect.assertions(1);
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch(e) {
    expect(e).toMatch('error');
  }
});

// Setup and Teardown
// using beforeEach and afterEach - can handle async code by taking a done parameter or return a promise
beforeEach(() => {
  initializeCityDatabase();
});

afterEach(() => {
  clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});

// beforeAll and afterAll for one time setup
// scoping: by default the before and after blocks apply to every test in a file
// can group tests together using a describe block and before and after is only scoped to within that
describe('matching cities to foods', () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test('Vienna', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
  });

  test('San Juan', () => {
    expect(isValidCityFoodPair('San Juan', 'Mofong')).toBe(true);
  });
});

// to run only one test, change it to test.only
// also check shared state in beforeEach/add another beforeEach to log stuff if not failing in isolation
// but failing together with whole test suite
test.only('this will be the only test that runs', () => {
  expect(true).toBe(false);
});

test('this test will not run', () => {
  expect('A').toBe('A');
});

// Mock Functions
// - make it easy to test the links between code by erasing the actual implementation of a function,
// capturing calls to the function (and parameters passed in those calls), capturing instances of constructor
// functions when instantiated with new, and allowing test-time configuration of return values
// - two ways to mock functions: creating a mock function to use in test code or writing
// a manual mock to override a module dependency
// i.e. using a mock function
function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}

// We can test the forEach by using a mock function and inspect the mock's state
// to ensure the callback is invoked as expected
const mockCallback = jest.fn();
forEach([0, 1], mockCallback);

// Mock function called twice
expect(mockCallback.mock.calls.length).toBe(2);

// The first argument of the first call to the function was 0
expect(mockCallback.mock.calls[0][0]).toBe(0);

// The first argument of the second call to the function was 1
expect(mockCallback.mock.calls[1][0]).toBe(1);

// .mock property
// - where data about how the function has been called is kept
// - tracks the value of this for each call to possibly inspect as well
const myMock = jest.fn();

const a = new myMock();
const b = {};
const bound = myMock.bind(b);
bound();

// > [ <a>, <b> ]
console.log(myMock.mock.instances);

// useful to assert how these functions get called or instantiated
// The function was called exactly once
expect(someMockFunction.mock.calls.length).toBe(1);

// The first arg of the first call to the function was 'first arg'
expect(someMockFunction.mock.calls[0][0]).toBe('first arg');

// This function was instantiated exactly twice
expect(someMockFunction.mock.instances.length).toBe(2);

// The object returned by the first instantiation of this function had
// a name property whose value was set to test
expect(someMockFunction.mock.instances[0].name).toEqual('test');

// Mock return values
const myMock = jest.fn();
console.log(myMock());
// > undefined

myMock.mockReturnValueOnce(10)
  .mockReturnValueOnce('x')
  .mockReturnValue(true);

console.log(myMock(), myMock(), myMock(), myMock());
// > 10, 'x', true, true

// Mock functions great for functional continuation-passing
// help avoid need for complicated stubs and just inject values directly
const filterTestFn = jest.fn();

// Make the mock return 'true' for the first call, and false for second call
// Try to avoid the tempatation to implement logic inside of any function that's not directly being tested
filterTestFn
  .mockReturnValueOnce(true)
  .mockReturnValueOnce(false);

const result = [11, 12].filter(filterTestFn);

console.log(result);
// > [11]
console.log(filterTestFn.mock.calls);
//> [ [11], [12] ]

// Mock implementations
// useful when you need to define the default implementation of a mock function
// that is created from another module
const myMockFn = jest.fn(cb => cb(null, true));

myMockFn((err, val) => console.log(val));
// > true
myMockFn((err, val) => console.log(val));
// > true

// foo.js
module.exports = function() {
  // some implementation
};

// test.js
jest.mock('../foo');
const foo = require('../foo');

// foo is a mock function
foo.mockImplementation(() => 42);
foo();
// > 42

// Multiple function calls produce different results
// with mockImplementationOnce method
// if runs out of once calls, it will execute default implementation set with
// jest.fn if it is defined
const myMockFn = jest.fn()
  .mockImplementationOnce(cb => cb(null, true))
  .mockImplementationOnce(cb => cb(null, false));

myMockFn((err, val) => console.log(val));
// > true 
myMockFn((err, val) => console.log(val));
// > false 

// .mockReturnThis(), .mockName()
// custom matchers (syntactic sugar)
// Mock called at least once
expect(mockFunc).toBeCalled();
// Called at least once with the specified args
expect(mockFunc).toBeCalledWith(arg1, arg2);
// Last call to the mock function was called with specified args
expect(mockFunc).lastCalledWith(arg1, arg2);
// All calls and name of mock writtern as snapshot
expect(mockFunc).toMatchSnapshot();

// Testing React Apps with Jest
// - Snapshot tests - useful when you want to make sure UI does not change unexpectedly
// -> ie. mobile ap renders UI component, takes a screenshot, then compares it to a reference image stored
// alongside the test; will fail if two images do not match, meaning the change is unexpected or screenshot
// needs to be updated to the new version of the UI component
// -> in React, we use a test renderer to quickly generate a serializable value for your React tree
import React from 'react';
import Link from '../Link.react';
import renderer from 'react-test-renderer';

// If we intentionally change snapshot, do jest --updateSnapshot to regenerate snapshots (or jest -u)
it('renders correctly', () => {
  const tree = renderer.create(
    <Link page="http://www.facebook.com">Facebook</Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

/*
  Creates a snapshote file like this that should be committed alongside code changes
  - subsequent test runs Jest will compare the rendered output with the previous snapshot
  - if they match, test pass or if not, either bug or need to update the snapshot
  exports[`renders correctly 1`] = `
    <a
      className="normal"
      href="http://www.facebook.com"
      onMouseEnter={[Function]}
      onMouseLeave={[Function]}
    >
    Facebook
    </a>
  `;
*/

// To assert and manipulate your rendered components you can use Enzyme or React's TestUtils
import React from 'react';
import { shallow } from 'enzyme';
import CheckboxWithLabel from '../CheckboxWithLabel';

test('CheckbowWithLabel changes the text after click', () => {
  // Render a checkbox with label in the document
  const checkbox = shallow(
    <CheckboxWithLabel labelOn="On" labelOff="Off" />
  );

  expect(checkbox.text()).toEqual('Off');
  checkbox.find('input').simulate('change');
  expect(checkbox.text()).toEqual('On');
});

/*
  End to End Testing with Cypress
  - most testing tools like Selenium run outside browser and execute remote commands across network
  - Cypress is executed in same run loop as your app, Node.js server process, also operates at network layer
  and helps with inside/outside browser
  - operates within app and has native access to every single object like window, document, DOM element, app instance, timer, function
  timer, service worker, etc.
  - automatic waiting, time traveling, dashboard to play back snapshots
  - can stub the browser or app functions to force them to behave as needed for test case
  - can expose data stores like Redux, can modify response status codes, DOM elements, use 3rd party plugins programmatically
  - can control time forward or backward, give synchronous notifications when app transitions to a new page, add event listeners,
  control functions/WebSocket messages, conditionally load 3rd party scripts, use DevTools at same time
  - can take shortcuts for setup like using cy.request to send HTTP requests and get cookies back, CORS is bypassed
  - npm install --save-dev cypress, can run with CI, call $(npm bin)/cypress open, can set environment variables
  - i.e. package.json - "scripts": {
    "cypress:open": "cypress open"
  }
  - CYPRESS_SKIP_BINARY_INSTALL=1 npm install -> skips binary install
*/
// Create new file in cypress/integration folder like
// touch {your_project}/cypress/intregration/{some_spec}.js
// Sample tests with describe and it from Mocha and expect from Chai (Bundled Tools)
// Solid test generally covers 3 phases:
// 1. Set up application state
// 2. Take an action
// 3. Make an assertion about the resulting application state
// "Given, when, then" or "Arrange, Act, Assert"
// -> only test apps you can control! (may do A/B tests, security features, block scripts, liable to change)
// -> not general purpose web automation tool and poorly suited for scripting live, production websites not under your control 
describe('My First Test', function() {
  it('does not do much!', function() {
    expect(true).to.equal(true);
  });
});

// i.e. Visit a web page, query for an element, interact with that element, assert about the content on the page
// - automatically detects things like page transition event and will automatically halt running commands until next page finished loading
// (usually if next page not finished loading, would have ended test and presented error - timeout is 60 seconds for PAGE LOAD event)
// - can do debugging with pinned snapshots to inspect DOM of application under test at the time snapshot taken,
// event hitbox, snapshot menu panel to show before and after events
// - logs out gray events for things like network XHR requests, URL hash changes, page loads, form submissions
// - can also open up DevTools and click on GET for .action-email class selector and see the command, returned, elements, selector in console
// - cy.pause() and cy.debug() for helpful debugging
// - better for local development server, can use stub network requests, can control against local servers
// - can easily take shortcuts, run executable scripts for data, expose test environment routes, disable security features, reset state on server/database
// - many run most of integration tests against local development server and then smaller set of smoke tests against a deployed prod app
describe('My first test', function() {
  it('visits the kitchen sink', function() {
    // Pass in URL you want to visit, VISIT in command log
    cy.visit('https://example.cypress.io');

    // CONTAINS in command log, even if you change it to wrong thing, it will retry first for about 4 seconds before failing
    // Can chain together events like CLICK, more declarative
    cy.contains('type').click();

    // Checking expected URL after clicking to a new page
    cy.url().should('include', '/commands/actions');

    // Select element based on CSS class, use type to enter text into selected input
    // andverify value has been updated
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com');
  });
});

// Testing your local app server
// - configuration option in cypress.json to set things like timeout period, environment variables, where tests live, etc.
// - may have to deal with JSON or server-side rendered HTML web apps, state in a database
{
  // This prefixes cy.visit() and cy.request() commands with baseUrl
  "baseUrl": "http://localhost:8080"
}
describe('The home page', function() {
  it('successfully loads', function() {
    cy.visit('/');
  });
});

// - typically with e2e tests using Selenium, before you automate the browser you do some kind of set up and tear down on server
// - need to generate user, seed them with associations and records with fixtures/factories, test page states through
// cy.exec() to run system commands and cy.request() to make HTTP requests
// i.e. can use a beforeEach to run npm task on node.js server
// i.e. can compose several requests together to tell server exactly the state you want to create
describe('The Home Page', function() {
  beforeEach(function() {
    // Reset and seed the database prior to every test
    cy.exec('npm run db:reset && npm run db:seed');

    // Seed a post in the DB that we control from our tests
    cy.request('POST', '/test/seed/post', {
      title: 'First Post',
      authorId: 1,
      body: '...'
    });

    // Seed a user in the DB that we can control from our tests
    cy.request('POST', '/test/seed/user', { name: 'Alfred' }).its('body').as('currentUser');
  });

  it('successfully loads', function() {
    // this.currentUser will now point to the response
    // body of the cy.request() that we could use to log in or work with in some way
    cy.visit('/');
  });
});
// - about this approach: need to synchronize state between server and browser and need to set up
// and tear down state before tests which can be slow like Selenium

// Better approach: stubbing the server
// - stub the JSON responses coming from it and force the server to respond with whatever you want it to
// - this prevents needing to synchronize the state between server and browser and prevent mutating state from tests
// (tests won't build up state that may affect other tests)
// - can build out your app without needing the contract of the server to exist and build data the way you want it to be
// though we don't have the guarantees that these response payloads actually match what the server will send
// - you can generate the fixture stubs ahead of time
// - write a single e2e test without stubs (seed the database and set up state) and then stub the rest
// i.e. testing the login, needing an authenticated user
// -> since logging in and signing up is mission critical, should use the server and test UI as a real user would
describe('The Login Page', function() {
  beforeEach(function() {
    // Reset and seed the database prior to every test
    cy.exec('npm run db:reset && npm run db:seed');

    // Seed a user in the DB that we can control from our tests assuming 
    // it generates a random password for us
    cy.request('POST', '/test/seed/user', { username: 'jane.lane' })
      .its('body')
      .as('currentUser');
  });

  it('sets auth cookie when logging in via form submission', function() {
    const { username, password } = this.currentUser;

    cy.visit('/login');

    cy.get('input[name=username]').type(username);

    // {enter} causes the form to submit
    cy.get('input[name=password]').type(`${password}{enter}`);
  
    // we should be redirected to /dashboard
    cy.url().should('include', '/dashboard');

    // our auth cookie should be present after logging in
    cy.getCookie('your-session-cookie').should('exist');

    // UI should reflect this user being logged in
    cy.get('h1').should('contain', 'jane.lane');
  });

  // likely want to test login UI for
  // -> invalid username/password
  // -> username taken
  // -> password complexity requirements
  // -> edge cases like locked / deleted accounts
});

// Do not use your UI to login before each test
// - when you are testing another area of the system that relies on a state from a previous feature
// do not use your UI to set up this state/build up state as it is slow and unnecessary
// - can skip using the UI by using cy.request() - which automatically gets and sets cookies under the hood
// and can use it to build up state without using your browser's UI
// i.e. skipping the login step through the UI
describe('The Dashboard Page', function() {
  beforeEach(function() {
    // Reset and seed the database prior to every test
    cy.exec('npm run db:reset && npm run db:seed');

    // Seed a user in the DB that we can control from our tests assuming it generates a random password for us
    cy.request('POST', '/test/seed/user', { username: 'alfred.lucero' })
      .its('body')
      .as('currentUser');
  });

  it('logs in programmatically without using the UI', function() { 
    const { username, password } = this.currentUser;

    // Programmatically log us in without needing the UI
    cy.request('POST', '/login', {
      username,
      password
    });

    // now that we're logged in, we can visit any kind of restricted route
    cy.visit('/dashboard');

    // our auth cookie should be present
    cy.getCookie('your-session-cookie').should('exist');

    // UI should reflect this user being logged in
    cy.get('h1').should('contain', 'alfred.lucero');
  });
});

// Introduction to Cypress
// i.e. Simple Post Resource test
describe('Post Resource', function() {
  it('Creating a new post', function() {
    cy.visit('/posts/new');

    cy.get('input.post-title')
      .type('My First Post');

    cy.get('input.post-body')
      .type('Hello, world!');
    
    cy.contains('Submit')
        .click();
      
    cy.url()
      .should('include', '/posts/my-first-post');
    
    cy.get('h1')
      .should('contain', 'My First Post');
  });
});

// Querying elements like jQuery
// -> Cypress bundles jQuery and exposes many of its DOM traversal methods to you 
cy.get('.my-selector');
cy.get('#main-content')
  .find('.article')
  .children('img[src^="/static"]')
  .first();
// This won't work as Cypress does not return the element synchronously unlike jQuery
const $cyElement = cy.get('.element');
// For jQuery, if it cannot find any matching DOM elements from selector, it returns empty jQuery collection object
// and we must check the length property
// -> When Cypress can't find any matching DOM elements from its selector, it automatically retries the query
// until either the element is found or a set timeout is reached
cy
  .get('#element')
  .then(($myElement) => {
    doSomething($myElement);
  });
// This helps avoid issues with DOM not loading yet, framework not finished bootstrapping, XHR request hasn't responded,
// animation hasn't completed
// -> needed mashup of arbitrary waits, conditional retries, null checks, etc. before
// -> when you want to interact with DOM element directly, call .then()
// -> when you want to skip retry-and-timeout functionality entirely, use Cypress.$

// Querying by text content
// - we use cy.contains()
cy.contains('New Post');
// Find an element within .main containing text 'New Post'
cy.get('.main').contains('New Post');
// Useful for testing like a user who only sees a button with "Submit" text rather than type attribute of submit
// -> beware of internationalization though with multiple languages i18n (may not be able to just use user-facing text)

// When elements are missing, retries until timeout reached (default timeout is 4 seconds)
// -> timeout option in cy.get selector or defaultCommandTimeout global config setting
// -> Cypress is asynchronous and relies on timeouts to know when to stop waiting on an app to get into expected state
// that can be configured globally or on a per-command basis
// -> tradeoffs of longer timeouts -> longer time to fail
cy.get('.my-slow-selector', { timeout: 10000 });

// Chains of Commands
// - Cypress manages a Promise chain on your behalf with each command yielding a subject to the next command
// until the chain ends or an error is encountered
// Interacting with elements
// -> action commands like .blur/focus/clear/check/uncheck/select/dblclick()
// -> for commands like .click(), Cypress ensures to wait until element reaches an "actionable" state by
// not being hidden/covered/disabled/animating
// -> can override this behavior with force option
cy.get('textarea.post-body')
  .type('This is an excellent post');

// Asserting about elements
// - commands to describe desired state of app, will automaticallyw ait until elements reach this state or fail the
// test if the assertions don't pass
// - Cypress automatically waits until these assertions pass
cy.get(':checkbox').should('be.disabled');
cy.get('form').should('have.class', 'form-horizontal');
cy.get('input').should('not.have.value', 'US');

// Subject Management
// - new Cypress chain always starts with cy.[command]
// - some commands cannot be chained like cy.clearCookies() or cy.screenshot()
// - depends on whether or not they yield DOM elements/subject, null, etc.
cy.clearCookies(); // 'null' was yielded, no chaining possible

cy.get('.main-container') // Yields an array of matching DOM elements
  .contains('Headlines')  // Yields the first DOM element containing content
  .click();                // Yields same DOM element from previous command
// -> Cypress commands do not return their subjects, they yield them
// and commands are asynchronous
// -> can use aliasing to store and save element references for future use
// -> chaining with .then and passing in subject you want to next command
cy
  // Find the el with id 'some-link'
  .get('#some-link')
  .then(($myElement) => {
    // ...massage the subject with some arbitrary code
    const href = $myElement.prop('href');
    return href.replace(/(#.*)/, '');
  })
  .then((href) => {
    // href is now the new subject which we can work with now
  });
// -> using aliases to refer to previous subjects to reuse our DOM queries for faster tests when element still in DOM
// and automatically handles re-querying the DOM for us when it is not immediately found in DOM
cy
  .get('.my-selector')
  .as('myElement')
  .click();

cy.get('@myElement') // re-queries the DOM as before (only if necessary)
  .click();

// Once again, commands are asynchronous and do not do anything the moment they are
// invoked but rather enqueue themselves to be run later
// -> i.e. Cypress doesn't kick off the browser automation magic until test function exits
it('changes the URL when "awesome" is clicked', function() {
  cy.visit('/my/resource/path'); // Nothing yet

  cy.get('.awesome-selector')
    .click(); // Not yet
  
  cy.url()
    .should('include', '/my/resource/path#awesomeness') // Nope
});
// Now we queued all of commands after test function finished executing and now Cypress runs them in order
// -> you cannot do anything useful with the return value from a command as they are enqueued and managed behind the scenes
// -> designed this way because DOM is highly mutable object that constantly goes stale
// and to prevent flake and know when to proceed, Cypress manages commands in a highly controlled deterministic way
// -> commands run serially (one after the other), never in parallel at the same time
// i.e. sample flow
// 1. visit a URL - and wait for page load event to fire after all external resources loaded
// 2. find an element by selector - and retry repeatedly until it is found in DOM
// 3. perform a click action on that element - after we wait for element to reach an actionable state
// 4. grab url
// 5. assert the URL to include a specific string - and retry repeatedly until assertion passes
// -> any waiting/retrying must complete before next step begins or else test will fail if timeout reached
// -> commands are PROMISES-like, we are adding Promises to a chain of Promises for every command
// -> didn't use async/await because there are no concepts of retry-ability in standard Promises, leading to flaky inconsistent results
// -> built using Promises that come from Bluebird and do not return typical Promise instances but rather
// a Chainer that acts like a layer sitting on top of the internal Promise instances
// and you cannot ever return or assign anything useful from Cypress commands
// -> Cypress API not 1:1 implementation of Promises
// 1. cannot race or run multiple commands at same time in parallel
// -> because lot of commands mutate state of browser (request, clearCookies, click), models after real user working step by step
// 2. cannot accidentally forget to return or chain a command
// -> ensure serial commands enqueued onto a global singleton, avoids lost promises
// 3. cannot add a .catch error handler to a failed command
// -> all eventually pass or if one failes the remaining commands not run and test fails; avoid if/else control flow that is flaky

// Assertions
// - like guards to describe what application should look like and Cypress will automatically block, wait, and retyr until it reaches that state
// i.e. After clicking on the button, I expect its class to eventually be active
cy.get('button').click().should('have.class', 'active');
// i.e. After making an HTTP request to my server, I expect the response body to equal {name: 'Jane'}
cy.request('/users/1').its('body').should('deep.eq', {name: 'Jane'});
// i.e. sometimes may not need to assert anything to have useful test because dozen of ways for test to fail
// -> many commands have a built in Default Assertion 
// i.e. cy.visit() expects page to send text/html content with 200 status code
// cy.request() expects remote server to exist and provide response
// cy.contains() expects element with content to eventually exist in DOM
// cy.get()/find() expects element to eventually exist in DOM
// .type() expects typeable state, .click() expects actionable state, .its() expects to find property on current subject
// -> all DOM based commands automatically wait for their elements to exist in the DOM and you
// never need to write .should('exist') after a DOM based command
cy.visit('/home');

cy.get('.main-menu')
  .contains('New Project')
  .click();

cy.get('.title')
  .type('My Awesome Project');

cy.get('form')
  .submit();
// i.e. Testing that something shouldn't exist, will wait until it's gone
// and this reverses the default assertion
cy.get('button.close').click().should('not.exist');
// i.e. .its() requires that the property you're asking about exists on the object
const obj = {};
setTimeout(() => {
  obj.foo = 'bar';
}, 1000);
// .its() will wait until the 'foo' property is on the object
cy.wrap(obj).its('foo');
// - Cypress bundles Chai, Chai-jQuery, and Sinon-Chai for built-in assertions
// - two ways to write assertions in Cypress
// 1. Implicit Subjects: using .should() or .and()
// -> apply to the currently yielded subject in command chain
cy.get('tbody tr:first').should('have.class', 'active');
cy.get('#header a')
  .should('have.class', 'active')
  // .and is another should and executes against same element
  .and('have.attr', 'href', '/users');
// -> beware of things that modify current subject unexpectedly like doing .should('.have.attr'
// 2. Explicit Subjects: using expect
// -> often longer, when you want to assert multiple things about same subject, massage subject prior to assertion
cy.get('tbody tr:first').should(($tr) => {
  expect($tr).to.have.class('active');
  expect($tr).to.have.attr('href', '/users');
});
// -> allows you to pass in specific subject and make assertion about it
// i.e. explicit subject here is boolean: true
expect(true).to.be.true;
// -> great for custom logic prior to making assertion, make multiple assertions against same subject
// i.e. using .should callback for complex assertions, should be idempotent (can be executed multiple times without side effects)
cy
  .get('p')
  .should(($p) => {
    // massage our subject from a DOM element into an array of texts from all of the p's
    let texts = $p.map((i, el) => {
      return Cypress.$(el).text();
    });

    // jQuery map returns jQuery object and .get() converts this to a simple array
    texts = texts.get();

    // array should have length 3
    expect(texts).to.have.length(3);

    // with this specific content
    expect(texts).to.deep.eq([
      'Some text from first p',
      'More text from second p',
      'And even more text from third p'
    ]);
  });

// Timeouts
// waits 4 seconds for each command, based on timeout for cy.get
// - cy.visit ~ 60000ms, cy.exec ~ 60000ms, cy.wait ~5000ms for routing alias, 30000ms for server's response
// - DOM based commands time out after 4000ms default
cy.get('mobile-nav')
  .should('be.visible')
  .and('contain', 'Home');

// Writing and Organizing Tests
// - Suggested folder structure like /fixtures, /integration, /plugins, /support
// - Fixture files used as external pieces of static data that cna be used by your tests
// and you would typically use them with cy.fixture() and when stubbing network requests
// - Test files may be written as .js/.jsx/.coffee/.cjsx, supports ES2015 out of box and use ES2015 modules or CommonJS modules
// and use import/require both npm packages and local relative modules
// - Cypress will automatically include the plugins file cypress/plugins/index.js before every single spec file it runs so we don't 
// have to import this file in every single one of your spec files
// - will automatically include the support file cypress/support/index.js before every single spec file it runs
// and it is great place for reusable behavior such as Custom Commands or global overrides that you want applied to all your spec files
// - built on top of Mocha and Chai (support Chai's BDD and TDD assertion styles)
// - test interface from Mocha: describe()/context(), it()/specify()
// -> also provides hooks to help set conditions that you want to run before/after a set of tests or before/after each test
describe('Hooks', function() {
  before(function() {
    // runs once before all tests in the block
  });

  after(function() {
    // runs once after all tests in the block
  });

  beforeEach(function() {
    // runs before each test in the block
  });

  afterEach(function() {
    // runs after each test in the block
  });
}); 
// - order of hook execution: before, beforeEach, tests run, afterEach, after
// - to run a specified suite or test, simply append .only() to the function, all nested suites
// also will be executed; can also append .skip() to skip tests
// - can dynamically generate tests using JS
describe('if you app uses jQuery', function() {
  ['mouseover', 'mouseout', 'mouseenter', 'mouseleave'].forEach((event) => {
    it('triggers event ' + event, function() {
      cy
        .get('#with-jquery').invoke('trigger', event)
        .get('#messages').should('contain', 'the event ' + event + 'was fired');
    });
  });
});
// supports both BDD (expect/should) and TDD (assert) style assertions

// Interacting with Elements
// - interacting with DOM like click/dblclick, type, clear, check, uncheck, select, trigger
// - recipes to test a lot of scenarios: https://docs.cypress.io/examples/examples/recipes.html
// - fires the events a browser would fire and causing your application's event bindings to fire
// - waits for duration of defaultCommandTimeout
// - considered hidden if width/height 0, visibility: hidden, display: none, position: fixed and offscreen/covered and overflow:hidden
// - checks disabled property is true, don't check readonly property
// - automatically determines if element is animating and waits until it stops, checks animationDistanceThreshold (slope changes)
// - make sure element isn't covered by parent element, check its center coordinates
// - always scroll element into view including any of its parent containers
// - events' coordinates fired at center of element but you can change position events fired to
// - only scroll elements into view when actionable commands running (do no scroll for cy.get/find)
// - can use debugger statement to "see" and debug why Cypress thought an element was not visible or .debug() before the action
// i.e. break on a debugger before the action command
cy.get('button').debug().click();
// - can pass { force: true } to force actions and it skips the checks and fires the event at the desired element

// Variables and Aliases
// - cannot assign or work with return values of any Cypress command, enqueued and run asynchronously
// - to access what each Cypress command yields you, use .then()
cy.get('button').then(($btn) => {
  // $btn is the object that the previous command yielded us
  const txt = $btn.text();
  cy.get('form').submit();
  cy.get('button').should(($btn2) => {
    expect($btn2.text()).not.to.eq(txt);
  });
});
// - can use .then() functions as opportunity for debugger, also takes advantage of closures to access older references
// - using const for mutable objects
// - can use aliases for when you need access to things in before/beforeEach
// so you can share objects/contexts between hooks and tests
// -> use command called .as(), utilizes Mocha's shared context object, aliases available as this.*
beforeEach(function() {
  // alias the $btn.text() as 'text'
  cy.get('button').invoke('text').as('text');
});

it('has access to text', function() {
  this.text; // is now available here
});
// - often share context when dealing with cy.fixture()
// and since commands are async, .as() command must run first
beforeEach(function() {
  // alias the users fixtures
  cy.fixture('users.json').as('users');
});

it('utilize users in some way', function() {
  // access users property
  const user = this.users[0];

  // make sure header contains first users name
  cy.get('header').should('contain', user.name);
});
// or this way with callback .then() to avoid aliases
// -> arrow functions and alias properties don't mesh well
cy.fixture('users.json').then((users) => {
  const user = users[0];
  cy.get('header').should('contain', user.name);
});
// -> can also use cy.get() and using '@' character
beforeEach(function() {
  cy.fixture('users.json').as('users');
});
it('utilize users in some way', function() {
  cy.get('@users').then((users) => {
    const user = users[0];

    cy.get('header').should('contain', user.name);
  });
});
// -> can alias DOM elements to be reused later and Cypress automatically re-queries the DOM
// to find the elements again
cy.get('table').find('tr').as('rows');
cy.get('@rows').first().click();
// -> can also alias the routes to ensure app makes intended requests, wait for your server to send the response,
// and access the actual XHR object for assertions
cy.server();
cy.route("POST", /users/, { id: 123 }).as("postUser");
cy.get('form').submit();
cy.wait('@postUser').its('requestBody').should('have.property', 'name', 'Alfred');
cy.contains('Successfully created user: Alfred');

// Conditional Testing
// - like if X, then Y, else Z; handling dynamic/mutable state but can only be used when state is stabilized
// - flaky if relying on DOM state, easy if server side rendered without JS that async modifies the DOM and it won't 
// change after load event occurs
// - client side rendering is tougher with dynamic content rendered asynchronously after load event occurs
// - have force app to behave deterministically, check server/db, embed data in cookies/localStorage, add data to DOM
// i.e. A/B campaign with different website content and using URL query params to denote different ones
cy.visit('https://app.com?campaign=A');
// -> can use the server to save the campaign with a session
cy.visit('https://app.com');
cy.request('https://app.com/me')
  .its('body.campaign')
  .then((campaign) => {
    return campaigns.test(campaign);
  });
// -> can use session cookies
cy.visit('https://app.com');
cy.getCookie('campaign')
  .then((campaign) => {
    return campaigns.test(campaign)
  });
// -> embed data in DOM such that it is always present and query-able
cy.get('html')
  .should('have.attr', 'data-campaign').then((campaign) => {
    return campaigns.test(campaign);
  });
// -> cannot do conditional testing on DOM unless you are either server side rendering with no async JS
// or using client side JS that only ever does synchronous rendering
// -> to test if a test is flaky, repeat the test an excessive number of times and then repeat by modifying DevTools
// to throttle the Network and CPU to simulate different environments like CI
// (good tests pass or fail 100% of the time)
Cypress._.times(100, (i) => {
  it(`num ${i+1} - test the thing conditionally`, () => {
    // do the conditional bits 100 times
  });
});
// checking for dynamic text is only okay if body has fully rendered without any pending changes to its state
// - error recovery ("If I had error handling, I could just try to find X and if X fails go find Y")
// -> failed commands in Cypress like uncaught exceptions in server side code
// -> may have to wait the timeout time that can get so long which is an anti-pattern and not deterministic

// The Test Runner
// - allows you to see commands as they execute while also viewing the applicatino under test
// -> can see test status menu, url preview, viewport sizing, app preview, command log, etc.
// -> test blocks properly nested and displays every Cypress command and assertion executed
// -> hovering over commands restores app to the state it was when command executed ('time-travel'), around 50 tests worth
// -> can check out routes, stubs, and spies in instrument panel
// -> can open console and inspect DOM and interact with app on right
// -> also a selector playground to inspect like DevTools

// Dashboard Service
// - allows you to record tests when running Cypress tests from CI provider
// - can get stack trace of tests, screenshots when tests fail or when using cy.screenshot(), watch
// video of entire test run or clip at point of test failure, manage who has access to your recorded test data
