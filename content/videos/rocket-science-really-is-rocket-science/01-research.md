---
type: research
status: in-progress
depends_on:
  - 00-specs.md
---

# Rocket science really is rocket science — Research

## Research goal

Collect the factual and conceptual material needed for a from-zero video about why launch is difficult and why a rocket launch looks the way it does. The target viewer watches a SpaceX or agency launch stream and wants to understand the physics behind the visible events.

This is not yet the final story, narration, or motion design.

## One-sentence thesis to test later

Getting to space is not mainly a height problem; it is a mass-and-velocity problem where every extra kilogram makes the rocket heavier, the extra propellant makes it heavier again, and the only ways out are better exhaust velocity, careful trajectory, and throwing away hardware you no longer need.

## Core vocabulary

- **Orbit**: a state of continuous freefall around a body. The spacecraft keeps falling toward Earth, but its sideways velocity is high enough that Earth curves away beneath it.
- **Orbital velocity**: the sideways speed needed for a circular orbit at a given altitude. NASA Glenn gives about **17,478 mph** for a circular orbit 100 miles above Earth.
- **Escape velocity**: the speed needed, in the idealized no-drag/no-further-propulsion case, to leave a body’s gravitational well instead of remaining bound to it. Near Earth’s surface this is about **11.2 km/s**. It is not the same thing as the speed needed to reach low Earth orbit.
- **Delta-v**: a velocity-change budget. It is what the vehicle can spend through propulsion, not simply the speed shown on a launch stream at one instant.
- **Propellant**: the mass expelled by the rocket engine. It is not just “fuel” in the everyday sense; rocket propellant often includes fuel plus oxidizer.
- **Wet mass**: vehicle mass including propellant.
- **Dry mass**: vehicle mass after usable propellant is gone, including tanks, engines, structure, avionics, and payload unless otherwise specified.
- **Payload**: the useful delivered mass: satellite, crew vehicle, cargo, probe, etc.
- **Mass ratio**: initial mass divided by final mass in a burn, often written `m0 / mf`.
- **Specific impulse (`Isp`)**: a measure of how much thrust/momentum change an engine gets per propellant weight flow. In the rocket equation it converts to effective exhaust velocity through `ve = Isp × g0`.
- **Effective exhaust velocity (`ve`)**: how fast the rocket effectively throws mass backward. Higher `ve` means the same propellant mass can provide more delta-v.
- **Thrust-to-weight ratio**: thrust divided by the vehicle’s weight. A launch vehicle needs enough thrust-to-weight to lift off and limit gravity losses, but thrust alone is not the same as efficiency.
- **Gravity losses**: delta-v spent fighting gravity while climbing instead of ending up as useful orbital energy.
- **Drag losses**: delta-v lost to the atmosphere.
- **Max Q**: maximum dynamic pressure, the point where aerodynamic stress is usually highest because speed is rising while the atmosphere is still relatively dense.
- **MECO**: main engine cutoff, often first-stage engine cutoff before staging.
- **Stage separation**: the event where the rocket discards a mostly empty stage so the remaining vehicle no longer has to accelerate dead mass.
- **Fairing separation**: the payload shroud is discarded once the atmosphere is thin enough that the payload no longer needs aerodynamic protection.
- **Orbital insertion**: the burn or sequence that places the payload/upper stage into the target orbit.

## Important distinction: space, orbit, and escape

### Reaching “space” is not the hard part

The Kármán-line idea of space is roughly 100 km altitude (the FAI convention; the US military and NASA award astronaut wings from 50 miles / ~80 km), but a vehicle can go above that and still fall back if it lacks sideways speed. A suborbital flight is a tall arc; an orbital flight is a fall that keeps missing Earth.

A useful energy comparison for the script: reaching 100 km of altitude needs on the order of 1.4 km/s of ideal velocity (ignoring losses), while staying in low Earth orbit needs about 7.8 km/s of sideways speed. The kinetic energy scales with velocity squared, so the orbit part of the job is roughly 30 times more energy than the altitude part. “Going up” is the cheap line item.

