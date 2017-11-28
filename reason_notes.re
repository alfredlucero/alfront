/* ReasonML
  - new syntax and toolchain powered by OCaml with syntax geared toward JS programmers
  - compiles to JS through BuckleScript which compiles Ocaml/Reason into readable JS
  with smooth interop
  - rock solid type system: coverage, inference and soundness
  - allow opt-in side-effect, mutation, and object for interop and rest is pure, immutable,
  and functional
  - build system = bsb - fast performance and small output size
  - can paste raw JS snippets right into your Reason file
  - ecosytem and tooling
  - render to native code; side-effects, mutation and other escape hatches
  - the creator created ReactJS -> ReasonReact; growing community
  - refmt - auto-formatting feature; merlin is engine powering type hint, refactor, real-time
  errors, jump to definitions etc. - ocamlmerlin, need to write .merlin but for JS workflow
  its config is generated for you automatically by BuckleScript's bsb
  - REPL called rtop
*/

/* Primitives Overview */
/* Strings */
"Hello"
/* Characters */
'x'
/* Integers */
23, -23
/* Floats */
23.0, -23.0
/* Integer Addition */
23 + 1
/* Float Addition */
23.0 +. 1.0
/* Integer Division/Multiplication */
2 / 23 * 1
/* Float Division/Multiplication */
2.0 /. 23.0 *. 1.0
/* Float Exponentiation */
2.0 ** 2.0
/* String Concatenation */
"Hello " ++ "World"
/* Comparison */
<, >, >=, =<
/* Boolean Operations */
!, &&, ||
/* Reference (shallow), Physical (deep equality) */
===, ===,
/* Immutable Lists */
[1, 2, 3]
/* Immutable Prepend */
[item1, item2, ..theRest]
/* Arrays */
[|1, 2, 3|]
/* Records */
type player = { score: int }; 

/* Let Binding */
/* - can be scoped through {}; bindings immutable */
/* OCaml syntax */
let a = 1 in
let b = 2 in 
a + b
/* Reason syntax, akin to a function, turned in into ; */
let a = 1;
let b = 2;
a + b

/* Types */
/* Types can be inferred, coverage is 100%, pure Reason has no null bugs */
let num: int = 10;
let myInt = (5: int) + (4: int);
let drawCircle = (~radius as r: int) : unit => ...;
type scoreType = int;
let x: scoreType = 10;

/* String and Char
  - strings delimited with double quotes, single quotes for char
  - quoted string for multiline, no special character escaping, hooks for special 
  pre-processors
  - can use JS.string API bindings in BuckleScript API docs
  - char doesn't support unicode or UTF-8, compiles to integer ranging from 0 to 255, can
  pattern match later
*/
let multiLineGreeting = "Hello 
world!";
let greetings = "Hello " ++ "world!";
/* Like JS backtick string interpolation but without built-in interpolation of variables */
let greetingAndOneSlash = {|Hello
World
\
Hehe...
|};

/* Boolean
  - BuckleScript bindings for true and false not same as Reason/OCaml true and false
  so you gotta use JS.to_bool and JS.Boolean.to_js_boolean
  - physical deep checking may have performance hits
  - special case of a variant type bool = True | False
*/

/* Integers
  - 32-bits truncated when necessary
  - bind JS number as float instead
  - floats need +., -., *., /.
*/

/* Tuples
  - immutable, ordered, fix-sized at creation time, heterogeneous with different types
  - destructuring on 2/3 tuples; useful to pattern match or return many values like coordinates
  - keep it local and for data structures that are long-living and passed around often use
  record with named fields
  - can use tuple and switch like cartesian product to avoid bugs
*/
let ageAndName: (int, string) = (22, "Alfred");
type coord3d = (float, float, float);
let my3dCoordinates: coord3d = (20.0, 30.0, 40.0);
let (_, y, _) = my3dCoordinates;

