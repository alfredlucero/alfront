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