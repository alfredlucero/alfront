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


/*
  End to End Tests with WebDriver.io
  - API Docs: http://webdriver.io/api.html
  - WebDriver bindings for Node.js, lets you control browser or mobile application, synchronous command handling
  - manages Selenium session for you, can use native JS functions, $ and $$ selectors for jQuery like syntax
  - can have hooks to take screnshots upon error i.e. beforeSession, beforeSuite, beforeTest, before/afterCommand, afterHook/Suite/Session
  onError 
  - all synchronous commands meaning that we don't have to deal with calling Promise.then anymore due to Fibers package, 3rd party integrations
  - handles state element reference error in Selenium with a retry mechanism for all failing requests to Selenium serevr in case element
  you requested got re-rendered causing the driver to lose its connection to it
  - wdio config/cli, services like Sauce Labs or BrowserStack provide Selenium testing on remote hosts
  - setup: need to download Selenium server, geckodriver and then start it up in a separate terminal; npm install webdriverio
  - use WebdriverIO test runner for integration testing and you need to create config file first
  i.e. ./node_modules/.bin/wdio 
  -> has a lot of options to add other services and choosing assertion/tdd library like mocha
  -> create sample spec and then run test runner
  i.e. ./node_modules/.bin/wdio wdio.conf.js
  -> can setup babel to write tests using latest JS (babel-register and babel-preset-es2015)
  i.e. mochaOpts: { ui: 'bdd', compilers: ['js:babel-register'], require: ['./test/helpers/common.js'] }
  .babelrc: { "presets": ["es2015"], "plugins": [ ["transform-runtime", { "polyfill": false }] ]}
  -> can also set up typescript in before hook of config file or mochaOpts with ts-node/register
*/
// Sample test.js
var webdriverio = require('webdriverio');
// Passing in options to define the Webdriver instance if you run WebdriverIO as standalone package
// Otherwise, you can set it in wdio.conf.js configuration file if you use wdio test runner
var options = {
    // Defines capabilities to run in Selenium session
    // i.e. browserName, version, platform, tags, name, pageLoadStrategy, logOutput, port, etc.
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

webdriverio
    .remote(options)
    .init()
    .url('http://www.google.com')
    .getTitle().then(function(title) {
        console.log('Title was: ' + title);
    })
    .end()
    .catch(function(err) {
        console.log(err);
    });

// Sample spec file
var assert = require('assert');

describe('webdriver.io page', function() {
    it('should have the right title - the fancy generator way', function () {
        browser.url('http://webdriver.io');
        var title = browser.getTitle();
        assert.equal(title, 'WebdriverIO - WebDriver bindings for Node.js');
    });
});

// Selectors
// - JsonWireProtocol allows us to query for an element
// - CSS Query Selector
browser.click('h2.subheading a');
// - Link Text
// -> to get an anchor element with a specific text in it, query the text starting with an equal sign
// i.e. <a href="http://webdriver.io">WebdriverIO</a>
console.log(browser.getText('=WebdriverIO'));
console.log(browser.getAttribute('=WebdriverIO', 'href'));
// -> partial link text search match i.e. *=driver
console.log(browser.getText('*=driver'));
// - Element with certain text
// i.e. <h1 alt="welcome-to-my-page">Welcome to my Page</h1>
console.log(browser.getText('h1=Welcome to my Page'));
console.log(browser.getTagName('h1=Welcome to my Page'));
// -> query partial text
console.log(browser.getText('h1*=Welcome'));
console.log(browser.getText('h1[alt*="welcome"]'));
// -> for ids and classnames
// i.e. <i class="someElem" id="elem">WebdriverIO is the best </i>
console.log(browser.getText('.someElem=WebdriverIO is the best'));
console.log(browser.getText('#elem=WebdriverIO is the best'));
// -> to query an element with a specific tag name use <tag> or <tag />
// - for specific name attributes you can use normal CSS3 selector or doing something like [name="some-name"]
// - can also do xPath selectors
// - supports Android/iOS selectors
// - chain selectors
browser.element('.row .entry:nth-child(1)').click('button*=Add');

// Custom Commands
// - can extend browser instance with your own set of commands with addCommand method
// - can define these at any point in yoru test suite or say the before hook in wdio.conf.js
// - typically throws an error if you try to overwrite an existing command
// -> can only be called inside a test hook or it block
browser.addCommand("getUrlAndTitle", function(customVar) {
  return {
    url: this.getUrl(),
    title: this.getTitle(),
    customVar: customVar
  };
});

it('should use my custom command', function() {
  browser.url('http://www.github.com');
  var result = browser.getUrlAndTitle('foobar');

  assert.strictEqual(result.url, 'https://github.com/');
  assert.strictEqual(result.title, 'Github - Where software is built');
  assert.strictEqual(result.customVar, 'foobar');
});
// can also define with old promise syntax
clientInformation.addCommand("getUrlAndTitle", async function() {
  return Promise.all([
    this.getUrl(),
    this.getTitle()
  ]);
});
// integrate third party libraries by wrapping certain API methods within a custom command
browser.addCommand("doExternalJob", async function(params) {
  return externalLib.command(params);
});

it('execute external library in a sync way', function() {
  browser.url('...');
  browser.doExternalJob('someParam');
  console.log(browser.getTitle());
});

// Using CloudServices
// - say you want to use Sauce Labs, Browserstack or Testingbot
// 1. use their host i.e. ondemand.saucelabs.com as the Selenium server either by setting host config or letting WebdriverIO
// configure it automatically based on value of user and key
// 2. optional: set service specific values for each browser in desiredCapabilities i.e. build to specify build number and cluster multiple tests together
// 3. optional: tunnel local traffic to provider so that your tests can access localhost
// i.e. to run against a server that is not accessible to the Internet like on localhost, then we need to use Local Testing

// Bindings and Commands
// - two different method types: protocol bindings and commands
// - protocol bindings: exact representation of JSONWire protocol interface
console.log(browser.url());

var element = browser.element('#myElem');
var res = browser.elementIdCssProperty(element.value.ELEMENT, 'width');
assert(res.value === '100px');
// Use these commands for shorter expressions
var width = browser.getCssProperty('#myElem', 'width');
assert(width.parsed.value === 100);
// - when you call a command, WebdriverIO automatically tries to propagate the prototype to the result so you can chain things
browser.click('#elem1').click('#elem2');
// - can also call commands on element results and remembers last result of each command
var element = browser.element('#elem1');
console.log(element.getText());
element.click();
console.log(element.getText());
// - can encapsulate page information into a page object which will allow you to write highly expressive tests like
var expect = require('chai').expect;
var FormPage = reuqire('../pageobjects/form.page');

describe('Auth Form', function() {
  it('should deny access with wrong creds', function() {
    FormPage.open();
    FormPage.username.setValue('foo');
    FormPage.password.setValue('bar');
    FormPage.submit();
    
    expect(FormPage.flash.getText()).to.contain('Your username is invalid!');
  });
});

// Run multiple browsers at the same time
// - multiple Selenium sessions in a single test
// i.e. when you need to test app features where multiple users are required
// - can have multiremote instance and control all browsers at same time
// - use multiremote function and pass object with named browser with capabilities into it
var webdriverio = require('webdriverio');
// Two sessions with Chrome and Firefox
// - all commands you call with browser variable gets executed in parallel with each instance
var browser = webdriverio.multiremote({
  myChromeBrowser: {
    desiredCapabilities: {
      browserName: 'chrome'
    },
    myFirefoxBrowser: {
      desiredCapabilities: {
        browserName: 'firefox'
      }
    }
  }
});

// Results accessible in callback functions, more than one result since more than one browser
// - command finishes once all browsers executed, browser actions synced
browser
  .init()
  .url('https://www.whatismybrowser.com/')
  .getText('.string-major').then(function(result) {
    console.log(result.resultChrome);
    console.log(result.resultFirefox);
  })
  .end();

// Say for a chat application one browser has to input a text message while the other browser listens to receive that messsage
// and do an assertion for it
// -> we can get access to single instance using select method
var myChromeBrowser = browser.select('myChromeBrowser');
var myFirefoxBrowser = browser.select('myFirefoxBrowser');

myChromeBrowser
  .setValue('#message', 'Hi, I am Chrome')
  .click('#send');

myFirefoxBrowser
  .waitForExist('.messages', 5000)
  .getText('.messages').then(function(messages) {
    assert.equal(messsages, 'Hi, I am Chrome');
  });
// -> for actions to be in parallel again we can call the sync method and all methods chained behind sync method
// get executed in parallel again
// these commands get executed in parallel by all defined instances
browser.init().url('http://example.com');

// do something with Chrome browser
myChromeBrowser.setValue('.chatMessage', 'Hey Whats up!').keys('Enter');

// do something with Firefox browser
myFirefoxBrowser.getText('.message').then(function(message) {
  console.log(messages);
});

// now sync instances again
browser.sync().url('http://anotherwebsite.com');
// i.e. sample wdio.conf.js
export.config = {
    // ...
    capabilities: {
        myChromeBrowser: {
            desiredCapabilities: {
                browserName: 'chrome'
            }
        },
        myFirefoxBrowser: {
            desiredCapabilities: {
                browserName: 'firefox'
            }
        }        
    }
    // ...
};
// -> since all commands are running synchronous with wdio test runner, all multiremote commands are sync
// so the sync method is obsolete and each single browser name is globally available
// -> multiremote is not meant to execute all tests in parallel but it should help for when you need more than one browser
it('should do something with two browsers', function() {
  browser.url('http://google.com');
  console.log(browser.getTitle()); // returns {myChromeBrowser: 'Google', myFirefoxBrowser: 'Google'}

  myFirefoxBrowser.url('http://yahoo.com');
  console.log(myFirefoxBrowser.getTitle()); // return 'Yahoo'

  console.log(browser.getTitle()); // returns {myChromeBrowser: 'Google', myFirefoxBrowser: 'Yahoo'}
});

// Event Handling
// - supports on, once, emit, removeListener, removeAllListeners
// - predefined events such as error, init, end, command, log
browser.on('error', function(e) {
  // will be executed everytime an error occurred
  // i.e. when element couldn't be found
  console.log(e.body.value.class);  // "org.openqa.selenium.NoSuchElementException"
  console.log(e.body.value.message) // "no such element..."
});

// -> log() to log arbitrary data which can be logged or displayed by a reporter
browser
  .init()
  .emit('log', 'Before my method')
  .click('h2.subheading a')
  .emit('log', 'After my method', { more: 'data' })
  .end();
// -> can chain commands
var cnt;

browser
  .init()
  .once('countme', function(e) {
    // Can't execute any WebdriverIO commands or any other async operation within listener function
    // more fo logging purposes
    console.log(e.elements.length, 'elements were found');
  })
  .elements('.myElem').then(function(res) {
    cnt = res.value;
  })
  .emit('countme', cnt)
  .end();

// - REPL interface, SeleniumGrid, Transfer Promises
// - comes with its own test runner, config file needed which is a node module that exports a JSON
// i.e. sample config
exports.config = {

// =====================
// Server Configurations
// =====================
// Host address of the running Selenium server. This information is usually obsolete as
// WebdriverIO automatically connects to localhost. Also if you are using one of the
// supported cloud services like Sauce Labs, Browserstack or Testing Bot you also don't
// need to define host and port information because WebdriverIO can figure that out
// according to your user and key information. However if you are using a private Selenium
// backend you should define the host address, port, and path here.
//
host: '0.0.0.0',
port: 4444,
path: '/wd/hub',
//
// =================
// Service Providers
// =================
// WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
// should work too though). These services define specific user and key (or access key)
// values you need to put in here in order to connect to these services.
//
user: 'webdriverio',
key:  'xxxxxxxxxxxxxxxx-xxxxxx-xxxxx-xxxxxxxxx',
//
// ==================
// Specify Test Files
// ==================
// Define which test specs should run. The pattern is relative to the directory
// from which `wdio` was called. Notice that, if you are calling `wdio` from an
// NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
// directory is where your package.json resides, so `wdio` will be called from there.
//
specs: [
    'test/spec/**'
],
// Patterns to exclude.
exclude: [
    'test/spec/multibrowser/**',
    'test/spec/mobile/**'
],
//
// ============
// Capabilities
// ============
// Define your capabilities here. WebdriverIO can run multiple capabilities at the same
// time. Depending on the number of capabilities, WebdriverIO launches several test
// sessions. Within your capabilities you can overwrite the spec and exclude option in
// order to group specific specs to a specific capability.
//
//
// First you can define how many instances should be started at the same time. Let's
// say you have 3 different capabilities (Chrome, Firefox and Safari) and you have
// set maxInstances to 1, wdio will spawn 3 processes. Therefor if you have 10 spec
// files and you set maxInstances to 10, all spec files will get tested at the same time
// and 30 processes will get spawned. The property basically handles how many capabilities
// from the same test should run tests.
//
//
maxInstances: 10,
//
// If you have trouble getting all important capabilities together, check out the
// Sauce Labs platform configurator - a great tool to configure your capabilities:
// https://docs.saucelabs.com/reference/platforms-configurator
//
capabilities: [{
    browserName: 'chrome',
    chromeOptions: {
    // to run chrome headless the following flags are required
    // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
    // args: ['--headless', '--disable-gpu'],       
    }        
}, {
    // maxInstances can get overwritten per capability. So if you have an in house Selenium
    // grid with only 5 firefox instance available you can make sure that not more than
    // 5 instance gets started at a time.
    maxInstances: 5,
    browserName: 'firefox',
    specs: [
        'test/ffOnly/*'
    ],
    "moz:firefoxOptions": {
      // flag to activate Firefox headless mode (see https://github.com/mozilla/geckodriver/blob/master/README.md#firefox-capabilities for more details about moz:firefoxOptions)
      // args: ['-headless']
    }
},{
    browserName: 'phantomjs',
    exclude: [
        'test/spec/alert.js'
    ]
}],
//
// When enabled opens a debug port for node-inspector and pauses execution
// on `debugger` statements. The node-inspector can be attached with:
// `node-inspector --debug-port 5859 --no-preload`
// When debugging it is also recommended to change the timeout interval of
// test runner (eg. jasmineNodeOpts.defaultTimeoutInterval) to a very high
// value and setting maxInstances to 1.
debug: false,
//
// Additional list node arguments to use when starting child processes
execArgv: null,
//
//
// ===================
// Test Configurations
// ===================
// Define all options that are relevant for the WebdriverIO instance here
//
// Per default WebdriverIO commands getting executed in a synchronous way using
// the wdio-sync package. If you still want to run your tests in an async way
// using promises you can set the sync command to false.
sync: true,
//
// Level of logging verbosity: silent | verbose | command | data | result | error
logLevel: 'silent',
//
// Enables colors for log output.
coloredLogs: true,
//
// Warns when a deprecated command is used
deprecationWarnings: true,
//
// If you only want to run your tests until a specific amount of tests have failed use
// bail (default is 0 - don't bail, run all tests).
bail: 0,
//
// Saves a screenshot to a given path if a command fails.
screenshotPath: 'shots',
//
// Set a base URL in order to shorten url command calls. If your `url` parameter starts 
// with `/`, the base url gets prepended, not including the path portion of your baseUrl. 
// If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url 
// gets prepended directly.
baseUrl: 'http://localhost:8080',
//
// Default timeout for all waitForXXX commands.
waitforTimeout: 1000,
//
// Initialize the browser instance with a WebdriverIO plugin. The object should have the
// plugin name as key and the desired plugin options as property. Make sure you have
// the plugin installed before running any tests. The following plugins are currently
// available:
// WebdriverCSS: https://github.com/webdriverio/webdrivercss
// WebdriverRTC: https://github.com/webdriverio/webdriverrtc
// Browserevent: https://github.com/webdriverio/browserevent
plugins: {
    webdrivercss: {
        screenshotRoot: 'my-shots',
        failedComparisonsRoot: 'diffs',
        misMatchTolerance: 0.05,
        screenWidth: [320,480,640,1024]
    },
    webdriverrtc: {},
    browserevent: {}
},
//
// Framework you want to run your specs with.
// The following are supported: mocha, jasmine and cucumber
// see also: http://webdriver.io/guide/testrunner/frameworks.html
//
// Make sure you have the wdio adapter package for the specific framework installed before running any tests.
framework: 'mocha',
//
// Test reporter for stdout.
// The only one supported by default is 'dot'
// see also: http://webdriver.io/guide.html and click on "Reporters" in left column
reporters: ['dot', 'allure'],
//
// Some reporter require additional information which should get defined here
reporterOptions: {
    //
    // If you are using the "xunit" reporter you should define the directory where
    // WebdriverIO should save all unit reports.
    outputDir: './'
},
//
// Options to be passed to Mocha.
// See the full list at http://mochajs.org/
mochaOpts: {
    ui: 'bdd'
},
//
// Options to be passed to Jasmine.
// See also: https://github.com/webdriverio/wdio-jasmine-framework#jasminenodeopts-options
jasmineNodeOpts: {
    //
    // Jasmine default timeout
    defaultTimeoutInterval: 5000,
    //
    // The Jasmine framework allows it to intercept each assertion in order to log the state of the application
    // or website depending on the result. For example it is pretty handy to take a screenshot every time
    // an assertion fails.
    expectationResultHandler: function(passed, assertion) {
        // do something
    },
    //
    // Make use of Jasmine-specific grep functionality
    grep: null,
    invertGrep: null
},
//
// If you are using Cucumber you need to specify where your step definitions are located.
// See also: https://github.com/webdriverio/wdio-cucumber-framework#cucumberopts-options
cucumberOpts: {
    require: [],        // <string[]> (file/dir) require files before executing features
    backtrace: false,   // <boolean> show full backtrace for errors
    compiler: [],       // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    dryRun: false,      // <boolean> invoke formatters without executing steps
    failFast: false,    // <boolean> abort the run on first failure
    format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    colors: true,       // <boolean> disable colors in formatter output
    snippets: true,     // <boolean> hide step definition snippets for pending steps
    source: true,       // <boolean> hide source URIs
    profile: [],        // <string[]> (name) specify the profile to use
    strict: false,      // <boolean> fail if there are any undefined or pending steps
    tags: [],           // <string[]> (expression) only execute the features or scenarios with tags matching the expression
    timeout: 20000,      // <number> timeout for step definitions
    ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings.
},
//
// =====
// Hooks
// =====
// WebdriverIO provides a several hooks you can use to interfere the test process in order to enhance
// it and build services around it. You can either apply a single function to it or an array of
// methods. If one of them returns with a promise, WebdriverIO will wait until that promise got
// resolved to continue.
//

/**
 * Gets executed once before all workers get launched.
 * @param {Object} config wdio configuration object
 * @param {Array.<Object>} capabilities list of capabilities details
 */
onPrepare: function (config, capabilities) {
},
/**
 * Gets executed just before initialising the webdriver session and test framework. It allows you
 * to manipulate configurations depending on the capability or spec.
 * @param {Object} config wdio configuration object
 * @param {Array.<Object>} capabilities list of capabilities details
 * @param {Array.<String>} specs List of spec file paths that are to be run
 */
beforeSession: function (config, capabilities, specs) {
},  
/**
 * Gets executed before test execution begins. At this point you can access to all global
 * variables like `browser`. It is the perfect place to define custom commands.
 * @param {Array.<Object>} capabilities list of capabilities details
 * @param {Array.<String>} specs List of spec file paths that are to be run
 */
before: function (capabilities, specs) {
},
/**
 * Hook that gets executed before the suite starts
 * @param {Object} suite suite details
 */
beforeSuite: function (suite) {
},
/**
 * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
 * beforeEach in Mocha)
 */
beforeHook: function () {
},
/**
 * Hook that gets executed _after_ a hook within the suite ends (e.g. runs after calling
 * afterEach in Mocha)
 */
afterHook: function () {
},
/**
 * Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
 * @param {Object} test test details
 */
beforeTest: function (test) {
},
/**
 * Runs before a WebdriverIO command gets executed.
 * @param {String} commandName hook command name
 * @param {Array} args arguments that command would receive
 */
beforeCommand: function (commandName, args) {
},
/**
 * Runs after a WebdriverIO command gets executed
 * @param {String} commandName hook command name
 * @param {Array} args arguments that command would receive
 * @param {Number} result 0 - command success, 1 - command error
 * @param {Object} error error object if any
 */
afterCommand: function (commandName, args, result, error) {
},
/**
 * Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) ends.
 * @param {Object} test test details
 */
afterTest: function (test) {
},
/**
 * Hook that gets executed after the suite has ended
 * @param {Object} suite suite details
 */
afterSuite: function (suite) {
},
/**
 * Gets executed after all tests are done. You still have access to all global variables from
 * the test.
 * @param {Number} result 0 - test pass, 1 - test fail
 * @param {Array.<Object>} capabilities list of capabilities details
 * @param {Array.<String>} specs List of spec file paths that ran
 */
after: function (result, capabilities, specs) {
},
/**
 * Gets executed right after terminating the webdriver session.
 * @param {Object} config wdio configuration object
 * @param {Array.<Object>} capabilities list of capabilities details
 * @param {Array.<String>} specs List of spec file paths that ran
 */
afterSession: function (config, capabilities, specs) {
},
/**
 * Gets executed after all workers got shut down and the process is about to exit.
 * @param {Object} exitCode 0 - success, 1 - fail
 * @param {Object} config wdio configuration object
 * @param {Array.<Object>} capabilities list of capabilities details
 */
onComplete: function (exitCode, config, capabilities) {
},
//
// Cucumber specific hooks
beforeFeature: function (feature) {
},
beforeScenario: function (scenario) {
},
beforeStep: function (step) {
},
afterStep: function (stepResult) {
},
afterScenario: function (scenario) {
},
afterFeature: function (feature) {
}
};

// -> currently supports Mocha, Jasmine, Cucumber
// i.e. using Mocha, npm install wdio-mocha-framework --save-dev and Chai
before() {
  var chai = require('chai');
  global.expect = chai.expect;
  chai.Should();
}

describe('my awesome website', function() {
  it('should do some chai assertions', function() {
      browser.url('http://webdriver.io');
      browser.getTitle().should.be.equal('WebdriverIO - WebDriver bindings for Node.js');
  });
});

// -> global browser object initialized by test runner
console.log(browser.desiredCapabilities);
// get wdio config options
console.log(browser.options);
// check if capability is a mobile device
var client = require('webdriverio').remote({
  desiredCapabilities: {
    platformName: 'iOS',
    app: 'net.company.SafariLauncher',
    udid: '123123123',
    deviceName: 'iPhone',
  }
});
console.log(client.isMobile);
console.log(client.isIOS);
console.log(client.isAndroid);
browser.logger.info('some random logging');

// Organizing Test Suites
// - try running tests in parallel; WebdriverIO creates for each spec or feature file in cucumber a single Selenium session
// - try to test a single feature in your app in one spec file
// - adjust maxInstances property in your config file to run spec files concurrently
// i.e. if you have 3 different capabilities (Chrome, Firefox, and Safari) and you set maxInstances to 1, wdio test runner will spawn
// 3 processes - if we have 10 spec files and set maxInstances to 10, all spec files will get tested at the same time and 30 processes will be spawned
// - can have multiple config files for multiple environments but we need a main config file first that contains configurations shared across
// all envrionments
exports.config = {
  // set maxInstances for all browsers
  maxInstances: 10,
  capabilities: [{
    browserName: "firefox"
  }, {
    // maxInstances can get overwritten per capability
    browserName: "chrome"
  }]
};

// wdio.dev.config.js
var merge = require('deepmerge');
var wdioConf = require('./wdio.conf.js');

// have main config file as default but overwrite envrionment specific information
exports.config = merge(wdioConf.config, {
  capabilities: [
    // more caps here...
  ],

  // run tests on sauce instead locally
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  services: ['sauce']
}, { clone: false });

exports.config.reporters.push('allure');

// - group test specs in suites and run single specific suites instead of all of them
// i.e. wdio wdio.conf.js --suite login
// wdio wdio.conf.js --suite login,otherFeature
exports.config = {
  // define all tests
  specs: ['./test/specs/**/*.spec.js'],
  // define specific suites
  suites: {
    login: [
      './test/specs/login.success.spec.js',
      './test/specs/login.failure.spec.js',
    ],
    otherFeature: [
      // ...
    ]
  }
};

// - run selected tests with --spec parameter
// -> in Mocha/Jasmine can specify which suite or feature for Cucumber
// i.e. wdio wdio.conf.js --spec ./test/specs/e2e/login.js
// -> multiple specs at once
// wdio wdio.conf.js --spec ./test/specs/signup.js,./test/specs/forgot-password.js
// -> to run all specs with word 'dialog' in them as defined in config file
// wdio wdio.conf.js --spec dialog
// -> run suites and test specs
// wdio wdio.conf.js --suite login --spec ./test/specs/signup.js
// - accepts piped input in form of filenames like grep/find/etc.
// grep -r -l --include "*.js" "myText" | wdio wdio.conf.js
// - can stop testing after failure with bail option
// i.e. expects a number with a default of 0: always run all test specs it can find

// Timeouts
// - each command in WebdriverIO is an asynchronous operation where a request is fired to the Selenium server and
// its response contains the result once the action has completed or failed
// - Selenium timeouts
// -> session script timeout: usually 30 seconds default to run asynchronous script
browser.timeouts('script', 60000);
browser.executeAsync(function(done) {
  console.log('This should not fail');
  setTimeout(done, 59000);
});
// -> session page load timeout: to wait for page loading to complete, usually 300000ms default
browser.timeouts('pageLoad', 10000);
// -> session implicit wait timeout: time to wait for implicit element location strategy when locating elements
// using element or elements commands; unless otherwise stated it is 0ms by default
browser.timeouts('implicit', 5000);
// - WebdriverIO related timeouts
// -> WaitForXXX timeout: provides multiple commands to wait on elements to reach a certain state (enabled, visible, existing)
// which take a selector argument and timeout number which declares how long the instance should wait for that element to reach that state
// waitforTimeout option allows you to set global timeout for all waitFor commands so you don't need to set same timeout over and over again
exports.config = {
  waitforTimeout: 5000,
};
var myElem = browser.element('#myElem');
myElem.waitForVisible();

// which is same as 
browser.waitForVisible('#myElem');

// which is same as
browser.waitForVisible('#myElem', 5000);
// - Framework related timeouts
// by default timeout is set to 10 seconds which means that a single test should not take longer than that
// i.e. single test in Mocha
it('should login into the application', function() {
  browser.url('/login');

  var form = browser.element('form');
  var username = browser.element('#username');
  var password = browser.element('#password');

  username.setValue('userXY');
  password.setValue('******');
  form.submit();

  expect(browser.getTitle()).to.be.equal('Admin Area');
});
// can increase timeout if your test takes longer than default value in the framework options
exports.config = {
  framework: 'mocha',
  mochaOpts: {
    timeout: 20000
  }
};
// i.e. for Jasmine
exports.config = {
  framework: 'jasmine',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 20000
  }
};

