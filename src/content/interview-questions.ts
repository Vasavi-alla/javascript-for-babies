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

  {
    id: 'iq-1.1-type-matters',
    lessonId: '1.1',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'Why does it matter that a value has a type? Give an example.',
    answer:
      'The type decides what operations make sense. You can add two numbers to get their sum. You can join two pieces of text to make longer text. But adding a number to a word has no clear meaning, so the result is often a surprise. Knowing the type tells you what a value can safely do.',
  },
  {
    id: 'iq-1.2-declare-use',
    lessonId: '1.2',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'let city = "Pune"\nlet where = city\nconsole.log(where)',
    answer:
      'It prints Pune. city is a label tied to a slot holding the text Pune. let where = city reads what city points at and stores that value in a new slot named where. Reading a variable hands you its current value.',
  },
  {
    id: 'iq-1.3-reassign-oral',
    lessonId: '1.3',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'When you reassign a variable, what changes and what stays the same?',
    answer:
      'The label stays tied to the same variable. The value inside gets swapped for a new one. So the name does not move, but what it holds changes. This is how you update a running total by assigning a new value to the same variable.',
  },
  {
    id: 'iq-1.5-number-type',
    lessonId: '1.5',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'How does JavaScript store whole numbers and decimals?',
    answer:
      'JavaScript has one number type for both whole numbers and decimals. There is no separate integer type like some languages have. This is simple to use, but it is also why very large numbers or exact decimals can lose a tiny bit of accuracy.',
  },
  {
    id: 'iq-1.6-immutable',
    lessonId: '1.6',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'Are strings changeable? What happens when you upper-case one?',
    answer:
      'Strings cannot be changed in place. They are read only. When you use something like toUpperCase, you do not edit the original string. You get back a brand new string, and the original stays the same. So text is copied into a new value rather than edited.',
  },
  {
    id: 'iq-1.7-boolean',
    lessonId: '1.7',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What are the two boolean values, and what does this print?',
    code: 'const isReady = 3 > 5\nconsole.log(isReady)',
    answer:
      'The two boolean values are true and false. 3 > 5 asks if 3 is greater than 5. It is not, so the comparison gives false, and that is what prints. A comparison produces a boolean.',
  },
  {
    id: 'iq-1.8-dynamic-typing',
    lessonId: '1.8',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What does it mean that JavaScript is dynamically typed?',
    answer:
      'It means a variable is not locked to one type. The same variable can hold a number now and a string later. The type travels with the value, not with the variable name. This is flexible, but it also means a variable can end up holding a type you did not expect.',
  },
  {
    id: 'iq-1.9-coercion',
    lessonId: '1.9',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is type coercion?',
    answer:
      'Type coercion is when JavaScript quietly converts a value from one type to another so an operation can work. For example, comparing a number and a string with == turns one into the other first. It can be handy, but it also causes surprises, which is why many people prefer === that does no converting.',
  },
  {
    id: 'iq-1.10-string-plus',
    lessonId: '1.10',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and why?',
    code: 'console.log(1 + 2 + "3")',
    answer:
      'It prints 33. The parts run left to right. First 1 + 2 is 3 because both sides are numbers. Then 3 + "3" joins a number and text, so JavaScript turns the number into text and glues them, giving the string 33. Plus means add for numbers and join for text.',
  },
  {
    id: 'iq-1.11-string-number',
    lessonId: '1.11',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and what is the trap?',
    code: 'const a = "5"\nconst b = 2\nconsole.log(a + b)',
    answer:
      'It prints 52. a is the text "5", not the number 5. Adding text and a number joins them, so you get "52", not 7. This is a common trap when values come from a form or a template, where numbers often arrive as text.',
  },

  // ── Phase 2 — Making Decisions & Repeating ──────────────────────
  {
    id: 'iq-2.1-if-else',
    lessonId: '2.1',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print, and which branch runs?',
    code: 'const age = 20\nif (age >= 18) {\n  console.log("adult")\n} else {\n  console.log("minor")\n}',
    answer:
      'It prints adult. The condition age >= 18 is checked first. It is true, so the if branch runs and the else branch is skipped. Only one branch of an if or else ever runs.',
  },
  {
    id: 'iq-2.2-falsy',
    lessonId: '2.2',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'Which values in JavaScript are falsy?',
    answer:
      'There are six everyday falsy values: false, 0, an empty string, null, undefined, and NaN. Everything else is truthy, including an empty array and the string "0". When a value sits in a condition, JavaScript treats a falsy value as no and anything else as yes.',
  },
  {
    id: 'iq-2.3-switch-fall',
    lessonId: '2.3',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What prints here, and what caused it?',
    code: 'const x = 1\nswitch (x) {\n  case 1:\n    console.log("one")\n  case 2:\n    console.log("two")\n}',
    answer:
      'It prints one then two. This is fall-through. A case without a break keeps running into the next case. Once case 1 matches, it prints one, then falls into case 2 and prints two. Add break after each case unless you want this on purpose.',
  },
  {
    id: 'iq-2.4-short-circuit',
    lessonId: '2.4',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print, and why does the right side not run?',
    code: 'const name = "Sam"\nconsole.log(name || "guest")',
    answer:
      'It prints Sam. With ||, JavaScript checks the left side first. "Sam" is truthy, so that becomes the result and the right side is never looked at. This skipping is called short circuit. || gives back the first truthy value, or the last value if none are truthy.',
  },
  {
    id: 'iq-2.5-while-infinite',
    lessonId: '2.5',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What makes a while loop run forever, and why does that freeze the tab?',
    answer:
      'A while loop keeps repeating as long as its condition is true. If nothing inside the loop ever makes the condition false, it never stops. JavaScript runs your code on one main thread, so a loop that never ends never hands control back, and the page cannot respond. Always change something inside the loop that moves the condition toward false.',
  },
  {
    id: 'iq-2.6-for-loop',
    lessonId: '2.6',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'How many times does this run, and what is the last value of i printed?',
    code: 'for (let i = 0; i < 3; i++) {\n  console.log(i)\n}',
    answer:
      'It runs three times and prints 0, 1, 2. i starts at 0. Before each lap the condition i < 3 is checked. After each lap i goes up by one. When i reaches 3 the condition is false, so the loop stops before printing 3.',
  },
  {
    id: 'iq-2.7-break-continue',
    lessonId: '2.7',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is the difference between break and continue in a loop?',
    answer:
      'break stops the whole loop right away and moves on to the code after it. continue stops just the current lap and jumps to the next one. So break leaves the loop, and continue skips ahead inside it.',
  },
  {
    id: 'iq-2.8-fizzbuzz',
    lessonId: '2.8',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'In FizzBuzz, why must you check for a multiple of 15 before checking 3 or 5?',
    code: 'if (n % 15 === 0) console.log("FizzBuzz")\nelse if (n % 3 === 0) console.log("Fizz")\nelse if (n % 5 === 0) console.log("Buzz")',
    answer:
      'Because 15 is a multiple of both 3 and 5. If you checked 3 first, a number like 15 would print Fizz and stop, since only one branch of an else-if chain runs. Checking 15 first catches the both case before the single cases get a turn. Order matters in an else-if chain.',
  },

  {
    id: 'iq-2.1-condition',
    lessonId: '2.1',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What kind of value does an if statement expect in its parentheses?',
    answer:
      'An if expects a condition that comes out to true or false. JavaScript looks at the value in the parentheses, decides whether it counts as true or false, and runs the block only when it is true. Any value can be judged this way, not just real booleans.',
  },
  {
    id: 'iq-2.2-truthy-code',
    lessonId: '2.2',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'Which of these blocks run?',
    code: 'if ("") console.log("A")\nif ("0") console.log("B")\nif (0) console.log("C")',
    answer:
      'Only B runs, printing B. An empty string is falsy, so A is skipped. The string "0" is not empty, so it is truthy and B runs. The number 0 is falsy, so C is skipped. The text "0" and the number 0 behave very differently here.',
  },
  {
    id: 'iq-2.3-else-if',
    lessonId: '2.3',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'How does an else-if chain decide which block runs?',
    answer:
      'It checks each condition from top to bottom. The first one that is true runs its block, and the rest are skipped. If none are true, the else block runs, when there is one. Only one block in the whole chain ever runs.',
  },
  {
    id: 'iq-2.4-ternary',
    lessonId: '2.4',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and what is the ? : doing?',
    code: 'const age = 20\nconst label = age >= 18 ? "adult" : "minor"\nconsole.log(label)',
    answer:
      'It prints adult. The ? : is a ternary. It checks the condition age >= 18. If true, it gives the value before the colon, otherwise the value after. Unlike an if statement, a ternary produces a value you can store, here in label.',
  },
  {
    id: 'iq-2.5-while-count',
    lessonId: '2.5',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'let n = 3\nwhile (n > 0) {\n  console.log(n)\n  n = n - 1\n}',
    answer:
      'It prints 3, 2, 1. The loop checks n > 0 before each lap. It prints n, then lowers n by one. When n reaches 0 the condition is false and the loop stops. Lowering n each lap is what keeps it from running forever.',
  },
  {
    id: 'iq-2.6-for-parts',
    lessonId: '2.6',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What are the three parts of a for loop header, and when does each run?',
    answer:
      'The header has three parts. The first sets up a starting value and runs once at the start. The second is the condition, checked before every lap. The third is the update, which runs after each lap. So it goes setup once, then check, lap, update, check, and so on.',
  },
  {
    id: 'iq-2.7-continue-code',
    lessonId: '2.7',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'for (let i = 1; i <= 5; i++) {\n  if (i % 2 === 0) continue\n  console.log(i)\n}',
    answer:
      'It prints 1, 3, 5. continue skips the rest of the current lap when i is even, so the log is jumped over for 2 and 4. The loop keeps going and prints only the odd numbers. continue skips a lap, it does not stop the loop.',
  },
  {
    id: 'iq-2.8-nested',
    lessonId: '2.8',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is a nested loop?',
    answer:
      'A nested loop is a loop inside another loop. For each single lap of the outer loop, the whole inner loop runs from start to finish. This is useful for working through rows and columns, like a grid, where the outer loop picks the row and the inner loop walks across it.',
  },

  // ── Phase 3 — Functions ─────────────────────────────────────────
  {
    id: 'iq-3.1-what-function',
    lessonId: '3.1',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is a function, and how is defining one different from calling it?',
    answer:
      'A function is a reusable machine: it takes inputs, does some work, and gives an output. Defining a function writes down the steps but does not run them. Calling the function is what actually runs those steps. Defining is writing the recipe. Calling is cooking it.',
  },
  {
    id: 'iq-3.2-params-args',
    lessonId: '3.2',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is the difference between a parameter and an argument?',
    answer:
      'A parameter is the slot name written in the function definition. An argument is the real value you drop into that slot when you call the function. Every call gets its own fresh slots, so two calls do not share values.',
  },
  {
    id: 'iq-3.3-return-vs-log',
    lessonId: '3.3',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and what is the difference between return and console.log?',
    code: 'function double(n) {\n  console.log(n * 2)\n}\nconst result = double(5)\nconsole.log(result)',
    answer:
      'It prints 10 then undefined. console.log only shows a value on the screen. return is what hands a value back to the caller. This function logs 10 but returns nothing, so result is undefined. To use the answer in code, the function must return it, not just log it.',
  },
  {
    id: 'iq-3.4-functions-are-values',
    lessonId: '3.4',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What does it mean that functions are values in JavaScript?',
    answer:
      'A function is a value like a number or a string, so you can store it in a variable, pass it into another function, or return it from one. A function expression stores a function in a variable. An arrow function is a shorter way to write one. Because functions are values, you can move them around.',
  },
  {
    id: 'iq-3.5-scope',
    lessonId: '3.5',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What happens when this runs, and why?',
    code: 'function outer() {\n  const secret = 42\n}\nouter()\nconsole.log(secret)',
    answer:
      'It throws an error, because secret is not defined out here. A variable made inside a function can only be seen inside that function. That is scope. Inner code can look outward to names in the functions around it, but outer code cannot look inward.',
  },
  {
    id: 'iq-3.6-call-stack',
    lessonId: '3.6',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is the call stack?',
    answer:
      'The call stack is how JavaScript keeps track of which function is running. Each call gets its own frame placed on top of the stack. When a function finishes, its frame pops off and control returns to the one below. It is last in, first out, like a stack of plates.',
  },
  {
    id: 'iq-3.7-closure',
    lessonId: '3.7',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and what is the closure here?',
    code: 'function counter() {\n  let count = 0\n  return function () {\n    count++\n    return count\n  }\n}\nconst next = counter()\nconsole.log(next(), next())',
    answer:
      'It prints 1 2. The inner function was returned but it still remembers count from the function it was born in. That kept-alive link to outer variables is a closure. Each call to next reaches the same remembered count and adds one, so it goes 1 then 2.',
  },
  {
    id: 'iq-3.8-callback',
    lessonId: '3.8',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is a higher-order function, and what is a callback?',
    answer:
      'A higher-order function is a function that takes another function as an input or returns one. The function you hand in is called a callback, because it gets called back at the right time. This is how tools like array methods and event handlers let you plug in your own step.',
  },
  {
    id: 'iq-3.9-recursion',
    lessonId: '3.9',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is recursion, and why does it need a base case?',
    answer:
      'Recursion is a function that calls itself to solve a smaller piece of the same problem. The base case is the simple version that stops the calling. Without a base case the function would call itself forever and overflow the call stack. Every recursion needs a case that stops and a case that shrinks the problem.',
  },
  {
    id: 'iq-3.10-default-pure',
    lessonId: '3.10',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print, and what does the = 1 do?',
    code: 'function greet(name, times = 1) {\n  return name.repeat(times)\n}\nconsole.log(greet("hi "))',
    answer:
      'It prints hi followed by a space, once. times = 1 is a default parameter. When you call greet without a second argument, times falls back to 1. Defaults give a slot a value to use when the caller leaves it out.',
  },
  {
    id: 'iq-3.11-pure-function',
    lessonId: '3.11',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is a pure function, and why are pure functions easy to test?',
    answer:
      'A pure function always gives the same output for the same inputs and changes nothing outside itself. It does not touch the screen, files, or outside variables. That makes it easy to test, because you just pass inputs and check the output, with no setup and no surprises. The tip calculator brain is built from small pure functions for exactly this reason.',
  },
  {
    id: 'iq-3.1-call-code',
    lessonId: '3.1',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'function greet(name) {\n  return "Hi " + name\n}\nconsole.log(greet("Sam"))',
    answer:
      'It prints Hi Sam. Defining greet only writes the steps. Calling greet("Sam") runs them with name set to Sam. The function returns the joined text, and console.log prints what came back.',
  },
  {
    id: 'iq-3.2-fresh-slots',
    lessonId: '3.2',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and why does the outer x not change?',
    code: 'function addOne(x) {\n  x = x + 1\n  return x\n}\nconst x = 5\nconsole.log(addOne(x), x)',
    answer:
      'It prints 6 5. The call gives the function its own slot named x set to 5. Adding one changes only that inner slot and returns 6. The outer x is a different slot, so it stays 5. Each call gets fresh slots.',
  },
  {
    id: 'iq-3.3-return-oral',
    lessonId: '3.3',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What does return do?',
    answer:
      'return hands a value back to whoever called the function, and it ends the function right there. The call is then replaced by that value in the code around it. Without return, a function gives back undefined. Showing a value with console.log is not the same as returning it.',
  },
  {
    id: 'iq-3.4-arrow-code',
    lessonId: '3.4',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'const double = (n) => n * 2\nconsole.log(double(4))',
    answer:
      'It prints 8. double is a variable holding an arrow function. The arrow function takes n and gives back n times 2. With no braces, the value after the arrow is returned automatically. Calling double(4) runs it with n set to 4.',
  },
  {
    id: 'iq-3.5-scope-oral',
    lessonId: '3.5',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is scope?',
    answer:
      'Scope is where a name can be seen from. A variable made inside a function lives only inside that function. Code inside can look outward to names in the functions around it. Code outside cannot look in. This keeps each function tidy and stops names from clashing.',
  },
  {
    id: 'iq-3.6-stack-order',
    lessonId: '3.6',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'In what order do the logs print?',
    code: 'function a() {\n  console.log("a start")\n  b()\n  console.log("a end")\n}\nfunction b() {\n  console.log("b")\n}\na()',
    answer:
      'It prints a start, then b, then a end. Calling a puts its frame on the stack and it logs a start. Then a calls b, whose frame goes on top and logs b. b finishes and pops off, so a carries on and logs a end.',
  },
  {
    id: 'iq-3.7-closure-oral',
    lessonId: '3.7',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is a closure, in one or two sentences?',
    answer:
      'A closure is a function that keeps a link to the variables from the place it was created, even after that outer function has finished. So the inner function carries those values with it wherever it goes. This is how a function can remember a private value between calls.',
  },
  {
    id: 'iq-3.8-callback-code',
    lessonId: '3.8',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'function twice(fn) {\n  fn()\n  fn()\n}\ntwice(() => console.log("hi"))',
    answer:
      'It prints hi twice. twice takes a function called fn and calls it two times. The arrow function passed in logs hi, so it runs once, then again. Passing a function to be run later like this is using a callback.',
  },
  {
    id: 'iq-3.9-recursion-code',
    lessonId: '3.9',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'function countdown(n) {\n  if (n === 0) return\n  console.log(n)\n  countdown(n - 1)\n}\ncountdown(3)',
    answer:
      'It prints 3, 2, 1. countdown logs n, then calls itself with n minus one. Each call shrinks n. When n reaches 0 the base case returns and stops the calling. Without that base case it would run forever.',
  },
  {
    id: 'iq-3.10-pure-oral',
    lessonId: '3.10',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What makes a function pure?',
    answer:
      'A pure function gives the same output every time for the same inputs, and it changes nothing outside itself. It does not read or change outside variables, and it does not print or save anything. Because it only turns inputs into an output, it is easy to trust and easy to test.',
  },
  {
    id: 'iq-3.11-compose-code',
    lessonId: '3.11',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const withTax = (p) => p * 1.1\nconst round = (p) => Math.round(p)\nconsole.log(round(withTax(100)))',
    answer:
      'It prints 110. withTax(100) gives 110. That result is passed into round, which leaves a whole number as it is, so it stays 110. Small functions can be fed into each other like this, each doing one job.',
  },

  // ── Phase 4 — Collections ───────────────────────────────────────
  {
    id: 'iq-4.1-basics',
    lessonId: '4.1',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const nums = [10, 20, 30]\nconsole.log(nums[0], nums.length)',
    answer:
      'It prints 10 3. An array holds many values in order under one name. nums[0] is the first element, found by its index, which starts at 0. length is how many elements there are. The last one sits at length minus one.',
  },
  {
    id: 'iq-4.1-out-of-range',
    lessonId: '4.1',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What do you get if you read an index that does not exist, like nums[10] on a 3-item array?',
    answer:
      'You get undefined. Reading past the end does not crash. JavaScript just says there is nothing in that slot. This is why an off-by-one mistake can quietly give undefined instead of an error, so you check length before trusting an index.',
  },
  {
    id: 'iq-4.2-o1',
    lessonId: '4.2',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'Why is reading arr[i] the same speed no matter how big the array is?',
    answer:
      'Because the elements sit in a row of slots of equal size, one after another. The computer finds any slot with a little math: start address plus index times slot size. That is one jump, not a search. So lookup by index is O(1), the same cost at any size.',
  },
  {
    id: 'iq-4.2-contiguous',
    lessonId: '4.2',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What does it mean that an array is stored in contiguous memory?',
    answer:
      'It means the elements sit right next to each other in one unbroken run of slots, with no gaps between them. This layout is what lets the computer jump straight to any index by math, and it is why arrays are fast to read by position.',
  },
  {
    id: 'iq-4.3-methods',
    lessonId: '4.3',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const q = [1, 2, 3]\nq.push(4)\nq.shift()\nconsole.log(q)',
    answer:
      'It prints [2, 3, 4]. push adds 4 to the end, giving [1,2,3,4]. shift removes the first element, 1, leaving [2,3,4]. push and pop work at the end. shift and unshift work at the front.',
  },
  {
    id: 'iq-4.3-front-cost',
    lessonId: '4.3',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'Why is adding to the front of an array (unshift) slower than adding to the end (push)?',
    answer:
      'Adding to the end drops a value in the next free slot, which is one step, O(1). Adding to the front means every existing element must slide over by one to make room. For n elements that is n moves, so it is O(n). Front work gets more expensive as the array grows.',
  },
  {
    id: 'iq-4.4-access',
    lessonId: '4.4',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const user = { name: "Sam", age: 3 }\nconsole.log(user.name, user["age"])',
    answer:
      'It prints Sam 3. An object holds values under names called keys. You reach a value by its key, not by a position. Dot style user.name and bracket style user["age"] both work.',
  },
  {
    id: 'iq-4.4-dot-vs-bracket',
    lessonId: '4.4',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'When must you use brackets instead of dot to read an object property?',
    answer:
      'You need brackets when the key is held in a variable, like user[field], or when the key is not a simple word, such as one with a space or one that starts with a number. Dot only works for fixed, plain-word keys written directly in the code.',
  },
  {
    id: 'iq-4.5-hash',
    lessonId: '4.5',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'How does an object find a value by its key so quickly?',
    answer:
      'It uses a hash. A hash function turns the key word into a number, and that number points to a bucket where the value lives. So looking up by name is a quick jump, not a search through every key. That is why object lookup by key is close to O(1).',
  },
  {
    id: 'iq-4.5-not-a-search',
    lessonId: '4.5',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'Objects find values by name. Why is that not just a slow search through every key?',
    answer:
      'Because the key is not checked one by one. It is turned into an address by a hash function, and the value is stored at that address. So the object jumps straight to the value. This is the same idea as a hash map.',
  },
  {
    id: 'iq-4.6-primitive-copy',
    lessonId: '4.6',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'let a = 5\nlet b = a\nb = 9\nconsole.log(a, b)',
    answer:
      'It prints 5 9. A number is a primitive, so b = a copies the value itself. a and b are now separate. Changing b does not touch a. Primitives are copied by value.',
  },
  {
    id: 'iq-4.6-reference-share',
    lessonId: '4.6',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'const a = { count: 1 }\nconst b = a\nb.count = 9\nconsole.log(a.count)',
    answer:
      'It prints 9. An object is a reference. b = a copies the arrow to the same object, not the object itself. So a and b point at one shared object, and changing it through b is seen through a. This is call by sharing.',
  },
  {
    id: 'iq-4.6-func-arg',
    lessonId: '4.6',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and why?',
    code: 'function bump(obj) {\n  obj.n = obj.n + 1\n}\nconst thing = { n: 1 }\nbump(thing)\nconsole.log(thing.n)',
    answer:
      'It prints 2. The object is passed by sharing, so obj inside the function points at the same object as thing outside. Changing obj.n changes the one shared object, and the caller sees it. If n were a plain number argument, the caller would not see the change.',
  },
  {
    id: 'iq-4.6-reassign-param',
    lessonId: '4.6',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and why does thing not change?',
    code: 'function replace(obj) {\n  obj = { n: 99 }\n}\nconst thing = { n: 1 }\nreplace(thing)\nconsole.log(thing.n)',
    answer:
      'It prints 1. Inside replace, obj = { n: 99 } points the local obj at a brand new object. It does not change what thing points at. Sharing lets you edit the shared object, but reassigning the parameter only re-points the local name. So the caller still sees the old object.',
  },
  {
    id: 'iq-4.7-equality',
    lessonId: '4.7',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and why?',
    code: 'console.log({} === {})',
    answer:
      'It prints false. Each {} makes a brand new object at its own address. === on objects checks whether they are the very same object, not whether they look alike. Two separate objects are never === even when their contents match.',
  },
  {
    id: 'iq-4.7-shallow',
    lessonId: '4.7',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is a shallow copy, and where does it fall short?',
    answer:
      'A shallow copy, like using spread, makes a new outer object but copies the inner values as they are. If an inner value is itself an object, only its arrow is copied, so the copy and the original still share that inner object. Changing the inner object shows in both. A deep copy would copy the inner objects too.',
  },
  {
    id: 'iq-4.7-spread-copy',
    lessonId: '4.7',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const a = { x: 1 }\nconst b = { ...a }\nb.x = 9\nconsole.log(a.x, b.x)',
    answer:
      'It prints 1 9. The spread { ...a } builds a new object and copies the top-level values of a into it. So b is a separate object. Changing b.x does not touch a.x. This is a shallow copy, which is enough here because x is a plain number.',
  },
  {
    id: 'iq-4.8-forof-forin',
    lessonId: '4.8',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'const arr = ["a", "b"]\nfor (const x of arr) console.log(x)\nfor (const i in arr) console.log(i)',
    answer:
      'It prints a, b, then 0, 1. for...of gives you the values of the array. for...in gives you the keys, which for an array are the index numbers 0 and 1. Use for...of for values and Object.keys or for...in for keys.',
  },
  {
    id: 'iq-4.8-object-keys',
    lessonId: '4.8',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const user = { name: "Sam", age: 3 }\nconsole.log(Object.keys(user))',
    answer:
      'It prints ["name", "age"]. Object.keys gives back an array of the keys of the object. There is also Object.values for the values and Object.entries for key and value pairs. These let you loop over the contents of an object.',
  },
  {
    id: 'iq-4.9-map-filter',
    lessonId: '4.9',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const nums = [1, 2, 3, 4]\nconst r = nums.filter((n) => n % 2 === 0).map((n) => n * 10)\nconsole.log(r)',
    answer:
      'It prints [20, 40]. filter keeps only the elements that pass its test, here the even ones, giving [2,4]. map then makes a new array by transforming each, times 10, giving [20,40]. Both return new arrays and leave the original alone.',
  },
  {
    id: 'iq-4.9-reduce',
    lessonId: '4.9',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and what is reduce doing?',
    code: 'const nums = [1, 2, 3, 4]\nconst total = nums.reduce((sum, n) => sum + n, 0)\nconsole.log(total)',
    answer:
      'It prints 10. reduce folds the whole array into one value. It starts sum at 0, then for each element adds it on: 0+1+2+3+4. The second argument, 0, is the starting value. reduce is how you turn a list into a single result like a total.',
  },
  {
    id: 'iq-4.9-map-vs-foreach',
    lessonId: '4.9',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is the difference between map and forEach?',
    answer:
      'map makes and returns a new array by transforming each element. forEach just runs a function for each element and returns nothing. So use map when you want a new array of results, and forEach when you only want to do something per element, like logging, with no new array.',
  },
  {
    id: 'iq-4.10-sort-gotcha',
    lessonId: '4.10',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and why is it surprising?',
    code: 'console.log([10, 2, 1].sort())',
    answer:
      'It prints [1, 10, 2]. By default sort turns values into text and compares them as words, so "10" comes before "2". To sort numbers correctly you must pass a compare function, like sort((a, b) => a - b). The string default is a classic trap.',
  },
  {
    id: 'iq-4.10-find-some',
    lessonId: '4.10',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is the difference between find, some, and includes on an array?',
    answer:
      'find gives back the first element that passes a test, or undefined if none do. some gives back true or false for whether any element passes. includes gives back true or false for whether an exact value is present. So find returns an element, the other two return a yes or no.',
  },
  {
    id: 'iq-4.11-destructure',
    lessonId: '4.11',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const point = { x: 1, y: 2 }\nconst { x, y } = point\nconsole.log(x, y)',
    answer:
      'It prints 1 2. Destructuring pulls values out of an object into variables whose names match the keys. So x becomes 1 and y becomes 2. It is a short way to unpack the pieces you want from an object or array.',
  },
  {
    id: 'iq-4.11-spread-rest',
    lessonId: '4.11',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and what do the three dots do here?',
    code: 'function sum(...nums) {\n  return nums.reduce((a, b) => a + b, 0)\n}\nconsole.log(sum(1, 2, 3))',
    answer:
      'It prints 6. In the parameter list, ...nums is rest: it gathers all the arguments into one array [1,2,3]. reduce then adds them. The same three dots used in a call would be spread, which does the opposite and unpacks an array into separate values.',
  },
  {
    id: 'iq-4.11-options-object',
    lessonId: '4.11',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'Why do many modern functions take a single options object instead of many separate arguments?',
    answer:
      'Because a caller can name each value, pass them in any order, and skip the ones they do not need. It also lets the function add new options later without breaking old calls. Inside, destructuring pulls the named values out. This is the options-object style most modern APIs use.',
  },
  {
    id: 'iq-4.12-set',
    lessonId: '4.12',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const s = new Set([1, 1, 2, 3, 3])\nconsole.log(s.size)',
    answer:
      'It prints 3. A Set only keeps unique values, so the repeats are dropped and only 1, 2, 3 remain. size is how many it holds. A Set is the go-to tool when you want to remove duplicates or check membership.',
  },
  {
    id: 'iq-4.12-map-vs-object',
    lessonId: '4.12',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'How is a Map different from a plain object?',
    answer:
      'A Map can use any type of value as a key, including objects, while a plain object only uses text keys. A Map also keeps its keys in insertion order and has a size property and clear methods to add and read. Use a Map when keys are not simple strings or when order and easy size matter.',
  },
  {
    id: 'iq-4.13-roundtrip',
    lessonId: '4.13',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'const obj = { name: "Sam", age: 3 }\nconst text = JSON.stringify(obj)\nconsole.log(text)',
    answer:
      'It prints {"name":"Sam","age":3}. JSON.stringify flattens an object into a text string, and the keys become quoted text. JSON.parse does the reverse, turning that text back into an object. This is how data travels between an app and an API.',
  },
  {
    id: 'iq-4.13-what-is',
    lessonId: '4.13',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is JSON, and why is it used?',
    answer:
      'JSON is a text format for data, written to look like JavaScript objects and arrays. It is used because text can travel easily over the network between programs, even ones written in different languages. You flatten an object to JSON text to send it, and rebuild it on the other side.',
  },
  {
    id: 'iq-4.14-pipeline',
    lessonId: '4.14',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'How do filter, map, and reduce work together to build a summary from a list?',
    answer:
      'You chain them. filter narrows the list to the rows you care about. map reshapes each row into just the piece you need. reduce folds those pieces into one summary value, like a count or a total. This filter then map then reduce flow is the backbone of most simple dashboards.',
  },
  {
    id: 'iq-4.14-count-code',
    lessonId: '4.14',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'const runs = [{ pass: true }, { pass: false }, { pass: true }]\nconst passed = runs.filter((r) => r.pass).length\nconsole.log(passed)',
    answer:
      'It prints 2. filter keeps only the runs where pass is true, and length counts them. This is a common QA move: from a list of test results, count how many passed. You could also reduce, but filter then length reads clearly.',
  },

  // ── Phase 5 — How JavaScript Really Runs ────────────────────────
  {
    id: 'iq-5.1-two-passes',
    lessonId: '5.1',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What are the two passes the engine makes over your code?',
    answer:
      'First is the creation pass, where the engine reads through and registers the names of variables and functions before running anything. Second is the execution pass, where it runs your lines top to bottom. The first pass is why a function can be called before its definition appears in the file.',
  },
  {
    id: 'iq-5.1-context',
    lessonId: '5.1',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is an execution context?',
    answer:
      'An execution context is the workspace the engine sets up to run a piece of code. There is one for the whole file and a new one for each function call. It holds that code own variables and remembers where to return. Contexts stack up as calls happen, just like the call stack.',
  },
  {
    id: 'iq-5.2-var-hoist',
    lessonId: '5.2',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and why?',
    code: 'console.log(x)\nvar x = 5',
    answer:
      'It prints undefined. In the creation pass, var x is registered and set to undefined before any line runs. So the log finds x already there but not yet given 5. var hoists as undefined, which is why this does not crash but is not 5 either.',
  },
  {
    id: 'iq-5.2-tdz',
    lessonId: '5.2',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What happens here, and how is it different from var?',
    code: 'console.log(y)\nlet y = 5',
    answer:
      'It throws an error. Unlike var, a let name is registered but left untouched until its line runs. Reading it before then lands in the dead zone, and JavaScript throws. This is safer than the quiet undefined of var, because it catches use-before-set.',
  },
  {
    id: 'iq-5.2-func-decl',
    lessonId: '5.2',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and why does it not fail?',
    code: 'greet()\nfunction greet() {\n  console.log("hi")\n}',
    answer:
      'It prints hi. A function declaration is hoisted whole, name and body, during the creation pass. So you can call it above where it is written. This is different from var, which hoists only the name set to undefined, not any value.',
  },
  {
    id: 'iq-5.3-lookup',
    lessonId: '5.3',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'When code uses a name, how does JavaScript decide which variable it means?',
    answer:
      'It looks in the current function first. If the name is not there, it walks outward to the function that surrounds it, and so on, until the global level. The first match wins. This outward walk follows where the code was written, not who called it.',
  },
  {
    id: 'iq-5.3-written-not-called',
    lessonId: '5.3',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'Is the scope chain decided by where a function is written or where it is called from?',
    answer:
      'By where it is written. Each function carries one link to the place it was defined, and lookups walk that link outward. Calling the function from somewhere else does not change what names it can see. This is called lexical scope.',
  },
  {
    id: 'iq-5.4-call-time',
    lessonId: '5.4',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'When is the value of this decided, and what decides it?',
    answer:
      'this is decided at call time, not when the function is written. What decides it is how the function is called. Called as obj.method(), this is obj. Called plain, this is undefined in strict mode or the global object otherwise. So the same function can have different this on different calls.',
  },
  {
    id: 'iq-5.4-arrow',
    lessonId: '5.4',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and what would change with an arrow function?',
    code: 'const obj = {\n  name: "Sam",\n  greet() {\n    return this.name\n  },\n}\nconsole.log(obj.greet())',
    answer:
      'It prints Sam. greet is called as obj.greet(), so this is obj, and this.name is Sam. If greet were an arrow function, it would not get its own this, and this.name would not be Sam. Arrows keep the this of where they were written.',
  },
  {
    id: 'iq-5.4-lost-this',
    lessonId: '5.4',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and why?',
    code: 'const obj = {\n  name: "Sam",\n  greet() {\n    return this.name\n  },\n}\nconst g = obj.greet\nconsole.log(g())',
    answer:
      'It prints undefined, or throws in strict mode. Pulling greet out into g loses the object in front of it. Calling g() plain means this is no longer obj, so this.name is not Sam. this depends on how a function is called, and here it is called bare.',
  },
  {
    id: 'iq-5.4-rules',
    lessonId: '5.4',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What are the ways this gets its value?',
    answer:
      'There are a few. Called as a method, obj.fn(), this is obj. Called plain, fn(), this is undefined in strict mode or the global object otherwise. Called with new, this is the fresh object. Called with call, apply, or bind, this is whatever you pass. Arrow functions ignore all of this and take the this of where they were written.',
  },
  {
    id: 'iq-5.5-chain',
    lessonId: '5.5',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is the prototype chain, and how does it find a method?',
    answer:
      'Every object has a hidden link to another object called its prototype. When you read a property the object does not have, JavaScript climbs this link to the prototype, then its prototype, and so on, until it finds the property or runs out. This is how many objects can share one copy of a method.',
  },
  {
    id: 'iq-5.5-shared',
    lessonId: '5.5',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'Why are methods usually put on the prototype instead of on each object?',
    answer:
      'Because then all the objects share one copy of the method through the chain, instead of every object carrying its own copy. This saves memory and keeps the method in one place. The objects hold their own data, and the shared behavior lives on the prototype.',
  },
  {
    id: 'iq-5.5-shadow',
    lessonId: '5.5',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'If an object and its prototype both have a property with the same name, which one wins?',
    answer:
      'The property on the object itself wins. Lookup starts on the object and only climbs to the prototype if the object does not have the property. So an own property shadows one further up the chain. The version on the prototype is still there, just hidden behind the closer one.',
  },
  {
    id: 'iq-5.6-sugar',
    lessonId: '5.6',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is a class in JavaScript, under the hood?',
    answer:
      'A class is a nicer way to write the prototype pattern. Methods you put in a class actually live on the prototype, shared by all instances. So class is friendly handwriting over prototypes. It does not add a new kind of object, it just makes the same thing easier to read and write.',
  },
  {
    id: 'iq-5.6-new',
    lessonId: '5.6',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and what did new do?',
    code: 'class Dog {\n  constructor(name) {\n    this.name = name\n  }\n}\nconst d = new Dog("Rex")\nconsole.log(d.name)',
    answer:
      'It prints Rex. new makes a fresh empty object, runs the constructor with this pointing at it, sets this.name to Rex, and hands the object back. So d is a Dog with name Rex. new is what turns a class into a real object.',
  },
  {
    id: 'iq-5.7-reachability',
    lessonId: '5.7',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'How does JavaScript decide which objects to free from memory?',
    answer:
      'It keeps any object that can still be reached by following links from the roots, like variables in use. If nothing points to an object any more, it can no longer be reached, so it is safe to free. This is called reachability. You do not free memory by hand, the collector does it.',
  },
  {
    id: 'iq-5.7-leak',
    lessonId: '5.7',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What causes a memory leak if garbage collection is automatic?',
    answer:
      'A leak happens when you keep a link to something you no longer need, so it stays reachable and cannot be freed. Common causes are values left in a long-lived array or map, or a closure that holds onto big data. The fix is to drop the link when you are done.',
  },
  {
    id: 'iq-5.8-try-catch',
    lessonId: '5.8',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and why does after not run?',
    code: 'try {\n  throw new Error("bad")\n  console.log("after")\n} catch (e) {\n  console.log("caught " + e.message)\n}',
    answer:
      'It prints caught bad. throw stops the normal flow at once, so the after line never runs. The stack unwinds until a catch is found. catch receives the error, and e.message is the text bad. try lets risky code fail without crashing the whole program.',
  },
  {
    id: 'iq-5.8-finally',
    lessonId: '5.8',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is the finally block for?',
    answer:
      'finally runs after try and catch no matter what, whether the code succeeded, threw, or returned. It is where you put cleanup that must always happen, like closing a file or clearing a loading flag. So finally is your always-run step.',
  },
  {
    id: 'iq-5.9-hoist-puzzle',
    lessonId: '5.9',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'function outer() {\n  console.log(x)\n  var x = 2\n}\nouter()',
    answer:
      'It prints undefined. Inside outer, var x is hoisted to the top of the function and set to undefined during the creation pass. The log runs before the line that gives x its 2, so it sees undefined. This mixes hoisting and function scope in one puzzle.',
  },
  {
    id: 'iq-5.9-this-oral',
    lessonId: '5.9',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'In an interview, how would you explain what decides this in one breath?',
    answer:
      'I would say this is set by how a function is called, not where it is written. Called as a method on an object, this is that object. Called plain, this is undefined in strict mode. Arrow functions are the exception, they keep the this from where they were defined.',
  },

  // ── Phase 6 — Asynchronous JavaScript ───────────────────────────
  {
    id: 'iq-6.1-blocking',
    lessonId: '6.1',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'Why does a long synchronous task freeze the whole page?',
    answer:
      'JavaScript runs on one main thread with one call stack. While a long task is running, nothing else can, so clicks and drawing all wait. That is blocking. Async work avoids this by scheduling a task to run later instead of doing it right now, keeping the thread free.',
  },
  {
    id: 'iq-6.1-async-meaning',
    lessonId: '6.1',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What does async actually mean here?',
    answer:
      'Async means you start a job now and let it finish later, without standing still and waiting for it. You hand it off, carry on with other code, and get told when it is done. It does not mean many threads. It means not waiting on the one thread you have.',
  },
  {
    id: 'iq-6.2-settimeout0',
    lessonId: '6.2',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and in what order?',
    code: 'console.log("A")\nsetTimeout(() => console.log("B"), 0)\nconsole.log("C")',
    answer:
      'It prints A, C, B. The two plain logs run first. setTimeout, even with 0, does not run now. It hands its function to be queued and run only after the current code finishes and the stack is empty. So B comes last, even at 0 delay.',
  },
  {
    id: 'iq-6.2-loop',
    lessonId: '6.2',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is the event loop, in one or two sentences?',
    answer:
      'The event loop is the rule that keeps JavaScript moving. When the call stack is empty, it takes the next waiting task from a queue and runs it. Timers and network results wait in that queue until the stack is clear, then the loop lets them in one at a time.',
  },
  {
    id: 'iq-6.2-webapis',
    lessonId: '6.2',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'When you call setTimeout, where does the timer run while your code keeps going?',
    answer:
      'The timer is handled outside the JavaScript engine, by the browser or Node. Your code hands the timer off and carries straight on. When the time is up, the environment drops your function into a queue. The event loop only runs it once the call stack is empty.',
  },
  {
    id: 'iq-6.2-responsive',
    lessonId: '6.2',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'How does async work let a single thread stay responsive?',
    answer:
      'The one thread never waits on slow work. It hands slow jobs, like timers and network calls, off to the environment, and keeps running other code. When a job is done, its callback waits in a queue and the event loop runs it later. So nothing blocks the thread while it waits.',
  },
  {
    id: 'iq-6.3-callback',
    lessonId: '6.3',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'Why do async results often arrive inside a callback?',
    answer:
      'Because the result is not ready when you ask for it. So instead of returning it right away, the async job takes a function from you and calls it later, once the result is in. That function is the callback, and the result is handed to it when it finally arrives.',
  },
  {
    id: 'iq-6.3-hell',
    lessonId: '6.3',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is callback hell, and what problem does it cause?',
    answer:
      'Callback hell is when each async step nests inside the callback of the one before it, so the code marches deeper to the right in a pyramid. It gets hard to read and hard to handle errors across every level. Promises and async await were made to flatten this back out.',
  },
  {
    id: 'iq-6.4-states',
    lessonId: '6.4',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What are the states of a promise, and can it change more than once?',
    answer:
      'A promise starts pending. It then settles once, either to fulfilled with a value or to rejected with a reason. Once it settles it is fixed and cannot change again. So a promise is a one-time receipt for a result that is coming.',
  },
  {
    id: 'iq-6.4-chain',
    lessonId: '6.4',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'Promise.resolve(2)\n  .then((n) => n * 3)\n  .then((n) => console.log(n))',
    answer:
      'It prints 6. then runs when the promise has a value and passes that value in. The first then turns 2 into 6 and hands it to the next then, which logs it. Returning a value from a then feeds it to the next one, so chains stay flat.',
  },
  {
    id: 'iq-6.4-catch',
    lessonId: '6.4',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'Promise.reject(new Error("boom"))\n  .then(() => console.log("ok"))\n  .catch((e) => console.log("caught " + e.message))',
    answer:
      'It prints caught boom. The promise is rejected, so the then is skipped and control falls to the catch, which receives the error. One catch at the end of a chain handles a rejection from any step above it. This is why promise chains have one clear error drain.',
  },
  {
    id: 'iq-6.5-order',
    lessonId: '6.5',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'In what order do these print?',
    code: 'console.log("A")\nsetTimeout(() => console.log("B"), 0)\nPromise.resolve().then(() => console.log("C"))\nconsole.log("D")',
    answer:
      'It prints A, D, C, B. A and D are plain code and run first. Then the microtask queue drains completely, so the C from the promise runs. Only after that does the macrotask B from setTimeout get a turn. Promise reactions always beat timers.',
  },
  {
    id: 'iq-6.5-priority',
    lessonId: '6.5',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is the difference between a microtask and a macrotask?',
    answer:
      'Microtasks, like promise reactions, are the express lane. After each piece of code, the loop drains all waiting microtasks before it touches anything else. Macrotasks, like timers and clicks, wait in a slower queue and only get a turn once the microtasks are empty. So microtasks always go first.',
  },
  {
    id: 'iq-6.5-await-microtask',
    lessonId: '6.5',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'After an await, is the rest of the function a microtask or a macrotask?',
    answer:
      'A microtask. When an awaited promise settles, the code after the await is queued as a microtask, so it runs before the next timer or click. This is why promise and async await work tends to run ahead of setTimeout callbacks.',
  },
  {
    id: 'iq-6.6-await',
    lessonId: '6.6',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What does await do to the function it is in?',
    answer:
      'await pauses that one function until the promise it is waiting on settles, then resumes with the value. While it is paused, the function steps off the stack so the thread is free to do other work. When the value is ready, the function picks up right where it left off.',
  },
  {
    id: 'iq-6.6-desugar',
    lessonId: '6.6',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print, and what does an async function return?',
    code: 'async function f() {\n  return 1\n}\nf().then((v) => console.log(v))',
    answer:
      'It prints 1. An async function always gives back a promise. Returning 1 makes a promise that fulfills with 1, so then receives 1 and logs it. async and await are a nicer way to write promises, and the result of an async function is still a promise.',
  },
  {
    id: 'iq-6.6-try-catch',
    lessonId: '6.6',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print?',
    code: 'async function load() {\n  try {\n    const n = await Promise.reject(new Error("no"))\n    console.log(n)\n  } catch (e) {\n    console.log("caught " + e.message)\n  }\n}\nload()',
    answer:
      'It prints caught no. With async await, a rejected promise makes the await throw, so plain try and catch handle it, just like normal errors. The rejected value becomes the caught error. This is why async await lets you use one familiar try and catch for async failures.',
  },
  {
    id: 'iq-6.7-two-await',
    lessonId: '6.7',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What is happening here, and why are there two awaits?',
    code: 'const res = await fetch("/api/user")\nconst data = await res.json()\nconsole.log(data.name)',
    answer:
      'It reads the name from the response. The first await waits for the response to arrive. The second await waits for its body to be read and turned from JSON text into an object. Two awaits are needed: one for the response, one for its body.',
  },
  {
    id: 'iq-6.7-ok-guard',
    lessonId: '6.7',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'After a fetch, why check response.ok before reading the data?',
    answer:
      'Because fetch does not treat a 404 or 500 as a failure by itself. The request arrived, so the promise fulfills even when the server said no. response.ok is true only for success status codes. You check it first so you do not read an error page as if it were good data.',
  },
  {
    id: 'iq-6.8-all',
    lessonId: '6.8',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and in what order do the results come?',
    code: 'const [a, b] = await Promise.all([Promise.resolve(1), Promise.resolve(2)])\nconsole.log(a, b)',
    answer:
      'It prints 1 2. Promise.all starts all the promises together and waits for every one to finish. It gives back the results in the same order as the inputs, not the order they finished. This runs work in parallel instead of one after another.',
  },
  {
    id: 'iq-6.8-family',
    lessonId: '6.8',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is the difference between Promise.all, allSettled, and race?',
    answer:
      'all waits for every promise and fails fast if any one rejects. allSettled waits for every promise and reports each outcome, success or failure, without failing. race settles as soon as the first promise settles, whether it succeeded or failed. You pick by whether you need all results, every outcome, or just the fastest.',
  },
  {
    id: 'iq-6.8-parallel-vs-serial',
    lessonId: '6.8',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is the difference between awaiting two fetches one after another and using Promise.all?',
    answer:
      'Awaiting them one after another runs them in series: the second only starts after the first finishes, so the times add up. Promise.all starts both at once and waits for both, so they overlap and the total is about the time of the slower one. Use all when the jobs do not depend on each other.',
  },
  {
    id: 'iq-6.9-states',
    lessonId: '6.9',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What states does a typical data fetch move through in a UI?',
    answer:
      'It usually starts in loading while the request is out. Then it lands in either data, when the response is good, or error, when something failed. From there it is done. Handling all three, loading, data, and error, is what makes a fetch feel reliable.',
  },
  {
    id: 'iq-6.9-error-flow',
    lessonId: '6.9',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'In an async flow, how do you handle a request that might fail?',
    answer:
      'You wrap the awaits in try and catch. The try holds the fetch and the parsing. If the network fails or you throw on a bad status, control jumps to catch, where you set an error state instead of crashing. A finally can turn off the loading flag either way.',
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
