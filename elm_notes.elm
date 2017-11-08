Elm: Functional Progamming Language
-- Great static type checking with compiler, rare runtime exceptions
-- Improve performance with Html.Lazy, Html.Keyed, pretty fast
-- Amazing type system, pure functions, immutability, higher-order functions
-- Powerful time traveling debugger, can go back to state history and replay --debug
-- Standardized dev tools: make (compiler), package (build tool), repl (read-eval-print loop), upgrade
-- Others such as reactor (simple web server and websocket-based live reload), format
-- quite large applications compiled, interoperability with ports(talking to JS code outside)/flags
-- Pattern matching, model-update-view architecture suitable for web apps
-- Model: state of appplication, single data structure for app
-- Update: portion of application that handles both changes to the Model, I/O such as http requests
-- Update called whenever a Msg value is produced with action and data i.e. UserSearchInput "john"
-- View: portion of program that renders HTML and handles user inputs, takes Model as argument
-- View called by Elm runtime anytime any value in the Model changes, user inputs produce Msg values for Update
-- May have complicated JSON decoders, union types points out errors, possibly difficult handling events/event.target


i.e. Using types
-- The type representing the possible states of the tag
type TagState = Current | Added | Removed

-- The type representing a single tag
type alias Tag = {
	tagId : Int,
	tagName : String,
	tagStatus : TagState
}

-- Function that takes a tag value and returns an html
-- value that will be rendered by the Elm program
displayTag : Tag -> Html Msg
displayTag tag =
    -- perform a match against the tagStatus field of the tag parameter
    case tag.tagStatus of

        Current ->
            -- Display a standard tag
            div [ class "tag" ] [ text tag.tagName ]

        Added ->
            -- Display a tag, but include the 'tag-added' class
            -- so that we can style these tags differently
            div [ class "tag tag-added" ] [ text tag.tagName ]

        Removed ->
            -- Display an empty div*
            div [] []

-- i.e. Sample functions, returns a new array
square : Int -> Int
square x = x * x

normalList = [1, 2, 3, 4, 5]

squaredList = List.map square normalList

-- i.e. Sample pattern matching with _
type PermissionLevel = AdministratorPermissionLevel | StandardPermissionLevel

type UserGroup = AdministratorUserGroup | StandardUserGroup


-- Function checks whether a user can edit a post
checkIfUserCanEditPost : PermissionLevel -> UserGroup -> Bool
checkIfUserCanEditPost requiredPermissionLevel currentUserGroup =
    case (requiredPermissionLevel, currentUserGroup) of
        -- A standard user can edit a standard post
        (StandardPermissionLevel, StandardUserGroup) ->
            True

        -- An administrator can edit any post
        (_, AdministratorUserGroup) ->
            True

        -- Deny any other possible combination of values
        _ ->
            False

-- Sample Button Incrementer
import Html exposing (beginnerProgram, div, button, text)
import Html.Attributes exposing (type_)
import Html.Events exposing (onClick)


main =
  beginnerProgram { model = 0, view = view, update = update }

view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (toString model) ]
    , button [ onClick Increment ] [ text "+" ]
    , button [ onClick Double ] [ text "Double!" ]
    ]

type Msg = Increment | Decrement | Double

update msg model =
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1
      
    Double ->
      model * 2

