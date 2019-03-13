/*
  Building a Github Marketplace App
  - using REST API v3 to interact with Github
  - need to consider the behavior and what it needs to access before choosing from
  personal access tokens, OAuth, or Github apps
  - personal access token is a string of characters that functions similarly to OAuth token in that you
  can specify permissions via scopes, similar to a password but you can have many of them and revoke
  access to any of them
  -> i.e. using PAT to write to your repos with with cURL or script, passing PAT to authenticate
  -> PAT represents yourself only, for one-off cURL requests/personal scripts, not for shared user account/team
  - OAuth app authenticates as a specific user, app needs to be hosted somewhere
  -> when a user grants the application permissions, the user is granting permissions to all repos they have access to
  in their account and to any organizations they belong to that haven't blocked third-party access
  -> should always act as authenticated Github user, can be used as identity provider by enabling "Login with Github"
  -> don't use this if want your app to act on a single repo; with repo OAuth scope can act on all of authenticated user's repos
  -> don't build one to act as an app for your team or company, authenticates as single user (if person leaves, no one will have access to it)
  - Github apps also need to hosted somewhere but can be installed on specific accounts and granted access to specific repositories
  -> offer narrow, specific permissions; can contain multiple scripts or an entire app and then connect app to many other tools like
  Github, Slack, in-house apps, email programs, APIs, etc.
  -> should take actions independent of a user (unless app is using user-to-server token)
  -> make sure it integrates with specific repos, should connect to a personal account or organization
  -> don't expect this to know and do everything a user can, don't use this if you only need a "Login with Github" service,
  but a Github App can user a user identification flow to log users in and do other things
  -> don't build this if you only want to act as a Github user and do everything that user can do
*/

// Creating a Github App: https://developer.github.com/apps/building-github-apps/creating-a-github-app/
// - setup and securing webhooks for URL that events will POST to and respond to certain events
// - set permissions (read/write) and subscriptions to events (Label, Public, Repo, Watch events)
// - can choose where app is installed whether only on this account or any account
// - generate private key in PEM format to sign access token requests
// - authentication options for GitHub apps (to access API with integration, must provide custom media type in Accept Header for your requests)
// -> allows you to retrieve high-level management information about Github App, can request access tokens for an installation of app
// -> use private key to sign a JSON Web Token (JWT) and encode it using the RS256 algorithm, Github checks request
// authenticated by verifying the token with the app's stored public key
// i.e. curl -i -H "Authorization: Bearer YOUR_JWT" -H "Accept: application/vnd.github.machine-man-preview+json" https://api.github.com/app
// - authenticating as installation lets you perform actions int he API for that installation
// -> need installation access token, scoped to repositories an installation can access, have defined permissions set by the GitHub App and expire after one hour
// i.e. creating an installation access token: curl -i -X POST \
// -H "Authorization: Bearer YOUR_JWT" \
// -H "Accept: application/vnd.github.machine-man-preview+json" \
// https://api.github.com/installations/:installation_id/access_tokens
// -> installations with permissions on contents of a repository can use their installation access token to authenticate for Git access and
// using as HTTP password
// - when Github app acts on behalf of user, it performs user-to-server requests that must be authorized with a user's access token
// -> i.e. requesting data for a user like determining which repos to display to a particular user and actions triggered by user like running build
// -> identifying users on your site with a callback_url
// 1. users redirected to request their Github identity
// GET http://github.com/login/oauth/authorize - parameters: client_id, redirect_uri, state (random string to help protect forgery attacks and can contain arbitrary data)
// 2. users redirected back to your site by Github
// POST https://github.com/login/oauth/access_token - parameters: client_id, client_secret, code, redirect_uri, state
// 3. Github app accesses the API with the user's access token
// GET https://api.github.com/user?access_token=...
// Or access_token in Authorization header like: curl -H "Authorization: token OAUTH-TOKEN" https://api.github.com/user
// -> check which installation's resources a user can access
// GET /user/installations?access_token=...
// -> check which repos acessible to user for an installation
// GET /user/installations/:installation_id/repositories?access_token=...
// -> supported endpoints like deployment statuses, feeds, blobs, commits, references, tags, trees, issues, labels, reactions to comments/issues/PRs,
// statuses, users, etc.
// - can modify app's permissions to end user data and metadata permissions (collection of read-only endpoints for accessing general information for various resources that the authorized installaion has access to)
// - installation options for Github Apps can be public/private
// -> public installation flow: landing page where users begin the installation flow provided in "Public link" field when setting up github app
// -> private installation flow: allows only the owner of a Github app to install it, limited info exists on public page but Install button only available
// to organization admins or the user account if the Github app is owned by an individual account; private or internal Github apps can only be installed on user or organization account of owner
// - installation minimum rate limit of 5000 requests per hour, organization installations with more than 20 users receive another 50 requests per hour for each user

// Github Marketplace Listing requirements here: https://developer.github.com/apps/marketplace/
// - need at least one paid plan, minimum number of installations, Github takes 25% of revenue of listings
// - logo and badge images, up to 5 screenshot images for your app
// - pricing plans: free, flat rate, per-unit pricing plan, marketplace free trials (14-day free trials of OAuth or Github apps)
// - receive payment for listing once revenue reaches $500USD minimum for the month and you'll get 75%
// Can also do Works with Github app if it doesn't meet requirements and they can do their own installation and purchasing

