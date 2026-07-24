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

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
} as const

/** Change this one line to compare the available colour schemes. */
export const theme: VideoTheme = themes.dark
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
