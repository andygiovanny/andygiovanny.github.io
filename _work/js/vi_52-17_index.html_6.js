
/* ═══ 52/17 DEEP-WORK TIMER ═══
   52-minute sprints, 17-minute unplugged breaks, auto-chained.
   Session-only sprint stats — they reset when you close or reload the tab. */
var WORK_S = 52 * 60, BREAK_S = 17 * 60, EXTEND_S = 5 * 60;
try {
  var _cts = JSON.parse(localStorage.getItem('tt_5217_minutes_v1') || 'null');
  if (_cts) {
    if (_cts.workMin > 0) WORK_S = Math.round(_cts.workMin * 60);
    if (_cts.breakMin > 0) BREAK_S = Math.round(_cts.breakMin * 60);
    if (_cts.extendMin > 0) EXTEND_S = Math.round(_cts.extendMin * 60);
  }
} catch (e) {}

var mode = 'idle';            // idle | work | break
var left = WORK_S, breakLeft = BREAK_S;
var hp = 100;
var timer = null;             // exactly ONE interval, ever

const $ = id => document.getElementById(id);
var DEFAULT_TITLE = document.title;   // restored whenever the timer is idle

/* single interval owner — clears before starting, prevents the 2s bug */
function runTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(tick, 1000);
}
function stopTimer() {
  if (timer) { clearInterval(timer); timer = null; }
}

/* ── mascot expression ──
   Five static SVG states (1 = full energy ... 5 = exhausted), swapped as
   the energy bar drains. No layered/moving parts. */
var CHICK_STATES = [1, 2, 3, 4, 5].map(function (i) { return '/assets/images/' + i + '.svg'; });
var chickCur = 0;
function paintFace() {
  const pick = hp >= 80 ? 1 : hp >= 60 ? 2 : hp >= 40 ? 3 : hp >= 20 ? 4 : 5;
  if (pick !== chickCur) { chickCur = pick; $('tomato').src = CHICK_STATES[pick - 1]; }
  $('vignette').style.opacity = hp < 40 ? ((40 - hp) / 40 * .8).toFixed(2) : 0;
}

/* ── mascot videos: sprint/break × light/dark loops (same pattern as the
   Flowtime duck). Any slot with no working file silently keeps the SVG
   states above, so the page is complete even before the mp4s land. ── */
