import { findLesson } from './registry'

/**
 * The returning-learner recall bank. Distinct from each lesson's "🎤 in an
 * interview" teaching card (def.interview) — these are self-rated questions a
 * returning learner is asked on topics they already completed. Not graded.
 * Content rules: simplest English, no em dashes, curly apostrophes, only
 * vocabulary taught by the keyed lesson. Coding questions are NOT auto-checked;
 * the learner reveals the worked answer and rates their own confidence.
 */
export interface InterviewQuestion {
  /** stable, unique id */
  id: string
  /** the lesson that equips the learner to answer; eligible once it is completed */
  lessonId: string
  /** 'oral' = explain out loud; 'coding' = read or write a snippet */
  type: 'oral' | 'coding'
  difficulty: 'straightforward' | 'tricky'
  /** the interviewer's question */
  prompt: string
  /** optional snippet shown with the prompt (coding questions). Use \n for line breaks. */
  code?: string
  /** the model answer, revealed after the learner has thought about it */
  answer: string
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ── Phase 1 — Values & Variables ────────────────────────────────
  {
    id: 'iq-1.1-value-type',
    lessonId: '1.1',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is a value in JavaScript, and what do we mean when we say every value has a type?',
    answer:
      'A value is a single piece of data the program remembers, like the number 7 or the text "hi". Every value has a type, which is the kind of thing it is. The type decides what you are allowed to do with the value. You can multiply two numbers, but multiplying two words has no clear meaning.',
  },
  {
    id: 'iq-1.2-variable-slot',
    lessonId: '1.2',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What really happens in memory when you write let score = 10?',
    answer:
      'The computer sets aside a slot in memory and puts the value 10 inside it. Then it ties the name score to that slot, like a label. When you later use score, the computer follows the label to the slot and reads what is inside.',
  },
  {
    id: 'iq-1.3-reassign',
    lessonId: '1.3',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print, and why?',
    code: 'let n = 5\nn = n + 3\nconsole.log(n)',
    answer:
      'It prints 8. The right side n + 3 is worked out first using the current value 5, which gives 8. That result is then put back into the same slot n. The label did not move. Only the contents were swapped.',
  },
  {
    id: 'iq-1.4-let-const',
    lessonId: '1.4',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is the difference between let and const?',
    answer:
      'let makes a label you can point at a new value later. const makes a label you cannot re-point once it is set. const locks the label to one slot, not the contents of that slot. Use const by default and reach for let only when you know the label needs to change.',
  },
  {
    id: 'iq-1.4-const-object',
    lessonId: '1.4',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'A colleague says "const means the value can never change." Are they right?',
    answer:
      'Not quite. const locks the label so you cannot point it at a different slot. For a simple value like a number, that does feel like the value cannot change. But const stops re-pointing, not editing. This matters more later once values can hold other values inside them. The one firm rule is that a const label cannot be reassigned.',
  },
  {
    id: 'iq-1.5-float',
    lessonId: '1.5',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does 0.1 + 0.2 give in JavaScript, and why is it not exactly 0.3?',
    code: 'console.log(0.1 + 0.2)',
    answer:
      'It prints 0.30000000000000004. Numbers are stored in a binary form that cannot hold 0.1 or 0.2 exactly, the same way one third cannot be written exactly as a decimal. The tiny rounding errors add up and show. When you need an exact check, compare with a small tolerance or work in whole units like paise or cents.',
  },
  {
    id: 'iq-1.6-string-index',
    lessonId: '1.6',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const word = "hello"\nconsole.log(word[0], word.length)',
    answer:
      'It prints h 5. A string is a run of characters, each with a position that starts at 0. So word[0] is the first character, h. length is how many characters there are, which is 5. The last character sits at length minus one.',
  },
  {
    id: 'iq-1.7-null-undefined',
    lessonId: '1.7',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is the difference between null and undefined?',
    answer:
      'undefined means a value was never set. The computer gives it to you when nothing has been put in a slot yet. null means empty on purpose. You write null yourself to say "there is deliberately nothing here." So undefined is usually the computer speaking, and null is usually you speaking.',
  },
  {
    id: 'iq-1.8-typeof',
    lessonId: '1.8',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does typeof do here, and what prints?',
    code: 'let x = 42\nx = "now text"\nconsole.log(typeof x)',
    answer:
      'It prints string. typeof reports the type of the value a variable currently points at. JavaScript is dynamically typed, so the same variable can point at a number and later at a string. The type belongs to the value, not to the variable.',
  },
  {
    id: 'iq-1.9-equality',
    lessonId: '1.9',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What is the difference between == and ===, and what does each of these print?',
    code: 'console.log(0 == "0")\nconsole.log(0 === "0")',
    answer:
      'The first prints true and the second prints false. == converts the two sides to the same type before comparing, so the number 0 and the text "0" are treated as equal. === checks the type as well as the value, and a number is not the same type as a string, so it is false. Prefer === so nothing is converted behind your back.',
  },
  {
    id: 'iq-1.10-operator-order',
    lessonId: '1.10',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print, and which part runs first?',
    code: 'console.log(2 + 3 * 4)',
    answer:
      'It prints 14. Multiplication runs before addition, so 3 * 4 is worked out first to give 12, then 2 is added. An expression is like a small tree, and the values bubble up from the deepest parts first.',
  },
  {
    id: 'iq-1.11-template',
    lessonId: '1.11',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const name = "Sam"\nconst age = 3\nconsole.log(`${name} is ${age}`)',
    answer:
      'It prints Sam is 3. Backticks make a template string. Anything inside the ${ } is worked out and its value is dropped into the text. It is a cleaner way to join text and values than adding strings with plus signs.',
  },
]

/**
 * Questions the learner is eligible for: keyed lesson is completed and is in a
 * phase past 0 (phase 0 is never quizzed). Phase is read from the registry.
 */
export function questionsForCompleted(completed: Record<string, string>): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => {
    if (!completed[q.lessonId]) return false
    const phase = findLesson(q.lessonId)?.phase ?? 0
    return phase >= 1
  })
}
