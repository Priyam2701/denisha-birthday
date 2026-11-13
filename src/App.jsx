import { useEffect, useRef, useState } from 'react'
import { config } from './config.js'

/* Reveal-on-scroll wrapper */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold: 0.15 }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* Photo with graceful gold placeholder if the file is missing */
function Photo({ src, alt, className = '' }) {
  const [ok, setOk] = useState(true)
  return ok ? (
    <img className={className} src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />
  ) : (
    <div className={`ph ${className}`}><span>{config.name[0]}</span></div>
  )
}

/* Floating gold dust + music notes */
function Ambient() {
  const items = Array.from({ length: 26 }, (_, i) => ({
    left: (i * 37) % 100,
    size: 6 + ((i * 7) % 14),
    dur: 12 + ((i * 5) % 14),
    delay: -((i * 3) % 20),
    note: i % 4 === 0,
    glyph: ['♪', '♫', '♩'][i % 3],
  }))
  return (
    <div className="ambient" aria-hidden>
      {items.map((p, i) =>
        p.note ? (
          <span key={i} className="note" style={{ left: `${p.left}%`, fontSize: p.size + 12, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}>{p.glyph}</span>
        ) : (
          <span key={i} className="dust" style={{ left: `${p.left}%`, width: p.size / 2, height: p.size / 2, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} />
        )
      )}
    </div>
  )
}

/* Canvas confetti burst in gold tones */
function burst(canvas) {
  const ctx = canvas.getContext('2d')
  canvas.width = innerWidth; canvas.height = innerHeight
  const cols = ['#d4af37', '#f1d98a', '#b8902a', '#fff3c4']
  const ps = Array.from({ length: 170 }, () => ({
    x: innerWidth / 2, y: innerHeight * 0.6,
    vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 18 - 4,
    s: Math.random() * 7 + 3, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
    c: cols[(Math.random() * cols.length) | 0],
  }))
  let t = 0
  ;(function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ps.forEach(p => {
      p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += p.vr
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r)
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore()
    })
    if (++t < 220) requestAnimationFrame(frame)
    else ctx.clearRect(0, 0, canvas.width, canvas.height)
  })()
}

function Cake() {
  const [lit, setLit] = useState(true)
  const canvas = useRef(null)
  const blow = () => {
    if (!lit) { setLit(true); return }
    setLit(false)
    burst(canvas.current)
  }
  return (
    <div className="cake-wrap">
      <canvas ref={canvas} className="confetti" />
      <button className="cake" onClick={blow} aria-label="Blow the candles">
        <div className="candles">
          {[0, 1, 2].map(i => (
            <div key={i} className="candle">
              <span className={`flame ${lit ? 'on' : ''}`} style={{ animationDelay: `${i * 0.2}s` }} />
              <span className="wick" />
            </div>
          ))}
        </div>
        <div className="tier t1" /><div className="tier t2" /><div className="plate" />
      </button>
      <p className="hint">{lit ? 'Tap the cake & make a wish' : '✦ May every wish come true ✦  (tap to relight)'}</p>
    </div>
  )
}

export default function App() {
  const [opened, setOpened] = useState(false)
  useEffect(() => { document.body.style.overflow = opened ? '' : 'hidden' }, [opened])

  return (
    <>
      <Ambient />

      {/* Intro curtain */}
      <div className={`curtain ${opened ? 'open' : ''}`}>
        <div className="panel l" /><div className="panel r" />
        <button className="enter" onClick={() => setOpened(true)}>
          <span className="mono">{config.name[0]}</span>
          <span>A gift for {config.name}</span>
          <small>Tap to open</small>
        </button>
      </div>

      {/* Hero */}
      <header className="hero">
        <div className="ring">
          <Photo src={config.heroPhoto} alt={config.name} className="hero-photo" />
        </div>
        <p className="gu">{config.gujaratiGreeting}</p>
        <h1 className="title">
          <span className="script">Happy Birthday</span>
          <span className="name">{config.name}</span>
        </h1>
        <p className="tag">{config.tagline}</p>
        <div className="scroll">⌄</div>
      </header>

      {/* Tribute */}
      <section className="sec tribute">
        <Reveal><p className="eyebrow">The Voice of Gujarat</p></Reveal>
        <Reveal delay={100}>
          <h2>
            Happy Birthday, <em>{config.name}</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="lead">
            {config.name}, the celebrated Gujarati singer whose voice fills every home and every garba night with song —
            warm birthday wishes from {config.from}.
          </p>
        </Reveal>
        <div className="wishes">
          {config.wishes.map((w, i) => (
            <Reveal key={w.title} delay={i * 150} className="wish">
              <span className="ico">{w.icon}</span>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="sec gallery">
        <Reveal><p className="eyebrow">Moments</p></Reveal>
        <Reveal delay={100}><h2>A Gallery of <em>Grace</em></h2></Reveal>
        <div className="grid">
          {config.photos.map((p, i) => (
            <Reveal key={i} delay={(i % 3) * 120} className={`frame f${i % 3}`}>
              <Photo src={p.src} alt={p.caption} />
              <span className="cap">{p.caption}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Letter */}
      <section className="sec letter">
        <Reveal><p className="eyebrow">A note from the heart</p></Reveal>
        <div className="paper">
          {config.letter.map((l, i) => (
            <Reveal key={i} delay={i * 250}><p>{l}</p></Reveal>
          ))}
          <Reveal delay={800}><p className="sign">With love,<br /><span>{config.from}</span></p></Reveal>
        </div>
      </section>

      {/* Cake */}
      <section className="sec cake-sec">
        <Reveal><h2>Make a <em>Wish</em></h2></Reveal>
        <Cake />
      </section>

      <footer>
        <p className="script">Happy Birthday, {config.name} ♡</p>
        <small>From {config.from}</small>
      </footer>
    </>
  )
}
