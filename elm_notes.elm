-- Elm: Functional Progamming Language
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
-- Informative compiler messages like Lists with different types, currying/partial application of functions
-- think piping functionality of functional programming, think values or functions
-- make one change for new message or functionality and let compiler tell you errors of where to change
-- not afraid to make changes/refactor cause compiler guides you through errors
-- Msg -> update -> Model -> view -> Html (Elm Runtime)
-- create-elm-app; elm-ui-explorer like storybook

-- How we embedded into our Backbone/Marionette application
-- const ElmView = Marionette.ItemView.extend({
--       template: `<div><div data-role="elm-rts"></div></div>`,
--     });
-- options.layoutController.display(new ElmView());

-- const Elm = require("elm/Rts.elm");
-- Elm.Rts.embed(document.querySelector("[data-role=elm-rts]"));

-- Sample test suite with Elm
-- module RtsTest exposing (..)

-- import Expect exposing (Expectation)
-- import Fuzz exposing (Fuzzer, int, list, string)
-- import Html
-- import Rts
-- import Test exposing (..)
-- import Test.Html.Query as Query
-- import Test.Html.Selector exposing (tag, text)


-- suite : Test
-- suite =
--     describe "Rts"
--         [ test "should work!" <|
--             \_ ->
--                 Rts.view { foo = "bar" }
--                     |> Query.fromHtml
--                     |> Query.find [ tag "p" ]
--                     |> Query.has [ text "Foo is bar" ]
--         ]

-- Sample starter Elm file for us
module Rts exposing (..)

import Html exposing (Html, div, h1, p, text)
import Html.Attributes exposing (class)


main =
    Html.program
        { init = init
        , view = view
        , update = update
        -- Listen to mouse movement, requestAnimationFrame
        , subscriptions = subscriptions
        }

-- Types with a record (like JS object, key-value pairs), shows intent, can show without it but helps for readability
-- Sample syntax usage i.e. { foo = "asdf", bar = 3 } and model.foo to get the string
type alias Model =
    { foo : String
    }

-- Union type like enums
type Msg = NoOp


-- Defines initial model and any commands, startup of main Html.program
init : ( Model, Cmd Msg )
init =
    -- Cmd.none is empty command
    ( { foo = "bar" }, Cmd.none )


type Msg
    -- NoOp to be replaced when we start implementing further
    = NoOp


-- Returns a tuple of Model and Cmd Msg, package together values like Python tuples
-- Tuple syntax usage i.e. (1, "adsf", 1234)
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Hello from Elm!" ]
        , p [] [ text ("Foo is " ++ model.foo) ]
        ]

-- Pairing time with our Mako project yay -> Insights
-- Return and console log in one line woah - Debug.log()
-- Pure functions (same input and same output), no side effects, immutability
-- html to elm converter for speedy conversion into proper syntax - https://mbylstra.github.io/html-to-elm/
-- elm ui explorer like react storybook - http://package.elm-lang.org/packages/kalutheo/elm-ui-explorer/latest
-- 
-- use Nothing, Maybe (could be Nothing or List of strings)
-- can maybe have anything or nothing; if it's not something, it's just something - can't do Nothing | a
-- https://ellie-app.com/new, http://elm-lang.org/examples/random
type Maybe a = Nothing | Just a

-- Need labels in front of payload to help distinguish types that's why we need Just
type Foo = GoodVal String | Error String

-- Rendering message rows by mapping woooooo
-- Nothing in initial state while fetching or returned error, Just when we receive list of messages from endpoint
view : Model -> Html Msg
view model =
  case model.messages of 
    Nothing ->
      h1 [] [ text "Loading..." ]
    Just messages ->
    div [] [ 
      table [ class "table-wrap", id "email_stats" ]
        [ thead []
            [ tr []
                [ th []
                    [ text "Status" ]
                , th []
                    [ text "Message" ]
                , th []
                    [ text "Opens" ]
                , th []
                    [ text "Clicks" ]
                ]
            ]
        , tbody [ attribute "data-role" "tableBody" ]
            (List.map viewMessage messages)
        ]
      , viewModal model.modalMessage
    ]

