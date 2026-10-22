// pixel whale sharks, seen from above, swimming down as you scroll.
// the sprite is generated from a few control points, nothing is traced from anywhere.
const lerp = (pts, r) => {
  for (let k = 1; k < pts.length; k++) {
    if (r <= pts[k][0]) {
      const [r0, v0] = pts[k - 1], [r1, v1] = pts[k]
      return v0 + ((v1 - v0) * (r - r0)) / (r1 - r0)
    }
  }
  return pts[pts.length - 1][1]
}
const BODY = [[0, 7], [4, 10], [11, 3], [18, 4], [26, 7], [36, 10], [46, 12], [58, 12], [61, 11], [63, 8]]
const FIN = [[0, 0], [40, 0], [41, 5], [43, 6], [47, 5], [51, 3], [55, 0], [63, 0]]
const H = 64
const rows = Array.from({ length: H }, (_, r) => ({ hw: Math.round(lerp(BODY, r)), fin: Math.round(lerp(FIN, r)) }))

let seed = 11
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const spots = []
for (let i = 0; i < 1500 && spots.length < 110; i++) {
  const r = 5 + Math.floor(rnd() * 56)
  const hw = rows[r].hw
  if (hw < 3) continue
  const dx = Math.round((rnd() * 2 - 1) * (hw - 1))
  if (spots.every((s) => Math.hypot(s.dx - dx, s.r - r) > 2.6)) {
    spots.push({ dx, r, phase: rnd() * 6.283, period: 2.6 + rnd() * 4.5, tint: rnd() * 6.283, big: rnd() < 0.1 })
  }
}

const BIG = [
  { x: 0.8, s: 7, al: 1, a: 0.06, b: 0.95 },
  { x: 0.93, s: 4, al: 0.6, a: -0.55, b: 1.4 },
  { x: 0.66, s: 3, al: 0.32, a: 0.3, b: 0.55 },
]
const SMALL = [
  { x: 0.8, s: 4, al: 0.45, a: 0.08, b: 0.9 },
  { x: 0.15, s: 3, al: 0.28, a: -0.5, b: 1.3 },
]
const mix = (a, b, t) => a + (b - a) * t

export function startSea(cv) {
  const ctx = cv.getContext('2d')
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  let w = 0, h = 0, dpr = 1, raf = 0, last = 0

  const shark = (c, t, p) => {
    const s = c.s
    const al = c.al * (w < 1200 && w >= 700 ? 0.6 : 1)
    const y0 = Math.round(((c.a + p * c.b) * h) / s) * s
    if (y0 > h || y0 + H * s < 0) return
    const cx = Math.round((w * c.x) / s) * s
    const sw = rows.map((_, r) => (reduce ? 0 : Math.round(Math.sin(t * 0.0016 + r * 0.16) * Math.max(0, (26 - r) / 26) * 2.6)))
    const body = `rgba(120,168,190,${0.2 * al})`
    const edge = `rgba(175,218,232,${0.38 * al})`
    rows.forEach((row, r) => {
      const hw = row.hw + row.fin
      const y = y0 + r * s
      const x0 = cx + (sw[r] - hw) * s
      const wd = (2 * hw + 1) * s
      ctx.fillStyle = body
      if (r < 3) {
        ctx.fillRect(x0, y, (hw - 1) * s, s)
        ctx.fillRect(cx + (sw[r] + 2) * s, y, (hw - 1) * s, s)
      } else ctx.fillRect(x0, y, wd, s)
      ctx.fillStyle = edge
      if (r === H - 1) ctx.fillRect(x0, y, wd, s)
      else {
        ctx.fillRect(x0, y, s, s)
        ctx.fillRect(x0 + wd - s, y, s, s)
      }
    })
    const e = rows[59].hw - 1
    ctx.fillStyle = `rgba(4,24,38,${0.55 * al})`
    ctx.fillRect(cx + (sw[59] - e) * s, y0 + 59 * s, s, s)
    ctx.fillRect(cx + (sw[59] + e) * s, y0 + 59 * s, s, s)
    ctx.fillStyle = edge
    ctx.fillRect(cx + (sw[62] - 6) * s, y0 + 62 * s, 13 * s, s)
    spots.forEach((sp) => {
      const I = 0.5 + 0.5 * Math.sin(((t / 1000) * 6.283) / sp.period + sp.phase)
      const k = I * I
      const m = 0.5 + 0.5 * Math.sin((t / 1000) * 0.15 + sp.tint)
      const R = mix(130, mix(255, 184, m), k), G = mix(175, mix(226, 240, m), k), B = mix(195, mix(160, 255, m), k)
      ctx.fillStyle = `rgba(${R | 0},${G | 0},${B | 0},${al * (0.2 + 0.45 * k)})`
      const z = sp.big ? 2 : 1
      ctx.fillRect(cx + (sp.dx + sw[sp.r]) * s, y0 + sp.r * s, z * s, z * s)
    })
  }

  const draw = (now) => {
    const t = reduce ? 0 : now
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    const max = document.documentElement.scrollHeight - h
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
    ;(w < 700 ? SMALL : BIG).forEach((c) => shark(c, t, p))
  }
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2)
    w = innerWidth
    h = innerHeight
    cv.width = w * dpr
    cv.height = h * dpr
    cv.style.width = w + 'px'
    cv.style.height = h + 'px'
    draw(performance.now())
  }
  const loop = (now) => {
    raf = requestAnimationFrame(loop)
    if (document.hidden || now - last < 33) return
    last = now
    draw(now)
  }
  const onScroll = () => draw(0)
  addEventListener('resize', resize)
  resize()
  if (reduce) addEventListener('scroll', onScroll, { passive: true })
  else raf = requestAnimationFrame(loop)
  return () => {
    cancelAnimationFrame(raf)
    removeEventListener('resize', resize)
    removeEventListener('scroll', onScroll)
  }
}
