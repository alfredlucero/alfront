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