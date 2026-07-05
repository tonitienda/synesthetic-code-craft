---
type: research
status: in-progress
depends_on:
  - 00-specs.md
---

# 01 — Research: DDD bounded contexts

## Research purpose

This research supports a 6–9 minute explainer about Domain-Driven Design focused on bounded contexts, ubiquitous language, context maps, and clean cross-context contracts.

The main explanatory target is:

> A bounded context is a boundary around meaning.

The viewer should leave with a practical mental model: DDD is not mainly about entity classes, repository folders, or tactical patterns. It is a way to keep business meaning explicit, local, and protected when the same organization uses the same words in different ways.

## Source map

Primary and highly useful sources:

- Eric Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software*, Addison-Wesley, 2004.
- Eric Evans, *Domain-Driven Design Reference: Definitions and Pattern Summaries*, Domain Language, 2015.  
  https://www.domainlanguage.com/ddd/reference/
- Martin Fowler, “Bounded Context”, 2014.  
  https://martinfowler.com/bliki/BoundedContext.html
- Martin Fowler, “Ubiquitous Language”, 2006.  
  https://martinfowler.com/bliki/UbiquitousLanguage.html
- DDD Crew, “Context Mapping” cheat sheet and starter kit.  
  https://github.com/ddd-crew/context-mapping
- Vaughn Vernon, *Implementing Domain-Driven Design*, Addison-Wesley, 2013.
- Vaughn Vernon, *Domain-Driven Design Distilled*, Addison-Wesley, 2016.

Secondary and related sources:

- Sam Newman, *Building Microservices*, O'Reilly, especially the bounded-context/microservice relationship.
- Matthew Skelton and Manuel Pais, *Team Topologies*, IT Revolution, for the sociotechnical boundary angle.
- Alberto Brandolini, EventStorming material, for discovery of domain language and boundaries. EventStorming is related but out of scope for this video.
- Ozan Özkan, Önder Babur, Mark van den Brand, “Domain-Driven Design in Software Development: A Systematic Literature Review on Implementation, Challenges, and Effectiveness”, 2023.  
  https://arxiv.org/abs/2310.01905

## Historical context

Domain-Driven Design was popularized by Eric Evans' 2004 book *Domain-Driven Design: Tackling Complexity in the Heart of Software*. The book separates two broad areas:

- tactical modeling patterns, such as entities, value objects, aggregates, repositories, services, and factories
- strategic design patterns, such as bounded contexts, context maps, distillation, and large-scale structure

A common modern confusion is to treat DDD as if it were mainly the tactical object-oriented pattern catalog. This video should deliberately correct that. Bounded contexts belong to strategic design: the part of DDD concerned with large models, multiple teams, and multiple meanings.

Martin Fowler summarizes the issue well: as the domain grows, a single unified model becomes progressively harder because different groups use subtly different vocabularies. The same word can become a polyseme: one word, multiple meanings. DDD accepts that total unification is often not feasible or cost-effective and instead asks us to make multiple models explicit.

Research implication for the video:

- Present DDD as a response to ambiguity and scale, not as a pattern checklist.
- Introduce bounded contexts only after the viewer feels the pain of one overloaded word.
- Avoid starting with class diagrams or package structure.

## The problem being solved

### The naive assumption

A team starts with an apparently reasonable goal:

> Let us build one clean model of the business.

In small systems, this can work. In a larger business, it often fails because different departments, products, workflows, and teams need different abstractions.

For example, in an online-shopping system:

- Sales may treat an `Order` as a customer intent to buy items at a price.
- Billing may treat an `Order` as something that produces invoices, payments, refunds, and tax records.
- Inventory may not care about the customer-facing order at all; it may care about reservations, stock movements, and availability.
- Delivery may treat an `Order` as parcels, routes, carriers, addresses, and failed delivery attempts.
- Support may treat an `Order` as a conversation anchor for complaints, returns, replacements, and escalation.

Trying to force all of these meanings into one universal `Order` model creates a model that is either too vague to be useful or too large to understand.

### Why conversation hides the problem

