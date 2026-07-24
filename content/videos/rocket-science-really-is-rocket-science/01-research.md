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

The Kármán-line idea of space is roughly 100 km altitude, but a vehicle can go above that and still fall back if it lacks sideways speed. A suborbital flight is a tall arc; an orbital flight is a fall that keeps missing Earth.

NASA’s beginner material emphasizes that launching into space means using enough propellant to rise above most of the atmosphere, then releasing the spacecraft at the right distance/condition. For an orbital launch, the vehicle must also accelerate to orbital velocity.

### Orbit is mostly sideways

NASA Space Place explains orbit as a balance between forward momentum and gravity: too little forward motion and the object falls back; enough sideways motion and it continually falls around the planet. This is the key conceptual reason rockets pitch over and appear to fly horizontally.

NASA Glenn’s flight-to-orbit page gives a concrete number: a 100-mile-high circular Earth orbit needs about 17,478 mph. This is a better “launch stream intuition” number than escape velocity for most Earth-orbit missions.

### Escape velocity is useful but can mislead beginners

Escape velocity answers a different question: “How fast would something need to be moving, without more thrust and ignoring atmosphere, to never come back?” For Earth, the famous surface value is about 11.2 km/s, higher than low-Earth-orbit speed. But rockets do not normally launch by instantly jumping to escape speed at the pad. They burn over time, lose energy to gravity and drag, and often aim for orbit first.

Teaching use: include escape velocity, but frame it as one line on a velocity ladder:

```text
space altitude < low Earth orbit speed < Earth escape speed
```

The useful correction: “Going to space” is altitude; “staying in space around Earth” is sideways velocity; “leaving Earth” is more energy again.

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

NASA Glenn’s ideal rocket equation page gives a strong beginner-friendly statement: for an idealized rocket going to orbit, roughly 90% of the weight can be propellant, with the remaining 10% split between structure, engines, and payload; payload may be only about 1% of launch weight in that simplified discussion.

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

The vehicle also manages aerodynamic stress. During Max Q, launch providers may throttle down or shape the trajectory so the vehicle is not both extremely fast and deep in dense air.

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

For the user’s “why 2 phases instead of one” idea, use “two stages” rather than “two phases” in the technical text, while acknowledging viewers may perceive a launch as two main phases:

1. First stage: dense atmosphere, high thrust, lift and initial acceleration.
2. Second stage: near-vacuum, finishes horizontal/orbital velocity.

A single-stage-to-orbit vehicle is not physically impossible in principle, but it is extremely constrained because it cannot discard empty tanks/engines. It must carry all structure all the way to orbit, leaving little margin for payload. This is why most orbital launch vehicles use staging.

## What viewers see during a modern launch stream

These events are useful context for a beginner video because they connect equations to real footage:

### Liftoff

The rocket has enough thrust-to-weight to rise. The vehicle is heaviest here because it is full of propellant.

### Pitch program / gravity turn

Soon after clearing the tower, the rocket begins steering away from vertical. This is not a mistake; it is the beginning of building sideways orbital velocity.

### Max Q

Dynamic pressure peaks because the rocket is moving fast while the atmosphere is still thick. This is often called out in launch commentary.

### MECO

Main engine cutoff for the first stage. The first stage has done its main job and is mostly empty.

### Stage separation

The vehicle drops first-stage dry mass. This is the most visible answer to the rocket equation.

### Second engine start

The upper stage engine ignites to finish the climb and, more importantly, the horizontal acceleration to orbit.

### Fairing separation

Once the atmosphere is thin enough, the payload no longer needs a protective aerodynamic shell. Discarding it saves mass.

### Orbital insertion / SECO

The upper stage cuts off when the target orbit is reached or when a coast/burn sequence is complete. The vehicle’s speed readout is often now near orbital speed, not escape speed.

## Common misconceptions to address

