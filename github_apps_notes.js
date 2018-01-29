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