viewModal : Maybe Message -> Html Msg
viewModal maybeMessage =
  case maybeMessage of
    Nothing ->
      div [] [ div [ class "side-modal" ] [ text "Not showing cause no message modal details" ]
        , div [ class "side-modal-mask" ] []
      ]
    
    Just message
      div [] [ div [ class "side-modal is-visible" ] [ text message.subject ]
        , div [ class "side-modal-mask is-visible", onClick HideModalMessage ] []
      ]

viewMessage : Message -> Html Msg
viewMessage message =
    -- listen to events, inline styles by taking list of tuples (style, value)
    tr [ onClick (ClickedMessage message), style [ ("cursor", "pointer") ] ]
        [ td [ class "cell-label" ]
            [ span [ class "label status label-delivered" ]
                [ text message.status ]
            , span [ class "date" ]
                [ text message.lastEventTime ]
            ]
        , td []
            [ span [ class "email" ]
                [ text ("To: " ++ message.toEmail) ]
            , span [ class "subject" ]
                [ text message.subject ]
            ]
        , td [ class "stats" ]
            [ text (toString message.opensCount) ]
        , td [ class "stats" ]
            [ text (toString message.clicksCount) ]
        ]

-- Going over Random.generate
type Msg =
  NewFace Int -- takes in a number and returns type message
Random.generate
<function> : (a -> msg) -> Random.Generator a -> Platform.Cmd.Cmd msg
-- usage, takes NewFace and random int from 1-6 and gives back message
Random.generate NewFace (Random.int 1 6))

-- Results types
type Result err ok = Error err | Success ok 
-- Response types for different states?
type Response ok err = NotYetInitiated | Loading | SuccessEmpty | Success ok | Error err

renderList : Maybe (List String) -> Html Msg
renderList maybeStrings =
  case maybeStrings of
    Nothing ->
      div [] [text "Still loading!"]
    -- Pattern matching
    Just [] ->
      renderEmptyList
    Just strings ->
      List.map renderString strings

renderString : String -> Html Msg

renderNum : Int -> Html Msg
renderNum num =
  case num of
    0 ->
      div [] [text "I love zeroes!"]
    -- Catch anything else other than 0 with _
    _ ->
      div [] [text ("I guess " ++ (toString num) ++ " is okay too")]

-- Json Decoder a bit confusing but let's dive in: https://guide.elm-lang.org/interop/json.html
type Msg 
  = MorePlease
  | NewGif (Result Http.Error String)
getRandomGif : String -> Cmd Msg
getRandomGif topic =
  -- use let in to use a variable later on
  let
    url =
      "..."
  in
  Http.send NewGif (Http.get url decodeGifUrl)

