// TypeScript notes: by Microsoft
// classes and modules, integrate with gulp/grunt
// used with node, npm install -g typescript
// tsc helloworld.ts to compile typescript code
function hello(string : String) {
  console.log("Hello " + string);
}
hello("Alfred");
// hello(1); will fail cause wrong types

// Types important during compile time
var n : Number = 1;
var anything : any = 'any type';

// Types such as Boolean, Number, String, array etc.
var isBool : Boolean = false;
var count : Number = 10;
var stringVal : String = 'stringval';
var namesArray : any[] = ['Sample', 'Array'];

// Enums
enum Starks {Jon, Bran, Arya, Catlyn};

var cat : Starks = Starks.Catlyn;

// Return values of function
function returnString() : String {
  return "Returns a String";
}

function returnVoid() : void {
  console.log("Void function");
}

// Interfaces: definition/blueprint for an object
interface Stark {
  name: String;
  age?: number; // optional property
}

function printName(stark : Stark) {
  console.log(stark.name);
}

printName({name: "Arya"});
// printName({label: "Errors out"});

// Classes
class Stark {
  name: String = "Brandon";
  static castle: String = "Winterfell";
  saying: String;

  constructor() {
    this.saying = "Winterfell!";
  }

  hello(person : String) {
    console.log("Hello, " + person);
  }
}

var ned = new Stark();
ned.saying = "Winter is coming";
// console.log(Stark.castle);
ned.hello("Alfred");

// Inheritance with extends
class Person {
  name: String;
  constructor(name : String) {
    this.name = name;
  }
  dance() {
    console.log(this.name + " is dancing");
  }
}

var bran = new Person("bran");
bran.dance();

class AwesomePerson extends Person {
  dance() {
    console.log("So awesome!");
  }
}

var robb = new AwesomePerson("Robb");
robb.dance();

// Modules: export classes
module Utility { 
  export class Useful {
    timesTwo(n : number) {
      return n * 2;
    }
  }
}

// <reference path="timesTwo.ts" />
// var use = new Utility.Useful();
// console.log(use.timesTwo(9));
// tsc util.ts timesTwo.ts --out util.js to combine files

// Object-oriented Design patterns
// Decorator Pattern: allow objects to have different options by wrapping around it
abstract class Car {
  public description: string;
  public getDescription(): string {
    return this.description;
  }
  public abstract cost(): number;
}

class ModelS extends Car {
  public description = "Model S";

  public cost(): number {
    return 73000;
  }
}

class ModelX extends Car {
  public description = "Model X";

  public cost(): number {
    return 77000;
  }
}

abstract class CarOptions extends Car {
  decoratedCar: Car;
  public abstract getDescription(): string;
  public abstract cost(): number;
}

class EnhancedAutoPilot extends CarOptions {
  decoratedCar: Car;
  constructor(car: Car) {
    super();
    this.decoratedCar = car;
  }
  public getDescription(): string {
    return this.decoratedCar.getDescription() + ', Enhanced AutoPilot';
  }
  public cost(): number {
    return this.decoratedCar.cost() + 5000;
  }
}

// EnhancedAutoPilot class decorates the ModelS Car class with more options
let myTesla = new ModelS();
myTesla = new EnhancedAutoPilot(myTesla);
console.log(myTesla.getDescription());
console.log(myTesla.cost());
// We had abstract component Car class, concrete component ModelS class
// abstract decorator CarOptions class and concrete decorator EnhancedAutoPilot class

// Observer pattern
// when one part of application changes, another part needs to be updated like onChange/Click events
interface Subject {
  registerObserver(o: Observer);
  removeObserver(o: Observer);
  notifyObservers();
}

interface Observer {
  update(temperature: number);
}

class WeatherStation implements Subject {
  private temperature: number;
  private observers: Observer[] = [];

  setTemperature(temp: number) {
    console.log("WeatherStation: new temperature measurement: " + temp);
    this.temperature = temp;
    this.notifyObservers();
  }