// Migrating OAuth Apps to Github Apps
// - Github apps have fine-grained permissions, short-lived tokens vs. OAuth token not expiring until person who authorized OAuth App revokes the token
// -> built-in, centralized webhooks receive events for all repositories and organizations the app can access vs. OAuth apps require configuring a webhook for each repository and organization accessible to the user
// -> bot accounts don't consume a Github Enterprise seat and remain installed even when person who initially installed app leaves organization
// -> built-in support for OAtuh still available in Github apps using user-to-server endpoints
// -> dedicated API rate limits for bot accounts
// -> repository owners can install Github Apps on organization repositories; org owner approves installation
// -> open source community support with Octokit library and frameworks like Probot
// - to convert an OAuth app to Github app, you must review available API endpoints and stay with API rate limits, register Github app, determine permissions
// -> subscribe to webhooks, understand authentication methods, direct users to install your Github app on repositories, remove any unnecessary repo hooks, switch Marketplace listing to use new Github App
// -> encourage users to revoke access to your OAuth app
// -> authentication methods i.e. JSON Web token authenticates as the Github app, installation access token authenticates as specific installation of your Github App (server-to-server requests),
// OAuth access token can authenticate as a user of your Github App (user-to-server requests)

// Setting up development environment
// - registering a Github App and setting up a web server to receive webhook events with Smee to capture webhook payloads and forward to local dev environment
// - steps: start Smee channel, register a new Github App, save private key and app ID, prepare runtime environment, review Github App template code, start server, install app on your account

// Creating Github App
// - need to update app permissions, add event handling by listening to webhook payloads as POST requests from Github, hit Github REST API
// -> every event that Github sends includes a request header called HTTP_X_GITHUB_EVENT, which indicates type of event in POST request
// -> each event has additional action field i.e. issues event with assigned, unassigned, labeled actions
// - When GitHub Apps take actions via the API, such as adding labels, GitHub shows these actions as being performed by bot accounts

// Creating CI tests with the Checks API
// - creating a continuous integration server that runs tests
// - a CI server hosts code that runs CI tests like code linters, security checks, code coverage, etc.
// -> can build and deploy code to staging or production servers
// - Checks API allows you to set up CI tests automatically run against each code commit in a repository
// -> gives detailed information about each check on Github in pull request's Checks tab, can create annotations
// -> check suite: group of check runs (individual CI tests), statuses visible on pull request
// -> sends check_suite webhook event to all Github Apps installed on a repository each time new code is pushed to repository
// -> app must have checks:write permission, GitHub automatically creates check_suite events for new code commits in a repo in default flow
// -> when someone pushes code to repo, Github sends check_suite event with an action of request to all Github Apps installed on repo that have checks:write permission
// -> when app receives this event, it can add check runs to that suite
// -> check runs can include annotations displayed on specific lines of code
// 1. Set up framework for CI server using Checks API
// -> configure GitHub App as server that receives Checks API events
// -> create new check runs for CI tests when a repo receives newly pushed commits
// -> re-run check runs when a user requests that action on GitHub
// 2. Build on CI server framework you created by adding a linter CI test
// -> update check run with a status, conclusion, and output details
// -> create annotations on lines of code that GitHub displays in the Checks and Files Changed tab of PR
// -> automatically fix linter recommendations by exposing a "Fix this" button in the Checks tab of a PR
// - check_suite event with action field -> requested, rerequested, completed
// -> requested/rerequested - create a check run
// - creates a check run for a specific commit SHA (head_sha), status to queued
// -> receive check_run webhook event with created action which is signal to begin running the check
// -> for rerequested action we'll create another check run
// -> GitHub sends all events for created check runs to every app installed on a repository that has the necessary check permissions
// which means your app will receive check runs created by other apps
// -> filter by app ID to exclude check runs for other apps on repository
// - need to update status of check run from queued to in_progress (kick off CI test) to completed
// -> update check run status to in_progress and set started_at to current time
// -> run CI test: i.e. cloning repository and checking out certain commit and running linter on it
// -> update status of check run to completed with conclusion (success, failure, neutral, cancelled, timed_out, action_required) and completed_at parameters
// i.e. conclusion: success, completed_at to current time, status to completed
// - can get statuses, annotation for specific lines of code, take requested actions
// -> clicking on button sends a requested_action check_run event to GitHub App
// - be careful about verifying webhook signatureå
// -> need to validate webhook payloads that stuff passed through does not include arbitrary malicious commands
// - limit of 50 annotations per API request; otherwise, you'll need to make multiple requests to the update a check run endpoint
// -> annotation object with path, start_line, end_line, annotation_level, message
// - each check run contains an output object that includes a title, summary, text, annotations, and images
// - when someone clicks a button, the app receives the check_run event with requested_action action
// -> has an identifier that app uses to determine which button was clicked
// -> can set username and email to associate with commit in .env file

// Probot
// - framework for building GitHub Apps in Node.js
// - helps with receiving and validating webhooks and doing authentication
// - app is a Node.js module that exports a function
// app is an instance of an Application
module.exports = app => {
  // code here
};

// app.on listen for any webhook events triggered by GitHub
// context includes everything about event that was triggered
module.exports = app => {
  app.on("issues.opened", async context => {
    // A new issue was opened what should we do with it?
    context.log(context.payload);
  });
};
// context.github is an authenticated GitHub client that can be used to make API calls
// i.e. autoresponder app that comments on opened issues
module.exports = app => {
  app.on("issues.opened", async context => {
    // `context` extracts information from the event, which can be passed to GitHub API calls
    // returns { owner: 'yourname', repo: 'yourrepo', number: 123, body: 'Hello World!' }
    const params = context.issue({ body: "Hello World!" });

    // Post a comment on the issue
    return context.github.issues.createComment(params);
  });
};

// create-probot-app to start building an app with templates like basic-js, checks-js, git-data-js, deploy-js, basic-ts
