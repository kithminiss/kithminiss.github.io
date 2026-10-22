import { useEffect, useMemo, useRef, useState } from 'react'
import { marked } from 'marked'
import { startSea } from './sea.js'
import { links, hi, sub, projects, pinned, cs, csSlots, cloud, marketing, communities } from './data.js'

const raw = import.meta.glob('./posts/*.md', { query: '?raw', import: 'default', eager: true })
const posts = Object.entries(raw)
  .filter(([k]) => !k.split('/').pop().startsWith('_'))
  .map(([k, src]) => {
    const text = src.replace(/\r\n/g, '\n')
    const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text)
    const meta = {}
    if (m) m[1].split('\n').forEach((l) => { const i = l.indexOf(':'); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim() })
    return { slug: k.split('/').pop().replace(/\.md$/, ''), title: meta.title || 'untitled', date: meta.date || '', summary: meta.summary || '', html: marked.parse(m ? m[2] : text) }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

const split = (w) => (typeof Intl !== 'undefined' && Intl.Segmenter ? [...new Intl.Segmenter('si', { granularity: 'grapheme' }).segment(w)].map((x) => x.segment) : Array.from(w))

function Hi() {
  const words = useMemo(() => hi.map(split), [])
  const reduce = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const [i, setI] = useState(0)
  const [n, setN] = useState(words[0].length)
  const [del, setDel] = useState(false)

  useEffect(() => {
    const w = words[i]
    let t
    if (reduce) t = setTimeout(() => { const j = (i + 1) % words.length; setI(j); setN(words[j].length) }, 2400)
    else if (!del && n < w.length) t = setTimeout(() => setN(n + 1), 95)
    else if (!del) t = setTimeout(() => setDel(true), 2200)
    else if (n > 0) t = setTimeout(() => setN(n - 1), 45)
    else t = setTimeout(() => { setDel(false); setI((i + 1) % words.length) }, 250)
    return () => clearTimeout(t)
  }, [i, n, del, words, reduce])

  return (
    <span className="hi">
      <span className="word">{words[i].slice(0, n).join('')}</span>
      <span className="caret" />,
    </span>
  )
}

function Item({ p, compact }) {
  return (
    <article className="item">
      <h3>{p.name}</h3>
      <p>{compact ? p.short : p.text}</p>
      {!compact && p.extra && <p className="todo">{p.extra}</p>}
      {!compact && <p className="tags">{p.stack}</p>}
      {p.links && (
        <p className="links">
          {p.links.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>)}
        </p>
      )}
    </article>
  )
}

const Slot = ({ children }) => <div className="item slot"><p>{children}</p></div>

function Head({ depth, children }) {
  return (
    <>
      <p className="depth">{depth}</p>
      <h2>{children}</h2>
    </>
  )
}


// pixel fishing hook: the line lengthens as you scroll, the hook sits at the bottom, click it to go back up
const HOOK = ['..X.....', '..X.....', '..X.....', '..X...X.', '..X..XX.', '..X...X.', '..X...X.', '..XX.X..', '...XXX..']
const PX = 4

function Hook() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const f = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
      setY(Math.round((p * (innerHeight - HOOK.length * PX - 28)) / PX) * PX)
    }
    f()
    addEventListener('scroll', f, { passive: true })
    addEventListener('resize', f)
    return () => { removeEventListener('scroll', f); removeEventListener('resize', f) }
  }, [])
  const up = () => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  return (
    <div className="hookbar" style={{ width: 8 * PX }}>
      <div className="thread" style={{ left: 2 * PX, width: PX, height: y + PX }} />
      <button className="hook" onClick={up} aria-label="back to top" style={{ top: y, width: 8 * PX, height: HOOK.length * PX }}>
        <svg width={8 * PX} height={HOOK.length * PX} shapeRendering="crispEdges" fill="currentColor" aria-hidden="true">
          {HOOK.flatMap((row, r) => [...row].map((c, k) => (c === 'X' ? <rect key={r + '-' + k} x={k * PX} y={r * PX} width={PX} height={PX} /> : null)))}
        </svg>
        <span className="hooklabel">top</span>
      </button>
    </div>
  )
}