// Page Object Pattern
// - introducing  "elements as first class citizens" and can build up large test suites
// - Object.create provides all features we need for this pattern: inheritance between page objects, lazy loading of elements
// and encapsulation of methods and actions
// - goal of page objects: abstract any page information away from actual tests; ideally store all selectorrs or specific instructions
// that are unique for a certain page in a page object so you can still run your test after you've completely redesigned your page
// - say we create main page object called Page and it will contain general selectors or methods all page objects will inherit from
// and apart from all child page objects, Page is created using the prototype modle
function Page() {
  this.title = "My Page";
}

Page.prototype.open = function(path) {
  browser.url(path);
}

module.exports = new Page();
// or ES6 class
export default class Page {
  constructor() {
    this.title = 'My Page';
  }

  open(path) {
    browser.url(path);
  }
}
// - we will always export an instance of a page object and never create that instance in the test
// -> we always see page as stateless construct the same way as each http request is stateless construct
// -> browser session infromation shouldn't be reflected within page object and state changes should emerge from actual tests
// i.e. login.page.js and using Object.create method to inherit the prototype of main page
const Page = require('./page');

const LoginPage = Object.create(Page, {
  // define elements
  username: { get() { return browser.element('#username'); } },
  password: { get() { return browser.element('#password'); } },
  form: { get() { return browser.element('#login'); } },
  flash: { get() { return browser.element('#flash'); } },

  // define or overwrite page methods
  open: { value() {
    Page.open.call(this, 'login');
  } },

  submit: { value() {
    this.form.submitForm();
  } }
});

