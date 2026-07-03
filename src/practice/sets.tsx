import type { CodeExerciseDef } from '../engine/practice/types'

/**
 * Practice bays: cumulative write-real-code drills, unlocked roughly every
 * two lessons. LeetCode-style: story → precise requirements (the WHAT, never
 * the how) → exact expected output. Validation checks output AND required
 * syntax, so the learner practices writing JavaScript — not recognizing it.
 * Exercises only use concepts already taught by their `bestAfter` point.
 */

export interface PracticeSet {
  id: string
  phase: number
  title: string
  blurb: string
  /** Human hint like "1.4" — do this drill after that lesson. */
  bestAfter: string
  exercises: CodeExerciseDef[]
}

export const PRACTICE_SETS: PracticeSet[] = [
  // ── Phase 1 ─────────────────────────────────────────────────────────────
  {
    id: 'drill-1a',
    phase: 1,
    title: 'Drill: your first variables',
    blurb: 'Store things, change things, and pick let vs const like you mean it.',
    bestAfter: '1.4',
    exercises: [
      {
        id: 'd1a-message',
        title: 'store a message',
        task: 'Make the program remember a message, say it, then change its mind and say the new one.',
        steps: [
          <>
            The variable must be named <code>message</code> and first hold exactly{' '}
            <code>"Hello, machine!"</code>, later exactly <code>"Goodbye, machine!"</code>.
          </>,
          <>
            It must be the <strong>same variable</strong> both times — creating a second variable
            is not allowed.
          </>,
          <>
            Both printed lines must come from printing the variable — printing the text directly is
            not allowed.
          </>,
        ],
        starter: '',
        expectedOutput: ['Hello, machine!', 'Goodbye, machine!'],
        mustUse: [
          { test: /let\s+message\s*=/, label: 'message is created with a keyword that allows change' },
          { test: /message\s*=\s*["']Goodbye, machine!["']/, label: 'the SAME variable is given the new text' },
          { test: /console\.log\s*\(\s*message\s*\)/, label: 'the variable itself is printed' },
        ],
        mustNotUse: [
          { test: /const\s+message/, label: 'const welds the label shut — this message must change' },
          { test: /console\.log\s*\(\s*["']/, label: 'print the variable, not the raw text' },
        ],
        modelAnswer: `let message = "Hello, machine!";
console.log(message);

message = "Goodbye, machine!";
console.log(message);`,
      },
      {
        id: 'd1a-right-keyword',
        title: 'the right keyword for the job',
        task: 'Two facts to store: one will never change, one changes all the time. Picking the right keyword for each — that IS the exercise.',
        steps: [
          <>
            A variable named <code>name</code> holds <code>"Lijas"</code>. A person’s name doesn’t
            change.
          </>,
          <>
            A variable named <code>mood</code> starts as <code>"sleepy"</code> — and later becomes{' '}
            <code>"curious"</code> (the coffee kicked in).
          </>,
          <>
            Print <code>name</code>, then the final <code>mood</code> — in that order.
          </>,
        ],
        starter: '',
        expectedOutput: ['Lijas', 'curious'],
        mustUse: [
          { test: /const\s+name\s*=\s*["']Lijas["']/, label: 'the never-changing name uses the permanent keyword' },
          { test: /let\s+mood\s*=\s*["']sleepy["']/, label: 'the changing mood uses the changeable keyword' },
          { test: /mood\s*=\s*["']curious["']/, label: 'mood actually changes to "curious"' },
        ],
        mustNotUse: [{ test: /const\s+mood/, label: 'const mood would throw a TypeError the moment it changes' }],
        modelAnswer: `const name = "Lijas";
let mood = "sleepy";

mood = "curious";

console.log(name);
console.log(mood);`,
      },
      {
        id: 'd1a-counter',
        title: 'the visitor counter',
        task: 'A counter that counts visitors as they arrive. It has to survive being changed — twice.',
        steps: [
          <>
            A variable named <code>count</code> starts at the number <code>0</code> — a number, so
            no quotes.
          </>,
          <>
            First visitor: <code>count</code> becomes <code>1</code> — print it. Second visitor: it
            becomes <code>2</code> — print it again.
          </>,
          <>Same variable the whole time. Choose its keyword so the changes don’t crash.</>,
        ],
        starter: '',
        expectedOutput: ['1', '2'],
        mustUse: [
          { test: /let\s+count\s*=\s*0/, label: 'count starts at 0 with a keyword that survives change' },
          { test: /count\s*=\s*1/, label: 'count becomes 1' },
          { test: /count\s*=\s*2/, label: 'count becomes 2' },
        ],
        mustNotUse: [
          { test: /const\s+count/, label: 'a counter that can never count is furniture — const is the wrong tool' },
        ],
        modelAnswer: `let count = 0;

count = 1;
console.log(count);

count = 2;
console.log(count);`,
      },
    ],
  },
  {
    id: 'drill-1b',
    phase: 1,
    title: 'Drill: gluing and arithmetic',
    blurb: 'Build sentences out of pieces and let the machine do your math.',
    bestAfter: '1.6',
    exercises: [
      {
        id: 'd1b-fullname',
        title: 'glue a full name',
        task: 'Two halves of a name live in two variables. Produce the full name — without ever typing it yourself.',
        steps: [
          <>
            <code>firstName</code> holds <code>"Ada"</code>; <code>lastName</code> holds{' '}
            <code>"Lovelace"</code>.
          </>,
          <>
            Exactly ONE <code>console.log</code>, and the full name must be <em>built from the two
            variables</em> — the text <code>"Ada Lovelace"</code> may not appear in your code.
          </>,
          <>Check the expected output closely: there’s a space between the names. It has to come from somewhere.</>,
        ],
        starter: '',
        expectedOutput: ['Ada Lovelace'],
        mustUse: [
          { test: /firstName\s*\+/, label: 'the sentence is glued from the firstName variable' },
          { test: /["']\s["']/, label: 'the space is supplied as its own piece' },
        ],
        mustNotUse: [{ test: /["']Ada Lovelace["']/, label: 'the finished name may not be typed by hand' }],
        modelAnswer: `const firstName = "Ada";
const lastName = "Lovelace";

console.log(firstName + " " + lastName);`,
      },
      {
        id: 'd1b-age',
        title: 'the machine does your math',
        task: 'Compute an age from a birth year. Programmers don’t do arithmetic in their heads — they write the formula, so the answer stays right when the inputs change.',
        steps: [
          <>
            <code>birthYear</code> holds the number <code>2000</code> and never changes.
          </>,
          <>
            A variable named <code>age</code> gets the age in the year 2026 — <em>calculated by
            the machine</em> from those two numbers. The number 26 may not appear in your code.
          </>,
          <>Print <code>age</code>.</>,
        ],
        starter: '',
        expectedOutput: ['26'],
        mustUse: [
          { test: /const\s+birthYear\s*=\s*2000/, label: 'birthYear is stored as a never-changing 2000' },
          { test: /2026\s*-\s*birthYear/, label: 'age is CALCULATED from 2026 and birthYear' },
        ],
        mustNotUse: [{ test: /=\s*26\b/, label: 'no pre-computed 26 — the subtraction is the machine’s job' }],
        modelAnswer: `const birthYear = 2000;
const age = 2026 - birthYear;

console.log(age);`,
      },
    ],
  },

  // ── Phase 2 ─────────────────────────────────────────────────────────────
  {
    id: 'drill-2a',
    phase: 2,
    title: 'Drill: decisions',
    blurb: 'Store a message based on a condition — the if/else muscle, made real.',
    bestAfter: '2.3',
    exercises: [
      {
        id: 'd2a-weather',
        title: 'a message that depends',
        task: 'The program looks at the temperature and decides which of two messages to remember — then says the one it chose.',
        steps: [
          <>
            The first line is given: <code>let temperature = 35;</code> — it’s already in the
            editor.
          </>,
          <>
            If the temperature is above 30, the message is <code>"Stay hydrated!"</code> —
            otherwise it’s <code>"Nice weather!"</code>.
          </>,
          <>
            The chosen text must end up in a variable named <code>message</code>, and exactly ONE{' '}
            <code>console.log</code> — placed after the decision — prints it. The decision chooses
            the value, not the printing.
          </>,
        ],
        starter: 'let temperature = 35;\n\n',
        expectedOutput: ['Stay hydrated!'],
        mustUse: [
          { test: /let\s+message/, label: 'a message variable holds the result' },
          { test: /if\s*\(\s*temperature\s*>\s*30\s*\)/, label: 'the decision checks temperature > 30' },
          { test: /else/, label: 'the other path is covered too' },
          { test: /console\.log\s*\(\s*message\s*\)/, label: 'the message variable is printed after deciding' },
        ],
        mustNotUse: [
          { test: /console\.log[\s\S]*console\.log/, label: 'exactly one console.log in the whole program' },
        ],
        modelAnswer: `let temperature = 35;

let message;
if (temperature > 30) {
  message = "Stay hydrated!";
} else {
  message = "Nice weather!";
}

console.log(message);`,
      },
      {
        id: 'd2a-oddeven',
        title: 'odd or even',
        task: 'Tell whether a number is odd or even. (A number is even exactly when dividing it by 2 leaves remainder 0 — and there’s an operator for remainders.)',
        steps: [
          <>
            The first line is given: <code>const number = 7;</code>
          </>,
          <>
            Print exactly <code>odd</code> or exactly <code>even</code> — lowercase, no punctuation
            — depending on the number.
          </>,
          <>
            Your decision must use the remainder operator <code>%</code>, and the code must still
            be correct if someone edits the 7 to an 8.
          </>,
        ],
        starter: 'const number = 7;\n\n',
        expectedOutput: ['odd'],
        mustUse: [
          { test: /number\s*%\s*2/, label: 'the remainder operator does the checking' },
          { test: /if\s*\(/, label: 'an if makes the decision' },
          { test: /else/, label: 'the other case is handled' },
        ],
        modelAnswer: `const number = 7;

if (number % 2 === 0) {
  console.log("even");
} else {
  console.log("odd");
}`,
      },
    ],
  },
  {
    id: 'drill-2b',
    phase: 2,
    title: 'Drill: loops that work for you',
    blurb: 'Never write the same line three times again.',
    bestAfter: '2.6',
    exercises: [
      {
        id: 'd2b-countdown',
        title: 'countdown',
        task: 'A rocket launch: 3… 2… 1… Go! — where the counting is done by a loop, not by you.',
        steps: [
          <>
            The three numbers must be printed by a loop counting <strong>down</strong> — writing
            the digits 3, 2, 1 into print statements is not allowed.
          </>,
          <>
            <code>Go!</code> prints exactly once, after the counting is over.
          </>,
        ],
        starter: '',
        expectedOutput: ['3', '2', '1', 'Go!'],
        mustUse: [
          { test: /for\s*\(|while\s*\(/, label: 'a loop produces the numbers' },
          { test: /i--|i\s*-=\s*1|i\s*=\s*i\s*-\s*1|\w+--/, label: 'the loop counts DOWN' },
        ],
        mustNotUse: [
          { test: /console\.log\s*\(\s*["']?3["']?\s*\)/, label: 'no hard-coded 3 — the loop variable does the counting' },
        ],
        modelAnswer: `for (let i = 3; i >= 1; i--) {
  console.log(i);
}

console.log("Go!");`,
      },
      {
        id: 'd2b-sum',
        title: 'the accumulator',
        task: 'Add up the numbers 1 through 5 and print the result — but the loop must do the adding, not you.',
        steps: [
          <>A loop must visit the numbers 1, 2, 3, 4, 5.</>,
          <>
            The result is printed once, after the loop — and the number <code>15</code> may not
            appear anywhere in your code.
          </>,
          <>
            Hint (a pattern worth owning): a “running total” variable that starts empty and grows a
            little on every lap. It needs a name — <code>total</code> — and a starting value of 0.
          </>,
        ],
        starter: '',
        expectedOutput: ['15'],
        mustUse: [
          { test: /let\s+total\s*=\s*0/, label: 'a running total starts at 0 before the loop' },
          { test: /for\s*\(|while\s*\(/, label: 'a loop visits 1 through 5' },
          { test: /total\s*\+=|total\s*=\s*total\s*\+/, label: 'every lap adds to the total' },
        ],
        mustNotUse: [{ test: /=\s*15\b/, label: 'no pre-computed 15 — the loop earns it' }],
        modelAnswer: `let total = 0;

for (let i = 1; i <= 5; i++) {
  total = total + i;
}

console.log(total);`,
      },
    ],
  },

  // ── Phase 3 ─────────────────────────────────────────────────────────────
  {
    id: 'drill-3a',
    phase: 3,
    title: 'Drill: functions meet your old tools',
    blurb: 'let, const, if/else and loops — now working INSIDE machines you build.',
    bestAfter: '3.2',
    exercises: [
      {
        id: 'd3a-greet-time',
        title: 'a machine that decides',
        task: 'Build a greeting machine with a brain: given the hour of the day, it picks the right greeting by itself.',
        steps: [
          <>
            A function named <code>greetByTime</code> with one input slot: <code>hour</code> (a
            number, 0–23).
          </>,
          <>
            For hours before 12 it prints exactly <code>Good morning!</code> — for every other
            hour, exactly <code>Good evening!</code>.
          </>,
          <>
            Prove it works by calling it for hour 9 and for hour 20 — matching the expected output
            below.
          </>,
        ],
        starter: '',
        expectedOutput: ['Good morning!', 'Good evening!'],
        mustUse: [
          { test: /function\s+greetByTime\s*\(\s*\w+\s*\)/, label: 'greetByTime is a function with one input slot' },
          { test: /if\s*\(/, label: 'the body decides with an if' },
          { test: /else/, label: 'the other path is covered' },
          { test: /greetByTime\s*\(\s*9\s*\)/, label: 'called with 9' },
          { test: /greetByTime\s*\(\s*20\s*\)/, label: 'called with 20' },
        ],
        modelAnswer: `function greetByTime(hour) {
  if (hour < 12) {
    console.log("Good morning!");
  } else {
    console.log("Good evening!");
  }
}

greetByTime(9);
greetByTime(20);`,
      },
      {
        id: 'd3a-cheer',
        title: 'a machine with a loop inside',
        task: 'Build a cheering machine: tell it a number, and it cheers exactly that many times.',
        steps: [
          <>
            A function named <code>cheer</code> with one input slot: <code>times</code>.
          </>,
          <>
            Calling it prints <code>Hip hip hooray!</code> exactly <code>times</code> times — and
            your whole program may contain only ONE <code>console.log</code>. (DRY: the repetition
            is the machine’s job.)
          </>,
          <>Prove it with <code>cheer(3)</code>.</>,
        ],
        starter: '',
        expectedOutput: ['Hip hip hooray!', 'Hip hip hooray!', 'Hip hip hooray!'],
        mustUse: [
          { test: /function\s+cheer\s*\(\s*\w+\s*\)/, label: 'cheer is a function with one input slot' },
          { test: /for\s*\(|while\s*\(/, label: 'a loop does the repeating' },
          { test: /cheer\s*\(\s*3\s*\)/, label: 'called with 3' },
        ],
        mustNotUse: [
          {
            test: /console\.log[\s\S]*console\.log[\s\S]*console\.log/,
            label: 'one console.log total — not one per cheer',
          },
        ],
        modelAnswer: `function cheer(times) {
  for (let i = 0; i < times; i++) {
    console.log("Hip hip hooray!");
  }
}

cheer(3);`,
      },
      {
        id: 'd3a-price-tag',
        title: 'everything at once',
        task: 'The shop needs printed price tags: item, price, and the shop’s name on every tag. One never-changing fact, one machine, two calls.',
        steps: [
          <>
            The shop’s name — <code>"Code Corner"</code> — lives in a variable named{' '}
            <code>shopName</code>. It never changes; store it accordingly.
          </>,
          <>
            A function named <code>priceTag</code> takes two inputs: <code>item</code> first, then{' '}
            <code>price</code>.
          </>,
          <>
            Each call prints one tag matching the expected output below <em>exactly</em> — built
            from the inputs and <code>shopName</code>, never typed by hand. (Copy the long dash —
            from the expected output; it’s not the minus key.)
          </>,
          <>
            Two tags to print: gear at 5, spring at 2.
          </>,
        ],
        starter: '',
        expectedOutput: ['gear — $5 (at Code Corner)', 'spring — $2 (at Code Corner)'],
        mustUse: [
          { test: /const\s+shopName\s*=\s*["']Code Corner["']/, label: 'the never-changing shop name is stored permanently' },
          { test: /function\s+priceTag\s*\(\s*\w+\s*,\s*\w+\s*\)/, label: 'priceTag is a function with two input slots' },
          { test: /priceTag\s*\(\s*["']gear["']\s*,\s*5\s*\)/, label: 'called for gear at 5 — item first, price second' },
          { test: /priceTag\s*\(\s*["']spring["']\s*,\s*2\s*\)/, label: 'called for spring at 2' },
        ],
        mustNotUse: [
          { test: /console\.log\s*\(\s*["'](gear|spring)/, label: 'tags are built from the slots — no hand-typed tags' },
        ],
        modelAnswer: `const shopName = "Code Corner";

function priceTag(item, price) {
  console.log(item + " — $" + price + " (at " + shopName + ")");
}

priceTag("gear", 5);
priceTag("spring", 2);`,
      },
    ],
  },
]

export function practiceSetsForPhase(phase: number): PracticeSet[] {
  return PRACTICE_SETS.filter((set) => set.phase === phase)
}

export function findPracticeSet(id: string): PracticeSet | undefined {
  return PRACTICE_SETS.find((set) => set.id === id)
}