  public registerObserver(o: Observer) {
    this.observers.push(o);
  }

  public removeObserver(o: Observer) {
    let index = this.observers.indexOf(o);
    this.observers.splice(index, 1);
  }

  public notifyObservers() {
    for(let observer of this.observers) {
      observer.update(this.temperature);
    }
  }
}

// Observer: observes another object for updated temps (WeatherStation)
class TemperatureDisplay implements Observer {
  private subject: Subject;
  
  constructor(weatherStation: Subject) {
    this.subject = weatherStation;
    weatherStation.registerObserver(this);
  }

  public update(temperature: number) {
    console.log('TemperatureDisplay: I need to update my display.');

  }
}

class Fan implements Observer {
  private subject: Subject;
  
  constructor(weatherStation: Subject) {
    this.subject = weatherStation;
    weatherStation.registerObserver(this);
  }

  public update(temperature: number) {
    if (temperature > 25) {
      console.log('Fan: it is hot here, turning myself on...');
    } else {
      console.log('Fan: it is nice and cool, turning myself off...');
    }
  }
}

let weatherStation = new WeatherStation();
let tempDisplay = new TemperatureDisplay(weatherStation);
let fan = new Fan(weatherStation);

weatherStation.setTemperature(20);
weatherStation.setTemperature(30);
// run for example tsc observer.ts && node observer.js
// Observer interface notify() and concrete observers like Fan and Temperature Display
// Subject interface with observerCollection, register/unregister/notifyObservers() and concrete subject like WeatherStation

// Facade pattern
// class hides a lot of the complexity away behind a single method
class BlurayPlayer {
  // ...
}

class Amplifier {
  // ...
}

class TV {
  turnOn() {
    console.log('TV turning on...');
  }
  turnOff() {
    console.log('TV turning off...');
  }
}

class Lights {
  dim() {
    console.log('Lights are dimming...');
  }
}

class PopcornMaker {
  turnOn() {
    console.log('Popcorn maker turning on...');
  }

  turnOff() {
    console.log('Popcorn maker turning off...');
  }

  pop() {
    console.log('Popping corn!');
  }
}

class HomeTheaterFacade {
  private bluray: BlurayPlayer;
  private amp: Amplifier;
  private lights: Lights;
  private tv: TV;
  private popcornMaker: PopcornMaker;

  constructor(amp: Amplifier, bluray: BlurayPlayer, lights: Lights, tv: TV, popcornMaker: PopcornMaker) {
    this.amp = amp;
    this.bluray = bluray;
    this.lights = lights;
    this.tv = tv;
    this.popcornMaker = popcornMaker;
  }

  public watchMovie() {
    // ... Logic using all the classes we initialized ...
  }
}

// Adapter pattern
// imagine converting from one thing to another like arguments/setup
interface IPhone {
  useLightning();
}

interface Android {
  useMicroUSB();
}

class iPhone7 implements IPhone {
  useLightning() {

  }
}

class GooglePixel implements Android {
  useMicroUSB() {

  }
} 

class LightningToMicroUSBAdapter implements Android {
  iphoneDevice: IPhone;
  
  constructor(iphone: IPhone) {
    this.iphoneDevice = iphone;
  }

  useMicroUSB() {
    console.log('Want to use microUSB, converting to Lightning...');
    this.iphoneDevice.useLightning();
  }
}

let iphone = new iPhone7();
let chargeAdapter = new LightningToMicroUSBAdapter(iphone);
chargeAdapter.useMicroUSB();

// State pattern
// keeps track of state of process, make a class for each state
// have a class keep track of the state and move it along
interface State {
  order: Order;

  cancelOrder();
  verifyPayment();
  shipOrder();
}
class Order {
  public cancelledOrderState: State;  
  public paymentPendingState: State;  
  public orderShippedState: State;  
  public orderBeingPreparedState: State;  
  
  public currentState: State;