NASA’s beginner material emphasizes that launching into space means using enough propellant to rise above most of the atmosphere, then releasing the spacecraft at the right distance/condition. For an orbital launch, the vehicle must also accelerate to orbital velocity.

### Orbit is mostly sideways

NASA Space Place explains orbit as a balance between forward momentum and gravity: too little forward motion and the object falls back; enough sideways motion and it continually falls around the planet. This is the key conceptual reason rockets pitch over and appear to fly horizontally.

#### Newton’s cannonball: the classic visual for this idea

Isaac Newton’s thought experiment from *Principia* (the “System of the World” section) is arguably the single best animation primitive for this video and should be a candidate for the opening act:

1. A cannon on a very tall mountain fires horizontally. The ball arcs and hits the ground.
2. Fire it faster: it lands farther away, because Earth’s surface curves away beneath it.
3. Fire it fast enough (~7.9 km/s at surface level, ignoring air) and the ground curves away exactly as fast as the ball falls. The cannonball never lands: it is in orbit.
4. Faster still, the orbit becomes an ellipse; at escape velocity, it never comes back.

This one picture unifies three of the video’s required concepts: orbit as continuous falling, orbital velocity as a threshold, and escape velocity as a higher threshold on the same dial. It also sets up the punchline “a rocket is just a machine for turning a cannonball sideways very fast.”

NASA Glenn’s flight-to-orbit page gives a concrete number: a 100-mile-high circular Earth orbit needs about 17,478 mph. This is a better “launch stream intuition” number than escape velocity for most Earth-orbit missions.

### Escape velocity is useful but can mislead beginners

Escape velocity answers a different question: “How fast would something need to be moving, without more thrust and ignoring atmosphere, to never come back?” For Earth, the famous surface value is about 11.2 km/s, higher than low-Earth-orbit speed. But rockets do not normally launch by instantly jumping to escape speed at the pad. They burn over time, lose energy to gravity and drag, and often aim for orbit first.

Teaching use: include escape velocity, but frame it as one line on a velocity ladder:

```text
space altitude < low Earth orbit speed < Earth escape speed
```

The useful correction: “Going to space” is altitude; “staying in space around Earth” is sideways velocity; “leaving Earth” is more energy again.

A clean mathematical relation worth showing (it is simple and memorable): at any given distance from Earth’s center,

```text
escape velocity = √2 × circular orbital velocity
```

At the surface, circular orbital velocity would be about 7.9 km/s and escape velocity is 7.9 × √2 ≈ 11.2 km/s. So escape is only about 41% faster than orbit — but since energy grows with velocity squared, it takes twice the kinetic energy. This makes the ladder feel lawful rather than arbitrary.

## The rocket equation

The ideal rocket equation is:

```text
Δv = ve × ln(m0 / mf)
```

or equivalently:

```text
Δv = Isp × g0 × ln(m0 / mf)
```

Where:

- `Δv` is the ideal velocity change.
- `ve` is effective exhaust velocity.
- `Isp` is specific impulse.
- `g0` is standard gravity.
- `m0` is starting/wet mass.
- `mf` is ending/final mass after propellant is burned.
- `ln` is the natural logarithm.

The formula is conceptually harsh because mass ratio is inside a logarithm. Doubling propellant does not double delta-v. To get more delta-v with the same engine performance, the mass ratio must grow exponentially.

### The inverted form is the scary one

For the video, the equation is more dramatic solved for mass ratio instead of delta-v:

```text
m0 / mf = e^(Δv / ve)
```

Delta-v sits in an exponent. Read as a story: the price of speed is exponential in mass. Every extra km/s of required delta-v multiplies the required mass ratio by the same factor; it never merely adds. With `ve ≈ 3.5 km/s` (a good vacuum kerosene-class engine), each additional 3.5 km/s of delta-v means the whole rocket must be ~2.72× (one factor of `e`) heavier relative to what arrives. This inverted form is the recommended on-screen version for the payload cascade act, because it directly answers “how big must the rocket be?”

