/**
 * Daily notes pinned to the home page — one per day, rotating
 * deterministically so the same day always shows the same note.
 * Tone: a warm note-to-self in the notebook, never a corporate poster.
 * (App-level copy stays notebook-branded — "the shop" belongs to Phase 3.)
 */

const MESSAGES: string[] = [
  'Twenty focused minutes beats three distracted hours. You showed up — that’s the whole game.',
  'Every expert was once confused by exactly the things confusing you today. They just kept coming back.',
  'You don’t memorize JavaScript. You visit it every day until it moves in.',
  'Confusion is the feeling of a brain making room. Uncomfortable, and exactly right.',
  'Slow is smooth, smooth is fast. Nobody speed-ran their way to understanding closures.',
  'The console doesn’t judge you. It just answers. Ask it something today.',
  'A streak isn’t about pride — it’s about making tomorrow’s session easier to start.',
  'Real developers google the syntax. What they carry in their heads is the *picture* — and pictures are exactly what you’re collecting.',
  'One lesson today is one less thing that can ever intimidate you again.',
  'Your future self is already thanking you for the boring, faithful days like this one.',
  'Typing code with your own fingers is the difference between reading about swimming and getting wet.',
  'Bugs are not verdicts. They’re the machine saying “almost — look here.”',
  'The tortoise wins because the hare’s motivation ran out. Systems beat moods.',
  'If today you only understand one thing deeply, that’s a better day than ten things vaguely.',
  'Playwright, promises, prototypes — every scary word on the map is built from things you already know.',
  'You’re not “still learning the basics.” You’re pouring the foundation everything else stands on.',
  'The best testers aren’t the ones who never break things — they’re the ones who understand *why* things break.',
  'Rosa doesn’t type greetings anymore. Automate the boring stuff — starting with your own doubts.',
  'Missed a day? Streaks bend, they don’t shatter. The comeback session counts double in spirit.',
  'Explaining a concept to someone else is the final boss. Every teach-back is a practice round.',
  'undefined is not a personal attack.',
  'You will forget things. That’s not failure — that’s the signal to revisit, and revisits are where memory is made.',
  'Small daily wins compound like interest. Today’s deposit: one lesson.',
  'The gap between “I watched it” and “I built it” is where careers are made. Build today.',
  'Nobody’s first FizzBuzz was pretty. Nobody’s hundredth was hard.',
  'A function you wrote yourself is worth ten you only read about.',
  'Learning to code is mostly learning to stay calm while being wrong. You’re training both.',
  'The machine does exactly what you say — which means every bug is a conversation, not a mystery.',
  'Six months from now you’ll debug something at work and quietly smile, remembering this exact chapter.',
  'Don’t compare your chapter 3 to someone else’s chapter 30. Your notebook is filling at exactly the right speed.',
  'Curiosity beats discipline on the good days. Discipline covers the rest. You only need one of them per day.',
  'Read error messages like letters from a pen pal: they’re oddly formal, but they’re trying to help.',
  'Every “aha!” you’ve had lives in your notebook now. You’re not just learning — you’re writing your own textbook.',
  'The keyboard is a piano. Scales first, symphonies later — but you have to touch the keys every day.',
  'One day the job title changes to “automation tester” — and it will trace back to unglamorous sessions exactly like this one.',
  'Strong opinions about semicolons can wait. Understanding what a call stack is cannot. You’re prioritizing right.',
]

/** Doodle stickers that rotate alongside the messages. */
export type DoodleKind = 'coffee' | 'bulb' | 'sprout' | 'flag' | 'turtle' | 'spark'
const DOODLES: DoodleKind[] = ['coffee', 'bulb', 'sprout', 'flag', 'turtle', 'spark']

/** The note (message + doodle) for a local day — stable all day, new tomorrow. */
export function dailyNote(day: string): { text: string; doodle: DoodleKind } {
  let hash = 0
  for (let i = 0; i < day.length; i++) hash = (hash * 31 + day.charCodeAt(i)) >>> 0
  return { text: MESSAGES[hash % MESSAGES.length], doodle: DOODLES[hash % DOODLES.length] }
}