  constructor() {
    this.cancelledOrderState = new CancelledOrderState(this);
    this.paymentPendingState = new PaymentPendingState(this);
    this.orderShippedState = new OrderShippedState(this);
    this.orderBeingPreparedState = new OrderBeingPreparedState(this);
  }

  public setState(state: State) {
    this.currentState = state;
  }

  public getState(): State {
    return this.currentState;
  }
}

class PaymentPendingState implements State {
  public order: Order;

  constructor(order: Order) {
    this.order = order;
  }
  public cancelOrder() {
    console.log('Cancelling your unpaid order...');
    this.order.setState(this.order.cancelledOrderState);
  }
  public verifyPayment() {
    console.log('Payment verified! Shipping soon.');
    this.order.setState(this.order.orderBeingPreparedState);
  }
  public shipOrder() {
    console.log('Cannot ship the order when payment is pending');
  }
}

class OrderBeingPreparedState implements State {
  public order: Order;

  constructor(order: Order) {
    this.order = order;
  }
  public cancelOrder() {
    console.log('Cancelling your order...');
    this.order.setState(this.order.cancelledOrderState);
  }
  public verifyPayment() {
    console.log('Already verified your payment.');
  }
  public shipOrder() {
    console.log('Shipping your order now.');
    this.order.setState(this.order.orderShippedState);
  }
}

class CancelledOrderState implements State {
  public order: Order;

  constructor(order: Order) {
    this.order = order;
  }
  public cancelOrder() {
    console.log('Your order has already been cancelled.');
  }
  public verifyPayment() {
    console.log('Order cancelled, you cannot verify payment.');
  }
  public shipOrder() {
    console.log('Order cannot ship, it was cancelled.');
  }
}

class OrderShippedState implements State {
  public order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  public cancelOrder() {
    console.log('You cannot cancel, already shipped...');
  }
  public verifyPayment() {
    console.log('You cannot verify payment, already shipped...');
  }
  public shipOrder() {
    console.log('You cannot ship it again, already shipped...');
  } 
}

// TypeScript Documentation Notes
// - JS with types and static type checking
// -> Boolean
let isDone: boolean = false;
// -> Number (floating type)
let decimal: number = 4;
// -> String (single/double quotes/template strings ``)
let color: string = "blue";
// -> Array
let list: number[] = [1, 2, 3];
// -> Tuple - type of fixed number of elements is known
let x: [string, number];
x = ["somestring", 4]; // cannot be [4, "somestring"], order matters; cannot do x[1].substr(1)
// when accessing an element outside the set of unknown indices, union type is used instead
// -> Enum - give more friendly names to numeric values like C#
enum Color { Red, Green, Blue }
let c: Color = Color.Green;
// -> Any - to avoid compile time checks
let notSure: any = 4; // any[] for array of mixed types
// -> Object - can assign any value to them but can't call arbitrary methods on them even if they exist
let prettySure: Object = 4;
// -> Void - absence of having any type at all
// can only assign null or undefined to them
function warnUser(): void {
  alert('This is my warning message');
}
// -> Null and undefined - subtypes of all other types, can only assign to void
// --strictNullChecks makes sure null and undefined only assignable to void
// -> Never - type of values that never occur like return type for function expression or arrow function
// that always throws an exception or one that never returns, assignable to every type
// i.e. Function returning never must have unreachable end point
function error(message: string): never {
  throw new Error(message);
}
// - Type assertions - telling the compiler "trust me, I know what I'm doing", like a type cast
// but performs no special checking or restructuring of data, no runtime impact but used by compiler
// -> TypeScript assumes you have performed any special checks you need and are sure of the type suggested
let someValue: any = "this is a string";
// angle bracket syntax
let strLength: number = (<string>someValue).length;
// as syntax
let someValue2: any = "this is a string";
let strLength2: number = (someValue2 as string).length;

// Variable Declarations
// - var with function scoping, leaks out to containing function
// - let with lexical/block scoping, helps with new scope per iteration (don't need to use IIFE)
// - const cannot be changed once bound, block scoping, internal state still modifiable though
// TS lets you specify members of an object are readonly
// - array destructuring
function f([first, second]: [number, number]) {
  console.log(first);
  console.log(second);
}

