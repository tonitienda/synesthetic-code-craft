import type { Theme as BaseTheme } from "../../theme"

export interface VideoTheme extends BaseTheme {
  background: {
    atmosphere: readonly string[]
    depth: readonly string[]
    pulse: readonly string[]
    vignette: readonly string[]
    cyanGlow: string
    violetGlow: string
  }
  backgroundLighting: {
    depthOpacity: number
    pulseMinOpacity: number
    pulseMaxOpacity: number
  }
  phase: {
    activeDim: string
    completeDim: string
  }
  details: {
    commandSurface: string
    registryShelf: string
    boundarySurface: string
    kernelSurface: string
    mergedFilesystem: string
    mergedFilesystemText: string
  }
}

export const darkTheme: VideoTheme = {
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
  danger: { base: "#fb7185", dim: "#4c0519", soft: "#fb718522", on: "#fecdd3" },
  accent: { base: "#a78bfa", dim: "#2e1065", soft: "#a78bfa22", on: "#c4b5fd" },
  background: {
    atmosphere: ["#050505", "#101010", "#161616", "#0a0a0a"],
    depth: ["#161616", "#101010", "#0a0a0a"],
    pulse: ["#181818", "#111111", "#10101000"],
    vignette: ["#02020200", "#020202cc"],
    cyanGlow: "#0c4a6e22",
    violetGlow: "#2e106522",
  },
  backgroundLighting: {
    depthOpacity: 0.42,
    pulseMinOpacity: 0.12,
    pulseMaxOpacity: 0.26,
  },
  phase: { activeDim: "#a16207", completeDim: "#1f6f52" },
  details: {
    commandSurface: "#020617",
    registryShelf: "#3b1f66",
    boundarySurface: "#02061766",
    kernelSurface: "#111827",
    mergedFilesystem: "#333333",
    mergedFilesystemText: "#cccccc",
  },
}

export const blueTheme: VideoTheme = {
  ...darkTheme,
  bg: "#060914",
  surfaceDim: "#0b1020",
  surface: "#0f172a",
  surfaceRaised: "#111c2f",
  surfaceHigh: "#17233a",
  border: "#334155",
  borderStrong: "#64748b",
  borderSubtle: "#94a3b824",
  divider: "#1e293b",
  text: "#f8fafc",
  textSoft: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  background: {
    atmosphere: ["#060914", "#0b1020", "#111c2f", "#08101f"],
    depth: ["#17233a", "#0f172a", "#060914"],
    pulse: ["#172554", "#111c2f", "#0b102000"],
    vignette: ["#02061700", "#020617cc"],
    cyanGlow: "#0c4a6e44",
    violetGlow: "#2e106544",
  },
  details: {
    commandSurface: "#020617",
    registryShelf: "#3b1f66",
    boundarySurface: "#02061766",
    kernelSurface: "#111827",
    mergedFilesystem: "#1e293b",
    mergedFilesystemText: "#e2e8f0",
  },
}

export const lightTheme: VideoTheme = {
  bg: "#f5f7fb",
  surfaceDim: "#e8edf5",
  surface: "#ffffff",
  surfaceRaised: "#f8fafc",
  surfaceHigh: "#eef2f7",
  border: "#94a3b8",
  borderStrong: "#64748b",
  borderSubtle: "#0f172924",
  divider: "#cbd5e1",
  text: "#0f172a",
  textSoft: "#1e293b",
  textMuted: "#475569",
  textDim: "#64748b",
  highlight: "#b45309",
  primary: {
    base: "#0369a1",
    dim: "#bae6fd",
    soft: "#0ea5e922",
    on: "#0c4a6e",
  },
  secondary: {
    base: "#b45309",
    dim: "#fde68a",
    soft: "#f59e0b22",
    on: "#78350f",
  },
  success: {
    base: "#047857",
    dim: "#a7f3d0",
    soft: "#10b98122",
    on: "#064e3b",
  },
  danger: { base: "#be123c", dim: "#fecdd3", soft: "#f43f5e22", on: "#881337" },
  accent: { base: "#6d28d9", dim: "#ddd6fe", soft: "#8b5cf622", on: "#4c1d95" },
  background: {
    atmosphere: ["#ffffff", "#f5f7fb", "#e8edf5", "#f8fafc"],
    depth: ["#ffffff", "#eef2f7", "#dbe5f1"],
    pulse: ["#ffffff", "#f8fafc", "#f5f7fb00"],
    vignette: ["#ffffff00", "#94a3b844"],
    cyanGlow: "#38bdf833",
    violetGlow: "#8b5cf622",
  },
  backgroundLighting: {
    depthOpacity: 0.42,
    pulseMinOpacity: 0.12,
    pulseMaxOpacity: 0.26,
  },
  phase: { activeDim: "#d97706", completeDim: "#059669" },
  details: {
    commandSurface: "#ffffff",
    registryShelf: "#ede9fe",
    boundarySurface: "#ffffffaa",
    kernelSurface: "#e2e8f0",
    mergedFilesystem: "#ffffff",
    mergedFilesystemText: "#1e293b",
  },
}