Humans can tolerate ambiguity by reading context. A person can hear “the customer cancelled the order” and infer the relevant meaning from the conversation.

Software cannot do this safely. Code, APIs, schemas, queues, dashboards, and tests require precise meaning. Ambiguity that feels manageable in conversation becomes expensive in software.

Research implication for the video:

- Use one familiar term, probably `Order`, as the recurring visual anchor.
- Show the word working in ordinary speech first.
- Then show how code/data forces the ambiguity to become explicit.

## Core concepts

### Domain

A domain is the sphere of knowledge, activity, and rules the software is built to support.

For this video, avoid formal definitions. Use a practical explanation:

> The domain is the part of the real business we are trying to understand well enough to build useful software.

In the online-shopping example, the broad domain is online retail. It contains many areas: selling, pricing, inventory, billing, delivery, returns, support, fraud, recommendations, and more.

### Model

A model is a useful simplification of part of the domain. It is not a full copy of reality. It selects the details that matter for a specific purpose.

Important nuance:

- Different models can describe the same real-world thing for different purposes.
- The question is not “Which model is the real one?”
- The question is “Which model is useful and valid in this context?”

Example:

- A `Product` in Catalog may be a public description with images, titles, attributes, and marketing copy.
- A `Product` in Inventory may be a SKU or stock-keeping unit with warehouse locations and available quantities.
- A `Product` in Billing may be a line item with price, tax category, currency, and discount rules.

### Ubiquitous language

Ubiquitous language is the shared, rigorous language used by developers and domain experts to discuss and model a specific domain area.

Key research points:

- It is not just a glossary.
- It is not just business terminology pasted into code.
- It should be used in conversation, documents, tests, APIs, and code.
- It evolves as the team learns.
- It must be precise because software does not handle ambiguity well.

Critical nuance for this video:

> Ubiquitous language is ubiquitous inside a boundary, not necessarily across the whole company.

This is one of the most important teaching points. Many beginners hear “ubiquitous language” and assume the company should force one global language for everything. Bounded contexts explain why that is often the wrong goal.

### Bounded context

A bounded context is the explicit boundary within which a particular model and language are valid.

Practical phrasing:

> A bounded context says: inside this boundary, these words mean this.

Important properties:

- It bounds meaning, not just code.
- It protects the integrity of a model.
- It gives a team a place where the language can be precise.
- It clarifies where a model stops being valid.
- It can align with a team, module, service, subsystem, database, workflow, or product area, but it is not identical to any one of those by definition.

Possible phrasing to preserve:

> A bounded context is not a box around classes. It is a box around assumptions.

### Context map

A context map shows bounded contexts and the relationships between them.

It is a map of contact points between models. It answers questions like:

- Which contexts exist?
- Which contexts depend on which other contexts?
- Where does one model influence another?
- Where do we translate between models?
- Where do we share a small kernel?
- Where do we conform to an upstream model?
- Where do we protect ourselves with an anti-corruption layer?

For the video, the context map should not become a complete taxonomy lesson. It should mainly show that DDD does not stop at drawing boxes. The relationships between boxes matter.

### Translation

When two contexts interact, data or requests often cross a language boundary.

Example:

- Sales sends an `OrderPlaced` event.
- Inventory translates that into a `StockReservationRequest`.
- Delivery later translates shipped items into `Parcel` and `DeliveryAttempt` concepts.

The important idea is not technical serialization. The important idea is semantic translation.

Possible phrasing:

> Translation is what prevents another context's model from leaking into yours.

### Clean APIs and contracts

The specs require a light architecture point: contexts should expose small, clean APIs or contracts to other contexts.

Research nuance:

- This does not imply every bounded context must be deployed as a microservice.
- A clean contract can exist between modules inside a modular monolith.
- The contract should expose what other contexts need, not the full internal model.
- The API is part of the boundary, but the boundary is conceptual before it is technical.

Possible examples:

