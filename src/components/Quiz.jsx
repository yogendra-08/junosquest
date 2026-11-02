import { useEffect, useState } from 'react'
import { Check, X, SkipForward, ChevronLeft, ChevronRight, Menu, RotateCcw, Flag, Home } from 'lucide-react'

const LETTERS = ['A', 'B', 'C', 'D']

function statusClass(rec) {
  if (!rec) return 'idle'
  return rec.status
}

export default function Quiz({ title, onHome, questions, state, stats, onGo, onSubmit, onSkip, onDraft, onFinish, onRestart }) {
  const [open, setOpen] = useState(false)
  const q = questions[state.current]
  const rec = state.records[q.id]
  const graded = rec && rec.status !== 'skipped'
  const selected = graded ? rec.selected : (state.drafts[q.id] || [])
  const pct = Math.round((stats.attempted / stats.total) * 100)

  useEffect(() => { window.scrollTo({ top: 0 }) }, [state.current])

  const toggle = i => {
    if (graded) return
    if (q.multi) onDraft(q.id, selected.includes(i) ? selected.filter(x => x !== i) : [...selected, i])
    else onDraft(q.id, [i])
  }
  const go = i => { onGo(i); setOpen(false) }
  const confirmRestart = () => { if (window.confirm('Restart the quiz? All progress and scores will be erased.')) onRestart() }
  const confirmFinish = () => {
    if (stats.remaining === 0 || window.confirm(`${stats.remaining} question(s) are still unattempted. Finish the quiz anyway?`)) onFinish()
  }

  const optState = i => {
    if (!graded) return selected.includes(i) ? 'selected' : ''
    if (q.answer.includes(i)) return 'right'
    if (selected.includes(i)) return 'wrong'
    return 'dim'
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="icon-btn menu-btn" aria-label="Toggle question list" onClick={() => setOpen(o => !o)}><Menu size={20} /></button>
        <div className="brand">JunosQuest<span className="set-name">{title}</span></div>
        <div className="progress-wrap">
          <div className="progress-label">
            <span>{stats.attempted} / {stats.total} attempted</span>
            <span>Score: <strong>{stats.correct}</strong></span>
          </div>
          <div className="bar"><div style={{ width: pct + '%' }} /></div>
        </div>
      </header>

      <div className="layout">
        <aside className={'sidebar' + (open ? ' open' : '')}>
          <h2>Questions</h2>
          <div className="grid">
            {questions.map((x, i) => (
              <button key={x.id}
                className={`qnum ${statusClass(state.records[x.id])}${i === state.current ? ' current' : ''}`}
                onClick={() => go(i)} aria-label={`Question ${x.id}`} aria-current={i === state.current}>{x.id}</button>
            ))}
          </div>
          <ul className="legend">
            <li><i className="idle" />Not attempted</li>
            <li><i className="correct" />Correct</li>
            <li><i className="incorrect" />Incorrect</li>
            <li><i className="skipped" />Skipped</li>
            <li><i className="idle current" />Current</li>
          </ul>
          <dl className="stats">
            <div><dt>Attempted</dt><dd>{stats.attempted}</dd></div>
            <div><dt>Correct</dt><dd>{stats.correct}</dd></div>
            <div><dt>Incorrect</dt><dd>{stats.incorrect}</dd></div>
            <div><dt>Skipped</dt><dd>{stats.skipped}</dd></div>
            <div><dt>Remaining</dt><dd>{stats.remaining}</dd></div>
          </dl>
          <button className="btn ghost full" onClick={onHome}><Home size={16} /> Question sets</button>
          <button className="btn ghost full gap" onClick={confirmRestart}><RotateCcw size={16} /> Restart quiz</button>
        </aside>
        {open && <div className="scrim" onClick={() => setOpen(false)} />}

        <main className="main">
          <section className="card">
            <div className="q-meta">
              <span>Question {q.id} of {stats.total}</span>
              {q.topic && <span className="tag">{q.topic}</span>}
              {q.multi && <span className="tag">Select {q.answer.length}</span>}
              {rec && rec.status === 'skipped' && <span className="tag warn">Skipped</span>}
            </div>
            {q.intro && <p className="q-intro">{q.intro}</p>}
            {q.code && <pre className="code">{q.code}</pre>}
            <h1 className="q-text">{q.question}</h1>

            <div className="options" role={q.multi ? 'group' : 'radiogroup'}>
              {q.options.map((o, i) => (
                <button key={i} className={'option ' + optState(i)} onClick={() => toggle(i)} disabled={graded}
                  role={q.multi ? 'checkbox' : 'radio'} aria-checked={selected.includes(i)}>
                  <span className="letter">{LETTERS[i]}</span>
                  <span className="o-text">{o}</span>
                  {graded && q.answer.includes(i) && <Check size={18} className="mark ok" />}
                  {graded && !q.answer.includes(i) && selected.includes(i) && <X size={18} className="mark bad" />}
                </button>
              ))}
            </div>

            {graded && (
              <div className={'feedback ' + (rec.status === 'correct' ? 'ok' : 'bad')}>
                <strong>{rec.status === 'correct' ? 'Correct' : 'Incorrect'}</strong>
                <p>Correct answer: {q.answer.map(a => `${LETTERS[a]}. ${q.options[a]}`).join('  |  ')}</p>
                <p className="expl"><b>Explanation:</b> {q.explanation}</p>
              </div>
            )}

            <div className="actions">
              <button className="btn ghost" disabled={state.current === 0} onClick={() => go(state.current - 1)}><ChevronLeft size={16} /> Previous</button>
              {!graded && (
                <>
                  <button className="btn primary" disabled={selected.length === 0} onClick={() => onSubmit(q, selected)}>Submit</button>
                  <button className="btn outline" onClick={() => onSkip(q)}><SkipForward size={16} /> Skip</button>
                </>
              )}
              {graded && state.current < questions.length - 1 && (
                <button className="btn primary" onClick={() => go(state.current + 1)}>Next <ChevronRight size={16} /></button>
              )}
              <button className="btn finish" onClick={confirmFinish}><Flag size={16} /> Finish quiz</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
