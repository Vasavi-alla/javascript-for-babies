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
