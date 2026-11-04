
/* ═══ FLOWTIME — charge-your-break engine (prototype v1) ═══
   Contract kept for the shared Task Manager + Ambience blocks:
   window.tick  = global 1s tick (tm wraps it for estimate drain)
   window.mode  = 'idle' | 'work' | 'break'
   window.timer = interval handle while running, null when paused/stopped
   window.left  = truthy while a work stint exists (paused or running)
   window.stopTimer / window.runTimer = pause / resume              */
var $ = function (id) { return document.getElementById(id); };
var DEFAULT_TITLE = document.title;

/* ---------- reward math: one function, two modes ---------- */
var SET_KEY = 'tt_flow_settings_v1';
var BANK_KEY = 'tt_flow_bank_v1';
var LOG_KEY = 'tt_flow_log_v1';
var ZOE_TIERS = [[25, 5], [50, 8], [90, 10], [null, 15]]; // last = open-ended
var BREAK_BAR_CAP_MS = 15 * 60000;   // visual capacity of the break bar
var BANK_CAP_MS = 60 * 60000;        // bank can hold at most 1 hour

function defaultSettings() {
  return { mode: 'tiered', cont: false, tiers: ZOE_TIERS.map(function (t) { return t.slice(); }), ratioN: 5, ratioCap: 15, fullMin: 60 };
}
function loadSettings() {
  try {
    var s = JSON.parse(localStorage.getItem(SET_KEY) || 'null');
    if (s && (s.mode === 'tiered' || s.mode === 'ratio') && Array.isArray(s.tiers)) {
      if (typeof s.cont === 'undefined') s.cont = false; // Zoe's lump table = default
      return s;
    }
  } catch (e) {}
  return defaultSettings();
}
var settings = loadSettings();
function saveSettings() { try { localStorage.setItem(SET_KEY, JSON.stringify(settings)); } catch (e) {} }

/* earned break minutes for `workMin` of work.
   TIERED (Zoe's method, default): a step table — stop inside a bracket
   and you earn that bracket's full break (her "aren't rules" suggestion).
   TIERED + "charge continuously" checkbox: piecewise-linear between the
   same anchors (ratio-style live charging).
   RATIO: "every N min worked → 1 min break", optional cap. */
function earnedMin(workMin) {
  if (!(workMin > 0)) return 0;
  if (settings.mode === 'tiered' && !settings.cont) {
    var t = settings.tiers;
    for (var i = 0; i < t.length; i++) {
      var w = t[i][0], b = t[i][1];
      if (w === null || workMin < w) return b;
    }
    return t[t.length - 1][1];
  }
  if (settings.mode === 'ratio') {
    var e = workMin / (settings.ratioN || 5);
    if (settings.ratioCap > 0) e = Math.min(e, settings.ratioCap);
    return e;
  }
  var t = settings.tiers, prevW = 0, prevB = 0;
  for (var i = 0; i < t.length; i++) {
    var w = t[i][0], b = t[i][1];
    if (w === null) { // open-ended tail: reach its cap 100 min past prev anchor
      var slope = Math.max(0, b - prevB) / 100;
      return Math.min(b, prevB + (workMin - prevW) * slope);
    }
    if (workMin <= w) {
      if (w === prevW) return b;
      return prevB + (workMin - prevW) * (b - prevB) / (w - prevW);
    }
    prevW = w; prevB = b;
  }
  return prevB;
}

/* ---------- state ---------- */
var phase = 'idle';            // idle | work | break
var workSec = 0;               // seconds in the current work stint
var sessionEarnedMs = 0;       // break credit earned this stint (bar value)
var breakLeftMs = 0, breakTotalMs = 0;
var bankMs = 0;
try { bankMs = parseInt(localStorage.getItem(BANK_KEY) || '0', 10) || 0; } catch (e) {}
var logArr = [];
try { logArr = JSON.parse(localStorage.getItem(LOG_KEY) || '[]') || []; } catch (e) {}

window.mode = 'idle';
window.timer = null;
window.left = 0;

