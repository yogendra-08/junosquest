import { ArrowLeft, ListChecks } from 'lucide-react'

function progress(bank) {
  try {
    const s = JSON.parse(localStorage.getItem(bank.storageKey))
    const recs = Object.values((s && s.records) || {})
    return recs.filter(r => r.status !== 'skipped').length
  } catch (e) { return 0 }
}

export default function Select({ banks, onPick, onBack }) {
  return (
    <main className="landing">
      <div className="landing-card wide">
        <h1>Choose a question set</h1>
        <p className="subtitle">Each set keeps its own progress and score.</p>
        <div className="sets">
          {banks.map(b => {
            const done = progress(b)
            return (
              <button key={b.id} className="set-card" onClick={() => onPick(b.id)}>
                <ListChecks size={24} />
                <h2>{b.title}</h2>
                <p>{b.desc}</p>
                <span className="tag">{b.questions.length} questions{done ? ` · ${done} attempted` : ''}</span>
              </button>
            )
          })}
        </div>
        <button className="btn ghost" onClick={onBack}><ArrowLeft size={16} /> Back</button>
      </div>
    </main>
  )
}
