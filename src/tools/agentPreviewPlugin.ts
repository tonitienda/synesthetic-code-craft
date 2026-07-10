import type { Plugin } from "@motion-canvas/core/lib/plugin"
import type { Player } from "@motion-canvas/core"

declare global {
  interface Window {
    motionCanvasAgent?: {
      player: Player
      seek: (seconds: number) => void
      seekFrame: (frame: number) => void
      frame: () => number
      time: () => number
      duration: () => number
    }
  }
}

const timeParamNames = ["ts", "time", "t"]

function readTimeParam(params: URLSearchParams): number | null {
  const value = timeParamNames
    .map((name) => params.get(name))
    .find((value) => value !== null)
  if (value === undefined || value === null) return null

  const seconds = Number(value)
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null
}

function readFrameParam(params: URLSearchParams): number | null {
  const value = params.get("frame")
  if (value === null) return null

  const frame = Number(value)
  return Number.isFinite(frame) && frame >= 0 ? Math.round(frame) : null
}

function hasAgentPreviewParam(params: URLSearchParams): boolean {
  return params.has("agent-preview") || params.has("agentPreview")
}

function hasSeekParam(params: URLSearchParams): boolean {
  return params.has("frame") || timeParamNames.some((name) => params.has(name))
}

function installUrlSync(player: Player): void {
  const params = new URLSearchParams(window.location.search)
  const shouldSyncUrl = hasAgentPreviewParam(params) || hasSeekParam(params)

  const seekToFrame = (frame: number) => {
    player.togglePlayback(false)
    player.requestSeek(frame)
    player.requestRender()
  }

  const seekToSeconds = (seconds: number) => {
    seekToFrame(player.status.secondsToFrames(seconds))
  }

  window.motionCanvasAgent = {
    player,
    seek: seekToSeconds,
    seekFrame: seekToFrame,
    frame: () => player.playback.frame,
    time: () => player.status.framesToSeconds(player.playback.frame),
    duration: () => player.status.framesToSeconds(player.playback.duration),
  }

  const targetFrame = readFrameParam(params)
  const targetSeconds = readTimeParam(params)
  if (targetFrame !== null) {
    seekToFrame(targetFrame)
  } else if (targetSeconds !== null) {
    seekToSeconds(targetSeconds)
  }

  if (!shouldSyncUrl) return

  const writeUrl = (frame: number) => {
    const nextParams = new URLSearchParams(window.location.search)
    const seconds = player.status.framesToSeconds(frame).toFixed(3)
    if (
      nextParams.get("frame") === String(frame) &&
      nextParams.get("ts") === seconds
    )
      return

    nextParams.set("frame", String(frame))
    nextParams.set("ts", seconds)
    const next = `${window.location.pathname}?${nextParams.toString()}${window.location.hash}`
    window.history.replaceState(null, "", next)
  }

  let lastWrite = 0
  player.onFrameChanged.subscribe((frame) => {
    const now = performance.now()
    if (now - lastWrite < 250) return
    lastWrite = now
    writeUrl(frame)
  })
}

export default function agentPreviewPlugin(): Plugin {
  return {
    name: "synesthetic-code-craft/agent-preview",
    player(player) {
      installUrlSync(player)
    },
  }
}
