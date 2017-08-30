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