module.exports = LoginPage;
// or using ES6 class
import Page from './page';

class LoginPage extends Page {
  // these getter functions are evaluated when you actually access the proeprty and not when you generate the object
  // and with that you always request the element before you do an action on it
  // -> WebdriverIO internally remembers the last result of a command and if you chain an element command with an action command,
  // it finds the element from the previous command and uses the result to execute the action
  get username() { return browser.element('#username'); }
  get password() { return browser.element('#password'); }
  get form() { return browser.element('#login'); }
  get flash() { return browser.element('#flash'); }

  open() {
    super.open('login');
  }

  submit() {
    this.form.submitForm();
  }
}

export default new LoginPage();

LoginPage.username.setValue('alucero');
// same as this
var elem = browser.element('#username');
elem.setValue('alucero');
// or
browser.element('#username').setValue('alucero');
// or 
browser.setValue('#username', 'alucero');

// i.e. login.spec.js
// when writing test for it we just need to require page object
// - can use page object pattern to encapsulate page information from your actual tests and helps to keep test suite structured
// and clear when probject and number of tests grow
// - can have pageobjects directory as well to separate spec files and page objects
var expect = require('chai').expect;
var LoginPage = require('../pageobjects/login.page');

describe('login form', function() {
  it('should deny access with wrong creds', function() {
    LoginPage.open();
    LoginPage.username.setValue('foo');
    LoginPage.password.setValue('bar');
    LoginPage.submit();

    expect(LoginPage.flash.getText()).to.contain('Your username is invalid!');
  });

  it('should allow access with correct creds', function() {
    LoginPage.open();
    LoginPage.username.setValue('tomsmit');
    LoginPage.password.setValue('SuperSecretPW');
    LoginPage.submit();

    expect(LoginPage.flash.getText()).to.contain('You logged into a secure area!'):
  });
});

