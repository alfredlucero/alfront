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