// ---------------------------------------------------------------------------
// Channel-signature exploration palettes.
//
// Four directions for a recognisable channel look. Each keeps the *elements and
// their motion* as the protagonists: dark grounds are softened off pure black
// to survive back-to-back viewing, light grounds are warmed off stark white,
// and boldness is spent on one accent family rather than the whole screen.
// ---------------------------------------------------------------------------

// 1. INK — a refined, cool graphite dark. Their dark, perfected: slightly cool
// ink instead of pure #000 (kinder over many videos), electric cyan signature,
// warm gold cursor. The safe-but-distinctive default.
export const inkTheme: VideoTheme = {
  ...darkTheme,
  bg: "#0b0d10",
  surfaceDim: "#101317",
  surface: "#161a20",
  surfaceRaised: "#1b2028",
  surfaceHigh: "#212732",
  border: "#313945",
  borderStrong: "#4a5563",
  borderSubtle: "#ffffff1f",
  divider: "#232a33",
  text: "#f4f7fb",
  textSoft: "#d6dde6",
  textMuted: "#97a2b0",
  textDim: "#5c6673",
  highlight: "#fcd34d",
  primary: {
    base: "#67e8f9",
    dim: "#0e4f5e",
    soft: "#67e8f922",
    on: "#cffafe",
  },
  secondary: {
    base: "#fbbf24",
    dim: "#3a2708",
    soft: "#fbbf2418",
    on: "#fde68a",
  },
  success: {
    base: "#34d399",
    dim: "#0a3d2c",
    soft: "#34d39922",
    on: "#6ee7b7",
  },
  danger: { base: "#fb7185", dim: "#4c0519", soft: "#fb718522", on: "#fecdd3" },
  accent: { base: "#a78bfa", dim: "#2e1065", soft: "#a78bfa22", on: "#c4b5fd" },
  background: {
    atmosphere: ["#090b0e", "#0b0d10", "#101317", "#0a0c0f"],
    depth: ["#171c23", "#11151a", "#0b0d10"],
    pulse: ["#101820", "#0f1318", "#10131700"],
    vignette: ["#05070900", "#050709cc"],
    cyanGlow: "#0e4f5e40",
    violetGlow: "#2e106540",
  },
  backgroundLighting: {
    depthOpacity: 0.22,
    pulseMinOpacity: 0.04,
    pulseMaxOpacity: 0.1,
  },
  phase: { activeDim: "#a16207", completeDim: "#1f6f52" },
  details: {
    commandSurface: "#080b0f",
    registryShelf: "#2a2140",
    boundarySurface: "#080b0f66",
    kernelSurface: "#141c26",
    mergedFilesystem: "#2a323d",
    mergedFilesystemText: "#d6dde6",
  },
}