// Debugging
// - difficult when several processes spawning dozens of tests in multiple browsers
// - helpful to limit parallelism by setting maxInstances to 1 and targeting only those specs and browsers
// that need to be debugged
// i.e. maxInstances: 1, specs: ['**/myspec.spec.js'], capabilities: [{ browserName: 'firefox' }]
// - can use browser.debug() to pause test and inspect browser and your command line interface will switch to REPL mode
// that allows you to fiddle around with commands and elements on page; can access browser object or $ and $$ in your tests
// -> when using browser.debug() we need to increase timeout of test runner to prevent test runner from failing the test for taking too long
// --watch flag to run certain specs when they get updated; it will initialize desired Selenium sessions defined in config and will wait
// until a file that was defined via the specs option has changed
// - can use node-inspector or chrome-devtools by passing in --inspect flag to node process running tests like
// execArgv: ['--inspec']
// - can do dynamic configuration since we don't want to permanently change timeout value to 1 day but from command line using environment variable
var debug = process.env.DEBUG;
var defaultCapabilities = {};
var defaultTimeoutInterval = 10000;
var defaultSpecs = './';

exports.config = {
  debug: debug,
  maxInstances: debug ? 1 : 100, 
  capabilities: debug ? [{ browserName: 'chrome' }] : defaultCapabilities,
  specs: process.env.SPEC ? [process.env.SPEC] : defaultSpecs,
  jasmineNodeOpts: {
    defaultTimeoutInterval: debug ? (24 * 60 * 60 * 1000) : defaultTimeoutInterval
  }
};
// run command with desired values like this
// DEBUG=true SPEC=myspec ./node_modules/.bin/wdio wdio.conf