/* Record 
  - lighter, immutable by default, fixed in field names and types, fast, nicely typed
  - needs explicit type definition either above or in another file
  - record types found by field names so can't take any record type as long as they have
  some fields -> should look into Reason objects otherwise
  - fields are fixed and compiled to an array with array index accesse, compiles to a region
  of memory where a field access is just one field lookup + one actual access (2 assembly insns)
  - "nominal typing" based on single explicit type declaration vs. "structural typing"
*/
type person = {
  age: int,
  name: string
};
/* Inferred to be type person */
let me = {
  age: 22,
  name: "Alfred"
};
let name = me.name;
/* If say the type person is in School.re */
let me: School.person = {age: 22, name: "Alfred"};
/* or */
let me = School.{age: 22, name: "Alfred"};
/* or */
let me = {School.age: 22, name: "Alfred"};
/* Immutable update with spread operator */
let meNextYear = {...me, age: me.age + 1};
/* Can optionally be mutable by updating those fields in-place with = operator */
type person = {
  name: string,
  mutable age: int
};
let baby = { name: "Baby", age: 2 }
baby.age = baby.age + 1;
/* Punning for a record's types and values, refers to when name of field matches name of
  it value or type, no punning for a single record field
*/
type horsePower = {power: int, metric: bool};

let metric = true;
let someHorsePower = {power: 10, metric};
/* same as the value {power: 10, metric: metric}; */

type car = {name: string, horsePower};
/* same as the type {name: string, horsePower: horsePower}; */
/* Interop with JS */
type payload = {. "name": string};

[@bs.module "myAjaxLibrary"] external sendQuery : payload => unit = "sendQuery";

sendQuery({"name": "Reason"});

/* Variant
  - express "this or that" rather than "this and that"
  - "constructors" or "tags", need to be capitalized
  - useful for switches to enumerate every variant constructor
  - can have constructor arguments
*/
type myResponseVariant =
  | Yes
  | No
  | PrettyMuch;
let someResponse = Yes;

let message =
  switch someResponse {
  | No => "Nope"
  | Yes => "Yes"
  | PrettyMuch => "PrettyMuch"
  };

/* Zoo.re */
type animal = Dog | Cat | Bird;
/* example.re */
let pet: Zoo.animal = Dog;
/* or */
let pet = Zoo.Dog;
/* Constructor arguments like a function */
type account = 
  | None
  | Instagram(string)
  | Facebook(string, int);

let greeting =
  switch myAccount {
  | None => "Hi!"
  | Facebook(name, age) => "Hi " ++ name ++ ", you're " ++ string_of_int(age) ++ "-year-old."
  | Instagram(name) => "Hello " ++ name ++ "!"
  };
/* option variant: to simulate "nullable" (null or undefined) value
  pure Reason program doesn't have null errors
*/
type option('a) = None | Some('a);

/* List & Array 
  - lists - homogeneous, immutable, fast at prepending items
  - lists are simple, singly linked list, constant time spreading (can't be multiple)
  - empty list is parameter-less variant constructor which compiles to mere integer
  - arrays - mutable, fast at random access and updates, fix-sized on native (flexibly sized on JS)
  - immutable, resizable and features like immutable-re (WIP)
  - can use Js.Array API to resize them
*/
let myList = [1, 2, 3];
let anotherList = [0, ...myList];

let message = 
  switch myList = {
  | [] => "List is empty"
  | [a, ...rest] => "The head of list is the string " ++ a
  };

let myArray = [|"Hello", "World"|];
let firstItem = myArray[0];
myArray[0] = "hey";

/* Function
  - declared with arrow and return expression
  - every function takes an argument, () is called "unit"
  - can do punning, partially called (currying) - OCaml optimizes this to 
  avoid unnecessary function allocation for no performance cost and currying for
  free (every function takes a single argument)
  - can have default values
  - use rec for recursive functions
*/
let greet = (name) => "Hello " ++ name;
greet("Alfred");
let add = (x, y, z) => {
  x + y + z
};
/* receive & destructure the unit argument */
let logSomething = () => {
  print_endline("hello");
  print_endline("world")
};
/* can attach labels to an argument */
let addCoordinates = (~x, ~y) => {
  /* use x and y here */
};
addCoordinates(~y=6, ~x=5);
let drawCircle = (~radius as r: int, ~color as c: string) => {
  setColor(c);
};
drawCircle(~radius=10, ~color="red");

/* radius can be omitted as it is optional */
let drawCircle = (~color, ~radius=?, ()) => {
  setColor(color);
  switch radius {
  | None => startAt(1, 1)
  | Some(r_) => startAt(r_, r_)
  }
};
let actualResultWithoutProvidingRadius = drawCircle(~color, ());
/* recursive functions */
let rec neverTerminate = () => neverTerminate();