let [first, ...rest] = [1,2,3,4];
console.log(first);
// - object destructuring
let o = {
  a: "foo",
  b: 12,
  c: "bar"
};
let { a, b } = o;

let { a, ...passthrough } = o;
let total = passthrough.b + passthrough.c.length;

// Setting types on destructured objects and setting default values
let { a, b }: { a: string, b: number } = o;
function keepWholeObject(wholeObject: { a: string, b?: number }) {
  let { a, b = 1001 } = wholeObject;
}

// Function declarations
type C = { a: string, b?: number }
function functionTest({ a, b }: C): void {
  // ...
}
// with defaults
function funcDefaultTest({ a, b } = { a: "", b: 0 }): void {
  // ...
}

// spread operator
let first = [1,2];
let second = [3,4];
let bothPlus = [0, ...first, ...second];

// Interfaces
// - typechecking focuses on the shape the values have - "duck typing" or "structural subtyping"
// - checks for at least the ones required are present and match the types required
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = { size: 10, label: "Size 10" };
printLabel(myObj);

// optional properties denoted by ?
interface SquareConfig {
  color?: string;
  width?: number;
}

// function someFunc(args) : return types { ...functionbody }
function createSquare(config: SquareConfig) : { color: string; area: number } {
  let newSquare = {color: "white", area: 100};
  if (config.color) {
      newSquare.color = config.color;
  }
  if (config.width) {
      newSquare.area = config.width * config.width;
  }
  return newSquare;
}
let mySquare = createSquare({ color: "black" });

// use readonly to denote that some properties should only be modifiable when an object is first created
// - variables use const, properties use readonly
interface Point {
  readonly x: number;
  readonly y: number;
}
let p1: Point = { x: 10, y: 20 };
// p1.x = 5; // error!
// ReadonlyArray<T> which is same as Array<T> with all mutating methods removed
let arr: number[] = [1,2,3];
let ro: ReadonlyArray<number> = arr;
// can override it with type assertion like arr = ro as number[]
// ro[0] = 12; // error!
// ro.push(5); // error!
// ro.length = 100; // error!
// a = ro; // error!

// When using optional properties ("option bags"), there is excess property checking
// when assigning them to other variables or passing them as arguments
// - if an object literal has any properties that the "target type" doesn't have, you get an error
// error: 'colour' not expected in type 'SquareConfig'
//let mySquare1 = createSquare({ colour: "red", width: 100 });
// - can get around with type assertion
let mySquare2 = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

// - can also do string index signatures
// can have any number of properties with any type that aren't color and width
// - or can just assign object to another variable to get around excess property checks
interface SquareConfigStringSignature {
  color?: string;
  width?: number;
  [propName: string]: any;
}

// Function types and interfaces
// - like with only parameter list and return type
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// parameter names do not need to match but the types do
// - also does contextual typing that can infer argument types and return types
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}

// Indexable types
// - index signature that describes the types we can use to index into the object along
// with the corresponding return types when indexing
// - two types of supported index signatures: string and number
// - helps with "dictionary" pattern
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];

// Class types
// - can implement an interface that describes the public side of the class
// - two types: type of the static side and type of instance side
// - when a class implements an interface, only the instance side of the class is checked
// and constructor sits in static side and not included in check
interface ClockInterfaceTest {
  currentTime: Date;
  setTime(d: Date);
}

class Clock implements ClockInterfaceTest {
  currentTime: Date;
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) { }
}

interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
  tick();
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) { }
  tick() {
      console.log("beep beep");
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) { }
  tick() {
      console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);

// - interfaces can extend each other with "extends"
// - interfaces can extend a class type as it inherits the members of the class but not their 
// implementations
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;

// Classes
// - ES6 with more OO approach
class Greeter {
  greeting: string;
  constructor(message: string) {
      this.greeting = message;
  }
  greet() {
      return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");