### Intuition for why the equation is exponential

The reason is worth 20 seconds of the video because it converts the formula from magic into common sense: the propellant you will burn later must itself be accelerated now. Fuel needs fuel, and *that* fuel needs fuel. Don Pettit’s NASA essay “The Tyranny of the Rocket Equation” is the best popular source for this framing and for the numbers below.

### How extreme rockets are compared to everything else (Pettit’s anchors)

- A rocket sitting on the pad, ready to go to orbit, is about **85–90% propellant** by mass and often **less than ~2% payload**.
- For comparison, an ordinary car is only a few percent fuel by mass, and even a long-range jet airliner at takeoff is roughly 40% fuel. Nothing else humans build routinely operates at rocket-like propellant fractions.
- Pettit’s framing: at ~90% propellant, “small gains through engineering are literally worth more than their weight in gold” — every kilogram of structure saved is a kilogram of payload gained.

NASA Glenn’s ideal rocket equation page gives a strong beginner-friendly statement: for an idealized rocket going to orbit, roughly 90% of the weight can be propellant, with the remaining 10% split between structure, engines, and payload; payload may be only about 1% of launch weight in that simplified discussion.

Real-vehicle sanity checks of the payload fraction (good for one on-screen bar chart):

- Falcon 9: about 549 t at liftoff, up to about 22.8 t to low Earth orbit fully expended — roughly a **4% payload fraction**, and meaningfully less when the booster reserves propellant to land.
- Saturn V: about 2,900+ t at liftoff for roughly 140 t to low Earth orbit — also in the neighborhood of **4–5%**.

The takeaway visual: the biggest machines humanity operates deliver only a few percent of themselves to orbit, and that is *after* a century of optimization.

## Payload mass cascade: why “just add a little payload” becomes expensive

A launch vehicle must accelerate everything currently attached to it:

```text
payload + structure + engines + tanks + propellant
```

If payload increases, the rocket needs more propellant to give that larger final mass the same delta-v. But that added propellant has mass too. Carrying that propellant may require larger tanks and more structure. That structure also needs propellant. This feedback loop is the intuitive form of the rocket equation.

A simple simulation can use a fixed target delta-v and fixed engine performance:

1. Start with payload mass.
2. Add dry structure as a fraction of propellant/tank/engine mass.
3. Compute propellant needed from the rocket equation.
4. The propellant increases wet mass.
5. Larger wet mass implies more structure in the simplified model.
6. Recompute until it converges or fails.

The important teaching point is not exact vehicle sizing; it is the feedback shape:

```text
more payload → more final mass → more propellant → more tank/structure → more propellant again
```

### Math that makes the simulation work (and gives it an ending)

The iterative loop above has a clean closed form, which is useful both for implementing the animation and for the story’s climax. Define:

- `P` = payload mass
- `Mp` = propellant mass
- structure mass `S = α × Mp` (tanks/engines scale with the propellant they hold; `α ≈ 0.08–0.15` is a reasonable teaching value)
- `R = e^(Δv / ve)` (the required mass ratio)

Requiring `Δv = ve × ln(m0/mf)` with `m0 = P + S + Mp` and `mf = P + S` gives:

```text
Mp = (R − 1) × P / (1 − α(R − 1))
```

Two properties of this formula are gold for the video:

1. **The iterative loop is a geometric series.** Each pass of the naive simulation (“add propellant → that needs structure → that structure needs propellant → …”) adds another term with ratio `α(R − 1)`. If that ratio is below 1, the loop converges and the rocket closes; the animation can literally show the added mass chunks shrinking toward a finite total.
2. **There is a wall.** When `α(R − 1) ≥ 1`, the series diverges: no amount of propellant makes the rocket work with that structure fraction and that engine. The simulation should end with the viewer pushing the payload/delta-v slider until the rocket grows without bound — the “impossible rocket” moment. This is not a rendering trick; it is exactly what the equation does.

