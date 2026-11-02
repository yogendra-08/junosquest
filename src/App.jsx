import { useEffect, useState } from 'react'
import { BANKS } from './banks.js'
import Landing from './components/Landing.jsx'
import Select from './components/Select.jsx'
import QuizSession from './components/QuizSession.jsx'

const VIEW_KEY = 'junosquest-view'

function loadView() {
  try {
    const v = localStorage.getItem(VIEW_KEY)
    if (v === 'select' || BANKS.some(b => b.id === v)) return v
  } catch (e) { /* ignore */ }
  return 'landing'
}

export default function App() {
  const [view, setView] = useState(loadView)
  useEffect(() => {
    try { localStorage.setItem(VIEW_KEY, view) } catch (e) { /* storage unavailable */ }
  }, [view])

  if (view === 'landing') return <Landing onContinue={() => setView('select')} />
  if (view === 'select') return <Select banks={BANKS} onPick={setView} onBack={() => setView('landing')} />
  const bank = BANKS.find(b => b.id === view)
  return <QuizSession key={bank.id} bank={bank} onHome={() => setView('select')} />
}