// 2. EMBER — a warm graphite / espresso dark. Rare in this genre, so instantly
// recognisable: warm near-black ground, amber-gold as the star, teal as the
// cool counterpoint, a violet pop for distribution. Cosy, human, techie.
export const emberTheme: VideoTheme = {
  ...darkTheme,
  bg: "#14100d",
  surfaceDim: "#1a1512",
  surface: "#211b16",
  surfaceRaised: "#28211b",
  surfaceHigh: "#2f2721",
  border: "#453a30",
  borderStrong: "#5f5142",
  borderSubtle: "#ffffff1c",
  divider: "#2c251f",
  text: "#faf6f0",
  textSoft: "#e8dfd3",
  textMuted: "#b3a693",
  textDim: "#6b5f50",
  highlight: "#fcd34d",
  primary: {
    base: "#5eead4",
    dim: "#134e4a",
    soft: "#5eead422",
    on: "#99f6e4",
  },
  secondary: {
    base: "#f59e0b",
    dim: "#422006",
    soft: "#f59e0b20",
    on: "#fcd34d",
  },
  success: {
    base: "#a3e635",
    dim: "#1a2e05",
    soft: "#a3e63522",
    on: "#d9f99d",
  },
  danger: { base: "#f87171", dim: "#450a0a", soft: "#f8717122", on: "#fecaca" },
  accent: { base: "#c084fc", dim: "#3b0764", soft: "#c084fc22", on: "#e9d5ff" },
  background: {
    atmosphere: ["#14100d", "#1a1512", "#211b16", "#17120f"],
    depth: ["#2f2721", "#211b16", "#14100d"],
    pulse: ["#2a211a", "#211b16", "#1a151200"],
    vignette: ["#0b080600", "#0b0806cc"],
    cyanGlow: "#134e4a40",
    violetGlow: "#3b076440",
  },
  phase: { activeDim: "#b45309", completeDim: "#3f6212" },
  details: {
    commandSurface: "#0d0a08",
    registryShelf: "#3b2a52",
    boundarySurface: "#0d0a0866",
    kernelSurface: "#241d17",
    mergedFilesystem: "#332a22",
    mergedFilesystemText: "#e8dfd3",
  },
}

// 3. PAPER — an editorial light. Warm off-white paper instead of stark white
// (far less strain over a series), ink-dark text, a deep indigo signature with
// an ochre + coral supporting cast. Textbook clarity, print-shop calm.
export const paperTheme: VideoTheme = {
  ...lightTheme,
  bg: "#f7f4ee",
  surfaceDim: "#efe9df",
  surface: "#ffffff",
  surfaceRaised: "#faf7f1",
  surfaceHigh: "#f1ece3",
  border: "#b9b0a1",
  borderStrong: "#8a8072",
  borderSubtle: "#1c160f1f",
  divider: "#ded6c8",
  text: "#1c1a17",
  textSoft: "#3a352e",
  textMuted: "#6b6459",
  textDim: "#948b7d",
  highlight: "#b45309",
  primary: {
    base: "#4338ca",
    dim: "#c7d2fe",
    soft: "#4338ca1a",
    on: "#312e81",
  },
  secondary: {
    base: "#b45309",
    dim: "#fde68a",
    soft: "#d977061a",
    on: "#7c2d12",
  },
  success: {
    base: "#047857",
    dim: "#a7f3d0",
    soft: "#05966918",
    on: "#064e3b",
  },
  danger: { base: "#dc2626", dim: "#fecaca", soft: "#ef44441a", on: "#7f1d1d" },
  accent: { base: "#7c3aed", dim: "#ddd6fe", soft: "#8b5cf618", on: "#4c1d95" },
  background: {
    atmosphere: ["#ffffff", "#f7f4ee", "#efe9df", "#faf7f1"],
    depth: ["#ffffff", "#f1ece3", "#e3dccd"],
    pulse: ["#ffffff", "#faf7f1", "#f7f4ee00"],
    vignette: ["#ffffff00", "#b9b0a144"],
    cyanGlow: "#4338ca1f",
    violetGlow: "#8b5cf61a",
  },
  phase: { activeDim: "#c2600a", completeDim: "#059669" },
  details: {
    commandSurface: "#ffffff",
    registryShelf: "#ede9fe",
    boundarySurface: "#ffffffaa",
    kernelSurface: "#ece4d7",
    mergedFilesystem: "#ffffff",
    mergedFilesystemText: "#3a352e",
  },
}

