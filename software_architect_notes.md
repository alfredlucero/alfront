# Software Architect Notes

## What is a Software Architect?

Types of Architects

- Infrastructure Architect
  - Design infrastructure i.e. servers, vms, network, storage, etc.
  - Familiar with requirements
  - Career path: infrastructure expert
- Software Architect
  - Developer knows what can be done
  - Architect knows what should be done
  - Figures out how to meet these common baseline requirements:
    - Fast
    - Secure
    - Reliable
    - Easy to maintain
  - Org chart
    - junior architect may be within a project under project manager
    - senior architect may report directly to CIO/CTO outside of a specific project to handle things across the whole organization
    - certifications geared towards Enterprise Architect
  - Career path: main factor is experience
    - 3 years experience, more common in small companies
    - dev to team leader to jr. architect
    - dev to team leader to dev manager/CTO to senior architect (can become enterprise architect)
    - system analyst to architect but lacks technical experience and requires mentoring
- Enterprise Architect
  - Works with top level management i.e. CEO, CIO
  - Streamlines IT to support business
  - No development-oriented tasks
  - Career Path: Senior Software Architect / Project Manager

Architect's Mindset

- Understand the business
  - Weaknesses
  - Strengths
  - Competition
  - Growth Strategy
- System's Goals
  - Not "what the system should do" or requirements
  - Goals describe the effect on the organization (bottom line, big picture)
  - Usually described by client but exceptions
  - Example 1: Product-oriented company wants to streamline recruitment process in its HR system
  - Example 2: Improve police's response time, attract new residents for reporting and mapping criminal incidents system for large city
  - Example 3: Mobile flash sales for young and small startup, wants to generate quick revenue stream and attract investors
- Your Client's Clients (end users)
  - Possibly show errors or have backend caching if systems go down to provide best experience to users
- Always keep in mind what is the thing that really matters to the person you are talking to
  - Project manager cares primarily on project success (be careful with how you speak about new technology)
  - Team leader cares about programming (can use technical language)
  - CEO cares about the financial bottom line, can avoid technical buzzwords
  - Show how your work contributes to the other person's primary interests

Architecture Process

- Understand the system's requirements after setting the goals
  - Requirements = what the system should do i.e. provide telemetry dashboard to customers
  - Usually defined by system analyst
- Understand the non-functional requirements
  - Define technical and service level attributes i.e. # of users, loads, volumes of data, performance
  - Not always know to client or analyst
- Map the Components
  - Represent the tasks of the system
  - Two goals
    - helps to understand system functionality
    - communicate your understanding to the client
  - Non-technical (demonstrates capabilities of system only)
- Select the Technology Stack
  - Usually for backend, frontend, data stores
  - A lot of factors come into play so choose wisely
- Design the architecture
- Write the architecture document
  - Describes process and architecture i.e. blueprint
  - Must be relevant for all participants
- Support the team
  - Architecture will change a lot
  - Make sure it will stay relevant
  - Not done until system in production and need to maintain after
- Important to learn about unknown scenarios early
- Built together with development team and helps to grow ambassadors to convince others that architecture is right approach
  
Understanding Requirements

- Two types of requirements
  - What system should do = Functional Requirements
    - Business flows i.e. login, managing photos, telemetry
    - Business services i.e. auth, telemetry
    - User Interfaces
  - What should system deal with = non-functional requirements
    - Performance
    - Load
    - Data volume
    - Concurrent Users
    - SLA
  - Non-functional requirements
    - Performance
      - Always talk in numbers and work with client
      - What is fast? Typically less than sec for end user, for B2B usually less than 100ms
      - Latency: How much time does it take to perform a single task?
        - How much time will it take for the API to save the user data in the database?
        - How much time will it take to read a single file from the file system?
      - Throughput: How many tasks can be performed in a given time unit?
        - How many users can be saved in the database in a minute?
        - How many files can be read in a second?
      - Example case for saving user data
        - Latency less than 1 second
        - Throughput greater than 1000 in 1 minute for well designed app, less than 60 in 1 minute for badly designed app
    - Load
      - Quantity of work without crashing i.e. in web API how many concurrent requests without crashing
      - Defines availability of system
      - Example case: throughput of 100 requests/sec and load of 500 requests without crashing
        - Always plan for extreme cases
    - Data Volume
      - How much data the system will accumulate over time i.e. TB/GB
      - Helps with deciding
        - Database type
        - Designing queries (thousands of rows to millions of rows)
        - Storage planning
      - Two aspects
        - Data required on "Day One"
        - Data growth
      - Example day one 500 MB and annual growth of 2 TB
    - Concurrent users
      - How many users will be using the system simultaneously
      - Concurrent users includes "dead times" vs. actual requests with load
      - Concurrent users = Load x 10 for rule of thumb
    - SLA (Service level agreement)
      - Required uptime for the system (used by public providers)
      - 99.99% = less than 1 hour of downtime in a year (0.88 hrs downtime / year)
      - Manage client's expectations; 99.999% uptime is not a realistic goal (needs automatic failover, multi-region, etc)
    - Never start working before setting these non-functional requirements
    - Architect's roles
      - Framing the requirements' boundaries (100% uptime is not realistic, What is the required response time for API? 10ms); clients won't be able to define them
      - Discuss numbers

