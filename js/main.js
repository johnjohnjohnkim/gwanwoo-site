// gwanwoo.dev — site interactions

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Scroll progress bar ──────────────────────────────────────────────────────

const progressBar = document.querySelector('.scroll-progress');
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = max > 0 ? (window.scrollY / max) * 100 + '%' : '0';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ── Scroll reveal ────────────────────────────────────────────────────────────

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .pipeline').forEach(el => revealObserver.observe(el));

// ── Scroll-spy nav ───────────────────────────────────────────────────────────

const spyLinks = document.querySelectorAll('.topnav-links a[data-spy]');
const spySections = [...spyLinks].map(a => document.getElementById(a.dataset.spy));

const spyObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      spyLinks.forEach(a => a.classList.toggle('active', a.dataset.spy === entry.target.id));
    }
  }
}, { rootMargin: '-40% 0px -55% 0px' });

spySections.forEach(s => s && spyObserver.observe(s));

// ── RBCheck: SMS → parsed transaction demo ──────────────────────────────────
// Simulated messages in the same formats the real parser handles.

const SMS_SAMPLES = [
  {
    text: 'RBC: PURCHASE of $8.75 AT TIM HORTONS #4821. STOP-TXT HELP-TXT HELP',
    type: 'CC Purchase', amount: '$8.75', place: 'TIM HORTONS #4821',
  },
  {
    text: 'RBC: WITHDRAWAL of $60.00 from your account. STOP-TXT HELP-TXT HELP',
    type: 'Withdrawal', amount: '$60.00', place: '—',
  },
  {
    text: 'RBC: DEPOSIT of $250.00 to your account. STOP-TXT HELP-TXT HELP',
    type: 'Deposit', amount: '$250.00', place: '—',
  },
  {
    text: 'RBC: PAYMENT OF $132.40 received on your credit card. STOP-TXT HELP-TXT HELP',
    type: 'Credit Card Payment', amount: '$132.40', place: '—',
  },
];

const smsText = document.getElementById('sms-text');
const parseRow = document.getElementById('parse-row');
const pvType = document.getElementById('pv-type');
const pvAmount = document.getElementById('pv-amount');
const pvPlace = document.getElementById('pv-place');

function runSmsDemo() {
  let i = 0;

  function showSample(sample, done) {
    parseRow.classList.remove('parsed');
    pvType.textContent = pvAmount.textContent = pvPlace.textContent = '—';
    smsText.textContent = '';

    if (prefersReducedMotion) {
      smsText.textContent = sample.text;
      fillParsed(sample);
      setTimeout(done, 5000);
      return;
    }

    // Type the message out, then reveal the parsed fields
    let pos = 0;
    const typer = setInterval(() => {
      pos += 2;
      smsText.textContent = sample.text.slice(0, pos);
      if (pos >= sample.text.length) {
        clearInterval(typer);
        setTimeout(() => {
          fillParsed(sample);
          setTimeout(done, 3200);
        }, 450);
      }
    }, 22);
  }

  function fillParsed(sample) {
    pvType.textContent = sample.type;
    pvAmount.textContent = sample.amount;
    pvPlace.textContent = sample.place;
    parseRow.classList.add('parsed');
  }

  function next() {
    showSample(SMS_SAMPLES[i], () => {
      i = (i + 1) % SMS_SAMPLES.length;
      next();
    });
  }
  next();
}

// ── YOLight: simulated terminal ──────────────────────────────────────────────

const TERM_SCRIPT = [
  { t: 0,    line: '$ python tracker.py' },
  { t: 700,  line: 'Using device: cuda' },
  { t: 1300, line: 'Scanning for Govee devices...' },
  { t: 2200, line: '  + Found H6199 at 192.168.1.55' },
  { t: 2800, line: 'Done scanning. Found 1 device(s).' },
  { t: 3900, line: '[12:04:11] person detected      → lights ON' },
  { t: 5400, line: '[12:04:58] person lost          → grace period (3s)' },
  { t: 6600, line: '[12:05:00] person re-detected   → off cancelled' },
  { t: 8100, line: '[12:07:22] person lost          → grace period (3s)' },
  { t: 9600, line: '[12:07:25] room empty           → lights OFF' },
];
const TERM_LOOP_PAUSE = 4000;

const termBody = document.getElementById('term-body');

function runTerminal() {
  function cycle() {
    termBody.textContent = '';
    if (prefersReducedMotion) {
      termBody.textContent = TERM_SCRIPT.map(s => s.line).join('\n');
      setTimeout(cycle, 12000);
      return;
    }
    for (const step of TERM_SCRIPT) {
      setTimeout(() => { termBody.textContent += step.line + '\n'; }, step.t);
    }
    setTimeout(cycle, TERM_SCRIPT[TERM_SCRIPT.length - 1].t + TERM_LOOP_PAUSE);
  }
  cycle();
}

// Start each demo only once it scrolls into view
function startOnVisible(el, start) {
  if (!el) return;
  const obs = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      start();
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  obs.observe(el);
}

startOnVisible(document.getElementById('sms-demo'), runSmsDemo);
startOnVisible(document.getElementById('yolight-term'), runTerminal);
