import mainQuestions from './data/questions.json'
import extraQuestions from './data/questions2.json'

// Each bank has its own saved progress (storageKey) so scores never mix.
export const BANKS = [
  { id: 'main', title: 'Core Practice Set', desc: 'The original 128 JNCIA-Junos questions with explanations.',
    storageKey: 'junosquest-progress-v1', questions: mainQuestions },
  { id: 'extra', title: 'Topic Practice Set', desc: 'Extra questions grouped by topic: commit, rollback, routing, subnetting, interfaces, policy, and more.',
    storageKey: 'junosquest-progress-extra-v1', questions: extraQuestions },
]