Application Types

- Web Apps
  - Websites, Web server, web browser, communicate via HTTP protocol
  - Browser sends HTTP request to server asking for resource i.e. HTML page, renders to end user with JS for implementation and CSS for visual design
  - Best suited for
    - User interface
    - User initiated actions
    - Large scale
    - Short, focused actions (not good fit to crunch billions of numbers)
  - Request-response based
- Web API
  - Clients are other applications/servers
  - Exposes an API for other programs to execute various actions
  - Usually REST API
    - Returns data (usually as JSON), not HTML
    - Accessible
  - Combination of
    - URL i.e. https://myapi.com/orders
    - Parameters i.e. date=10/10/2021
    - HTTP Verb i.e. GET
  - Best suited for systems that require
    - Data retrieval and store
    - Client initiated actions
    - Large scale
    - Short, focused actions (not long running processes)
  - Request-response based
- Mobile
  - Smartphones/mobile phones - Android or Apple
  - Usually works with Web API
  - Best suited for
    - User interation (games, social apps)
    - Frontend for Web API (news)
    - Location-sensitive for GPS
- Console
  - Command-line applications aka CLI in the terminal
  - No fancy UI
  - Require Technical Knowledge
  - Limited interaction
  - Long- or short-running processes
  - Best suited for systems that require
    - Long-running processes
    - Short actions by trained power-users
- Service
  - Like Console but no UI at all, managed by Service Manager in operating system i.e. Windows, Linux (monitors activity)
  - Config files
  - Best suited for systems that require
    - Long-running processes (i.e. monitoring folders and processing files)
- Desktop
  - Has all its resources on the PC
  - Might connect to the web
  - Has UI
  - Best suited for
    - User centric actions i.e. word processing
    - Gaming
- Function as a service
  - AWS Lambda
  - Azure functions
  - Short focused code segments and not worry about servers/SLAs
- Application type should be set early, can be more than one i.e. Web App + Service, Web App + Mobile


## Object-Oriented Programming SOLID Principles

`S - Single-Responsibility Principle`

Loose coupling and more cohesion, focus on modules doing one thing

`O - Open-closed Principle`

Open for extension, closed for modification

`L - Liskov Substitution Principle`

Every subclass/derived class should be substitutable for their base or parent class

`I - Interface Segregation Principle`

Client shouldn't be forced to implement interface it doesn't use or forced to depend on methods they don't use (shouldn't be any empty methods)

`D - Dependency Inversion Principle`

Entities depend on abstractions, not on concretions
High-level modules must not depend on low-level module but on abstractions
Promote decoupling, dependency injection may help
Invert the arrows of dependencies

## Become an Awesome Software Architect Book 1 Foundation 

`What is software architecture?`

Series of decisions intended to reduce cost of building and changing your software

`Software Architect Hit List`

- Programming languages, features, readability, and interoperation
- Code reuse across platforms (server vs. web. vs. mobile)
- Early error detection (compile-time vs. runtime error detection, breadth of validation)
- Availability and cost of hiring the right talent; learning curve for new hires
- Readability and refactorability of code
- Approach to code composition, embracing the change
- Datastore and general approach to data modeling
- Application-specific data model, and blast radius from changing it
- Performance and latency in all tiers and platforms
- Scalability and redundancy
- Spiky traffic patterns, autoscaling, capacity planning
- Error recovery
- Logging, telemetry, and other instrumentation
- Reducing complexity
- User interfaces and their maintainability
- External APIs
- User identity and security
- Hardware and human costs of infrastructure and its maintenance
- Enabling multiple concurrent development workstreams
- Enabling testability
- Fast-tracking development by adopting third-party frameworks
- Personal: Deployment i.e. CICD
- Personal: Automating commands, steps, deployment, etc. 
- Personal: Alerting when things go wrong