- Sales exposes `PlaceOrder`, `CancelOrder`, or `OrderPlaced`, not its entire internal aggregate structure.
- Inventory exposes `ReserveStock` or `StockReserved`, not its warehouse optimization internals.
- Billing exposes `InvoiceIssued`, `PaymentCaptured`, or `RefundStarted`, not its full accounting model.

## Context-map relationship patterns

The specs ask to introduce the names of the main relationship patterns without explaining all deeply. The research should still clarify what each one means so the treatment can choose which to mention and how.

### Partnership

Two contexts or teams are mutually dependent. They need coordinated planning because both succeed or fail together.

Simple online-shopping example:

- Sales and Billing are launching a new checkout payment flow that must release together.

Narrative use:

- Mention only as a relationship where both sides must coordinate closely.

### Shared Kernel

Two contexts share a small, explicitly bounded part of a model or codebase.

Key caution:

- Keep it small.
- Changes require coordination.
- It is a deliberate compromise, not casual reuse.

Online-shopping example:

- Sales and Billing share a small `Money` representation or shared tax category definitions.

Narrative use:

- Good for showing that sharing is possible, but dangerous if it grows.

### Customer/Supplier

One context is upstream and another is downstream. The downstream has needs, and the upstream agrees to consider those needs in planning.

Online-shopping example:

- Billing depends on Sales events. Billing is a customer of Sales' published checkout contract.

Narrative use:

- Good to show power direction: not all relationships are equal.

### Conformist

The downstream context adopts the upstream model instead of translating it, usually because translation cost is not worth it or the upstream will not adapt.

Online-shopping example:

- A small reporting context conforms to Billing's invoice terminology because it only displays Billing reports.

Narrative use:

- Useful as a quick example of “sometimes you choose not to fight the upstream model.”

### Anti-Corruption Layer

A downstream context protects its own model by translating from an upstream model.

Online-shopping example:

- Support talks to legacy order management but translates legacy statuses into support concepts like `ActionableComplaint`, `ReplacementEligibility`, or `EscalationState`.

Narrative use:

- This is likely the most visually useful pattern. It matches the video's translation-bridge concept.

### Open Host Service

A context exposes a defined protocol or service for other contexts to use.

Online-shopping example:

- Inventory exposes stock-reservation operations used by Sales, Delivery, and Support.

Narrative use:

- Useful when introducing clean APIs/contracts.

### Published Language

A well-documented shared language is used as a medium between contexts.

Online-shopping example:

- Public events such as `OrderPlaced`, `PaymentCaptured`, and `ShipmentDispatched` are documented as integration messages.

Narrative use:

- Pair with Open Host Service: clean service plus documented language.

### Separate Ways

Two contexts do not integrate because integration is unnecessary or more expensive than useful.

Online-shopping example:

- Recommendation experiments may not need a direct model relationship with warehouse replenishment.

Narrative use:

- Useful to show that not every box needs a line.

### Big Ball of Mud

This appears in many context-mapping resources as a way to mark a messy system with unclear boundaries and mixed models.

The specs did not list it among required names. Consider mentioning only if useful as the “before” state, not as a main pattern to teach.

## Bounded contexts and microservices

A bounded context is often associated with microservices, but the concepts are not identical.

Important distinctions:

- A bounded context is a semantic/model boundary.
- A microservice is a deployment and operational boundary.
- A bounded context can be implemented inside a monolith.
- A single bounded context may contain multiple services for operational reasons.
- Multiple bounded contexts may temporarily live inside one deployed service for simplicity, although this can become risky if the semantic boundaries are not protected.

Video should avoid saying:

> One bounded context equals one microservice.

Better phrasing:

> Microservices can make boundaries visible, but they do not create meaning by themselves.

Another useful phrasing:

> You can have a distributed big ball of mud. Splitting deployment does not automatically split the model.

## Bounded contexts and teams

Bounded contexts often align with team boundaries, but this is also not automatic.

Research nuance:

- Since ubiquitous language lives in human communication, team structure strongly influences context boundaries.
- Conway's Law and Team Topologies are relevant: system boundaries and communication structures influence each other.
- But the video should not become a Team Topologies episode.

Practical teaching point:

