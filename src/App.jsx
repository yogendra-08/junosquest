import { useEffect, useMemo, useState } from 'react'
import questions from './data/questions.json'
import Landing from './components/Landing.jsx'
import Quiz from './components/Quiz.jsx'
import Results from './components/Results.jsx'

const KEY = 'junosquest-progress-v1'
const TOTAL = questions.length
const fresh = { screen: 'landing', current: 0, records: {}, drafts: {} }

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s && ['landing', 'quiz', 'results'].includes(s.screen)) return { ...fresh, ...s }
  } catch (e) { /* ignore corrupt storage */ }
  return fresh
}

export default function App() {
  const [state, setState] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch (e) { /* storage unavailable */ }
  }, [state])

  // records[id] = { status: 'correct' | 'incorrect' | 'skipped', selected: number[] }
  const stats = useMemo(() => {
    const vals = Object.values(state.records)
    const correct = vals.filter(r => r.status === 'correct').length
    const incorrect = vals.filter(r => r.status === 'incorrect').length
    const skipped = vals.filter(r => r.status === 'skipped').length
    const attempted = correct + incorrect
    return { correct, incorrect, skipped, attempted, remaining: TOTAL - attempted,
      unanswered: TOTAL - attempted - skipped, total: TOTAL }
  }, [state.records])

  const set = patch => setState(s => ({ ...s, ...patch }))

  const submit = (q, selected) => setState(s => {
    if (s.records[q.id] && s.records[q.id].status !== 'skipped') return s // already graded: no re-scoring
    const ok = selected.length === q.answer.length && q.answer.every(a => selected.includes(a))
    return { ...s, records: { ...s.records, [q.id]: { status: ok ? 'correct' : 'incorrect', selected } } }
  })

  const skip = q => setState(s => {
    const prev = s.records[q.id]
    const records = prev && prev.status !== 'skipped' ? s.records : { ...s.records, [q.id]: { status: 'skipped', selected: [] } }
    return { ...s, records, current: Math.min(s.current + 1, TOTAL - 1) }
  })

  const setDraft = (id, selected) => setState(s => ({ ...s, drafts: { ...s.drafts, [id]: selected } }))
  const restart = () => setState({ ...fresh, screen: 'quiz' })

  if (state.screen === 'landing') {
    const started = Object.keys(state.records).length > 0
    return <Landing hasProgress={started} onContinue={() => set({ screen: 'quiz' })} />
  }
  if (state.screen === 'results') {
    return <Results stats={stats} onReview={() => set({ screen: 'quiz' })} onRestart={restart} />
  }
  return (
    <Quiz questions={questions} state={state} stats={stats}
      onGo={i => set({ current: i })} onSubmit={submit} onSkip={skip} onDraft={setDraft}
      onFinish={() => set({ screen: 'results' })} onRestart={restart} />
  )
}