function Home() {
  return (
    <>
      <section className="hero">
        <h1 className="sr">hi, i’m kithmini</h1>
        <p className="big" aria-hidden="true">
          <Hi />
          <br />
          <span>i’m kithmini</span>
        </p>
        <p className="sub">{sub}</p>
        <p className="label">pinned</p>
        {pinned.map((k, idx) => (k ? <Item key={k} p={projects[k]} compact /> : <Slot key={idx}>[pin a third project here]</Slot>))}
      </section>

      <section id="cs">
        <Head depth="10m">computer science</Head>
        <p className="intro">frontend, software engineering, and whatever else gets built in class or outside it.</p>
        {cs.map((k) => <Item key={k} p={projects[k]} />)}
        {csSlots.map((s) => <Slot key={s}>coming: {s}</Slot>)}
      </section>

      <section id="cloud">
        <Head depth="40m">cloud and devops</Head>
        <p className="intro">this is where i’m heading. the projects below are how i’m getting there, in the order i’m doing them.</p>
        <Item p={projects.sentinel} />
        {cloud.map((c) => (
          <details className={c.done ? 'item plan done' : 'item plan'} key={c.name}>
            <summary>
              <span className="pname">{c.name}</span>
              <span className="pstatus">{c.done ? 'done' : c.status}</span>
            </summary>
            <p>{c.line}</p>
            <ol>{c.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            <p className="tags">{c.stack}. {c.time}.</p>
            {c.links && <p className="links">{c.links.map(([l, h]) => <a key={l} href={h} target="_blank" rel="noreferrer">{l}</a>)}</p>}
          </details>
        ))}
      </section>

      <section id="marketing">
        <Head depth="90m">marketing</Head>
        <p className="intro">{marketing}</p>
        <p className="label">blog</p>
        {posts.length ? (
          posts.map((p) => (
            <article className="item" key={p.slug}>
              <h3><a href={'#/blog/' + p.slug}>{p.title}</a></h3>
              <p>{p.summary}</p>
              <p className="tags">{p.date}</p>
            </article>
          ))
        ) : (
          <Slot>first post soon.</Slot>
        )}
      </section>

      <section id="me">
        <Head depth="200m">me</Head>
        <p className="intro">the part nobody asked for, and my favourite.</p>
        <p className="line"><i className="rec" /> i vlog. camera on, yapping. none of it is public. it’s my guilty pleasure.</p>
        <p className="line">i value community. being vice chairperson of women in foss at mozilla campus club means a lot to me, personally.</p>
        <p className="label">clubs and societies</p>
        {communities.map(([name, role]) => (
          <p className="club" key={name}><span>{name}</span>{role && <span className="muted">{role}</span>}</p>
        ))}
      </section>

      <section id="contact">
        <p className="depth">bottom</p>
        <h2>say hi</h2>
        <a className="mail" href={'mailto:' + links.email}>{links.email}</a>
        <p className="links">
          <a href={links.linkedin} target="_blank" rel="noreferrer">linkedin</a>
          <a href={links.github} target="_blank" rel="noreferrer">github</a>
          <a href={links.resume} target="_blank" rel="noreferrer">resume (pdf)</a>
        </p>
      </section>
    </>
  )
}

function Post({ slug }) {
  const p = posts.find((x) => x.slug === slug)
  return (
    <section className="post">
      <p className="links"><a href="#/">← back</a></p>
      {p ? (
        <>
          <h1>{p.title}</h1>
          <p className="tags">{p.date}</p>
          <div dangerouslySetInnerHTML={{ __html: p.html }} />
        </>
      ) : (
        <p>couldn’t find that post.</p>
      )}
    </section>
  )
}

export default function App() {
  const cv = useRef(null)
  const [hash, setHash] = useState(location.hash)
  useEffect(() => startSea(cv.current), [])
  useEffect(() => {
    const f = () => setHash(location.hash)
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])
  const slug = hash.startsWith('#/blog/') ? hash.slice(7) : null
  useEffect(() => {
    if (!slug && hash.length > 2 && !hash.startsWith('#/')) document.querySelector(hash)?.scrollIntoView()
    if (slug) scrollTo(0, 0)
  }, [slug, hash])

  return (
    <>
      <canvas ref={cv} className="sea" aria-hidden="true" />
      <Hook />
      <div className="wrap">
        <header className="top">
          <a href="#/" className="name">kithmini</a>
          <nav>
            <a href="#cs">cs</a>
            <a href="#cloud">cloud</a>
            <a href="#marketing">marketing</a>
            <a href="#me">me</a>
            <a href={links.resume} target="_blank" rel="noreferrer">resume</a>
          </nav>
        </header>
        <main>{slug ? <Post slug={slug} /> : <Home />}</main>
        <footer>kithmini bandhusena</footer>
      </div>
    </>
  )
}
