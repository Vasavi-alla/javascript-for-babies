/**
 * Newbie-first phase introductions, shown on each phase's own page.
 * Writing rule (see memory + 03-DESIGN-SYSTEM.md voice): every word must make
 * sense to someone who has never coded. Plain words, one analogy, terms defined.
 */

export interface KeyTerm {
  term: string
  meaning: string
}

export interface PhaseIntro {
  /** The motivation — what breaks without this? Shown first, before any explanation. */
  whyNeeded: string[]
  /** 2–3 short paragraphs in plain language, with an analogy. */
  plainWords: string[]
  /** Small glossary — the words this phase will make you fluent in. */
  keyTerms: KeyTerm[]
  /** "After this phase you can…" — concrete, checkable abilities. */
  youCan: string[]
}

export const PHASE_INTROS: Record<number, PhaseIntro> = {
  0: {
    whyNeeded: [
      'Why spend a whole phase before writing any code? Because everything confusing about programming becomes simple once you know what the machine actually does with your instructions. Learners who skip this end up memorizing spells that sometimes work; you’ll be giving orders you understand.',
    ],
    plainWords: [
      'Before writing a single line of code, meet the thing you’ll be talking to. A computer is incredibly fast, perfectly obedient, and has zero imagination — it does exactly what it’s told, nothing more. A program is simply a list of instructions for it, written down in advance.',
      'JavaScript is one language for writing those instructions. When you open a website, your browser contains a little machine (called an engine) that reads JavaScript and performs it, line by line, top to bottom — millions of instructions per second.',
      'In this phase there’s almost no code. Instead, you’ll watch how the machine thinks, so that later nothing it does feels like magic.',
    ],
    keyTerms: [
      { term: 'program', meaning: 'A written list of instructions a computer follows, in order.' },
      { term: 'code', meaning: 'The text of those instructions, written in a language like JavaScript.' },
      { term: 'engine', meaning: 'The part of the browser that reads your JavaScript and actually performs it. Chrome’s is called V8.' },
      { term: 'console', meaning: 'A little window where your program can print messages to you — your first two-way conversation with the machine.' },
      { term: 'memory (RAM)', meaning: 'The machine’s short-term workspace: a huge wall of tiny numbered boxes where running programs keep things.' },
      { term: 'error', meaning: 'Not a failure — a message from the machine saying “I didn’t understand this part, here’s where I got stuck.”' },
    ],
    youCan: [
      'Explain to a friend what a program actually is',
      'Say where JavaScript runs and what an engine does',
      'Print a message with console.log',
      'Read an error message calmly and find the line it points to',
    ],
  },
  1: {
    whyNeeded: [
      'Try to imagine a program that can’t remember. You type your name into an app — and one instruction later, it’s gone. A game where the score can’t be kept. A shopping cart that forgets each item the moment you add the next. Useless, right? Programs are only useful because they can hold on to things while they work.',
      'A variable IS that remembering. And it gives the remembered thing a name, so later instructions can talk about it: “add the price to the total” only works because price and total are names pointing at stored values. Every username on a screen, every score, every cart total you have ever seen was a variable in someone’s program.',
    ],
    plainWords: [
      'This is the foundation everything else stands on. Every app you’ve ever used — WhatsApp, YouTube, a bank app — is at its core just values being remembered and changed. A value is one piece of data: the number 25, the text "hello", the answer true.',
      'A variable is how a program remembers a value: the machine reserves one of its memory boxes, puts the value inside, and ties a name to the box — like a label on a jar. From then on, using the name means “go look in that jar.” That’s it. That’s the big secret.',
      'Take this phase slowly. If variables, values, and types become truly obvious to you, every later phase gets easier — functions, objects, even Playwright tests are all built from these same jars.',
    ],
    keyTerms: [
      { term: 'value', meaning: 'One piece of data: 25, "hello", or true.' },
      { term: 'variable', meaning: 'A named memory box holding one value, so the program can use it later by name.' },
      { term: 'declare', meaning: 'Creating the variable — “machine, reserve a box and call it age.”' },
      { term: 'assign', meaning: 'Putting a value into the box. The = sign means “put this in”, NOT “equals”.' },
      { term: 'type', meaning: 'What kind of value something is: number, text (string), true/false (boolean)… The kind decides what you can do with it.' },
      { term: 'undefined vs null', meaning: 'undefined = “nobody ever put anything in this box.” null = “someone deliberately put nothing in it.”' },
    ],
    youCan: [
      'Create a variable and draw what happened in memory',
      'Explain why changing a variable doesn’t move its label',
      'Name the basic types and check one with typeof',
      'Predict tricky results like "5" + 5 — and explain why',
    ],
  },
  2: {
    whyNeeded: [
      'A program that can’t choose does exactly the same thing every single run — it could never check a password, apply a discount, or decide whether a test passed. And without loops, checking 500 items would mean writing the same line 500 times. Choosing and repeating are what turn a list of instructions into actual behavior.',
    ],
    plainWords: [
      'So far, programs run straight down like a shopping list. Real programs feel smart because they can do two more things: choose between paths, and repeat work without getting tired.',
      'Choosing works like a fork in a road: the program checks a condition (a question whose answer is true or false) and takes one branch or the other. Repeating is a loop: “keep doing this until I say stop.” A loop that checks 10,000 items takes the machine a blink.',
      'Almost every bug you’ll ever hunt as a tester lives in a choice or a loop that went the wrong way — so we’ll watch them run step by step until the path is always visible in your head.',
    ],
    keyTerms: [
      { term: 'condition', meaning: 'A yes/no question the program asks, like age >= 18. The answer is always true or false.' },
      { term: 'branch', meaning: 'One of the paths the program can take after checking a condition (the if part or the else part).' },
      { term: 'loop', meaning: 'A block of code the machine repeats again and again while a condition stays true.' },
      { term: 'iteration', meaning: 'One single lap around a loop.' },
      { term: 'infinite loop', meaning: 'A loop whose stop-condition never becomes false — the machine obediently repeats forever and the page freezes.' },
      { term: 'truthy / falsy', meaning: 'JavaScript can treat ANY value as a yes or no. Six special values count as “no” (falsy); everything else counts as “yes”.' },
    ],
    youCan: [
      'Trace which branch an if/else will take, before running it',
      'Write a loop and say exactly how many times it runs',
      'Spot why a loop never stops — or never starts',
      'List the falsy values from memory',
    ],
  },
  3: {
    whyNeeded: [
      'Real programs are thousands of instructions. Without functions you’d copy-paste the same lines everywhere — and fixing one mistake would mean hunting it down in fifty places. Functions let you build a piece of behavior once, name it, trust it, and reuse it forever. They’re how big programs stay sane, and how you’ll structure every automated test you ever write.',
    ],
    plainWords: [
      'Imagine writing the same 10 lines every time you need them — or building a machine once and pressing its button forever. A function is that machine: it takes inputs, does its work, and hands back an output. Name it once, use it a thousand times.',
      'Functions also introduce the two ideas people call “hard” — scope and closures. Scope just answers: “from this line, which variables can I see?” (Picture soap bubbles inside bubbles: inner bubbles can see out, outer ones can’t see in.) A closure is a function that walks away carrying a little backpack of the variables from where it was born.',
      'They’re only hard when described in words. Watched as pictures, they’re almost obvious — and they’re the favorite interview questions in JavaScript, so we’ll master them properly.',
    ],
    keyTerms: [
      { term: 'function', meaning: 'A named, reusable machine: inputs go in, work happens, one output comes back.' },
      { term: 'parameter vs argument', meaning: 'A parameter is the machine’s labeled input slot; an argument is the actual value you drop into it for one call.' },
      { term: 'return value', meaning: 'What the function hands back to whoever called it. Different from printing to the console!' },
      { term: 'scope', meaning: 'The region of code where a variable is visible. Inner code sees outer variables; never the other way.' },
      { term: 'closure', meaning: 'A function that remembers the variables from the place it was created — even after that place has finished running.' },
      { term: 'callback', meaning: 'A function you hand to another function, saying “run this when it’s time.”' },
    ],
    youCan: [
      'Write and call functions with parameters and return values',
      'Explain the return-vs-console.log difference (the classic confusion)',
      'Draw scope bubbles for a piece of code and predict what each line can see',
      'Explain a closure with the backpack picture — well enough to teach it',
    ],
  },
  4: {
    whyNeeded: [
      'With one variable per value, a list of 200 test results would need 200 separate variables — result1 through result200 — and a loop couldn’t even visit them one by one. Real data comes in groups, so programs need containers for groups: arrays for ordered lists, objects for labeled bundles. Every API response and every test report you’ll ever handle is built from these two.',
    ],
    plainWords: [
      'One jar per value is fine for age — but real data comes in groups: a list of 200 test results, a user with a name, email and password. Arrays are ordered lists (numbered shelf slots); objects are labeled bundles (a locker with named drawers).',
      'This phase also holds the single most important “gotcha” in JavaScript: for arrays and objects, a variable’s box doesn’t hold the thing itself — it holds an arrow pointing to it. Copy the variable and you copy the arrow, not the thing. Two names, one object. Change it through either name and “both” change.',
      'That one picture — arrows, not things — explains an entire family of bugs you will absolutely meet in real test code. You’ll see it animated until it’s impossible to forget.',
    ],
    keyTerms: [
      { term: 'array', meaning: 'An ordered list of values on numbered shelf slots. Counting starts at 0.' },
      { term: 'index', meaning: 'A slot’s number in an array. The first item is index 0.' },
      { term: 'object', meaning: 'A bundle of labeled values: { name: "Lijas", role: "tester" }. Each label is a key, each content a value.' },
      { term: 'reference', meaning: 'The “arrow” a variable holds instead of the object itself. Copying the variable copies the arrow — both point at the same object.' },
      { term: 'mutation', meaning: 'Changing an object or array in place. Everyone holding an arrow to it sees the change.' },
      { term: 'JSON', meaning: 'A text format for shipping objects around — how servers and tests exchange data. You’ll live in it as an automation tester.' },
    ],
    youCan: [
      'Store and read grouped data with arrays and objects',
      'Draw the arrows: predict when changing one variable affects another',
      'Transform lists with map, filter and reduce — and narrate each step',
      'Read and write JSON comfortably',
    ],
  },
  5: {
    whyNeeded: [
      'Sooner or later JavaScript will do something that looks impossible: a variable usable “before” the line that creates it, a this that means different things on different days. If you only know syntax, these look like the language being broken. With the hood open, they become predictable — and they happen to be the exact questions JavaScript interviewers love to ask.',
    ],
    plainWords: [
      'You can drive a car without knowing what’s under the hood — until it makes a strange noise. This phase opens JavaScript’s hood: how it reads your file in two passes before running it, how every function call stacks a new tray on a pile (the call stack), and how objects quietly inherit abilities from each other.',
      'Nothing new gets built here; instead, things you’ve already seen stop being mysterious. Why can you sometimes use a thing before the line that creates it (hoisting)? Why does the keyword this keep changing meaning? Where do old values go (garbage collection)?',
      'This is also interview country: these exact questions decide “knows JavaScript” vs “memorized JavaScript.” You’ll be in the first group.',
    ],
    keyTerms: [
      { term: 'call stack', meaning: 'The machine’s pile of “what am I in the middle of?” trays. Calling a function adds a tray; returning removes it.' },
      { term: 'execution context', meaning: 'The workspace created for each function call — its own variables, its own view of the world.' },
      { term: 'hoisting', meaning: 'Before running your code, the engine first scans it and registers every declaration. Some things are therefore usable “early.”' },
      { term: 'this', meaning: 'A special word whose meaning is decided by HOW a function is called, not where it was written.' },
      { term: 'prototype', meaning: 'An object other objects fall back to: “if I don’t have it, ask my prototype.” How JavaScript shares abilities.' },
      { term: 'class', meaning: 'Tidier handwriting for building objects with shared methods — under the hood, it’s still prototypes.' },
      { term: 'garbage collection', meaning: 'The engine’s cleaner: values nothing points to anymore get swept away automatically.' },
      { term: 'try / catch / finally', meaning: 'Attempt risky code, catch what goes wrong instead of crashing, and finally always runs — cleanup you can count on.' },
    ],
    youCan: [
      'Predict the output of hoisting puzzles — and explain the two passes',
      'Narrate the call stack for any piece of code',
      'Say what this is in each of the four calling styles',
      'Explain how a to-do item “knows” methods it never defined (prototypes)',
      'Write a class and explain the prototype machinery it’s shorthand for',
      'Catch a thrown error with try/catch/finally instead of crashing',
    ],
  },
  6: {
    whyNeeded: [
      'Some things a program asks for are slow — fetching data across the internet takes an eternity in machine time. If JavaScript simply waited, the whole page would freeze with it: no clicks, no typing, no scrolling, until the data arrived. Async is how one worker stays responsive while slow things cook. And since every single Playwright command works this way, an automation tester lives and breathes this phase.',
    ],
    plainWords: [
      'JavaScript does exactly one thing at a time — it is single-threaded. Code that runs one step after another, each step waiting for the previous one, is called synchronous. That’s fine until one step is slow (like fetching data across the internet): synchronous waiting would block everything — frozen page, dead buttons.',
      'The fix is to be asynchronous, or non-blocking: start the slow job, immediately move on, and get called back when the result is ready. Picture one waiter serving a whole café: they don’t stand at your table while the kitchen cooks (blocking); they take your order, serve others, and return when the bell rings (non-blocking). The bell system is JavaScript’s event loop.',
      'This single idea is the heart of the browser AND of Node.js — and of every Playwright test you’ll ever write (they’re async from the first line). It’s also where the visualizations in this app do their finest work.',
    ],
    keyTerms: [
      { term: 'single-threaded', meaning: 'JavaScript has one worker doing one thing at a time — one waiter for the whole café.' },
      { term: 'synchronous', meaning: 'Step-by-step: each instruction finishes completely before the next begins.' },
      { term: 'blocking', meaning: 'When a slow synchronous step makes everything else wait — the frozen-page feeling.' },
      { term: 'asynchronous / non-blocking', meaning: 'Start a slow job, keep working on other things, handle the result when it arrives.' },
      { term: 'event loop', meaning: 'The coordinator: watches for finished jobs and hands their results back to JavaScript the moment it’s free.' },
      { term: 'promise', meaning: 'A receipt for a result that isn’t ready yet: “your data is coming — here’s what to do when it arrives (or fails).”' },
      { term: 'async / await', meaning: 'A friendlier way to write promise code so it READS like step-by-step code, while staying non-blocking underneath.' },
    ],
    youCan: [
      'Explain synchronous vs asynchronous and blocking vs non-blocking with the waiter analogy',
      'Predict the order console.log, setTimeout and promises print in — and why',
      'Fetch real data from an internet API and handle failure gracefully',
      'Explain why every Playwright test line has await in front of it',
    ],
  },
  7: {
    whyNeeded: [
      'JavaScript exists to make web pages come alive: menus that open, forms that complain, feeds that refresh without reloading. All of it works by editing the browser’s live model of the page — the DOM. For you specifically, this phase is the job: an automated test finds elements in this tree, acts on them, and reads the results back out of it. The DOM is your future workplace.',
    ],
    plainWords: [
      'Every web page’s structure is written in HTML — plain text wrapped in tags, like <li class="todo">buy milk</li>. The tag name (li) says what kind of thing this is; anything else inside the angle brackets, like class="todo", is an attribute — extra information about that one element. CSS is a separate language for how things LOOK (colors, spacing, layout) — and it uses the same kind of selectors you’re about to learn, just to say which elements to style instead of which ones to grab in code.',
      'A web page looks like a picture, but to the browser it’s a family tree of elements — the DOM. Every button, heading and input is a node on that tree, and JavaScript can find any node, read it, change it, or listen to it.',
      'Finding nodes is done with selectors — little address patterns like “the button inside the login form.” When a user clicks, an event ripples through the tree, and code can catch it at any level.',
      'Pay extra attention here: this tree is exactly what you’ll automate for a living. A Playwright test is, at heart, “find this element, act on it, check the result.” Testers who write good selectors are worth gold; this phase is where that skill starts.',
    ],
    keyTerms: [
      { term: 'HTML', meaning: 'The language a web page’s structure is written in — plain text wrapped in tags.' },
      { term: 'tag / attribute', meaning: 'A tag like <li> names what kind of thing an element is; an attribute like class="todo" (written inside the tag) adds extra information about it.' },
      { term: 'the tags you’ll keep meeting', meaning: 'body (the visible page), h1–h3 (headings), p (paragraph), ul / li (bulleted list / one item in it), a (link), button, input (a form field), form, div / span (plain boxes for grouping).' },
      { term: 'CSS', meaning: 'A separate language for how things look — colors, spacing, layout. Uses the same kind of selectors you’ll write to find elements.' },
      { term: 'DOM', meaning: 'The Document Object Model — the live family tree the browser builds from HTML. Change the tree and the page changes instantly.' },
      { term: 'element / node', meaning: 'One item in the tree: a button, a paragraph, an image.' },
      { term: 'selector', meaning: 'A pattern for finding elements, like ".login-form button" — the address system of the page.' },
      { term: 'event', meaning: 'A signal that something happened: a click, a keypress, a form submit. Code can listen and react.' },
      { term: 'event bubbling', meaning: 'Events ripple upward from the element to its ancestors — so a parent can hear its children’s events.' },
      { term: 'rendering', meaning: 'The browser turning the tree into pixels. Elements can exist before they’re visible — the root cause of flaky tests.' },
    ],
    youCan: [
      'Read an HTML tag and its attributes, and explain what CSS is for',
      'Sketch the DOM tree for a simple page',
      'Write a selector to hit any element — first try',
      'Wire up events and explain how one listener can watch 100 buttons',
      'Explain why an element can exist but not yet be clickable (flaky-test seed)',
    ],
  },
  8: {
    whyNeeded: [
      'Everything so far fits in one file. Real projects don’t: they’re dozens of files working together, plus tools written by other people, installed with a command and run from a terminal. Playwright itself is an npm package that runs on Node.js — so this phase is literally the setup routine of every job project you’ll touch.',
    ],
    plainWords: [
      'Real projects aren’t one file — they’re many files working together, plus code written by thousands of strangers. Modules let files share code with each other; npm is the world’s shared toolbox where that stranger-code lives (Playwright itself is one of those tools).',
      'You’ll also get a first, brief look at Node.js — the way JavaScript runs outside the browser, in a terminal. Phase 9 goes deep on it; for now, just know that npm and Playwright itself are both Node programs.',
      'Add professional debugging (breakpoints instead of console.log everywhere) and a first taste of TypeScript, and you’ll be at home in any real-world test codebase.',
    ],
    keyTerms: [
      { term: 'module', meaning: 'One file that can share (export) its code and borrow (import) from others.' },
      { term: 'npm', meaning: 'The giant public library of JavaScript packages, plus the command that installs them into your project.' },
      { term: 'package', meaning: 'A ready-made bundle of someone else’s code you can install and use — like Playwright.' },
      { term: 'terminal / CLI', meaning: 'The text window where you type commands — how test suites are started and CI servers work.' },
      { term: 'CI', meaning: 'Continuous Integration — a robot server that reinstalls and re-runs the whole test suite automatically on every code change. Phase 11 sets one up for real.' },
      { term: 'git & the repo', meaning: 'git = the project’s version-control memory: it records every change ever made and shares them with the team. The repo is the shared project folder it guards; “committing” = recording into it.' },
      { term: 'TypeScript', meaning: 'JavaScript plus type labels the machine checks BEFORE running — catching mistakes early. Most Playwright projects use it.' },
    ],
    youCan: [
      'Split code across files with import/export',
      'Create a project, install packages, and run npm scripts',
      'Debug with breakpoints instead of console.log guesswork',
    ],
  },
  9: {
    whyNeeded: [
      'Every Playwright test you will ever write runs as a Node.js program, not inside a browser tab — and so does its test runner, and the CI server that runs it at 3am. If you don’t know what changes when JavaScript leaves the browser (no DOM, no window — but new powers instead), the terminal output, the CI logs, and half of Playwright’s setup will feel like unexplained magic.',
    ],
    plainWords: [
      'Every lesson so far ran JavaScript inside a browser tab. Node.js is the exact same language, the exact same V8 engine (0.2) — just with the browser walls removed. No DOM, no window, nothing to click. In exchange it gets powers a browser deliberately withholds: reading and writing real files, talking to the operating system, running as a server.',
      'You’ll work in the terminal properly for the first time: typing commands, reading a script’s output and its stack trace when it crashes, and understanding exit codes — the single number a finished script hands back that tells a CI server “I passed” or “I failed.”',
      'This phase also revisits Phase 6’s event loop from Node’s side — same one-thread, non-blocking model, different backstage crew (libuv instead of the browser’s Web APIs) — and gives you process.argv and process.env: exactly how a real Playwright suite reads a BASE_URL or a secret without hard-coding it.',
    ],
    keyTerms: [
      { term: 'Node.js', meaning: 'A program that runs JavaScript outside the browser — no DOM, no window; new powers instead (files, servers, the OS).' },
      { term: 'terminal / CLI', meaning: 'The text window where you type commands and read a script’s output — how every real test suite actually gets run.' },
      { term: 'REPL', meaning: 'A live JavaScript prompt in the terminal — type an expression, see its value immediately.' },
      { term: 'process.argv', meaning: 'The list of extra words typed after a command — how a script accepts input from whoever ran it.' },
      { term: 'process.env', meaning: 'A script’s environment variables — where secrets and settings like BASE_URL actually live in real test suites.' },
      { term: 'exit code', meaning: 'The single number a script hands back when it finishes: 0 means success, anything else means CI marks the run failed.' },
      { term: 'CI', meaning: 'Continuous Integration — the robot server that re-runs your whole suite on every code change and reads exit codes to decide green or red.' },
      { term: 'fs (file system)', meaning: 'Node’s toolbox for reading and writing real files — where test reports and screenshots actually go.' },
    ],
    youCan: [
      'Explain what changes (and what doesn’t) when JS runs outside the browser',
      'Run a script from the terminal and read its output and stack trace',
      'Read command-line arguments and environment variables in a script',
      'Read and write a real file with Node’s fs module',
    ],
  },
  10: {
    whyNeeded: [
      'Every change to an app risks silently breaking something that used to work. Re-checking everything by hand after every change is slow, mind-numbing, and error-prone — so companies pay engineers to teach machines to do the checking instead. That job is the one you’re heading for, and this phase is its way of thinking.',
    ],
    plainWords: [
      'Software breaks quietly: a fix over here snaps something over there (a regression), and nobody notices until a customer does. Testing is the craft of noticing first — writing checks that re-verify the important promises automatically, every single time the code changes.',
      'A test has a simple rhythm called Arrange–Act–Assert: set the stage, do the thing, check the result. An assertion is the checking part: “I expect the total to be 115 — is it?” Green means the promise holds; red means you caught a bug before a user did.',
      'You’ll also learn the strategy layer — the testing pyramid — which explains why teams write many small fast tests and fewer big slow ones, and exactly where your future Playwright tests sit in that picture.',
    ],
    keyTerms: [
      { term: 'test case', meaning: 'One automated check of one promise: “given this input, the app should do that.”' },
      { term: 'assertion', meaning: 'The moment of truth inside a test: expect(actual).toBe(expected).' },
      { term: 'regression', meaning: 'Something that used to work, broken by a later change. The main monster tests exist to catch.' },
      { term: 'unit / integration / E2E', meaning: 'Test sizes: one function alone; several parts together; the whole app driven like a real user (that’s Playwright).' },
      { term: 'test runner', meaning: 'The tool that finds your tests, runs them, and reports green/red — Vitest here, Playwright’s runner later.' },
      { term: 'mock', meaning: 'A cardboard stand-in for a real dependency (like a payment server) so tests stay fast, cheap and predictable.' },
    ],
    youCan: [
      'Explain to anyone why automated tests exist (in money terms)',
      'Structure a test with Arrange–Act–Assert',
      'Write and run real Vitest tests and read their output',
      'Place any testing task on the pyramid and justify it',
    ],
  },
  11: {
    whyNeeded: [
      'Manual testing means clicking through the same login form for the thousandth time, every release, forever. Playwright gives your JavaScript robot hands: it drives a real browser through those clicks in seconds, identically, every time the code changes. It’s the fastest-growing automation tool in the industry — and the skill this entire journey was aimed at.',
    ],
    plainWords: [
      'Everything converges here. Playwright gives your code robot hands: it opens a real browser, clicks real buttons, types into real forms, and checks real results — exactly like a human tester, but in seconds and never bored.',
      'Your whole journey pays off at once: async/await drives every line, selectors become locators, the DOM knowledge tells you what’s clickable, JSON handles the data. Playwright’s superpower is auto-waiting — it patiently retries until elements are actually ready, killing the “flaky test” misery that older tools were famous for.',
      'By the end you’ll structure suites professionally (page objects, fixtures), mock network calls, run tests in parallel on CI, and debug failures with traces — the actual day-to-day job of an automation tester.',
    ],
    keyTerms: [
      { term: 'browser automation', meaning: 'Code driving a real browser — navigating, clicking, typing, reading — instead of a human.' },
      { term: 'locator', meaning: 'Playwright’s way of pointing at an element, preferably how a USER sees it: getByRole("button", { name: "Log in" }).' },
      { term: 'auto-waiting', meaning: 'Before acting, Playwright automatically waits until the element is visible, stable and enabled — no manual sleep() hacks.' },
      { term: 'headless', meaning: 'Running the browser invisibly (no window) — how tests run fast on servers.' },
      { term: 'page object model', meaning: 'A tidy pattern: one class per page of the app, holding its locators and actions, so tests read like English.' },
      { term: 'fixture', meaning: 'Ready-made ingredients handed to each test (like a fresh logged-in page), keeping tests isolated and clean.' },
      { term: 'CI', meaning: 'Continuous Integration — a server that runs your whole test suite automatically on every code change.' },
      { term: 'flaky test', meaning: 'A test that sometimes passes, sometimes fails with no code change — the enemy. You’ll learn its causes and cures.' },
    ],
    youCan: [
      'Write end-to-end tests that survive UI redesigns',
      'Structure a professional suite with page objects and fixtures',
      'Mock APIs, reuse login state, and test pure API endpoints',
      'Run suites in parallel on CI and debug failures from traces — job-ready',
    ],
  },
}