var chickVideo = $('chickVideo');
var CHICK_TRIES = {
  'work-light':  ['5217-work-light.mp4', '5217-work-light.mp4.mp4', '5217 work light.mp4', 'work-light.mp4'],
  'work-dark':   ['5217-work-dark.mp4', '5217-work-dark.mp4.mp4', '5217 work dark.mp4', 'work-dark.mp4'],
  'break-light': ['5217-break-light.mp4', '5217-break-light.mp4.mp4', '5217 break light.mp4', 'break-light.mp4'],
  'break-dark':  ['5217-break-dark.mp4', '5217-break-dark.mp4.mp4', '5217 break dark.mp4', 'break-dark.mp4']
};
var chickResolved = {};      // slot -> file name that worked
var chickToken = 0;          // invalidates stale candidate chains after a quick state/theme flip
var chickCurrentSlot = null; // skip reloads when state+theme didn't change (paint() calls this every tick)
function currentTheme() { return document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light'; }
function setChickVideo() {
  if (!chickVideo) return;
  var slot = (mode === 'break' ? 'break' : 'work') + '-' + currentTheme();
  if (slot === chickCurrentSlot && !chickVideo.error) return; // same slot already loaded OK -> don't touch it
  chickCurrentSlot = slot;
  var cands = CHICK_TRIES[slot] || [];
  var list = chickResolved[slot] ? [chickResolved[slot]].concat(cands) : cands.slice();
  if (!list.length) { showChickImg(); return; }
  chickToken++;
  tryLoadChick(slot, list, 0, chickToken);
}
function showChickImg() {
  if (chickVideo) { chickVideo.removeAttribute('src'); chickVideo.load && chickVideo.load(); }
  chickVideo.style.display = 'none';
  $('tomato').style.display = '';
}
function tryLoadChick(slot, list, i, tok) {
  if (tok !== chickToken) return;                       // stale chain
  if (i >= list.length) { showChickImg(); return; }     // nothing found -> SVG fallback
  var t = chickVideo.currentTime || 0, wasPlaying = !chickVideo.paused && !chickVideo.ended;
  var onErr = function () {
    chickVideo.removeEventListener('error', onErr);
    chickVideo.removeEventListener('loadedmetadata', onMeta);
    tryLoadChick(slot, list, i + 1, tok);
  };
  var onMeta = function () {
    chickVideo.removeEventListener('error', onErr);
    chickVideo.removeEventListener('loadedmetadata', onMeta);
    chickResolved[slot] = list[i];
    $('tomato').style.display = 'none';
    chickVideo.style.display = 'block';
    try { if (isFinite(chickVideo.duration)) chickVideo.currentTime = t % chickVideo.duration; } catch (e) {}
    if (wasPlaying || chickVideo.autoplay) { var p = chickVideo.play(); if (p && p.catch) p.catch(function () {}); }
  };
  chickVideo.addEventListener('error', onErr);
  chickVideo.addEventListener('loadedmetadata', onMeta);
  chickVideo.src = '/assets/images/' + list[i];
  chickVideo.load();
}
new MutationObserver(function () { setChickVideo(); })
  .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
setInterval(function () { if (chickVideo && chickVideo.error) setChickVideo(); }, 2000);
setChickVideo();

/* ── HUD ── */
function fmt(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
function paint() {
  var shown = mode === 'break' ? fmt(breakLeft) : fmt(left);
  $('digits').textContent = shown;
  document.title = mode === 'idle' ? DEFAULT_TITLE
    : mode === 'break' ? '(' + shown + ') Break — walk away from the screen'
    : '(' + shown + ') 52/17 Timer';
  $('energyFill').style.width = hp + '%';
  $('energyFill').style.background = hp > 60 ? 'linear-gradient(90deg,#7fa653,#b5cf7d)'
    : hp > 30 ? 'linear-gradient(90deg,#E0A458,#f0c47f)' : 'linear-gradient(90deg,#DE4B3A,#F0806F)';
  $('energyPct').textContent = Math.round(hp) + '%';
  $('playIcon').style.display = timer ? 'none' : '';
  $('pauseIcon').style.display = timer ? '' : 'none';
  paintFace();
  setChickVideo();
  paintTracker();
}

/* ── flow ── */
function tick() {
  if (mode === 'work') {
    left--; hp = Math.max(0, left / WORK_S * 100);
    sessionWorkSec++;               // log accrues only while the sprint is actually running
    if (left <= 0) openBreak();
  } else if (mode === 'break') {
    breakLeft--;
    if (breakLeft <= 0) completeBreak();
  }
  paint();
}
function openBreak() {
  stopTimer();
  playEyeChime();
  logSprint();                       // a 52-minute sprint just landed
  mode = 'break'; breakLeft = BREAK_S;
  ideaStart();                       // rotating unplug suggestions
  $('breakPanel').classList.add('open');
  runTimer();
  paint();
}
function completeBreak() {
  ideaStop(); $('breakPanel').classList.remove('open');
  playEyeChime();
  hp = 100;
  toast('⚡ đã phục hồi — sprint tiếp theo bắt đầu ngay');
  mode = 'work'; left = WORK_S;
  runTimer();
  paint();
}
function skipBreak() {
  ideaStop(); $('breakPanel').classList.remove('open');
  toast('đã bỏ qua — không phán xét, nhưng giờ nghỉ CHÍNH LÀ phương pháp 😔');
  hp = 100;
  mode = 'work'; left = WORK_S;
  runTimer();
  paint();
}
function extendBreak() {
  breakLeft += EXTEND_S;
  toast('+5 phút — nhưng sau đó hãy rời màn hình!');
  paint();
}

/* ── controls ── */
$('playBtn').onclick = () => {
  if (mode === 'break') return;
  if (mode === 'idle') { mode = 'work'; left = WORK_S; }
  if (timer) { stopTimer(); } else { runTimer(); }   // toggle pause
  paint();
};
$('resetBtn').onclick = () => {
  stopTimer(); mode = 'idle'; left = WORK_S; hp = 100;
  ideaStop(); $('breakPanel').classList.remove('open'); paint();
};
$('skipBtn').onclick = () => {
  if (mode === 'work' || mode === 'idle') {
    mode = 'work'; left = 1;
    if (!timer) runTimer();
  }
};
$('snoozeBtn').onclick = extendBreak;
$('skipBreakBtn').onclick = skipBreak;

/* ── keyboard shortcuts (same as custom-timer): Space = play/pause, → = skip ── */
document.addEventListener('keydown', function (e) {
  var ov = document.getElementById('ctOverlay');
  if (ov && ov.classList.contains('open')) return;
  var zo = document.getElementById('tm_zero_overlay');
  if (zo && !zo.classList.contains('d-none')) return;
  var tag = (e.target && e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
  if (e.code === 'Space') { e.preventDefault(); $('playBtn').click(); }
  else if (e.key === 'ArrowRight') { $('skipBtn').click(); }
});

/* ── toast ── */
var toastT = null;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ── notification chime (this timer's slot: 't5217' in the shared map) ── */
/* Synthesized fallback beep — used when the chime mp3 can't load
   (e.g. page opened locally without the assets folder). */
function beepFallback() {
  try {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    var ctx = new Ctx();
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.32);
    setTimeout(function () { try { ctx.close(); } catch (e) {} }, 700);
  } catch (e) {}
}
/* Play a chime file; if the relative path fails (page not at the repo root),
   retry from the live site root — same files the main timer uses
   (assets/sounds/, see tomato.js) — then fall back to the beep. */
function playChimeFile(src) {
  try {
    var a = new Audio(src);
    var fellBack = false;
    var fb = function () {
      if (fellBack) return;
      fellBack = true;
      if (src.indexOf('http') !== 0) playChimeFile('https://www.tomatotimers.com/' + src);
      else beepFallback();
    };
    a.addEventListener('error', fb, { once: true });
    var p = a.play();
    if (p && p.catch) p.catch(fb);
  } catch (e) {
    if (src.indexOf('http') !== 0) playChimeFile('https://www.tomatotimers.com/' + src);
    else beepFallback();
  }
}
function playEyeChime() {
  try {
    var map = JSON.parse(localStorage.getItem('tt_notify_sounds_v1') || '{}');
    var n = parseInt(map.t5217) || 1;
    var files = { 1: '/assets/sounds/beep.mp3', 2: '/assets/sounds/Notification 1.mp3',
                  3: '/assets/sounds/Notification 2.mp3', 4: '/assets/sounds/Notification 3.mp3',
                  5: '/assets/sounds/Notification 4.mp3', 6: '/assets/sounds/Notification 5.mp3' };
    playChimeFile(files[n] || files[1]);
  } catch (e) { beepFallback(); }
}

/* ── break activity roulette: rotating unplug ideas during the 17 min ── */
var BREAK_IDEAS = [
  'Đi đến cửa sổ — hoặc ra ngoài nếu được. Không điện thoại.',
  'Pha một thức uống. Chậm rãi. Rồi uống nó xa bàn làm việc.',
  'Xoay cổ chậm 5 vòng mỗi bên, vai thả lỏng.',
  'Nhìn điểm xa nhất có thể — để mắt thư giãn.',
  'Sắp xếp một thứ nhỏ gần bạn. Chỉ một thứ thôi.',
  'Ra ngoài hít thở không khí, dù chỉ hai phút.',
  'Không làm gì cả trong hai phút. Đó chính là ý nghĩa.',
  'Trả lời một tin nhắn bạn đã trì hoãn — rồi dừng lại.',
  'Vặn cổ tay và cẳng tay — mười giây chậm mỗi bên.',
  'Ăn gì đó thật nếu hôm nay bạn chưa ăn.'
];
var ideaTimer = null;
var ideaIdx = Math.floor(Math.random() * BREAK_IDEAS.length);   // each break starts on the NEXT tip
function ideaStart() {
  ideaIdx = (ideaIdx + 1) % BREAK_IDEAS.length;   // every break opens on the next tip
  $('breakIdea').textContent = BREAK_IDEAS[ideaIdx];
  ideaStop();
  ideaTimer = setInterval(function () {
    ideaIdx = (ideaIdx + 1) % BREAK_IDEAS.length;
    $('breakIdea').textContent = BREAK_IDEAS[ideaIdx];
  }, 45000);
}
function ideaStop() { if (ideaTimer) { clearInterval(ideaTimer); ideaTimer = null; } }

/* ── session log: lives in this tab only. Pausing the timer pauses the
   elapsed log (it accrues in tick while a sprint runs). Closing the tab
   finalizes the session into a small local history; a new tab = a new log. ── */
var DAILY_GOAL = 6;
var SESSIONS_KEY = 'tt_5217_sessions_v1';
var sessionSprints = 0;
var sessionWorkSec = 0;
function logSprint() {
  sessionSprints++;
  paintTracker();
}
function fmtDur(totalMin) {
  totalMin = Math.floor(totalMin);
  return totalMin >= 60 ? Math.floor(totalMin / 60) + 'h ' + (totalMin % 60) + 'm' : totalMin + 'm';
}
function sessionSummary() {
  return sessionSprints + (sessionSprints === 1 ? ' sprint' : ' sprints') + ' · ' +
         fmtDur(sessionWorkSec / 60) + ' focused — 52/17 timer';
}
function loadSessions() { try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]'); } catch (e) { return []; } }
var sessionFinalized = false;
function finalizeSession() {
  if (sessionFinalized) return;                            // pagehide + beforeunload can both fire
  sessionFinalized = true;
  if (!sessionSprints && sessionWorkSec < 60) return;      // under a minute, no sprints: not worth logging
  var list = loadSessions();
  list.push({ s: sessionSprints, w: sessionWorkSec, t: Date.now() });
  while (list.length > 30) list.shift();                   // keep the last 30 sessions
  try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(list)); } catch (e) {}
}
function paintSessions() {
  var box = $('sessList');
  if (!box) return;
  var list = loadSessions();
  if (!list.length) {
    box.innerHTML = '<div class="sess-empty">No past sessions yet — each finished session appears here after you close the tab.</div>';
    return;
  }
  var html = '';
  for (var i = list.length - 1; i >= 0 && i >= list.length - 10; i--) {
    var e = list[i], d = new Date(e.t);
    var when = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ', ' +
               d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    html += '<div>' + e.s + (e.s === 1 ? ' sprint' : ' sprints') + ' · ' + fmtDur(e.w / 60) +
            ' &middot; <span style="opacity:.65">' + when + '</span></div>';
  }
  box.innerHTML = html;
}
window.addEventListener('pagehide', finalizeSession);
window.addEventListener('beforeunload', finalizeSession);
/* motion tracker: 6 work segments with a break dot after each.
   Work fills the current segment green left-to-right; the break blinks
   the dot after the last completed segment; after 6 it wraps. */
var LAP = 6;
(function buildTrack() {
  var track = $('sprintTrack');
  if (!track) return;
  var html = '';
  for (var i = 0; i < LAP; i++) {
    html += '<span class="sprint-seg"><span class="sprint-seg-fill"></span></span>' +
            '<span class="sprint-dot"></span>';
  }
  track.innerHTML = html;
})();
function paintTracker() {
  var today = sessionSprints;
  var segs = document.querySelectorAll('#sprintTrack .sprint-seg-fill');
  var dots = document.querySelectorAll('#sprintTrack .sprint-dot');
  if (!segs.length) return;
  var i, full = 0, activeSeg = -1, activeDot = -1, fillPct = 0;
  if (mode === 'break') {
    full = ((Math.max(today, 1) - 1) % LAP) + 1;   // sprints completed in this lap (1..6)
    activeDot = full - 1;                          // dot after the last completed segment blinks
  } else {
    full = today % LAP;                            // banked toward the current lap; wraps to 0 after 6
    if (mode === 'work') { activeSeg = full; fillPct = (1 - left / WORK_S) * 100; }
  }
  for (i = 0; i < LAP; i++) {
    segs[i].style.width = i < full ? '100%' : '0%';
    dots[i].classList.toggle('blink', i === activeDot);
  }
  if (activeSeg >= 0 && activeSeg < LAP) segs[activeSeg].style.width = fillPct.toFixed(1) + '%';
  $('cycleToday').textContent = today + (today === 1 ? ' sprint trong phiên này' : ' sprint trong phiên này');
  $('cycleWeek').textContent = fmtDur(sessionWorkSec / 60) + ' tập trung trong phiên này';
  paintSessions();
}

paint();
paintTracker();

/* hook for the task manager: begin (or resume) a 52-min work session */
window.startWork = function () {
  if (mode === 'break') return;
  if (mode === 'idle') { mode = 'work'; left = WORK_S; }
  if (!timer) runTimer();
  paint();
};