> A boundary around meaning is also a boundary around responsibility.

Online-shopping example:

- The Inventory team owns the language of reservation and stock movement.
- The Billing team owns the language of invoices, payments, refunds, and tax.
- Sales should not casually redefine Billing terms inside Billing's model.

## What did not work before

The video can contrast bounded contexts with common failed approaches.

### One global enterprise model

Trying to create a single universal model for the entire company often leads to endless debates over generic words like `Customer`, `Product`, `Order`, `Account`, and `Status`.

Failure mode:

- The model becomes abstract and weak.
- It serves everyone poorly.
- It hides local meaning.
- Every change requires broad coordination.

### Shared database as integration model

Teams integrate through shared tables and shared columns. The database becomes the accidental global language.

Failure mode:

- A column like `order_status` must serve Sales, Billing, Delivery, and Support.
- Each team adds special cases.
- Meaning leaks everywhere.
- The model becomes hard to change.

### Folder-driven DDD

Developers create folders named `Entities`, `ValueObjects`, `Repositories`, and `Services` and call it DDD.

Failure mode:

- The code may look DDD-ish while the language remains ambiguous.
- The team has tactical patterns but no strategic boundaries.
- The same `Customer` class spreads across unrelated business meanings.

### Microservice-first decomposition

Teams split services by nouns or technical layers without clarifying business meaning.

Failure mode:

- Each service has an API, but the model is still confused.
- Ambiguous events and shared schemas spread the confusion over the network.
- Distributed systems complexity increases without improving domain clarity.

## Common misconceptions

### Misconception: “Ubiquitous language means one language for the whole company.”

Correction:

- Ubiquitous language is precise within a bounded context.
- Across contexts, the same word can legitimately mean different things.
- The goal is not one universal dictionary. The goal is explicit local meaning plus explicit translation.

### Misconception: “Bounded contexts are just services.”

Correction:

- Services are one possible implementation.
- The core boundary is semantic.
- A monolith can contain bounded contexts if the boundaries are explicit and respected.

### Misconception: “Bounded contexts are just folders/packages/modules.”

Correction:

- Folders can help enforce a boundary, but they do not define the boundary by themselves.
- The boundary is about where a model and language are valid.

### Misconception: “The same real-world object should have one canonical class.”

Correction:

- Different contexts can model the same real-world thing differently.
- This is not duplication in the bad sense; it is purposeful modeling.

### Misconception: “A context map is an architecture diagram.”

Correction:

- It can influence architecture, but it maps model relationships and team/system relationships.
- It is not merely boxes and arrows of infrastructure.

### Misconception: “Anti-corruption layer means the other system is bad.”

Correction:

- “Corruption” means corruption of your model, not necessarily moral or technical badness in the other system.
- Even a good upstream model can be wrong for your context.

### Misconception: “DDD is only useful for huge enterprise systems.”

Correction:

- Full DDD may be overkill for simple CRUD systems.
- But the bounded-context idea is useful whenever the same words carry different meanings.

## Online-shopping example material

The specs choose an Amazon-like online-shopping domain. This section expands usable examples.

### Candidate contexts

#### Sales

Purpose:

- Help a customer choose items and place an order.

Language:

- Cart
- Checkout
- Order
- Order line
- Promotion
- Discount
- Customer
- Purchase intent

Possible model meaning:

- An `Order` is a commercial commitment/request created during checkout.

#### Inventory

Purpose:

- Know what can be promised, reserved, picked, and replenished.

Language:

- SKU
- Stock
- Reservation
- Available quantity
- Warehouse
- Replenishment
- Allocation

Possible model meaning:

- An `Order` may not be central; the key concept may be a `Reservation` or `Allocation`.

#### Billing

Purpose:

- Capture payments, issue invoices, manage refunds, calculate tax.

Language:

- Invoice
- Payment
- Capture
- Authorization
- Refund
- Taxable line
- Ledger entry

Possible model meaning:

- An `Order` is something that creates financial obligations and records.

#### Delivery

Purpose:

- Move goods to the customer.

Language:

