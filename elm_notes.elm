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


