# Github Marketplace Apps

- How I integrated with Octokit to retrieve Github repository data!

- How I integrated with Probot to create a Github App!

- How I launched gitpaid from start to finish on the Github Marktetplace!

# End to End Testing (Cypress + Selenium Webdriver)

- Maintaining CSS selectors across all tests and components!
  WriteSelectors, ReadSelectors -> reusing in unit tests and end to end tests and spreading onto React components

- Triggering Webdriver tests per environment in Buildkite steps

  - Part 1: Setting up separate configs and npm scripts per environment
  - Part 2: Dockerizing Webdriver test runs
  - Part 3: Setting up Buildkite pipeline steps and scripts

- Triggering Cypress tests per environment in Buildkite steps

  - Part 1: Setting up separate configs and npm scripts per environment
  - Part 2: Dockerizing Cypress test runs
  - Part 3: Setting up Buildkite pipeline steps and scripts
  - Part 4: Parallelization and hooking up to the Dashboard Service

- Page object patterns: Webdriver vs. Cypress

  - Part 1: Page objects plus selector objects with Webdriver and Cypress
  - Part 2: Page object findings and sample Webdriver tests vs. Cypress tests

- How we set up our Cypress tests

  - Part 1: Running everywhere -> Running headless, headed mode, headless in Docker container, running in Docker container, running in Docker container in Buildkite steps (plus parallelization)
  - Part 2: Setups/teardown through the API: hello cy.task and cy.request
  - Part 3: How we set up per environment scripts and configuration
  - Part 4: Tests passing in multiple environments

# CICD with Buildkite, Terraform, AWS S3/CloudFront

- Terraforming your AWS S3/CloudFront with cross-region replication, Cloudwatch alarms, etc.

- Our Buildkite CICD steps
