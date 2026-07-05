---
type: specs
status: ready
depends_on: []
---

# 00 — Specs: DDD bounded contexts

## Working title

DDD: bounded contexts are boundaries around meaning

Alternative titles to consider later:

- DDD: bounded contexts and context maps
- Bounded contexts are not folders
- DDD starts with language boundaries
- Ubiquitous language is local, not global

## Purpose

Create a practical explainer about Domain-Driven Design focused on bounded contexts, context maps, and ubiquitous language.

The video should help viewers understand that DDD is not mainly about entity classes, repository folders, or tactical patterns. It is about making business meaning explicit and drawing boundaries where meanings diverge.

The goal is to make bounded contexts feel concrete, not academic.

## Core thesis

A bounded context is a boundary around meaning.

Inside a context, the team can use a precise ubiquitous language. Across contexts, the same word may mean different things, so relationships and translations must be made explicit with a context map.

Bounded contexts often need small, clean APIs or contracts when they interact with other contexts. This can happen in a modular monolith or in microservices; the important part is the clarity of the boundary, not the deployment shape.

## Audience

Primary audience:

- software developers and architects who have heard of DDD but find it vague
- backend developers working in systems where words like `Customer`, `Order`, `Account`, or `Product` mean different things in different areas
- developers who have seen DDD reduced to folder names or entity/value-object patterns

Secondary audience:

- product-minded engineers who want better language between business and software teams

## Language

English for now.

The wording should remain simple enough to translate or rewrite in Spanish later.

## Target duration

Expected duration: 6–9 minutes.

The video should be as long as needed to make the concepts clear. Do not artificially reduce or lengthen it.

The video should be complete enough to explain the relationship between ubiquitous language, bounded context, context map, and clean cross-context APIs, but not become a full DDD course.

## Scope

The video should explain, at a high level:

- why the same word can mean different things in different parts of a business
- ubiquitous language as precise shared language inside a context
- why ubiquitous language is not necessarily one language for the whole company
- bounded context as the boundary where a model and language are valid
- context map as a map of relationships between bounded contexts
- translation between contexts
- ownership and responsibility of models
- small, clean APIs/contracts between contexts
- why bounded contexts are not just folders, packages, services, or teams
- why bounded contexts can exist inside a monolith and do not require microservices
- names of the main context-map relationship patterns, without explaining all of them in depth

Example domain:

- an online-shopping domain using concepts most viewers know from Amazon-like systems
- possible contexts: Sales, Inventory, Billing, Delivery, Support
- possible overloaded words: `Customer`, `Order`, `Product`, `Account`, `Delivery`

## Context-map relationship patterns

The video should introduce the names of the main relationship patterns so viewers know that context maps have vocabulary.

Mention only as much as needed for orientation:

- Partnership
- Shared Kernel
- Customer/Supplier
- Conformist
- Anti-Corruption Layer
- Open Host Service
- Published Language
- Separate Ways

The video should not explain every pattern deeply. The main point is that different context relationships need different integration strategies.

## Non-goals

Do not explain in detail:

- entities and value objects
- aggregates
- repositories
- domain services
- factories
- event storming
- CQRS/event sourcing
- all context-map relationship patterns in depth
- microservices as the main topic
- implementation architecture or code structure beyond the clean-boundary/API point

The video may mention services and microservices only to clarify that bounded contexts are not the same thing as microservices. A bounded context can be implemented inside a monolith if the boundary is clear.

## Tone

Calm, conceptual, practical.

The viewer should finish feeling that DDD is about reducing ambiguity, not adding ceremony.

Preferred feeling:

- “The same word can carry different business meanings.”
- “Ubiquitous language is precise inside a boundary.”
- “A context map shows how different models relate.”
- “Contexts can expose clean APIs without necessarily being microservices.”
- “A bounded context is not a folder; it is a boundary around meaning.”

Avoid:

- abstract enterprise-architecture jargon
- presenting DDD as a silver bullet
- overloading the viewer with all DDD tactical patterns
- making bounded contexts sound like arbitrary boxes
- making microservices the center of the explanation

## Visual direction

The video should be meaning-first and map-first.

Likely reusable visual components:

- `BoundedContextBox`
- `TermCard`
- `DomainMap`
- `ContextRelationship`
- `TranslationBridge`
- `ContextApi`
- `RelationshipLegend`
- `UbiquitousLanguagePanel`
- `ComparisonFrame`
- `VocabularyHighlight`
- `OwnershipLabel`

Useful visual contrasts:

- one overloaded word used globally vs precise words inside contexts
- a giant ambiguous model vs separated bounded contexts
- same term, different meaning in Sales/Inventory/Billing/Delivery/Support
- context map as explicit relationships between models
- direct sharing vs translation bridge
- clean context API vs leaking another context’s internal model
- bounded contexts inside a monolith vs bounded contexts as microservices, with the boundary as the important part

## Framework goals

This video should test whether the framework can handle:

- abstract concepts without relying on code diagrams
- semantic boundaries
- maps and relationships
- term highlighting
- repeated term with different meanings
- business/software conceptual animation
- relationship legends and named patterns
- clean API/contract visuals between contexts
- careful pacing with more narration-driven visuals

## Decisions already taken

- The title should include “DDD” for searchability.
- Use an online-shopping/Amazon-like example domain with familiar contexts such as Sales, Inventory, Billing, Delivery, and Support.
- Introduce the names of the main context-map relationship patterns.
- Mention microservices only if it helps clarify that bounded contexts are not only or mainly microservices.
- Include a light architecture point: contexts should expose small, clean APIs/contracts to other contexts.
- Let the duration be as long as needed for clarity; do not artificially shorten or lengthen it.

## Gate status

This specs file is `ready` for the research phase.
