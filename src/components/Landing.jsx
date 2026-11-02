import { BookOpenCheck, Github } from 'lucide-react'

export default function Landing({ onContinue }) {
  return (
    <main className="landing">
      <div className="landing-card">
        <div className="logo"><BookOpenCheck size={28} /></div>
        <h1>JunosQuest</h1>
        <p className="subtitle">JNCIA-Junos Practice &amp; Revision</p>
        <p className="lead">
          A focused practice platform for personal study and exam preparation. Work through
          multiple-choice questions, get instant feedback with explanations, and track your score.
        </p>
        <p className="disclaimer">
          <strong>Disclaimer:</strong> This website is created solely for educational and personal practice
          purposes. It is an independent practice platform and is not officially affiliated with or endorsed
          by Juniper Networks. Questions are provided for learning and revision.
        </p>
        <button className="btn primary big" onClick={onContinue}>
          Continue
        </button>
        <a className="gh" href="https://github.com/yogendra-08" target="_blank" rel="noopener noreferrer">
          <Github size={18} /> github.com/yogendra-08
        </a>
      </div>
    </main>
  )
}
