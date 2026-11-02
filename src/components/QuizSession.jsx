import { useEffect, useMemo, useState } from 'react'
import Quiz from './Quiz.jsx'
import Results from './Results.jsx'

const fresh = { screen: 'quiz', current: 0, records: {}, drafts: {} }

function load(key) {
  try {
    const s = JSON.parse(localStorage.getItem(key))
    if (s && typeof s === 'object') return { ...fresh, ...s, screen: s.screen === 'results' ? 'results' : 'quiz' }
  } catch (e) { /* ignore corrupt storage */ }
  return fresh
}

export default function QuizSession({ bank, onHome }) {
  const questions = bank.questions
  const TOTAL = questions.length
  const KEY = bank.storageKey
  const [state, setState] = useState(() => load(KEY))

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch (e) { /* storage unavailable */ }
  }, [state, KEY])

  // records[id] = { status: 'correct' | 'incorrect' | 'skipped', selected: number[] }
  const stats = useMemo(() => {
    const vals = Object.values(state.records)
    const correct = vals.filter(r => r.status === 'correct').length
    const incorrect = vals.filter(r => r.status === 'incorrect').length
    const skipped = vals.filter(r => r.status === 'skipped').length
    const attempted = correct + incorrect
    return { correct, incorrect, skipped, attempted, remaining: TOTAL - attempted,
      unanswered: TOTAL - attempted - skipped, total: TOTAL }
  }, [state.records, TOTAL])

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

  if (state.screen === 'results') {
    return <Results stats={stats} onHome={onHome} onReview={() => set({ screen: 'quiz' })} onRestart={restart} />
  }
  return (
    <Quiz title={bank.title} onHome={onHome} questions={questions} state={state} stats={stats}
      onGo={i => set({ current: i })} onSubmit={submit} onSkip={skip} onDraft={setDraft}
      onFinish={() => set({ screen: 'results' })} onRestart={restart} />
  )
}