// Retry Flaky Tests
// - can rerun unstable tests (due to race conditions or flaky network)
// - for Mocha you can use retry mechanism instead of WebdriverIO implementation that only allows you to rerun certain test blocks
// (within an it block) so you can rerun whole test suites
describe('retries', function() {
  // Retry all tests in this suite up to 4 times
  this.retries(4);

  beforeEach(function() {
    browser.url('http://www.yahoo.com');
  });

  it('should succeed on the 3rd try', function() {
    // Specify this test to only retry up to 2 times
    this.retries(2);
    console.log('run');
    expect(browser.isVisible('.foo').to.eventually.be.true);
  });
});

// - rerun single tests in Jasmine or Mocha by applying number of reruns as last parameter after test block function
describe('my flaky app', function() {
  // same for hooks; run 2 times: 1 actual run + 1 rerun
  beforeEach(function() {

  }, 1);

  // spec that runs max 4 times (1 actual run + 3 reruns)
  it('should rerun a test at least 3 times', function() {

  }, 3);
});

// Custom Reporter
// - create a node module that inherits from Eventemitter object so it can receive messages from the test
var util = require('util');
var events = require('events');

var CustomReporter = function(baseReporter, config, options) {
  // can access reporter optons via reporterOptions object against custom reporter
  // i.e. reporterOptions: { CustomReporter: { outputDir: './custom_report' } }
};