Worked example for concreteness (single stage, `ve = 3.5 km/s`):

- `Δv = 9.4 km/s` (a realistic LEO price tag, see below) → `R = e^(9.4/3.5) ≈ 14.7`, so `R − 1 ≈ 13.7`.
- The rocket only closes if `α < 1/13.7 ≈ 0.073` — the structure must be under ~7% of the propellant mass, which is thinner than a soda can proportionally. This is why single-stage-to-orbit is brutally hard, and it sets up the staging act.

The visual should avoid implying that real rockets are sized by one naive loop only. Real design includes thrust, engine count, structural margins, aerodynamic loads, manufacturing limits, trajectory optimization, recovery requirements, and mission orbit.

## Engine performance: how impulse helps

The rocket equation has two levers:

```text
Δv = effective exhaust velocity × log(mass ratio)
```

If engine performance improves, `ve` rises. That means the same mass ratio produces more delta-v, or the same delta-v can be achieved with a lower mass ratio. Specific impulse is the common performance shorthand.

NASA Glenn defines specific impulse as a ratio involving thrust and propellant weight flow, with units of seconds, and relates it to equivalent/effective velocity. For this video, the most intuitive wording is:

> Specific impulse tells us how effectively the engine turns propellant mass into push.

Do not spend time comparing engine cycles or propellant families in this video. A single slider labeled “exhaust velocity / Isp” is enough to show why engine performance can tame, but not repeal, the mass cascade.

Realistic bounds for that slider, without naming engine families: chemical rocket engines span roughly `ve ≈ 2.5–4.5 km/s` (Isp ≈ 250–460 s). That factor of ~1.8 sounds small, but because `ve` divides delta-v inside an exponent, it changes required mass ratio enormously: for 9.4 km/s of delta-v, `ve = 3.0` needs a mass ratio of ~23, while `ve = 4.4` needs only ~8.5. The visual should show that moving the engine slider bends the exponential curve down, but never makes it flat — chemistry caps how fast we can throw mass, which is why engine improvements tame the cascade but staging is still needed to beat it.

Important nuance: high `Isp` is not the only thing a launch engine needs. Liftoff also needs high thrust, practical density, structural compatibility, reliability, and manageable cost. That nuance can be a single caveat because detailed engine tradeoffs are out of scope.

## Why rockets start vertical but do not stay vertical

A rocket initially points mostly upward because it must clear the pad, climb out of dense atmosphere, and avoid terrain. But orbit requires sideways speed. So launch vehicles pitch over into a gravity turn / programmed pitch maneuver.

NASA’s Basics of Space Flight chapter describes launch as powered flight where the vehicle rises above Earth’s atmosphere and accelerates at least to orbital velocity. NASA Space Place’s orbit explanation supplies the intuitive reason: sideways momentum keeps the object falling around Earth instead of falling back down.

A good beginner phrasing:

```text
Vertical flight buys altitude and thinner air.
Horizontal flight buys orbit.
```

The rocket does not “turn sideways because space is sideways”; it turns sideways because the final orbit is a high-speed horizontal motion around Earth. The upward part is mostly a way to get out of the thick atmosphere before spending most of the velocity budget sideways.

## Why not go straight up and then turn?

Going straight up too long wastes delta-v fighting gravity. While the engine is burning upward, gravity continuously subtracts from the useful energy. A gradual gravity turn lets the rocket build horizontal velocity while still climbing and helps align thrust with the eventual orbital path.

A concrete way to feel gravity loss: while thrusting straight up, gravity is subtracting about 9.8 m/s of speed every second, no matter how good the engine is. Spend 100 seconds climbing vertically and roughly 1 km/s of delta-v has been paid just to hold the vehicle against gravity — delta-v that never becomes orbital speed. The sooner velocity is tilted sideways, the less of the burn gravity can tax (sideways speed is perpendicular to gravity, so gravity stops eating it). But pitching over too early means slamming through dense air at high speed. The trajectory is a compromise between the gravity tax and the drag tax, and that compromise is the gentle arc seen on every launch stream.

