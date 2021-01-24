# Software Architect Notes

## What is a Software Architect?

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