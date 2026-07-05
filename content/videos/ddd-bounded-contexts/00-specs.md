---
type: specs
status: in-progress
depends_on: []
---

# 00 — Specs: DDD bounded contexts

## Working title

DDD: bounded contexts are boundaries around meaning

Alternative titles to consider later:

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

Target: 5–7 minutes.

Acceptable range: 4–8 minutes.

The video should be complete enough to explain the relationship between ubiquitous language, bounded context, and context map, but not become a full DDD course.

## Scope

The video should explain, at a high level:

- why the same word can mean different things in different parts of a business
- ubiquitous language as precise shared language inside a context
- why ubiquitous language is not necessarily one language for the whole company
- bounded context as the boundary where a model and language are valid
- context map as a map of relationships between bounded contexts
- translation between contexts
- ownership and responsibility of models
- why bounded contexts are not just folders, packages, services, or teams

Possible example domain:

- Sales, Billing, and Support all use the word `Customer`, but with different meanings

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
- implementation architecture or code structure

The video may mention that bounded contexts sometimes align with services or teams, but it should not define them as the same thing.

## Tone

Calm, conceptual, practical.

The viewer should finish feeling that DDD is about reducing ambiguity, not adding ceremony.

Preferred feeling:

- “The same word can carry different business meanings.”
- “Ubiquitous language is precise inside a boundary.”
- “A context map shows how different models relate.”
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
- `UbiquitousLanguagePanel`
- `ComparisonFrame`
- `VocabularyHighlight`
- `OwnershipLabel`

Useful visual contrasts:

- one overloaded word used globally vs precise words inside contexts
- a giant ambiguous model vs separated bounded contexts
- same term, different meaning in Sales/Billing/Support
- context map as explicit relationships between models
- direct sharing vs translation bridge

## Framework goals

This video should test whether the framework can handle:

- abstract concepts without relying on code diagrams
- semantic boundaries
- maps and relationships
- term highlighting
- repeated term with different meanings
- business/software conceptual animation
- careful pacing with more narration-driven visuals

## Ready checklist

Before marking this specs file `ready`, decide:

- Which example domain should be used? Sales/Billing/Support with `Customer`, or another domain?
- Should the video introduce named context-map relationship patterns, or only the idea of mapping relationships?
- Should microservices be mentioned briefly as a common confusion, or avoided entirely?
- Should the title use “DDD” explicitly, or focus on “bounded contexts” for a broader audience?
- Is the target duration closer to 5 minutes or 7 minutes?