// Inherit from EventEmitter
util.inherits(CustomReporter, events.EventEmitter);

// Expose Custom Reporter
exports = module.exports = CustomReporter;

// assign it to reporter property in config
var CustomReporter = require('./reporter/my.custom.reporter');

exports.config = {
  reporters: [CustomReporter]
};
// - can register event handler for several events which get triggered during the test
// -> will return payload with useful information like current state and progress
// -> start/runner:start/hook:start/suite:start/test:start and end/pass/fail/pending
// -> all event handlers should execute synchronous routines otherwise you will run into race conditions
this.on('test:pass', function() {
  console.log('Hurray! A test has passed');
});

// Custom Service
// - services enable addons to be created for reusable logic to simplify tests, manage test suite, and integrate results
// - services have access to all same before/after hooks available in wdio.conf.js
// - NPM: services should use naming convention like wdio-*-service; use NPM keywords wdio-plugin, wdio-service, main entry should export an instance of the service
// i.e. wdio-sauce-service
class CustomService {
  onPrepare(config, capabilities) {
    // TODO: something before workers launch
  }

  onComplete(exitCode, config, capabilities) {
    // TODO: something after workers shutdown
  }
}

export default CustomService;

// assign it to services property in config
var CustomService = require('./service/my.custom.service');

exports.config = {
  services: [CustomService]
};

// - following recommended naming pattern allows services to be added by name
exports.config = {
  services: ['custom']
};

// Reporters
// - Dot already installed
// - others like Spec, Junit, Allure, TeamCity, Json, Concise, Tap, Mochawesome

// Services
// - Sauce Labs: automatically sets job status for you and updates all important job properties like job name, tags, availability,
// or custom data, use Suace Connect to run tests through secure tunnel
// - Browserstack: manages local tunnel and job metadata for Browserstack users
// - PhantomJS: helps you run PhantomJS seamlessly whhen running tests with WDIO testrunner
// - Webpack: build static assets through webpack before testing - wdio-webpack-service; 'webpack'
// - webpack dev server: wdio-webpack-dev-server-service (webpackConfig: require('webpack.dev.config.js'), webpackPort: 8080)
// - Docker: wdio-docker-service; can run test using containerized application by utilizing popular Docker service that supportds using Docker to host Selenium
// or using Docker to run your containerized application (default Google Chrome, Firefox, and PhantomJS available when installed on host system)
// - Others like Chromedriver, Visual Regression, Iedriver, static server, Appium, TestingBot, Firefox Profile, Selenium Standalone