// 4. NEON PLUM — the bold one. A deep, desaturated aubergine ground (a *colour*
// that still reads calm because it's dark and low-chroma) with a neon
// magenta-and-cyan duo. Synthwave restrained: unmistakable channel identity,
// but the accents pop on the elements, not a loud background.
export const neonPlumTheme: VideoTheme = {
  ...darkTheme,
  bg: "#120b16",
  surfaceDim: "#180f1d",
  surface: "#1e1425",
  surfaceRaised: "#24192c",
  surfaceHigh: "#2b1f34",
  border: "#40304c",
  borderStrong: "#5a4568",
  borderSubtle: "#ffffff1f",
  divider: "#2a1f33",
  text: "#f7f2fb",
  textSoft: "#ddd0e6",
  textMuted: "#a695b3",
  textDim: "#6a5a76",
  highlight: "#fbbf24",
  primary: {
    base: "#a55b4b",
    dim: "#0e4f5e",
    soft: "#22d3ee22",
    on: "#a5f3fc",
  },
  secondary: {
    base: "#f472b6",
    dim: "#500724",
    soft: "#f472b620",
    on: "#fbcfe8",
  },
  success: {
    base: "#9bc09c",
    dim: "#14532d",
    soft: "#4ade8022",
    on: "#bbf7d0",
  },
  danger: { base: "#fb7185", dim: "#4c0519", soft: "#fb718522", on: "#fecdd3" },
  accent: { base: "#a78bfa", dim: "#2e1065", soft: "#a78bfa22", on: "#ddd6fe" },
  background: {
    atmosphere: ["#120b16", "#180f1d", "#1e1425", "#150d1a"],
    depth: ["#2b1f34", "#1e1425", "#120b16"],
    pulse: ["#2a1836", "#1e1425", "#180f1d00"],
    vignette: ["#07040900", "#070409cc"],
    cyanGlow: "#0e4f5e40",
    violetGlow: "#50072440",
  },
  phase: { activeDim: "#a1055f", completeDim: "#1f7a4d" },
  details: {
    commandSurface: "#0a0610",
    registryShelf: "#3a2154",
    boundarySurface: "#0a061066",
    kernelSurface: "#1c1526",
    mergedFilesystem: "#2c2038",
    mergedFilesystemText: "#ddd0e6",
  },
}

// ===========================================================================
// RISKY / MOTION-NATIVE directions.
//
// The palettes above are "swatch systems": a ground plus accent families used
// as fills — they'd read fine as slide decks. These three are built for a
// screen that MOVES. The governing idea is the same across all three:
//
//   colour is a verb, not paint. Structure sits quiet and near-neutral; full
//   saturation is *reserved for the element that is currently doing something*
//   and arrives as brightness, not as a new fill. In motion the eye is pulled
//   to whatever just lit up, which is exactly where the explanation is.
//
// They deliberately break the channel's earlier "flat, no glow" rule — that's
// the risk. The emission can still be delivered mostly flat: via the shared
// atmosphere bloom + the existing colour-pulse breathing, not per-node glows.
// ===========================================================================

// 5. PHOSPHOR — an oscilloscope / CRT tube. Near-monochrome: structure is drawn
// in dim ghost-lines of the tube colour, and an element "activates" by burning
// brighter in the SAME hue rather than changing colour. Two phosphors only —
// amber (structure / writable) and green (alive) — with cyan reserved for the
// registry and red for a fault. Unmistakably a terminal; radically restrained.
export const phosphorTheme: VideoTheme = {
  ...darkTheme,
  bg: "#0a0b07",
  surfaceDim: "#0f1109",
  surface: "#14170d",
  surfaceRaised: "#191d11",
  surfaceHigh: "#1f2415",
  border: "#333a26",
  borderStrong: "#4d573a",
  borderSubtle: "#ffe08a14",
  divider: "#222616",
  text: "#f3f7df",
  textSoft: "#d7dcb8",
  textMuted: "#9aa47a",
  textDim: "#59613f",
  highlight: "#ffd24a",
  primary: {
    base: "#ffd24a",
    dim: "#4a3d12",
    soft: "#ffd24a1a",
    on: "#fff0c2",
  },
  secondary: {
    base: "#ff9d4a",
    dim: "#4a2a0e",
    soft: "#ff9d4a1a",
    on: "#ffd0a3",
  },
  success: {
    base: "#7dff9b",
    dim: "#123d20",
    soft: "#7dff9b1f",
    on: "#c2ffd2",
  },
  danger: { base: "#ff5c5c", dim: "#4a1414", soft: "#ff5c5c1f", on: "#ffc2c2" },
  accent: { base: "#66f0ff", dim: "#0c4450", soft: "#66f0ff1a", on: "#c2f8ff" },
  background: {
    atmosphere: ["#0a0b07", "#0f1109", "#14170d", "#0c0d08"],
    depth: ["#1f2415", "#14170d", "#0a0b07"],
    pulse: ["#26301a", "#191d11", "#0f110900"],
    vignette: ["#04050200", "#040502dd"],
    cyanGlow: "#0c445040",
    violetGlow: "#4a3d1240",
  },
  phase: { activeDim: "#a1791f", completeDim: "#2f7a3f" },
  details: {
    commandSurface: "#070803",
    registryShelf: "#12303a",
    boundarySurface: "#07080366",
    kernelSurface: "#16130a",
    mergedFilesystem: "#262a17",
    mergedFilesystemText: "#d7dcb8",
  },
}

