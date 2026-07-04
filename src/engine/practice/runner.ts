/**
 * Runs learner-typed JavaScript for real, in a throwaway Web Worker so an
 * accidental infinite loop can't freeze the app — the worker is terminated
 * after a timeout. console.log is captured and returned line by line.
 */

export interface RunResult {
  lines: string[]
  error?: string
  timedOut?: boolean
}

const WORKER_SOURCE = `
self.onmessage = function (e) {
  var logs = [];
  function fmt(v) {
    if (typeof v === 'string') return v;
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'function') return 'f ' + (v.name || '(anonymous)');
    try { var j = JSON.stringify(v); return j === undefined ? String(v) : j; } catch (err) { return String(v); }
  }
  function log() { logs.push(Array.prototype.map.call(arguments, fmt).join(' ')); }
  var fakeConsole = { log: log, info: log, warn: log, error: log };
  // The code runs inside an async wrapper so await/promises/timers work;
  // after it settles, a short grace window lets queued callbacks
  // (setTimeout with small delays, promise chains) finish logging.
  function done(err) {
    setTimeout(function () {
      var out = { lines: logs };
      if (err) {
        var name = err && err.name ? err.name + ': ' : '';
        var msg = err && err.message ? err.message : String(err);
        out.error = name + msg;
      }
      self.postMessage(out);
    }, 250);
  }
  try {
    var r = new Function('console', 'return (async function () {\\n' + e.data + '\\n})();')(fakeConsole);
    Promise.resolve(r).then(function () { done(); }, function (err) { done(err); });
  } catch (err) {
    done(err);
  }
};
`

export function runCode(code: string, timeoutMs = 2000): Promise<RunResult> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'application/javascript' }))
    const worker = new Worker(url)
    let settled = false

    function finish(result: RunResult) {
      if (settled) return
      settled = true
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve(result)
    }

    const timer = window.setTimeout(() => {
      finish({
        lines: [],
        timedOut: true,
        error: `The code never finished — most likely a loop with no way out. (The machine was stopped after ${timeoutMs / 1000}s.)`,
      })
    }, timeoutMs)

    worker.onmessage = (e) => {
      window.clearTimeout(timer)
      finish(e.data as RunResult)
    }
    worker.onerror = (e) => {
      window.clearTimeout(timer)
      finish({ lines: [], error: e.message || 'Something went wrong while running the code.' })
    }
    worker.postMessage(code)
  })
}