The vehicle also manages aerodynamic stress. During Max Q, launch providers may throttle down or shape the trajectory so the vehicle is not both extremely fast and deep in dense air.

## The real delta-v price tag to low Earth orbit

Circular orbital speed in low Earth orbit is about 7.8 km/s, but a launch vehicle must budget more than that, because losses accrue during ascent:

```text
  ~7.8 km/s   orbital speed itself
+ ~1.0–1.5 km/s   gravity losses (thrust spent holding the rocket up while climbing)
+ ~0.1–0.15 km/s  drag losses (pushing through the atmosphere)
+ small steering losses
− up to ~0.4 km/s  Earth-rotation bonus (launching eastward, latitude dependent)
≈ 9.0–9.5 km/s    typical total delta-v budget to LEO
```

Individual line items vary by vehicle, trajectory, and launch site, so present these as typical magnitudes rather than universal constants. The teaching value is the *shape* of the budget: the losses are a meaningful surcharge (~15–20%) but the dominant cost is still sideways speed — reinforcing the thesis that orbit is a velocity problem. This table is also the natural home for the “delta-v wallet” visual: a wallet of ~9.4 km/s with taxes removed before the orbit purchase.

## Why launch east / why launch site matters

Earth rotates eastward. NASA Space Place notes that at the equator Earth’s surface rotation is about 1,675 km/h, or 1,041 mph. Launching eastward can use that rotation as a free velocity boost, reducing required propellant for many prograde orbits.

This is why launch direction and launch site latitude matter. But missions may launch into other inclinations due to target orbit, safety corridors, national geography, or mission requirements.

## Why two phases/stages instead of one

The rocket equation punishes dead mass. After the first stage burns most of its propellant, its tanks and engines are mostly no longer useful for reaching orbit. Keeping them attached means the upper stage must accelerate empty hardware.

Staging solves this by discarding dry mass during flight:

```text
before staging: upper stage + payload + empty first-stage structure
 after staging: upper stage + payload
```

The equation then applies stage by stage, with each stage contributing part of the total delta-v. Staging is powerful because it resets the mass ratio problem for the remaining vehicle.

### Worked comparison: one stage vs two (recommended for the video)

Use the same engine (`ve = 3.5 km/s`) and the same job (9.4 km/s to LEO):

- **Single stage:** needs mass ratio `e^(9.4/3.5) ≈ 14.7`, i.e. about **93% of liftoff mass must be propellant**. The remaining ~7% must cover *all* tanks, engines, structure, and payload — at realistic structure fractions there is essentially nothing left for payload.
- **Two stages, splitting the job ~in half (4.7 km/s each):** each stage needs mass ratio `e^(4.7/3.5) ≈ 3.8`, i.e. about **74% propellant per stage**. Each stage keeps a comfortable ~26% for structure and everything it carries. Because the second stage’s “payload” is small and the first stage’s dead weight is discarded halfway, the same total delta-v now closes with room for real payload.

The multiplication insight worth stating aloud: total mass ratio multiplies across stages (3.8 × 3.8 ≈ 14.7 — the same total), but the *structure* penalty does not carry all the way to orbit. Staging doesn’t cheat the rocket equation; it stops paying the equation’s price for hardware that has finished its job.

There are diminishing returns: three stages beat two by less than two beat one, while cost, complexity, and failure points grow with every separation event. Two stages is the sweet spot most modern orbital launchers converge on — a good closing note that the design viewers see on streams is not tradition but arithmetic.

For the user’s “why 2 phases instead of one” idea, use “two stages” rather than “two phases” in the technical text, while acknowledging viewers may perceive a launch as two main phases:

1. First stage: dense atmosphere, high thrust, lift and initial acceleration.
2. Second stage: near-vacuum, finishes horizontal/orbital velocity.

A single-stage-to-orbit vehicle is not physically impossible in principle, but it is extremely constrained because it cannot discard empty tanks/engines. It must carry all structure all the way to orbit, leaving little margin for payload. This is why most orbital launch vehicles use staging.