// 6. ULTRAVIOLET — a blacklight room. Deep indigo-black void; fills stay dark,
// but edges and active states FLUORESCE in UV-reactive neons (cyan, magenta,
// lime). High-energy and festival-loud, kept legible because the saturation
// lives only on strokes and on whatever is moving. The bold "neon" swing, pushed.
export const ultravioletTheme: VideoTheme = {
  ...darkTheme,
  bg: "#0b0a1a",
  surfaceDim: "#100e26",
  surface: "#151230",
  surfaceRaised: "#1a1638",
  surfaceHigh: "#201b44",
  border: "#352d5c",
  borderStrong: "#4d4380",
  borderSubtle: "#b6ff3d14",
  divider: "#211c40",
  text: "#f2f0ff",
  textSoft: "#d6d2f0",
  textMuted: "#9a94c4",
  textDim: "#5c5686",
  highlight: "#b6ff3d",
  primary: {
    base: "#22e0ff",
    dim: "#0a3d4a",
    soft: "#22e0ff1a",
    on: "#b3f4ff",
  },
  secondary: {
    base: "#ff4fd8",
    dim: "#4a0a3a",
    soft: "#ff4fd81a",
    on: "#ffbdee",
  },
  success: {
    base: "#b6ff3d",
    dim: "#24400a",
    soft: "#b6ff3d1f",
    on: "#e2ffb0",
  },
  danger: { base: "#ff5a5f", dim: "#4a0f14", soft: "#ff5a5f1f", on: "#ffc2c4" },
  accent: { base: "#9d7bff", dim: "#2a1a5c", soft: "#9d7bff1a", on: "#d8ccff" },
  background: {
    atmosphere: ["#0b0a1a", "#100e26", "#151230", "#0d0b20"],
    depth: ["#201b44", "#151230", "#0b0a1a"],
    pulse: ["#241a4e", "#151230", "#100e2600"],
    vignette: ["#04030c00", "#04030cdd"],
    cyanGlow: "#22e0ff2e",
    violetGlow: "#9d7bff2e",
  },
  phase: { activeDim: "#a1055f", completeDim: "#4a8a1f" },
  details: {
    commandSurface: "#08061a",
    registryShelf: "#2a1a5c",
    boundarySurface: "#08061a66",
    kernelSurface: "#171338",
    mergedFilesystem: "#221c46",
    mergedFilesystemText: "#d6d2f0",
  },
}