- **Misconception: “Rockets go straight up to space.”** Correction: they start upward, but orbit is mostly sideways velocity.
- **Misconception: “Escape velocity is the speed every rocket must reach.”** Correction: low Earth orbit needs less speed than escape, though real launch delta-v includes losses.
- **Misconception: “More fuel always fixes the problem.”** Correction: more propellant also adds mass; the benefit has diminishing returns because of the logarithm.
- **Misconception: “Bigger engines solve everything.”** Correction: thrust helps lift and reduce losses, but efficiency/effective exhaust velocity controls how much delta-v propellant can provide.
- **Misconception: “The second stage is just backup.”** Correction: the second stage is essential for orbit because it accelerates a much smaller vehicle after dead mass is discarded.
- **Misconception: “Fairing separation is just a cosmetic event.”** Correction: it removes no-longer-needed mass once aerodynamic protection is unnecessary.
- **Misconception: “Horizontal flight means the rocket is falling.”** Correction: yes, orbit is falling — but fast enough sideways to miss Earth.

## Useful numerical anchors

These are rough anchors for teaching, not final precise narration:

- Low Earth orbit speed: about 7.8 km/s, or about 17,500 mph, depending on altitude.
- NASA Glenn example: 100-mile circular orbit speed is 17,478 mph.
- Earth surface escape velocity: about 11.2 km/s.
- Earth equator rotation speed: about 1,675 km/h / 1,041 mph eastward.
- Idealized orbit rocket mass can be around 90% propellant in NASA Glenn’s beginner explanation, with payload around 1% of launch mass in that simplified example.

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

- Earth curve with tangent velocity arrow.
- Velocity ladder: space altitude, orbital velocity, escape velocity.
- Rocket mass stack: payload, dry structure, propellant.
- Iterative payload cascade loop.
- Rocket equation machine with two knobs: mass ratio and engine performance.
- Gravity/drag loss “tax” labels removed from delta-v wallet.
- Stage separation as dropping a dim empty shell while the bright remaining stack continues.
- Launch stream timeline with callouts for Max Q, MECO, stage separation, fairing separation, and orbital insertion.

## Factual uncertainties / caution flags

- Avoid giving one universal delta-v-to-LEO number without context. State that real launch delta-v varies.
- Avoid treating escape velocity as a launch vehicle target for ordinary orbital missions.
- Avoid implying `Isp` alone determines engine quality. Thrust, density, reliability, reusability, and mission profile also matter.
- Avoid implying two stages is a law of nature. It is a very common practical solution; three stages, boosters, and single-stage concepts exist.
- Avoid implying a real rocket sizing tool is as simple as the proposed payload cascade simulation. Present the loop as a teaching model.

## Sources

- NASA Glenn Research Center, “Ideal Rocket Equation” — explains the rocket equation and gives the beginner-friendly 90% propellant / ~1% payload framing for an ideal orbital rocket. https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/ideal-rocket-equation/
- NASA Glenn Research Center, “Flight To Orbit” — gives the 17,478 mph speed for a 100-mile-high circular Earth orbit and frames orbital flight as altitude plus horizontal velocity. https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/flight-to-orbit/
- NASA Glenn Research Center, “Specific Impulse” — defines specific impulse and relates it to equivalent velocity and propellant weight flow. https://www.grc.nasa.gov/www/k-12/airplane/specimp.html
- NASA Glenn Research Center, “Rocket Thrust Equation” — notes that specific impulse simplifies rocket performance analysis across engine types. https://www.grc.nasa.gov/www/k-12/airplane/rockth.html
- NASA Space Place, “What Is an Orbit?” — explains orbit as sideways motion plus gravity: falling while missing Earth. https://spaceplace.nasa.gov/orbits/en/
- NASA Space Place, “How Do We Launch Things Into Space?” — beginner explanation of using rockets and propellant to reach space. https://spaceplace.nasa.gov/launching-into-space/en/
- NASA Space Place, “Launch a rocket from a spinning planet” — explains Earth’s eastward rotation and the equatorial speed boost of about 1,675 km/h / 1,041 mph. https://spaceplace.nasa.gov/launch-windows/
- NASA Science, “Basics of Space Flight, Chapter 14: Launch” — describes powered launch as rising above the atmosphere and accelerating to orbital velocity. https://science.nasa.gov/learn/basics-of-space-flight/chapter14-1/