## What viewers see during a modern launch stream

These events are useful context for a beginner video because they connect equations to real footage:

### Liftoff

The rocket has enough thrust-to-weight to rise. The vehicle is heaviest here because it is full of propellant. Typical liftoff thrust-to-weight is only about 1.2–1.5 — which is why rockets appear to crawl off the pad. This is a deliberate tradeoff, not weakness: more engines would lift the stack faster but add dry mass and cost. As propellant burns off, the same thrust pushes an ever-lighter vehicle, so acceleration climbs through the burn; crewed vehicles throttle down near the end of each stage to keep acceleration around 3–4 g for the humans on board.

### Pitch program / gravity turn

Soon after clearing the tower, the rocket begins steering away from vertical. This is not a mistake; it is the beginning of building sideways orbital velocity.

### Max Q

Dynamic pressure peaks because the rocket is moving fast while the atmosphere is still thick. This is often called out in launch commentary.

### MECO

Main engine cutoff for the first stage. The first stage has done its main job and is mostly empty.

A stream-decoding fact that surprises beginners: at a typical Falcon 9 MECO (around 2.5 minutes into flight), the vehicle is only moving at very roughly 2 km/s and sitting at roughly 65–80 km altitude. The first stage’s job was mostly lifting the stack out of the thick atmosphere; the large majority of orbital speed — from ~2 up to ~7.8 km/s — is added by the much smaller second stage. This inverts the naive intuition that the big booster “does most of the work of getting to space.”

### Stage separation

The vehicle drops first-stage dry mass. This is the most visible answer to the rocket equation.

### Second engine start

The upper stage engine ignites to finish the climb and, more importantly, the horizontal acceleration to orbit.

### Fairing separation

Once the atmosphere is thin enough, the payload no longer needs a protective aerodynamic shell. Discarding it saves mass.

### Orbital insertion / SECO

The upper stage cuts off when the target orbit is reached or when a coast/burn sequence is complete. The vehicle’s speed readout is often now near orbital speed, not escape speed.

### Reading the stream telemetry

SpaceX’s webcast overlay shows speed in km/h and altitude in km. Useful decoder values for the video: low-Earth-orbit speed of ~7.8 km/s reads as roughly **28,000 km/h** on the overlay, and the ISS orbits at about 400 km altitude, circling Earth about every 90 minutes. Watching the two numbers is watching the thesis of this video play out: early in flight the altitude number climbs while speed grows slowly; after staging, altitude nearly flatlines while the speed number races toward 28,000 — visible proof that the launch was mostly a sideways-speed purchase.

## Common misconceptions to address

- **Misconception: “Rockets go straight up to space.”** Correction: they start upward, but orbit is mostly sideways velocity.
- **Misconception: “Escape velocity is the speed every rocket must reach.”** Correction: low Earth orbit needs less speed than escape, though real launch delta-v includes losses.
- **Misconception: “More fuel always fixes the problem.”** Correction: more propellant also adds mass; the benefit has diminishing returns because of the logarithm.
- **Misconception: “Bigger engines solve everything.”** Correction: thrust helps lift and reduce losses, but efficiency/effective exhaust velocity controls how much delta-v propellant can provide.
- **Misconception: “The second stage is just backup.”** Correction: the second stage is essential for orbit because it accelerates a much smaller vehicle after dead mass is discarded.
- **Misconception: “Fairing separation is just a cosmetic event.”** Correction: it removes no-longer-needed mass once aerodynamic protection is unnecessary.
- **Misconception: “Horizontal flight means the rocket is falling.”** Correction: yes, orbit is falling — but fast enough sideways to miss Earth.
- **Misconception: “The big first stage does most of the work of reaching orbit.”** Correction: it does most of the *lifting* out of dense air, but most of the *speed* is added by the second stage after staging.
- **Misconception: “Astronauts float because there is no gravity up there.”** Correction: gravity at ISS altitude is still about 90% of surface gravity; astronauts float because they and their station are falling together. This is a one-line aside, but it lands hard with beginners and directly reinforces “orbit = falling.”
- **Misconception: “Rockets push against the air (so they can’t work in space).”** Correction: thrust is momentum exchange — the rocket pushes on its own exhaust, which is why engines work better in vacuum, not worse.