/* ---------- helpers ---------- */
function fmt(ms) {
  var s = Math.max(0, Math.round(ms / 1000));
  var m = Math.floor(s / 60); s = s % 60;
  if (m >= 60) { var h = Math.floor(m / 60); m = m % 60; return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0'); }
  return m + ':' + String(s).padStart(2, '0');
}
var toastT = null;
function toast(msg) {
  var t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2400);
}
function saveBank() { try { localStorage.setItem(BANK_KEY, String(bankMs)); } catch (e) {} }
function addToBank(ms) {
  var room = BANK_CAP_MS - bankMs;
  var added = Math.min(ms, Math.max(0, room));
  bankMs += added; saveBank();
  if (ms - added > 0) toast('🏦 break bank is full (1h max)');
  return added;
}

/* chime: shared notification map (slot 'flow'), mp3 with synthesized fallback */
var NOTIFY_KEY = 'tt_notify_sounds_v1';
var chimeAudio = new Audio('/assets/sounds/beep.mp3');
chimeAudio.preload = 'auto';
chimeAudio._n = 0; // 0 forces chime() to build the right file from the saved map on first play
function currentChime() {
  try { return parseInt(JSON.parse(localStorage.getItem(NOTIFY_KEY) || '{}').flow) || 1; } catch (e) { return 1; }
}
/* same file table as the other timers: selector value -> sound file */
var CHIME_FILES = { 1: '/assets/sounds/beep.mp3', 2: '/assets/sounds/Notification 1.mp3',
                    3: '/assets/sounds/Notification 2.mp3', 4: '/assets/sounds/Notification 3.mp3',
                    5: '/assets/sounds/Notification 4.mp3', 6: '/assets/sounds/Notification 5.mp3' };
function chimeFile(n) { return CHIME_FILES[n] || CHIME_FILES[1]; }
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
  } catch (e) {}
}
function chime() {
  var n = currentChime();
  if (chimeAudio._n !== n) {
    chimeAudio = new Audio(chimeFile(n));
    chimeAudio.preload = 'auto'; chimeAudio._n = n;
  }
  try { chimeAudio.currentTime = 0; } catch (e) {}
  var p = chimeAudio.play();
  if (p && p.catch) p.catch(function () { beepFallback(); });
}

