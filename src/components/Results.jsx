import { RotateCcw, ArrowLeft } from 'lucide-react'

export default function Results({ stats, onReview, onRestart }) {
  const acc = stats.attempted ? Math.round((stats.correct / stats.attempted) * 1000) / 10 : 0
  const items = [
    ['Correct', stats.correct, 'correct'], ['Incorrect', stats.incorrect, 'incorrect'],
    ['Skipped', stats.skipped, 'skipped'], ['Unanswered', stats.unanswered, 'idle'],
  ]
  return (
    <main className="landing">
      <div className="landing-card results">
        <h1>Quiz results</h1>
        <p className="big-score">{stats.correct} <span>/ {stats.total}</span></p>
        <p className="subtitle">Accuracy: {acc}% of attempted questions ({stats.attempted} attempted)</p>
        <div className="res-grid">
          {items.map(([l, v, c]) => (
            <div key={l} className="res-item"><i className={c} /><span>{l}</span><strong>{v}</strong></div>
          ))}
        </div>
        <div className="actions center">
          <button className="btn outline" onClick={onReview}><ArrowLeft size={16} /> Review questions</button>
          <button className="btn primary" onClick={() => { if (window.confirm('Restart the quiz? All progress and scores will be erased.')) onRestart() }}>
            <RotateCcw size={16} /> Restart quiz
          </button>
        </div>
      </div>
    </main>
  )
}