// 7. SIGNAL — the disciplined risk. A near-pure void with all structure in cool
// neutral greys and white schematic linework, and exactly ONE loud signature
// hue (a warm vermilion, rare in a blue-skewing genre) reserved for the element
// that is live. Read-only / writable / registry sit at low chroma so the one
// red thing is always the answer to "where do I look?". Maximum clarity, one
// ownable colour — a whole channel resting on a single bold decision.
export const signalTheme: VideoTheme = {
  ...darkTheme,
  bg: "#000000",
  surfaceDim: "#0b0d11",
  surface: "#12151b",
  surfaceRaised: "#171b22",
  surfaceHigh: "#1d222b",
  border: "#2b323d",
  borderStrong: "#414b59",
  borderSubtle: "#ffffff1a",
  divider: "#1a1f27",
  text: "#f5f7fa",
  textSoft: "#cfd6e0",
  textMuted: "#8a94a3",
  textDim: "#545d6b",
  highlight: "#ff5a3c",
  primary: {
    base: "#6b8299",
    dim: "#1c2731",
    soft: "#6b82991f",
    on: "#b8c6d4",
  },
  secondary: {
    base: "#c9a15a",
    dim: "#2e2413",
    soft: "#c9a15a1f",
    on: "#ecd8ac",
  },
  success: {
    base: "#ff5a3c",
    dim: "#4a170d",
    soft: "#ff5a3c1f",
    on: "#ffb9a8",
  },
  danger: { base: "#ff2d55", dim: "#4a0a1a", soft: "#ff2d551f", on: "#ffb3c2" },
  accent: { base: "#4bbfae", dim: "#123b35", soft: "#4bbfae1f", on: "#b0e8df" },
  background: {
    atmosphere: ["#000000", "#0b0d11", "#12151b", "#08090c"],
    depth: ["#1d222b", "#12151b", "#000000"],
    pulse: ["#1a2028", "#12151b", "#0b0d1100"],
    vignette: ["#00000000", "#000000ee"],
    cyanGlow: "#ff5a3c26",
    violetGlow: "#4bbfae22",
  },
  phase: { activeDim: "#b03a20", completeDim: "#2f6f60" },
  details: {
    commandSurface: "#06070a",
    registryShelf: "#123b35",
    boundarySurface: "#06070a66",
    kernelSurface: "#14181f",
    mergedFilesystem: "#1f252e",
    mergedFilesystemText: "#cfd6e0",
  },
}

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  ink: inkTheme,
  ember: emberTheme,
  paper: paperTheme,
  neonPlum: neonPlumTheme,
  phosphor: phosphorTheme,
  ultraviolet: ultravioletTheme,
  signal: signalTheme,
} as const

/** Change this one line to compare the available colour schemes. */
export const theme: VideoTheme = themes.ink
export default theme

export const containerColors = {
  readonly: theme.primary.base,
  writable: theme.secondary.base,
  process: theme.success.base,
  processSoft: theme.success.soft,
}

export const terminalTheme = {
  background: theme.surfaceDim + "dc",
  header: theme.surfaceRaised + "cc",
  headerFocus: theme.border + "cc",
  border: theme.border,
  borderFocus: theme.borderStrong,
  text: theme.textSoft,
  muted: theme.textMuted,
  prompt: theme.primary.base,
  cursor: theme.highlight,
  command: theme.textSoft,
  flag: theme.secondary.on,
  amber: theme.highlight,
  amberSoft: theme.secondary.on,
  success: theme.success.on,
  warning: theme.secondary.base,
  error: theme.danger.base,
}

// Compatibility palette for the earlier scene factory in this directory.
export const c = {
  bg: theme.bg,
  bg2: theme.surfaceDim,
  panel: theme.surfaceRaised,
  panelAlt: theme.surfaceHigh,
  panelSoft: theme.surface,
  stroke: theme.border,
  strokeSoft: theme.divider,
  text: theme.textSoft,
  muted: theme.textMuted,
  dim: theme.textDim,
  cyan: theme.primary.base,
  cyanSoft: theme.primary.dim,
  amber: theme.secondary.base,
  amberSoft: theme.secondary.dim,
  green: theme.success.base,
  greenSoft: theme.success.dim,
  violet: theme.accent.base,
  violetSoft: theme.accent.dim,
  red: theme.danger.base,
  redSoft: theme.danger.dim,
}

export const timing = {
  quick: 0.3,
  fade: 0.45,
  enter: 0.75,
  intro: 0.7,
  progress: 0.55,
  preHold: 0.4,
  defaultHold: 2.2,
  outroHold: 0.6,
}

export const layers = [
  "base filesystem",
  "packages",
  "runtime dependencies",
  "application files",
]