/* ---------- mascot video: work/break × light/dark, any common file name ---------- */
var duckVideo = $('duckVideo');
var DUCK_TRIES = {
  'work-light':  ['flow-work-light.mp4', 'flow-work-light.mp4.mp4', 'work light.mp4', 'work-light.mp4', 'work_light.mp4'],
  'work-dark':   ['flow-work-dark.mp4', 'flow-work-dark.mp4.mp4', 'work dark.mp4', 'work-dark.mp4', 'work_dark.mp4'],
  'break-light': ['flow-break-light.mp4', 'flow-break-light.mp4.mp4', 'break light.mp4', 'break-light.mp4', 'break_light.mp4'],
  'break-dark':  ['flow-break-dark.mp4', 'flow-break-dark.mp4.mp4', 'break dark.mp4', 'break-dark.mp4', 'break_dark.mp4']
};
var duckResolved = {};     // slot -> file name that worked
var duckToken = 0;         // invalidates stale candidate chains after a quick phase/theme flip
var duckCurrentSlot = null; // skip reloads when phase+theme didn't change (paint() calls this every tick)
function currentTheme() { return document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light'; }
function setDuckVideo() {
  if (!duckVideo) return;
  var slot = (phase === 'break' ? 'break' : 'work') + '-' + currentTheme();
  if (slot === duckCurrentSlot && !duckVideo.error) return; // same slot already loaded OK -> don't touch it
  duckCurrentSlot = slot;
  var cands = DUCK_TRIES[slot] || [];
  var list = duckResolved[slot] ? [duckResolved[slot]].concat(cands) : cands.slice();
  duckToken++;
  tryLoadDuck(slot, list, 0, duckToken);
}
function tryLoadDuck(slot, list, i, tok) {
  if (tok !== duckToken || i >= list.length) return;  // stale chain, or nothing found -> blank slot
  var t = duckVideo.currentTime || 0, wasPlaying = !duckVideo.paused && !duckVideo.ended;
  var onErr = function () {
    duckVideo.removeEventListener('error', onErr);
    duckVideo.removeEventListener('loadedmetadata', onMeta);
    tryLoadDuck(slot, list, i + 1, tok);
  };
  var onMeta = function () {
    duckVideo.removeEventListener('error', onErr);
    duckVideo.removeEventListener('loadedmetadata', onMeta);
    duckResolved[slot] = list[i];
    try { if (isFinite(duckVideo.duration)) duckVideo.currentTime = t % duckVideo.duration; } catch (e) {}
    if (wasPlaying) { var p = duckVideo.play(); if (p && p.catch) p.catch(function () {}); }
  };
  duckVideo.addEventListener('error', onErr);
  duckVideo.addEventListener('loadedmetadata', onMeta);
  duckVideo.src = '/assets/images/' + list[i];
  duckVideo.load();
}
new MutationObserver(function () { setDuckVideo(); })
  .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
setInterval(function () { if (duckVideo.error) setDuckVideo(); }, 2000);
setDuckVideo();

/* ---------- session log ---------- */
function saveLog() { try { localStorage.setItem(LOG_KEY, JSON.stringify(logArr.slice(-50))); } catch (e) {} }
function renderLog() {
  var box = $('logRows');
  if (!logArr.length) {
    box.innerHTML = '<div class="ft-log-empty">No sessions yet — press play and your focus stints will appear here.</div>';
    return;
  }
  var html = '';
  for (var i = logArr.length - 1; i >= 0; i--) {
    var e = logArr[i];
    var d = new Date(e.t);
    var hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
    var state = e.state === 'live'
      ? '<span class="ft-l-state live">● on break now</span>'
      : '<span class="ft-l-state">✓ done</span>';
    html += '<div class="ft-log-row"><span class="ft-l-time">' + hh + ':' + mm + '</span>'
      + '<span class="ft-l-work">🔥 ' + fmt(e.workMs) + '</span>'
      + '<span class="ft-l-arrow">→</span>'
      + '<span class="ft-l-break">☕ ' + fmt(e.breakMs) + '</span>'
      + state + '</div>';
  }
  box.innerHTML = html;
}

/* ---------- engine core ---------- */
function run() {
  if (!window.timer && phase !== 'idle') {
    window.timer = setInterval(function () { window.tick(); }, 1000);
  }
}
window.runTimer = function () { run(); paint(); };
window.stopTimer = function () {
  if (window.timer) { clearInterval(window.timer); window.timer = null; }
  paint();
};

window.tick = function () {
  if (phase === 'work') {
    workSec++;
    window.left = 1;
    sessionEarnedMs = Math.round(earnedMin(workSec / 60) * 60000);
    // bar overflow past 15:00 flows into the bank automatically
    if (sessionEarnedMs > BREAK_BAR_CAP_MS) {
      addToBank(sessionEarnedMs - BREAK_BAR_CAP_MS);
      sessionEarnedMs = BREAK_BAR_CAP_MS;
    }
    paint();
  } else if (phase === 'break') {
    breakLeftMs -= 1000;
    if (breakLeftMs <= 0) { breakLeftMs = 0; endBreak(true); return; }
    paint();
  }
};

function startWork(silent) {
  phase = 'work'; window.mode = 'work';
  workSec = 0; sessionEarnedMs = 0; window.left = 1;
  if (!silent) chime();
  run(); paint();
}
function togglePlay() {
  if (phase === 'idle') { startWork(); return; }
  if (window.timer) window.stopTimer(); else window.runTimer();
}
function takeBreak() {
  if (phase !== 'work') return;
  var total = sessionEarnedMs + bankMs;
  if (total <= 0) { toast('Chưa kiếm được giờ nghỉ nào — làm việc một chút đã 🙂'); return; }
  bankMs = 0; saveBank();
  breakTotalMs = total; breakLeftMs = total;
  phase = 'break'; window.mode = 'break'; window.left = 0;
  logArr.push({ t: Date.now(), workMs: workSec * 1000, breakMs: total, state: 'live' });
  saveLog(); renderLog();
  chime();
  if (!window.timer) run();
  paint();
}
function endBreak(natural) {
  var leftover = breakLeftMs;
  var taken = breakTotalMs - leftover;
  if (!natural && leftover > 0) {
    var added = addToBank(leftover);
    if (added > 0) toast('🏦 +' + fmt(added) + ' banked for later');
  }
  for (var i = logArr.length - 1; i >= 0; i--) {
    if (logArr[i].state === 'live') { logArr[i].state = 'done'; logArr[i].breakMs = taken; break; }
  }
  saveLog(); renderLog();
  phase = 'idle'; window.mode = 'idle'; window.left = 0;
  workSec = 0; sessionEarnedMs = 0; breakLeftMs = 0; breakTotalMs = 0;
  if (natural) chime();
  window.stopTimer();
  paint();
  if (!natural) startWork(true); // "RESUME WORK" means the new stint is already running
}
function resetSession() {
  phase = 'idle'; window.mode = 'idle'; window.left = 0;
  workSec = 0; sessionEarnedMs = 0; breakLeftMs = 0; breakTotalMs = 0;
  bankMs = 0; saveBank();   // full wipe: bank resets with the session
  window.stopTimer();
  toast('Đã đặt lại phiên — xóa ngân hàng, giữ nhật ký');
}

/* ---------- paint ---------- */
function paint() {
  var workMin = workSec / 60;
  var full = settings.fullMin || 60;

  // digits: count UP while working, DOWN while on break
  var shown;
  if (phase === 'break') shown = fmt(breakLeftMs);
  else shown = fmt(workSec * 1000);
  $('digits').textContent = shown;

  // work bar + over state (bar shakes when full — mascot video never shakes)
  var wpct = phase === 'break' ? 100 : Math.min(100, workMin / full * 100);
  $('workFill').style.width = wpct + '%';
  $('workPct').textContent = Math.round(wpct) + '%';
  var over = (phase === 'work' && workMin >= full);
  $('workBar').classList.toggle('over', over);
  setDuckVideo();

  // break bar + earned + bank
  var bpct, earnedShown;
  if (phase === 'break') {
    bpct = breakTotalMs > 0 ? breakLeftMs / breakTotalMs * 100 : 0;
    earnedShown = fmt(breakLeftMs) + ' left';
  } else {
    bpct = sessionEarnedMs / BREAK_BAR_CAP_MS * 100;
    earnedShown = fmt(sessionEarnedMs);
  }
  $('breakFill').style.width = Math.min(100, bpct) + '%';
  $('breakPct').textContent = Math.round(bpct) + '%';
  $('earnedVal').textContent = earnedShown;
  $('bankVal').textContent = fmt(bankMs);

  // phase line + play icon + tab title
  var label, title;
  if (phase === 'work') {
    var running = !!window.timer;
    label = running ? 'đang hưng phấn — mỗi phút nạp thêm giờ nghỉ' : 'đang tạm dừng — số giờ nghỉ của bạn vẫn an toàn';
    title = '(' + shown + ') Flowtime — charging break';
  } else if (phase === 'break') {
    label = 'giờ nghỉ — tận hưởng thành quả bạn kiếm được ☕';
    title = '(' + shown + ') Break time! — flowtime';
  } else {
    label = 'bấm phát và bắt đầu dòng chảy — giờ nghỉ nạp dần khi bạn làm việc';
    title = DEFAULT_TITLE;
  }
  $('phaseLabel').textContent = label;
  document.title = title;
  $('playIcon').style.display = (phase !== 'idle' && window.timer) ? 'none' : '';
  $('pauseIcon').style.display = (phase !== 'idle' && window.timer) ? '' : 'none';

  // the break button becomes the resume button while on break
  var bb = $('breakBtn');
  if (phase === 'break') {
    bb.textContent = '💪 RESUME WORK';
    bb.classList.add('cool');
    bb.title = 'Kết thúc giờ nghỉ sớm — phần còn lại chuyển vào ngân hàng';
  } else {
    bb.textContent = '☕ BREAK';
    bb.classList.remove('cool');
    bb.title = 'Đổi thưởng bạn kiếm được và nghỉ ngơi';
  }
}

/* ---------- reward settings modal ---------- */
var rsOverlay = $('rsOverlay');
function rsOpen() {
  rsRender();
  try { $('ct_notify').value = String(currentChime()); } catch (e) {}
  rsOverlay.classList.add('open');
}
function rsClose() { rsOverlay.classList.remove('open'); }

function rsRender() {
  $('rsModeTiered').classList.toggle('sel', settings.mode === 'tiered');
  $('rsModeRatio').classList.toggle('sel', settings.mode === 'ratio');
  $('rsTieredWrap').classList.toggle('rs-hide', settings.mode !== 'tiered');
  $('rsRatioWrap').classList.toggle('rs-hide', settings.mode !== 'ratio');
  $('rsCont').checked = !!settings.cont;
  $('rsRatioN').value = settings.ratioN;
  $('rsRatioCap').value = settings.ratioCap;
  $('rsFullMin').value = settings.fullMin;
  rsRenderTiers();
  rsRatioPreview();
}
function rsRatioPreview() {
  var el = $('rsRatioPreview');
  if (!el) return;
  var n = parseInt($('rsRatioN').value, 10);
  if (!(n >= 1)) { el.textContent = ''; return; }
  el.innerHTML = 'so <b>' + (n * 5) + ' min</b> worked = <b>5 min</b> break';
}
function rsRenderTiers() {
  var box = $('rsTierRows');
  var html = '';
  for (var i = 0; i < settings.tiers.length; i++) {
    var w = settings.tiers[i][0], b = settings.tiers[i][1];
    if (w === null) {
      html += '<div class="rs-tier-row" data-i="' + i + '"><span class="rs-open">past the last tier →</span>'
        + '<input type="number" class="ct-input rs-b" min="1" max="120" value="' + b + '" title="break minutes earned at this point (cap)">'
        + '<button type="button" class="rs-tier-x" disabled title="last tier stays open-ended" style="opacity:.35">✕</button></div>';
    } else {
      html += '<div class="rs-tier-row" data-i="' + i + '"><input type="number" class="ct-input rs-w" min="1" max="600" value="' + w + '" title="work minutes at this point">'
        + '<input type="number" class="ct-input rs-b" min="0" max="120" value="' + b + '" title="break minutes earned at this point">'
        + '<button type="button" class="rs-tier-x" title="remove tier">✕</button></div>';
    }
  }
  box.innerHTML = html;
}
function rsReadTiers() {
  var rows = $('rsTierRows').querySelectorAll('.rs-tier-row');
  var tiers = [];
  for (var i = 0; i < rows.length; i++) {
    var wInput = rows[i].querySelector('.rs-w');
    var b = parseFloat(rows[i].querySelector('.rs-b').value);
    if (!(b >= 0)) return null;
    tiers.push(wInput ? parseFloat(wInput.value) : null, b); // temp flat
  }
  // rebuild as pairs
  var pairs = [];
  for (var j = 0; j < tiers.length; j += 2) pairs.push([tiers[j], tiers[j + 1]]);
  return pairs;
}
function rsValidate(tiers) {
  var prevW = 0, prevB = -1;
  for (var i = 0; i < tiers.length; i++) {
    var w = tiers[i][0], b = tiers[i][1];
    if (i === tiers.length - 1) {
      if (w !== null) return 'Tầng cuối cùng phải mở.';
    } else {
      if (!(w > prevW)) return 'Tier ' + (i + 1) + ': work minutes must increase down the list.';
    }
    if (!(b >= prevB)) return 'Nghỉ được nhận không thể giảm giữa các tầng.';
    if (w !== null) prevW = w;
    prevB = b;
  }
  return null;
}
function rsSave() {
  var mode = $('rsModeTiered').classList.contains('sel') ? 'tiered' : 'ratio';
  var fullMin = parseInt($('rsFullMin').value, 10);
  if (!(fullMin >= 1 && fullMin <= 600)) { toast('Thanh đầy phải từ 1–600 phút'); return; }
  var ratioN = parseInt($('rsRatioN').value, 10);
  var ratioCap = parseInt($('rsRatioCap').value, 10);
  if (!(ratioN >= 2 && ratioN <= 10)) { toast('Tỷ lệ N phải từ 2–10'); return; }
  if (!(ratioCap >= 0 && ratioCap <= 60)) { toast('Giới hạn tỷ lệ phải từ 0–60'); return; }
  var tiers = null;
  if (mode === 'tiered') {
    tiers = rsReadTiers();
    if (!tiers) { toast('Giá trị các tầng phải là số'); return; }
    var err = rsValidate(tiers);
    if (err) { toast(err); return; }
  }
  settings.mode = mode;
  settings.cont = $('rsCont').checked;
  settings.fullMin = fullMin;
  settings.ratioN = ratioN;
  settings.ratioCap = ratioCap;
  if (tiers) settings.tiers = tiers;
  saveSettings();
  // chime preference lives in the shared notification map (same key as other timers)
  try {
    var map = JSON.parse(localStorage.getItem(NOTIFY_KEY) || '{}');
    map.flow = parseInt($('ct_notify').value, 10) || 1;
    localStorage.setItem(NOTIFY_KEY, JSON.stringify(map));
  } catch (e) {}
  rsClose();
  toast('Đã lưu cài đặt phần thưởng ⚙️');
  paint();
}

/* ---------- wire up ---------- */
$('playBtn').addEventListener('click', togglePlay);
$('breakBtn').addEventListener('click', function () {
  if (phase === 'break') { endBreak(false); return; }  // end early → bank the rest
  takeBreak();
});

/* ── keyboard shortcuts (same as custom-timer): Space = play/pause, → = break / end break ── */
document.addEventListener('keydown', function (e) {
  var zo = document.getElementById('tm_zero_overlay');
  if (zo && !zo.classList.contains('d-none')) return;
  var ro = document.getElementById('rsOverlay');
  if (ro && ro.classList.contains('open')) return;
  var tag = (e.target && e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
  if (e.code === 'Space') { e.preventDefault(); $('playBtn').click(); }
  else if (e.key === 'ArrowRight') { $('breakBtn').click(); }
});
$('resetBtn').addEventListener('click', resetSession);
$('logClear').addEventListener('click', function () {
  logArr = []; saveLog(); renderLog(); toast('Đã xóa nhật ký');
});
$('rewardSettingsBtn').addEventListener('click', rsOpen);
$('rsCancel').addEventListener('click', rsClose);
$('rsSave').addEventListener('click', rsSave);
$('rsRatioN').addEventListener('input', rsRatioPreview);
rsOverlay.addEventListener('click', function (e) { if (e.target === rsOverlay) rsClose(); });
$('rsModeTiered').addEventListener('click', function () {
  settings.mode = 'tiered'; rsRender();
});
$('rsModeRatio').addEventListener('click', function () {
  settings.mode = 'ratio'; rsRender();
});
$('rsAddTier').addEventListener('click', function () {
  var tiers = rsReadTiers();
  if (!tiers) { toast('Giá trị các tầng phải là số'); return; }
  // split the widest work segment with a midpoint anchor
  var best = 0, bestW = 0;
  var prevW = 0;
  for (var i = 0; i < tiers.length; i++) {
    var w = tiers[i][0] === null ? prevW + 200 : tiers[i][0];
    if (w - prevW > bestW) { bestW = w - prevW; best = i; }
    prevW = tiers[i][0] === null ? prevW : tiers[i][0];
  }
  var lo = best === 0 ? 0 : tiers[best - 1][0];
  var hi = tiers[best][0] === null ? lo + 100 : tiers[best][0];
  var midW = Math.round((lo + hi) / 2);
  var midB = Math.round(((best === 0 ? 0 : tiers[best - 1][1]) + tiers[best][1]) / 2 * 10) / 10;
  tiers.splice(best, 0, [midW, midB]);
  settings.tiers = tiers;
  rsRenderTiers();
});
$('rsResetZoe').addEventListener('click', function () {
  settings.tiers = ZOE_TIERS.map(function (t) { return t.slice(); });
  rsRenderTiers();
  toast('Quay lại phương pháp của Zoe\u2019s ↺');
});
$('ct_notify_test').addEventListener('click', function () {
  var n = parseInt($('ct_notify').value, 10) || 1;
  var a = new Audio(chimeFile(n));
  a.preload = 'auto';
  var p = a.play();
  if (p && p.catch) p.catch(function () { beepFallback(); });
});

renderLog();
paint();
console.log('[Flowtime] engine ready. Mode:', settings.mode, 'Bank:', fmt(bankMs));