## Useful numerical anchors

These are rough anchors for teaching, not final precise narration:

- Low Earth orbit speed: about 7.8 km/s, or about 17,500 mph / 28,000 km/h, depending on altitude.
- NASA Glenn example: 100-mile circular orbit speed is 17,478 mph.
- Earth surface escape velocity: about 11.2 km/s; escape velocity = √2 × circular orbital velocity at the same radius.
- Ideal velocity to merely *reach* 100 km altitude: about 1.4 km/s — the orbit job is ~30× more kinetic energy than the altitude job.
- Typical total delta-v budget to LEO including losses: roughly 9.0–9.5 km/s.
- Earth equator rotation speed: about 1,675 km/h / 1,041 mph eastward (up to ~0.4 km/s of free delta-v for eastward launches).
- Chemical engine effective exhaust velocity range: roughly 2.5–4.5 km/s (Isp ≈ 250–460 s).
- Typical liftoff thrust-to-weight: about 1.2–1.5; crewed ascent acceleration usually capped near 3–4 g.
- Idealized orbit rocket mass can be around 90% propellant in NASA Glenn’s beginner explanation, with payload around 1% of launch mass in that simplified example; Pettit gives 85–90% propellant and under ~2% payload for real vehicles.
- Real payload fractions: Falcon 9 ≈ 4% (549 t liftoff → up to 22.8 t to LEO expended); Saturn V ≈ 4–5%.
- ISS: about 400 km altitude, one orbit roughly every 90 minutes, local gravity still ~90% of surface gravity.

Real launch delta-v to low Earth orbit is higher than circular orbital speed because gravity and drag losses must be paid during ascent. The exact number depends on vehicle, trajectory, launch site, target orbit, atmosphere, steering, and recovery choices.

## Potential additions that would make the video more complete

These topics are related enough to enrich the video, but should be kept short:

- **Delta-v budget as a wallet**: every launch has a limited budget spent on gravity losses, drag losses, steering losses, and final orbit speed.
- **Energy vs speed**: higher orbits require more energy even though circular speed can be lower at higher altitude; avoid overcomplicating unless needed.
- **Inclination**: launch trajectory is not arbitrary; target orbit angle matters.
- **Launch windows**: for rendezvous missions, the launch pad must rotate into the correct plane at the correct time.
- **Throttle changes**: not all throttle changes mean trouble; they can manage loads or acceleration.
- **Acceleration increases during a burn**: as propellant burns off, the same thrust accelerates a lighter vehicle more strongly.
- **Reusability tradeoff**: reserving propellant for landing reduces payload performance, but this belongs as a small aside if SpaceX footage is referenced.

## Visual research implications

Good visual primitives for later phases:

- Newton’s cannonball on a mountain: increasing muzzle velocity until the arc becomes an orbit, then an escape trajectory.
- Earth curve with tangent velocity arrow.
- Velocity ladder: space altitude, orbital velocity, escape velocity.
- Rocket mass stack: payload, dry structure, propellant.
- Iterative payload cascade loop.
- Rocket equation machine with two knobs: mass ratio and engine performance.
- Gravity/drag loss “tax” labels removed from delta-v wallet.
- Stage separation as dropping a dim empty shell while the bright remaining stack continues.
- Launch stream timeline with callouts for Max Q, MECO, stage separation, fairing separation, and orbital insertion.
- Payload cascade as a geometric series: each feedback pass adds a visibly shrinking (converging) or growing (diverging) mass chunk, ending in the “impossible rocket” when the series diverges.
- Recreated stream telemetry overlay (speed km/h + altitude km) with the two numbers racing: altitude first, then speed dominating after staging.
- Payload-fraction bar chart: car fuel fraction vs airliner vs rocket, then rocket liftoff mass vs delivered payload.