- Shipment
- Parcel
- Carrier
- Route
- Delivery attempt
- Tracking number
- Address validation

Possible model meaning:

- The customer order is less important than parcels and delivery attempts.

#### Support

Purpose:

- Resolve customer problems after or during purchase.

Language:

- Case
- Ticket
- Complaint
- Replacement
- Return
- Escalation
- SLA

Possible model meaning:

- An `Order` is a reference point for a support case, not necessarily the same object Sales owns.

### Good overloaded terms

#### `Order`

Most useful central term for the video.

Different meanings:

- Sales: buying intent and checkout result
- Billing: basis for invoice/payment/refund
- Inventory: demand signal or reservation trigger
- Delivery: shipment source
- Support: issue anchor

Why it works visually:

- Familiar to every viewer.
- Easy to show as one word splitting into several context-specific cards.

#### `Product`

Different meanings:

- Catalog: description and discoverability
- Inventory: SKU and stock
- Sales: sellable item and price presentation
- Billing: taxed line item
- Support: thing with warranty/return policy

Why it works visually:

- Good secondary example if `Order` becomes overloaded in narration.

#### `Customer`

Different meanings:

- Sales: buyer or account placing order
- Billing: payer or invoice recipient
- Delivery: recipient at an address
- Support: person asking for help
- Identity: authenticated user/account holder

Risk:

- It can pull the video into identity/account modeling, which may be too broad.

#### `Account`

Different meanings:

- Identity: login identity
- Billing: financial account
- Support: customer account record
- Marketplace: seller account

Risk:

- Could distract from the online-shopping flow.

### Suggested example flow

Use `Order` as the main recurring word:

1. Show one global `Order` card.
2. Attach many expectations to it: price, payment, stock, parcel, complaint.
3. Show the card becoming heavy and contradictory.
4. Split into contexts:
   - Sales Order
   - Stock Reservation
   - Invoice/Payment
   - Shipment
   - Support Case
5. Show context map relationships:
   - Sales publishes `OrderPlaced`.
   - Inventory translates it to `ReserveStock`.
   - Billing translates it to `CreateInvoice` or `AuthorizePayment`.
   - Delivery later works from `ShipmentRequested`.
6. Show a clean API/contract between contexts.

## Visual research notes

The specs already list likely reusable components. Research suggests these visual metaphors.

### Word meaning lens

Visual:

- Same term card: `Order`.
- Move it under different colored context boxes.
- The definition underneath changes.

Teaching point:

- The word is the same, but the meaning is local.

Possible components:

- `TermCard`
- `BoundedContextBox`
- `VocabularyHighlight`
- `UbiquitousLanguagePanel`

### Dictionary vs local phrasebook

Visual:

- A giant company-wide dictionary becomes unwieldy.
- It splits into smaller phrasebooks inside each context.

Teaching point:

- Ubiquitous language is not a single global dictionary.

Risk:

- Could feel too metaphorical if overused.

### Map of meaning

Visual:

- Contexts appear as territories on a map.
- Borders define where language changes.
- Bridges show translations/contracts.

Teaching point:

- A context map is not just a technical architecture diagram; it maps model relationships.

Possible components:

- `DomainMap`
- `ContextRelationship`
- `TranslationBridge`
- `RelationshipLegend`

### Leaky model vs clean contract

Visual:

- Bad: Sales internal model pours many fields into Billing.
- Good: Sales exposes a compact `OrderPlaced` contract.

Teaching point:

- Clean APIs protect both sides from internal model leakage.

Possible components:

- `ContextApi`
- `ComparisonFrame`
- `TranslationBridge`

### Monolith vs microservices

Visual:

- Left: one deployed monolith containing visible internal bounded-context boundaries.
- Right: several microservices with the same semantic boundaries.
- Highlight boundary lines in both.

Teaching point:

- Deployment shape is secondary. Semantic clarity is primary.

Risk:

- Keep this short so the video does not become about microservices.

## Terminology decisions for this video

Use:

