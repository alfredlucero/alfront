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