-- must type response of the JSON that comes back like string, number, bool etc.
-- import Json.Decode as JD
-- > JD.decodeString
-- <function> : Json.Decode.Decoder a -> String -> Result.Result String a
-- > JD.decodeString JD.int "42"
-- Ok 42 : Result.Result String Int
-- > JD.list
-- <function> : Json.Decode.Decoder a -> Json.Decode.Decoder (List a)
-- > JD.decodeString (JD.list JD.int)
-- <function> : String -> Result.Result String (List Int)
-- > JD.decodeString (JD.list JD.int) "[1,2,3]"
-- Ok [1,2,3] : Result.Result String (List Int)
-- """ triple quotes for multiline or say if you have JSON inside with quotes
-- NoRedInk/elm-decode-pipeline to help decode our JSON because limits up to 8 value decoders for map8
-- how about elm-graphql and working with schemas and checking types faster
decodeGifUrl : Decode.Decoder String
decodeGifUrl =
  -- going deeper into JSON object data { image_url }
  Decode.at [ "data", "image_url" ] Decode.string

update msg model =
  case msg of 
    MorePlease ->
      ( model, getRandomGif model.topic)

    NewGif (Ok newUrl) ->
      ( Model model.topic newUrl, Cmd.none )

    NewGif (Err _) ->
      ( model, Cmd.none )

-- Sample decoding messages for our email message data
type Msg
  = NoOp
  | FetchedMessages (Result Http.Error MessagesResponse)
  | ClickedMessage Message
  | HideModalMessage

type alias MessagesResponse =
  { messages : List Message
  }

type alias Message = 
  { clicksCount : Int
  , fromEmail : String
  , lastEventTime : String
  , msgId : String
  , opensCount : Int
  , status : String
  , subject : String
  , toEmail : String
  }

type alias Model =
  -- Put Maybe because it may potentially be Nothing because error or empty array
  { messages: Maybe (List Message)
  }

init : ( Model, Cmd Msg )
init = 
  ( { messages = Nothing
    }
    , getMessages
  )

getMessage: Cmd Msg
getMessage =
  let
    url = "http://localhost:4567/v3/messages?mock_type=small"
  in
  -- Once data is retrieved and JSON decoded it will give off a FetchedMessages Msg and it 
  -- will go back to the update function to update the view based on Ok or Err
  Http.send FetchedMessages (Http.get url decodeMessages)


decodeMessages : JD.Decoder MessagesResponse
decodeMessages =
    -- using json decoder pipeline since we have many fields to decode and can just pipe the decode of the fields we want
    -- elm-package install "NoRedInk/elm-decode-pipeline"
    JDP.decode MessagesResponse
        |> JDP.required "messages" (JD.list decodeMessage)
decodeMessage : JD.Decoder Message
decodeMessage =
    JDP.decode Message
        |> JDP.required "msg_id" JD.string
        |> JDP.required "subject" JD.string
        |> JDP.required "status" JD.string
        |> JDP.required "last_event_time" JD.string
        |> JDP.required "to_email" JD.string
        |> JDP.required "from_email" JD.string
        |> JDP.required "clicks_count" JD.int
        |> JDP.required "opens_count" JD.int

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    NoOp ->
      ( model, Cmd.none )
    
    FetchedMessages messagesResponseResult ->
      case messagesResponseResult of 
        Ok messagesResponse ->
          let
            -- updating the record and setting only the messages and keeping other fields of model
            newModel = { model | messages = Just messagesResponse.messages }
          in
          (newModel, Cmd.none)
        Err err ->
          (model, Cmd.none)
    
    ClickedMessage message ->
      ( { model | modalMessage = Just message }, Cmd.none )
    
    HideModalMessage ->
      ( { model | modalMessage = Nothing }, Cmd.none )


-- Simple HTML application
-- elm-package.json like node style, see source-directories, dependencies like core, html, http; v. 0.18.0
-- elm-webpack-loader with debug true for helpful time travel debugging, see sample suite tests
-- in JS you can do Elm.Main.fullscreen()
-- can do exposing (..) to expose everything
module Main exposing (main)

import Html exposing (Html, h1, text)
import Html.Attributes exposing (class, id)

main : Html msg
main =
    h1 [class "my-h1", id "my-id"] [text "asdf"]

-- i.e. Using types
-- type aliases with a record and String type inside
type alias Model =
  { foo: String
  }
-- Understanding types, takes in a function that can take some type a and returns some type b
-- as a second argument it takes a List of type a and returns a List of type b
List.map
<function> : (a -> b) -> List a -> List b
-- Takes in type a and returns a String, ++ is for concatenation
loudenNum x = (toString x) ++ "!"
<function> : a -> String
-- Union type representing messages for events, like enums
-- can take in multiple arguments per type
-- button [ onClick (IncrementBySomeAmt 3) ] [ text "+3" ]
-- can be converted to incButton 3
incButton : Int -> Html Msg
incButton num = 
  button [ onClick (IncrementBySomeAmt num) ] [ text ("+" ++ toString(num)) ]

type Msg = Increment | Decrement | IncrementBySomeAmt Int
-- Sample type annotations, takes in a Msg and a Model and then returns a Model
update : Msg -> Model -> Model
-- Typically use case statements for union types with implicit returns to update model
update msg model =
  case msg of 
    Increment ->
      model + 1
    
    Decrement ->
      model - 1
    
    IncrementBySomeAmt num ->
      model + num
-- using lets and ins
let 
  foo = 1
  boo = 2
  in
    foo + bar

-- The union type representing the possible states of the tag
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
-- / Receive messages and produce new Html to get rendered, Elm runtime helps with that
-- / Now let's produce Commands (lets you do stuff) and Subscriptions (lets you register that you are interested in something)
-- / Represent Html as data and create data that describes what we want to do
-- / Commands and subscriptions are data, effects-as-data lets Elm have a time-travel debugger, keep same input/output guarantee
-- avoid setup/teardown phases when testing update logic, cache and batch effects, minimizing HTTP connections or other resources
-- Sample architecture with Commands and Subscriptions
-- MODEL
type alias Model =
{ ...
}

-- UPDATE
type Msg = Submit | ...

-- Returns new model and some commands you want to run
-- Commands produce message values fed back into update function
update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  ...

-- VIEW
view : Model -> Html Msg
view model =
  ...

-- SUBSCRIPTIONS
-- declare any event sources you need to subscribe to given the current model
-- produce Msg values that get fed right back into our update function
subscriptions : Model -> Sub Msg
subscriptions model =
  ...

-- INIT
-- Starting value and can kick off initial HTTP requests and models/updates
init : (Model, Cmd Msg)
init = 
  ...

-- Sample Random Die Generator
type Msg
  = Roll
  | NewFace Int

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Roll ->
      (model, Random.generate NewFace (Random.int 1 6))

    NewFace newFace ->
      (Model newFace, Cmd.none)
    
init : (Model, Cmd Msg)
init =
  (Model 1, Cmd.none)

-- Sample HTTP Request
-- must create an HTTP request and turn that into a command so Elm will actually do it
-- MODEL
type Msg
  = MorePlease
  | NewGif (Result Http.Error String)

init : (Model, Cmd Msg)
init =
  (Model "cats" "waiting.gif", Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    MorePlease ->
      (model, getRandomGif model.topic)

    NewGif (Ok newUrl) ->
      ( { model | gifUrl = newUrl }, Cmd.none)

    NewGif (Err _) ->
      (model, Cmd.none)

getRandomGif : String -> Cmd Msg
getRandomGif topic =
  let
    url =
      "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" ++ topic

    request =
      Http.get url decodeGifUrl
  in
    Http.send NewGif request

decodeGifUrl : Decode.Decoder String
decodeGifUrl =
  Decode.at ["data", "image_url"] Decode.string

-- VIEW

view : Model -> Html Msg
view model =
  div []
    [ h2 [] [text model.topic]
    , img [src model.gifUrl] []
    , button [ onClick MorePlease ] [ text "More Please!" ]
    ]

-- Sample Time Subscription
import Html exposing (Html)
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Time exposing (Time, second)

main =
  Html.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

-- MODEL
type alias Model = Time

init : (Model, Cmd Msg)
init =
  (0, Cmd.none)

-- UPDATE
type Msg
  = Tick Time

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Tick newTime ->
      (newTime, Cmd.none)


-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
-- Time.every subscription for tick every second and gives off a message to feed back into update function
subscriptions model =
  Time.every second Tick

-- VIEW
view : Model -> Html Msg
view model =
  let
    angle =
      turns (Time.inMinutes model)

    handX =
      toString (50 + 40 * cos angle)

    handY =
      toString (50 + 40 * sin angle)
  in
    svg [ viewBox "0 0 100 100", width "300px" ]
      [ circle [ cx "50", cy "50", r "45", fill "#0B79CE" ] []
      , line [ x1 "50", y1 "50", x2 handX, y2 handY, stroke "#023963" ] []
      ]