- “bounded context”
- “context map”
- “ubiquitous language”
- “model”
- “translation”
- “contract” or “API contract”
- “upstream” and “downstream” only if needed for context-map patterns

Avoid or minimize:

- “aggregate”
- “entity”
- “repository”
- “domain service”
- “factory”
- “CQRS”
- “event sourcing”
- “hexagonal architecture”
- “subdomain” unless a brief distinction is needed

Important distinction if subdomain appears:

- A subdomain is part of the problem/business space.
- A bounded context is part of the solution/model space.
- They often relate, but they are not the same thing.

This distinction may be too much for the 6–9 minute target. Include only if needed to prevent confusion.

## Concept validation against specs

### “A bounded context is a boundary around meaning.”

Valid as a teaching simplification.

More precise version:

> A bounded context is an explicit boundary within which a particular domain model and its language are consistent and valid.

The phrase “boundary around meaning” is strong for narration because it is memorable and points away from folders/services.

### “Ubiquitous language is local, not global.”

Valid and important.

More precise version:

> Ubiquitous language is shared by the people working within a bounded context. Across a larger organization, multiple ubiquitous languages may coexist.

### “Contexts can expose clean APIs/contracts without being microservices.”

Valid.

Important caveat:

- An API alone does not create a bounded context.
- The API should express a stable contract in terms of the context's model or a published language.

### “Context maps show relationships between bounded contexts.”

Valid.

Important caveat:

- Context maps can show technical relationships, model relationships, and team relationships.
- The video should clarify that arrows are not just HTTP calls or message queues.

## Factual uncertainties and cautions

- Evans' original book was published by Addison-Wesley in 2004. Some sources refer to DDD as coined in 2003, likely due to publication timing/early material. Use “popularized by Eric Evans' 2004 book” to avoid date precision issues.
- The exact list of context-map patterns varies slightly across sources. The specs list eight: Partnership, Shared Kernel, Customer/Supplier, Conformist, Anti-Corruption Layer, Open Host Service, Published Language, Separate Ways. DDD Crew also includes Big Ball of Mud and team relationship categories such as upstream/downstream. Follow the specs and mention Big Ball of Mud only if useful.
- “Every microservice should align with a bounded context” is common guidance, but not a strict law. Avoid presenting it as universal truth.
- “Anti-corruption” can sound judgmental. Clarify that it protects the downstream model from semantic leakage, not that the upstream team is bad.

## Research conclusions

The strongest explanatory path is:

1. Businesses reuse simple words.
2. Those words carry different meanings in different work areas.
3. One global model cannot stay precise at scale.
4. A bounded context creates a place where a model and language are valid.
5. A context map shows how those places relate.
6. Cross-context interaction requires translation, contracts, and relationship choices.
7. These boundaries may be implemented inside a monolith or across services; the meaning boundary comes first.

This supports the specs' desired viewer feeling:

- The same word can carry different business meanings.
- Ubiquitous language is precise inside a boundary.
- A context map shows how different models relate.
- Contexts can expose clean APIs without necessarily being microservices.
- A bounded context is not a folder; it is a boundary around meaning.

## Suggested material to carry into treatment

Potential central metaphor:

> A business is not one dictionary. It is a set of local languages with borders and translation points.

Potential central example:

> `Order` means different things to Sales, Inventory, Billing, Delivery, and Support.

Potential treatment arc:

- Start with one innocent word: `Order`.
- Show how every department attaches a different meaning to it.
- Introduce ubiquitous language as precise local language.
- Reveal the boundary: bounded context.
- Zoom out to the context map.
- Show translation/contracts between contexts.
- Close by separating the concept from folders and microservices.

Potential final line idea:

> DDD starts to make sense when we stop asking for one perfect model of everything, and start asking where each model is true.

## Research gate notes

This research is intentionally marked `in-progress` for human review.

Before marking ready, review whether:

- `Order` should be the central overloaded term, or whether `Product` is safer.
- The treatment should mention `subdomain` at all.
- Big Ball of Mud should appear as a quick contrast or stay out of scope.
- The context-map pattern list should be shown visually as a legend, or only spoken as orientation.
