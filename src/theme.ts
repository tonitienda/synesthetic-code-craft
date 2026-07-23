// The single source of truth for every colour in the videos.
//
// Components should never hard-code a hex value — they pull a semantic token
// from here. That way the whole system can be re-skinned from one place, and a
// component's colours can be swapped by role, e.g. giving the terminal a
// secondary accent is just:
//
//   createTerminal({
//     theme: { border: theme.secondary.base, header: theme.secondary.dim },
//   })
//
// The palette is a black base with a neutral dark-grey surface ramp, plus a few
// accent families. Each accent carries the variants components actually need:
//
//   base — the accent itself: borders, key text, status dots
//   dim  — a dark, desaturated version for headers and soft backgrounds
//   soft — a translucent wash to fill behind content
//   on   — a light tint for text/icons sitting on top of the accent

export interface AccentColor {
  /** The accent itself — borders, key text, status dots. */
  base: string
  /** Dark, desaturated — headers, soft panel backgrounds. */
  dim: string
  /** Translucent wash — fills behind content. */
  soft: string
  /** Light tint — text/icons placed on the accent. */
  on: string
}

export interface Theme {
  // Neutral surfaces: black base + a dark-grey ramp, dark → light.
  bg: string
  surfaceDim: string
  surface: string
  surfaceRaised: string
  surfaceHigh: string

  // Lines.
  border: string
  borderStrong: string
  borderSubtle: string
  divider: string

  // Text, brightest → dimmest.
  text: string
  textSoft: string
  textMuted: string
  textDim: string

  // A single attention colour for cursors / command lifts / phase markers.
  highlight: string

  // Accent families.
  primary: AccentColor // cool blue — images, read-only, the terminal prompt
  secondary: AccentColor // amber — commands, the writable layer, "active"
  success: AccentColor // green — a live, running process
  danger: AccentColor // red — errors and flow-stopping warnings
  accent: AccentColor // violet — registries, distribution
}

export const theme: Theme = {
  bg: "#000000",
  surfaceDim: "#0a0a0a",
  surface: "#141414",
  surfaceRaised: "#181818",
  surfaceHigh: "#1c1c1c",

  border: "#3a3a3a",
  borderStrong: "#5a5a5a",
  borderSubtle: "#ffffff24",
  divider: "#242424",

  text: "#f8fafc",
  textSoft: "#e2e8f0",
  textMuted: "#a1a1a1",
  textDim: "#5a5a5a",

  highlight: "#facc15",

  primary: {
    base: "#7dd3fc",
    dim: "#0c4a6e",
    soft: "#7dd3fc22",
    on: "#e0f2fe",
  },
  secondary: {
    base: "#fbbf24",
    dim: "#451a03",
    soft: "#1c130088",
    on: "#fde68a",
  },
  success: {
    base: "#34d399",
    dim: "#052e16",
    soft: "#34d39922",
    on: "#6ee7b7",
  },
  danger: {
    base: "#fb7185",
    dim: "#4c0519",
    soft: "#fb718522",
    on: "#fecdd3",
  },
  accent: {
    base: "#a78bfa",
    dim: "#2e1065",
    soft: "#a78bfa22",
    on: "#c4b5fd",
  },
}