## Factual uncertainties / caution flags

- Avoid giving one universal delta-v-to-LEO number without context. State that real launch delta-v varies.
- Avoid treating escape velocity as a launch vehicle target for ordinary orbital missions.
- Avoid implying `Isp` alone determines engine quality. Thrust, density, reliability, reusability, and mission profile also matter.
- Avoid implying two stages is a law of nature. It is a very common practical solution; three stages, boosters, and single-stage concepts exist.
- Avoid implying a real rocket sizing tool is as simple as the proposed payload cascade simulation. Present the loop as a teaching model.
- The Falcon 9 MECO speed/altitude figures vary noticeably by mission profile and booster recovery mode (droneship vs return-to-launch-site vs expendable); present them as “very roughly” and prefer relative claims (“most speed comes from stage 2”) over exact telemetry values.
- The structure-scales-with-propellant assumption (`S = α × Mp`) is a simplification; real structural mass depends on geometry, materials, thrust loads, and engine count. Keep `α` framed as a teaching knob.
- The loss figures (gravity ~1.0–1.5 km/s, drag ~0.1–0.15 km/s) are typical magnitudes from standard astronautics references, not universal constants; always attach “roughly.”

## Sources

- NASA Glenn Research Center, “Ideal Rocket Equation” — explains the rocket equation and gives the beginner-friendly 90% propellant / ~1% payload framing for an ideal orbital rocket. https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/ideal-rocket-equation/
- NASA Glenn Research Center, “Flight To Orbit” — gives the 17,478 mph speed for a 100-mile-high circular Earth orbit and frames orbital flight as altitude plus horizontal velocity. https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/flight-to-orbit/
- NASA Glenn Research Center, “Specific Impulse” — defines specific impulse and relates it to equivalent velocity and propellant weight flow. https://www.grc.nasa.gov/www/k-12/airplane/specimp.html
- NASA Glenn Research Center, “Rocket Thrust Equation” — notes that specific impulse simplifies rocket performance analysis across engine types. https://www.grc.nasa.gov/www/k-12/airplane/rockth.html
- NASA Space Place, “What Is an Orbit?” — explains orbit as sideways motion plus gravity: falling while missing Earth. https://spaceplace.nasa.gov/orbits/en/
- NASA Space Place, “How Do We Launch Things Into Space?” — beginner explanation of using rockets and propellant to reach space. https://spaceplace.nasa.gov/launching-into-space/en/
- NASA Space Place, “Launch a rocket from a spinning planet” — explains Earth’s eastward rotation and the equatorial speed boost of about 1,675 km/h / 1,041 mph. https://spaceplace.nasa.gov/launch-windows/
- NASA Science, “Basics of Space Flight, Chapter 14: Launch” — describes powered launch as rising above the atmosphere and accelerating to orbital velocity. https://science.nasa.gov/learn/basics-of-space-flight/chapter14-1/
- Don Pettit (NASA), “The Tyranny of the Rocket Equation” — the best popular treatment of why rockets are 85–90% propellant with under ~2% payload, with the fuel-fraction comparisons to cars and airliners and the “worth more than their weight in gold” framing. https://www.nasa.gov/mission_pages/station/expeditions/expedition30/tryanny.html (original 2012 URL; if NASA’s site restructure breaks it, use the Internet Archive copy: https://web.archive.org/web/2023/https://www.nasa.gov/mission_pages/station/expeditions/expedition30/tryanny.html)
- SpaceX, “Falcon 9” vehicle page — liftoff mass (~549 t) and payload-to-LEO (22.8 t) figures used for the real-world payload fraction anchor. https://www.spacex.com/vehicles/falcon-9
- Isaac Newton, *Principia* (“A Treatise of the System of the World”) — origin of the cannonball-on-a-mountain thought experiment; widely reproduced in agency and textbook educational material, no single canonical URL.