-- Elm Documentation Notes:
-- / functional language that compiles to JavaScript, enforced semver for packages
-- / no runtime errors in practice (no null or undefined), friendly error messages
-- / elm-repl - to play with Elm expressions
-- / elm-reactor - get a project going and access any Elm file in localhost, --port, --address
-- / elm-make - compile Elm code directly to HTML or JavaScript
-- i.e. elm-make Main.elm --output=main.html, --warn
-- / elm-package - download packages, elm-package.json i.e. elm-package install elm-lang/http
-- install, publish to Elm Package Catalog, bump, diff
-- make distinction between integers (/ division) and floating point numbers (// division)
-- concatenate strings together 
"hello" ++ "world" 

-- functions, use spaces to apply the function
isNegative n = 
  n < 0

-- if expressions, no notion of truthiness with numbers, strings, and lists
if True then "hello" else "world"

-- Lists - hold sequence of related things similar to arrays in JavaScript, can hold many values
-- -> values must all have same type
names = [ "Alfred", "Regine" ]
List.isEmpty names
List.length names
List.reverse names

numbers = [1,4,3,2]
List.sort numbers
double n = n * 2
List.map double numbers

-- Tuples - data structure that can hold a fixed number of values and each value can have any type
-- -> common use if you need to return more than one value from a function
import String
goodName name =
    if String.length name <= 20 then
      (True, "Name accepted!")
    else    
      (False, "Name was too long; please limit it to 20 characters")

-- Record is a set of key-value pairs, similar to objects in JS or Python
-- cannot ask for a field that does not exist
-- no field will ever be undefined or null
-- you cannot create recursive records with a this or self keyword
-- structural typing - records in Elm can be used in any situation as long as necessary fields exist
point =  { x = 3, y = 4 }
point.x
bill = { name = "Gates", age = 57 }
bill.name
-- can also do access like a function by starting the variable with a dot
.name bill
List.map .name [bill, bill, bill]
-- ["Gates", "Gates", "Gates"]
-- can do pattern matching as well, can pass in any record as long as it has an age field
under70 {age} = age < 70
under70 bill
-- updating values in a record, no destructive updates
-- actually create a new record rather than overwriting the existing one
{ bill | name = "Nye" }
{ bill | age = 22 }

-- Elm Architecture
-- / simple pattern for architecting webapps, for modularity, code reuse, and testing
-- / Model: state of your application
-- / Update: way to update your state
-- / View: way to view your state as HTML 
import Html exposing (..)

-- MODEL
type alias Model = { ... }

-- UPDATE
type Msg = Reset | ...

update : Msg -> Model -> Model
update msg model = 
  case msg of
    Reset -> ...
    ...

-- VIEW
view : Model -> Html Msg
view model =
  ...

-- User Input
-- Examples with Button Incrementer/Decrementer
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)

main =
  Html.beginnerProgram { model = model, view = view, update = update }

-- MODEL
type alias Model = Int

model : Model
model = 
  0

-- UPDATE
-- Messages we will get from the UI, describes the capabilities as data
type Msg = Increment | Decrement
update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment -> 
      model + 1

    Decrement ->
      model - 1

-- VIEW
-- elm-lang/html gives you full access to HTML5 as normal Elm functions
-- chunk of HTML that can produce Msg values
-- view code entirely declarative, take in a Model and produce some Html
-- clever optimizations, no need to mutate DOM manually, code runs faster, less code
view : Model -> Html Msg
view model = 
  div []
    -- div and button normal Elm functions that take a list of attributes and list of child nodes
    -- instead of < and > we have [ and ]
    [ button [ onClick Decrement ] [ text "-" ] -- feeds directly into update function
    , div [] [ text (toString model) ]
    , button [ onClick Increment ] [ text "+" ]
    ]

-- Sample with Text Fields
import Html exposing (Html, Attribute, div, input, text)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)

main = 
  Html.beginnerProgram { model = model, view = view, update = update }

-- MODEL
-- represented as a record to add more fields as app gets complicated
type alias Model = { content : String }

model : Model
model =
  { content = "" }

-- UPDATE
-- the user can change the contents of the text field
type Msg =
  Change String

update : Msg -> Model -> Model
update msg model = 
  case msg of 
    -- Update the content record on change of input text field
    Change newContent ->
      { model | content = newContent }

-- VIEW
view : Model -> Html Msg
view model =
  div []
    -- onInput takes the Change function; Change : String -> Msg
    -- on typing a character, triggers an input event and we'll get message Change "text" in update function
    [ input [ placeholder "Text to reverse", onInput Change ] [] 
    -- Reverses user input
    , div [] [ text (String.reverse.model.content) ]
    ]

-- Sample Forms
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)

main =
  Html.beginnerProgram { model = model, view = view, update = update }

-- MODEL
type alias Model =
  { name : String
  , password : String
  , passwordAgain : String  
  }

model : Model
model =
  Model "" "" ""

-- UPDATE
type Msg
  = Name String
  | Password String
  | PasswordAgain String

update : Msg -> Model -> Model
update msg model =
  case msg of
    Name name ->
      { model | name = name }
    
    Password password ->
      { model | password = password }
    
    PasswordAgain password ->
      { model | passwordAgain = passwordAgain }

-- VIEW
view : Model -> Html Msg
view model =
  div []
    [ input [ type_ "text", placeholder "Name" onInput Name ] []
    , input [ type_ "password", placeholder "Password", onInput Password ] []
    , input [ type_ "password", placeholder "Re-enter Password", onInput PasswordAgain ] []
    , viewValidation model
    ]

viewValidation : Model -> Html Msg
viewValidation model =
  let
    (color, message) =
      -- Compares two passwords
      if model.password == model.passwordAgain then
        ("green", "OK")
      else
        ("red", "Passwords do not match!")
  in
    div [ style [("color", color)] [ text message ] ]

-- Elm Architecture + Effects
