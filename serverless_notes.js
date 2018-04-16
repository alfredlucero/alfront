// Serverless Framework Notes
// - serverless: using managed cloud services for databases, search indexes, queues, SMS messaging, email delivery
// ; empowering developers to release production-ready applications that can autoscale, provision servers easily, using
// ephemeral stateless compute like FaaS i.e. AWS Lambda; focus on business logic/value to customers, not servers
// -> pay-per-use, zero administration, auto-scaling, increased velocity
// - serverless framework to automate and build/deploy to any cloud provider
// -> CLI helps to write functions faster with cloud-agnostic serverless YAML and services can be deployed with a single command
// (transactionally deploy code to multiple providers, version it, rollback), avoiding vendor lock-in, infrastructure as code, community plugins
// -> pubsub/subscribing to events from third-party SaaS, helping with CI/CD, hybrid apps, processing, etc.
// - "serverless deploy" to deploy all functions
//   "serverless deploy function -f list" for a single function