/* If-Else 
  - ifs are expressions and evaluated to their body's content
  - ternary is sugar for bool variant and switch
*/
let message = if (isMorning) {
  "Good Morning!"
} else {
  "Hello!"
};
let message = isMorning ? "Good morning!" : "Hello";

/* More on Types 
  - can accept parameters like generics in other languages, need to start with '
*/
type coordinates('a) = ('a, 'a, 'a);
type intCoordinateAlias = coordinates(int);
let intCoordinate: intCoordateAlias = (10, 10, 10);

type result('a, 'b) =
  | Ok('a)
  | Error('b);

type myPayload = {data: string};

type myPayloadResults('errorType) = list(result(myPayload, 'errorType));

let payloadResults: myPayloadResults(string) = [
  Ok({data: "hi"}),
  Ok({data: "bye"}),
  Error("Something wrong happened!")
];

/* Destructuring
  - concise way of extracting fields from a data structure
  - can rename the fields and allows type annotations
*/
let someInts = (10, 20);
let (ten, twenty) = someInts;

type person = { name: string, age: int };
let somePerson = { name: "Regine", age: 21 };
let { name, age } = somePerson;

let (ten: int, twenty: int) = someInts;
let {name: (n: string), age: (a: int)} = somePerson;

type person = {
  name: string,
  age: int
};

let someFunction = (~person as {name}) => {
  /* you can use `name` here */
};

let otherFunction = (~person as {name} as thePerson) => {
  /* you can use both `name` and the whole record as `thePerson` here */
};

/* Pattern Matching
  - like destructuring but with more type help
  - warns you if exhaustive or not, _ fall through
  - can add when clauses for extra if logic
  - flatten your pattern-match whenever you can
  - can use with tuple to map to a 2D table
*/
type payload =
  | BadResult(int)
  | GoodResult(string)
  | NoResult;

let data = GoodResult("Product shipped!");

let message =
  switch data {
  | GoodResult(theMessage) => "Success! " ++ theMessage
  | BadResult(errorCode) => "Something's wrong. The error code is: " ++ string_of_int(errorCode)
  };

switch myList {
  | [] => print_endline("Empty list")
  | [a, ...theRest] => print_endline("list with the head value " ++ a)
  };
  
switch myArray {
  | [|1, 2|] => print_endline("This is an array with item 1 and 2")
  | [||] => print_endline("This array has no element")
  | _ => print_endline("This is an array")
  };

let message =
  switch data {
  | GoodResult(theMessage) => ...
  | BadResult(errorCode) when isServerError(errorCode) => ...
  | BadResult(errorCode) => ... /* otherwise */
  | NoResult => ...
  };

let optionBoolToJsBoolean = (opt) =>
  switch opt {
  | Some(true) => Js.true_
  | Some(false)
  | None => Js.false_
  };

/* Mutation 
  - let-bindings are immutable but you can wrap it with ref
  which is like a box whose content can change
  - get actual value of ref through postfix ^ operator
  - := to assign a new value
  - just syntax sugar for predefined mutable record type called ref
  like foo = {contents: 5} vs. ref(5)
  - can achieve lightweight, local "mutations" by overriding let bindings
*/
let foo = ref(5);

let five = foo^;
foo := 6;

/* Imperative Loops
  - no loop-breaking "break" keyword, prefer map/filter/reduce over
  imperative loops
  - can break out of while loop easily using mutable binding
*/
for (myBinding in startValue to endValue) {

};

for (x in xStart downto xEnd) {

};

while (testCondition) {
  
};

Random.self_init();

let break = ref(false);

while (! break^) {
  if (Random.int(10) === 3) {
    break := true
  } else {
    print_endline("hello")
  }
};

/* JSX
  - HTML syntax, isn't tied to ReactJS, translates to
  normal function calls
  - not what ReasonReact turns JSX into in the end
  - can do children spread, no support for JSX prop spread
  - supports punning like <input checked />
  - want to evolve toward macros and library-agnostic JSX syntax
*/
<MyComponent foo={bar} />
MyComponent.make(~foo=bar, ~children=[], ());

<div foo={bar}> child1 child2 </div>;
([@JSX] div(~foo=bar, ~children=[child1, child2], ()));

<MyComponent> ...((theClassName) => <div className=theClassName />) </MyComponent>;
<MyForm> ...("Hello", "Submit") </MyForm>;

/* External
  - "FFI" (foreign function interface) or "interop"
  - let binding with body omitted and type written down
  - should learn the BuckleScript externals
*/
external myCFunction: int => string = "theCFunction";
[@bs.val] external getElementsByClassName : string => array(Dom.element) = "document.getElementsByClassName";

/* Object
  - more flexible, doesn't need a type declaration, looks like a record except
  with a .
  - single dot . is "closed" object type which means object based on this type
  must exactly have this shape
  - two dots called elision is "open" and contain other values and methods, polymorphic and
  requires a parameter
  - for JS, gotta use BuckleScript's special object accessed fields through ##,
  always come with JS.t as type parameter, compiles to actual JS objects
  i.e. {"foo": bar} looks like quoted record, {. "foo": string } for types
*/
type tesla = {
  .
  color: string
};
type car('a) = {
  ..
  color: string
} as 'a;

/* Can have pub/pri methods, access this, val, # to access */
type tesla = {.
  drive: int => int
};

let obj: tesla = {
  val hasEnvy = ref(false);
  pub drive = (speed) => {
    this#enableEnvy(true);
    speed
  };
  pri enableEnvy = (envy) => hasEnvy := envy
};

/* Exception
  - special kind of variant, "thrown" in exceptional cases
*/
switch (List.find((i) => i === theItem, myItems)) {
  | item => print_endline(item)
  | exception Not_found => print_endline("No such item found!")
  };

/* Modules
  - like mini files, contain type definitions, let bindings, nested modules, etc.
  - must start with a capital letter, contents accessed using dot notation
  - can be nested and can do a local/global open
  - can extend module with include like inheritance or mixins
  - every .re file is a module
  - module's type = "signature", every .rei file is a signature
  - module functions - functors (passing modules to functions)
*/
module School = {
  type profession = Teacher | Director;

  let person1 = Teacher;
  let getProfession = (person) =>
    switch person {
    | Teacher => "A teacher"
    | Director => "A director"
    };
};

let anotherPerson: School.profession = School.Teacher;
print_endline(School.getProfession(anotherPerson)); /* "A teacher" */

let message =
  School.(
    switch person1 {
    | Teacher => "Hello teacher!"
    | Director => "Hello director!"
    }
  );

module BaseComponent = {
  let defaultGreeting = "Hello";
  let getAudience = (~excited) => excited ? "world!" : "world";
};

module ActualComponent = {
  /* the content is copied over */
  include BaseComponent;
  /* overrides BaseComponent.defaultGreeting */
  let defaultGreeting = "Hey";
  let render = () => defaultGreeting ++ " " ++ getAudience(~excited=true);
};

/* Picking up previous section's example */
module type EstablishmentType = {
  type profession;
  let getProfession: profession => string;
};

module type Comparable = {
  type t;
  let equal: (t, t) => bool;
};

module MakeSet = (Item: Comparable) => {
  /* let's use a list as our naive backing data structure */
  type backingType = list(Item.t);
  let empty = [];
  let add = (currentSet: backingType, newItem: Item.t) : backingType =>
    /* if item exists */
    if (List.exists((x) => Item.equal(x, newItem), currentSet)) {
      currentSet /* return the same (immutable) set (a list really) */
    } else {
      [
        newItem,
        ...currentSet /* prepend to the set and return it */
      ]
    };
};

/* JS Interop
  - can just dump JS in middle of Reason code without type safety with bs.raw
  - use bs.val and external with types to use JS functions
  - use existing JS libraries with bs.module
*/
Js.log("this is reason");

[%%bs.raw {|
console.log('here is some javascript for you');
|}];

/* x is magic type that will unify with anything, should always probide type though for bs.raw */
Js.log("this is reason");
let x: string = [%bs.raw {| 'here is a string from javascript' |}];
Js.log(x ++ " back in reason land"); /* ++ is the operator for string concat */

let jsCalculate: (array(int), int) => int = [%bs.raw
{|
function (numbers, scaleFactor) {
 var result = 0;
 numbers.forEach(number => {
   result += number;
 });
 return result * scaleFactor;
}
|}
];

let calculate = (numbers, scaleFactor) => jsCalculate(Array.of_list(numbers), scaleFactor);

[@bs.val] external pi : float = "Math.PI";
let tau = pi *. 2.0;
[@bs.val] external alert : string => unit = "alert";
alert("hello");

type error;

[@bs.module] external glob : (string, (Js.nullable(error), array(string)) => unit) => unit = "";
[@bs.val] [@bs.module "glob"] external sync : string => array(string) = "";
