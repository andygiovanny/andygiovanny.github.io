
(function () {
'use strict';
var $ = function (id) { return document.getElementById(id); };
var LS = {
  get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ── choices: streak emoji + mascot image icons (assets/images/icons/) ── */
var EMOJIS = ['🔥', '💪', '🏃', '📚', '🧘', '💧', '🚭', '🍎', '😴', '✍️', '🎸', '🌱'];
var MASCOTS = ['duck-plain', 'duck-tomato', 'duck-sunglasses', 'cat-maestro',
  'duck-explorer', 'duck-santa', 'duck-safari', 'duck-sport',
  'duck-strawhat', 'duck-sprout', 'duck-astronaut', 'duck-crying',
  'duck-monocle', 'duck-angry', 'duck-school', 'duck-headphones'];
var DEFAULT_ICON = 'img:duck-monocle';
var COLORS = ['#DE4B3A', '#E0A458', '#7FA653', '#4A90D9', '#9B59B6', '#E8739C'];
var STORE_KEY = 'tt_streaks_v1';
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
var MON_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var DOWS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/* icon value = emoji char, or "img:<mascot-name>" for a mascot image */
function isImgIcon(v) { return typeof v === 'string' && v.indexOf('img:') === 0; }
function validIcon(v) {
  if (typeof v !== 'string' || !v) return DEFAULT_ICON;
  if (isImgIcon(v)) return MASCOTS.indexOf(v.slice(4)) >= 0 ? v : DEFAULT_ICON;
  return v.length <= 8 ? v : DEFAULT_ICON;
}
function setIconEl(el, v) {
  el.innerHTML = '';
  if (isImgIcon(v)) {
    var img = document.createElement('img');
    img.src = '/assets/images/icons/' + v.slice(4) + '.png';
    img.alt = '';
    el.appendChild(img);
  } else { el.textContent = v; }
}

/* ── dates: all local, "YYYY-MM-DD" keys so lexicographic compare works ── */
function pad2(n) { return (n < 10 ? '0' : '') + n; }
function toKey(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
function parseKey(k) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(k));
  if (!m) return null;
  var d = new Date(+m[1], +m[2] - 1, +m[3]);
  if (d.getFullYear() !== +m[1] || d.getMonth() !== +m[2] - 1 || d.getDate() !== +m[3]) return null;
  return d;
}
function addKey(k, n) { var d = parseKey(k); d.setDate(d.getDate() + n); return toKey(d); }
function todayKey() { return toKey(new Date()); }
function diffDays(a, b) { return Math.round((parseKey(b) - parseKey(a)) / 86400000); }
function humanDate(k) { var d = parseKey(k); return d ? MON_SHORT[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() : k; }

/* ── store ── */
function uid() { return 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function normStreak(x) {
  if (!x || typeof x !== 'object' || typeof x.name !== 'string' || !x.name.trim()) return null;
  var start = (typeof x.start === 'string' && parseKey(x.start)) ? x.start : todayKey();
  var ck = {};
  if (x.checkins && typeof x.checkins === 'object') {
    var keys = Array.isArray(x.checkins) ? x.checkins : Object.keys(x.checkins);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (parseKey(k) && k >= start && (Array.isArray(x.checkins) || x.checkins[k])) ck[k] = true;
    }
  }
  return {
    id: typeof x.id === 'string' ? x.id : uid(),
    name: x.name.slice(0, 60),
    mode: x.mode === 'countup' ? 'countup' : 'checkin',
    color: COLORS.indexOf(x.color) >= 0 ? x.color : COLORS[0],
    icon: validIcon(x.icon),
    start: start,
    checkins: ck,
    pinned: !!x.pinned,
    hideAll: !!x.hideAll,
    created: Number(x.created) || Date.now()
  };
}
var store = LS.get(STORE_KEY, null);
if (!store || !Array.isArray(store.streaks)) store = { streaks: [] };
store.streaks = store.streaks.map(normStreak).filter(Boolean);
function save() { LS.set(STORE_KEY, store); }
function byId(id) {
  for (var i = 0; i < store.streaks.length; i++) if (store.streaks[i].id === id) return store.streaks[i];
  return null;
}

/* ── streak math ── */
function isActive(s, k) {
  var t = todayKey();
  if (k > t) return false;
  if (s.mode === 'countup') return k >= s.start;
  return !!s.checkins[k];
}
function runEndingAt(s, k) {
  var n = 0, d = k;
  while (isActive(s, d) && n < 4000) { n++; d = addKey(d, -1); }
  return n;
}
function currentStreak(s) {
  var t = todayKey();
  if (s.mode === 'countup') return t < s.start ? 0 : diffDays(s.start, t) + 1;
  var end = t;
  if (!s.checkins[end]) end = addKey(t, -1);
  return s.checkins[end] ? runEndingAt(s, end) : 0;
}
function bestStreak(s) {
  if (s.mode === 'countup') return currentStreak(s);
  var keys = Object.keys(s.checkins).sort(), best = 0, run = 0, prev = null;
  for (var i = 0; i < keys.length; i++) {
    run = (prev && addKey(prev, 1) === keys[i]) ? run + 1 : 1;
    if (run > best) best = run;
    prev = keys[i];
  }
  return best;
}
function totalCount(s) { return s.mode === 'countup' ? currentStreak(s) : Object.keys(s.checkins).length; }
function monthCount(s, y, m) {
  var first = toKey(new Date(y, m, 1));
  var last = toKey(new Date(y, m + 1, 0));
  var t = todayKey();
  if (last > t) last = t;
  if (last < first) return 0;
  var n = 0, d = first;
  while (d <= last) { if (isActive(s, d)) n++; d = addKey(d, 1); }
  return n;
}
function monthDenom(y, m) {
  var now = new Date();
  if (y === now.getFullYear() && m === now.getMonth()) return now.getDate();
  if (new Date(y, m, 1) > now) return 0;
  return new Date(y, m + 1, 0).getDate();
}

/* ── ui state ── */
var now0 = new Date();
var view = { y: now0.getFullYear(), m: now0.getMonth() };
var focusId = 'all';
var selColor = COLORS[0], selIcon = DEFAULT_ICON, selMode = 'checkin', editId = null;

/* ── toast ── */
var toastTimer = null;
function hideToast() { $('toast').classList.remove('show'); }
function toast(msg, undoFn) {
  var t = $('toast');
  t.innerHTML = '';
  t.appendChild(document.createTextNode(msg));
  if (undoFn) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = 'Undo';
    b.addEventListener('click', function () { hideToast(); undoFn(); });
    t.appendChild(b);
  }
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, undoFn ? 6000 : 2600);
}

/* ── icon + color pickers ── */
var iconPanelOpen = false;
function openIconPanel() { iconPanelOpen = true; $('iconPanel').style.display = 'block'; $('iconPickBtn').setAttribute('aria-expanded', 'true'); }
function closeIconPanel() { iconPanelOpen = false; $('iconPanel').style.display = 'none'; $('iconPickBtn').setAttribute('aria-expanded', 'false'); }
function renderPickers() {
  var dr = $('dotRow');
  dr.innerHTML = '';
  COLORS.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot' + (c === selColor ? ' sel' : '');
    b.style.background = c;
    b.setAttribute('aria-label', 'Color ' + c);
    b.addEventListener('click', function () { selColor = c; renderPickers(); });
    dr.appendChild(b);
  });
  var mg = $('mascotGrid');
  mg.innerHTML = '';
  MASCOTS.forEach(function (mn) {
    var v = 'img:' + mn;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'icon-cell' + (v === selIcon ? ' sel' : '');
    b.setAttribute('aria-label', mn);
    setIconEl(b, v);
    b.addEventListener('click', function () { selIcon = v; setIconEl($('iconPickBtn'), selIcon); renderPickers(); });
    mg.appendChild(b);
  });
  var eg = $('emojiGrid');
  eg.innerHTML = '';
  EMOJIS.forEach(function (e) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'icon-cell' + (e === selIcon ? ' sel' : '');
    b.textContent = e;
    b.setAttribute('aria-label', 'Emoji ' + e);
    b.addEventListener('click', function () { selIcon = e; setIconEl($('iconPickBtn'), selIcon); renderPickers(); });
    eg.appendChild(b);
  });
  setIconEl($('iconPickBtn'), selIcon);
}
$('iconPickBtn').addEventListener('click', function (ev) {
  ev.stopPropagation();
  iconPanelOpen ? closeIconPanel() : openIconPanel();
});
document.addEventListener('click', function (ev) {
  if (!iconPanelOpen) return;
  if (!$('iconPanel').contains(ev.target) && ev.target !== $('iconPickBtn')) closeIconPanel();
});
document.addEventListener('keydown', function (ev) {
  if (ev.key === 'Escape' && iconPanelOpen) closeIconPanel();
});

/* ── form: mode pills, start date, add / edit ── */
function refreshModePills() {
  var pills = $('modeRow').querySelectorAll('.mode-pill');
  for (var i = 0; i < pills.length; i++) {
    pills[i].classList.toggle('sel', pills[i].getAttribute('data-mode') === selMode);
    pills[i].disabled = !!editId;
  }
  $('startLbl').textContent = selMode === 'countup' ? 'Counting from' : 'Started';
}
$('modeRow').addEventListener('click', function (ev) {
  var b = ev.target.closest('.mode-pill');
  if (!b || b.disabled) return;
  selMode = b.getAttribute('data-mode');
  refreshModePills();
});
function resetForm() {
  editId = null;
  $('stName').value = '';
  $('addErr').textContent = '';
  $('addBtn').textContent = 'Add streak';
  $('cancelEdit').classList.remove('on');
  $('stStart').disabled = false;
  $('stStart').value = todayKey();
  selColor = COLORS[0]; selIcon = DEFAULT_ICON; selMode = 'checkin';
  refreshModePills();
  renderPickers();
}
$('cancelEdit').addEventListener('click', resetForm);
$('addForm').addEventListener('submit', function (ev) {
  ev.preventDefault();
  var name = $('stName').value.trim();
  var start = $('stStart').value;
  if (!name) { $('addErr').textContent = 'Give your streak a name.'; return; }
  if (!parseKey(start)) { $('addErr').textContent = 'Pick a valid start date.'; return; }
  if (start > todayKey()) { $('addErr').textContent = 'Start date can\'t be in the future.'; return; }
  $('addErr').textContent = '';
  if (editId) {
    var s = byId(editId);
    if (s) { s.name = name.slice(0, 60); s.color = selColor; s.icon = selIcon; save(); }
    toast('Streak updated.');
  } else {
    store.streaks.push({
      id: uid(), name: name.slice(0, 60), mode: selMode,
      color: selColor, icon: selIcon, start: start,
      checkins: {}, pinned: false, created: Date.now()
    });
    save();
    toast(selMode === 'countup' ? 'Count-up started — it ticks up on its own.' : 'Streak added — tap the button or the calendar to check in.');
  }
  resetForm();
  renderAll();
});

/* check-in toggle: click = check in today, click again = undo */
function toggleToday(s) {
  var k = todayKey();
  if (s.checkins[k]) {
    delete s.checkins[k];
    save();
    renderAll();
    toast('Check-in removed.');
  } else {
    s.checkins[k] = true;
    save();
    renderAll();
    var n = currentStreak(s);
    toast('Checked in — ' + n + ' day' + (n === 1 ? '' : 's') + ' 🔥');
  }
}
/* ── filter chips ── */
function renderChips() {
  var box = $('chips');
  box.innerHTML = '';
  var all = document.createElement('button');
  all.type = 'button';
  all.className = 'chip' + (focusId === 'all' ? ' sel' : '');
  all.textContent = 'All streaks';
  all.addEventListener('click', function () { focusId = 'all'; renderAll(); });
  box.appendChild(all);
  store.streaks.forEach(function (s) {
    var c = document.createElement('button');
    c.type = 'button';
    c.className = 'chip' + (focusId === s.id ? ' sel' : '');
    var dot = document.createElement('span');
    dot.className = 'cdot';
    dot.style.background = s.color;
    var ic = document.createElement('span');
    ic.className = 'cicon';
    setIconEl(ic, s.icon);
    var nm = document.createElement('span');
    nm.textContent = s.name;
    var num = document.createElement('span');
    num.className = 'cnum';
    num.textContent = currentStreak(s) + ' 🔥';
    c.appendChild(dot); c.appendChild(ic); c.appendChild(nm); c.appendChild(num);
    c.addEventListener('click', function () { focusId = s.id; renderAll(); });
    box.appendChild(c);
  });
}

/* ── the big calendar ── */
function renderDows() {
  var box = $('calDows');
  box.innerHTML = '';
  DOWS.forEach(function (d) {
    var el = document.createElement('div');
    el.className = 'cal-dow';
    el.textContent = d;
    box.appendChild(el);
  });
}
$('calPrev').addEventListener('click', function () { view.m--; if (view.m < 0) { view.m = 11; view.y--; } renderAll(); });
$('calNext').addEventListener('click', function () { view.m++; if (view.m > 11) { view.m = 0; view.y++; } renderAll(); });
$('calToday').addEventListener('click', function () {
  var n = new Date();
  view.y = n.getFullYear(); view.m = n.getMonth();
  renderAll();
});
function toggleDay(s, key) {
  if (s.mode !== 'checkin') return;
  var t = todayKey();
  if (key > t) return;
  if (key < s.start) { toast('This streak starts ' + humanDate(s.start) + '.'); return; }
  if (s.checkins[key]) delete s.checkins[key];
  else s.checkins[key] = true;
  save();
  renderAll();
}
function renderCal() {
  var t = todayKey();
  var focusS = focusId === 'all' ? null : byId(focusId);
  var MAX_LANES = 5; /* All-view: each visible streak owns one fixed lane; beyond that → "+N" pill */
  $('calTitle').textContent = MONTHS[view.m] + ' ' + view.y;
  var grid = $('calGrid');
  grid.innerHTML = '';
  var off = new Date(view.y, view.m, 1).getDay();
  for (var i = 0; i < 42; i++) {
    var d = new Date(view.y, view.m, 1 - off + i);
    var key = toKey(d);
    var cell = document.createElement('div');
    cell.className = 'cal-day';
    if (d.getMonth() !== view.m) cell.className += ' other';
    if (key === t) cell.className += ' today';
    if (key > t) cell.className += ' future';
    var dn = document.createElement('div');
    dn.className = 'dnum';
    dn.textContent = d.getDate();
    cell.appendChild(dn);
    if (focusS && focusS.mode === 'checkin' && key <= t && key >= focusS.start) {
      cell.className += ' clickable';
      (function (s, k) {
        cell.addEventListener('click', function () { toggleDay(s, k); });
      })(focusS, key);
    }
    var list = focusS ? [focusS] : store.streaks.filter(function (s) { return !s.hideAll; });
    var bars = document.createElement('div');
    bars.className = 'cal-bars';
    var extraNames = [];
    list.forEach(function (s, lane) {
      if (!isActive(s, key)) return;
      if (!focusS && lane >= MAX_LANES) { extraNames.push(s.name); return; }
      var bar = document.createElement('div');
      bar.className = 'bar' + (focusS ? ' big' : '');
      bar.style.background = s.color;
      bar.style.top = (focusS ? 13 : lane * 7) + 'px';
      if (isActive(s, addKey(key, -1))) bar.className += ' cl';
      if (isActive(s, addKey(key, 1))) bar.className += ' cr';
      bars.appendChild(bar);
    });
    if (extraNames.length) {
      var more = document.createElement('div');
      more.className = 'cal-more';
      more.textContent = '+' + extraNames.length;
      more.title = 'Also active: ' + extraNames.join(', ');
      cell.appendChild(more);
    }
    cell.appendChild(bars);
    if (focusS && isActive(focusS, key)) {
      var run = runEndingAt(focusS, key);
      if (run === 100 || run === 365) {
        var ms = document.createElement('span');
        ms.className = 'cal-ms';
        ms.textContent = '⭐';
        cell.appendChild(ms);
      } else if (run > 0 && run % 7 === 0) {
        var ms2 = document.createElement('span');
        ms2.className = 'cal-ms';
        ms2.textContent = '🔥';
        cell.appendChild(ms2);
      }
    }
    grid.appendChild(cell);
  }
  var allHidden = !focusS && store.streaks.length > 0 &&
    store.streaks.every(function (s) { return s.hideAll; });
  $('calHint').textContent = !store.streaks.length
    ? 'Add your first streak above — it will draw its line right here.'
    : allHidden
      ? 'All streaks are hidden from this view — hit show on one to bring it back.'
      : !focusS
        ? 'Select a streak above to check in or tap-edit its days.'
        : focusS.mode === 'checkin'
          ? 'Tap any day from ' + humanDate(focusS.start) + ' onward to add or remove a check-in — past days included.'
          : 'This streak counts up automatically from ' + humanDate(focusS.start) + ' — no check-ins needed.';
}

/* ── stats band ── */
function statCard(numHtml, lbl) {
  var el = document.createElement('div');
  el.className = 'stat';
  var n = document.createElement('div');
  n.className = 'num';
  n.innerHTML = numHtml;
  var l = document.createElement('div');
  l.className = 'lbl';
  l.textContent = lbl;
  el.appendChild(n); el.appendChild(l);
  return el;
}
function renderStats() {
  var box = $('stats');
  box.innerHTML = '';
  var focusS = focusId === 'all' ? null : byId(focusId);
  var denom = monthDenom(view.y, view.m);
  var monLbl = MONTHS[view.m].slice(0, 3) + ' progress';
  if (focusS) {
    var cur = currentStreak(focusS);
    box.appendChild(statCard(cur + ' <small>' + (cur === 1 ? 'day' : 'days') + '</small>',
      focusS.mode === 'checkin' ? 'Current streak 🔥' : 'Days and counting 🔥'));
    box.appendChild(statCard(String(bestStreak(focusS)), 'Best streak'));
    box.appendChild(statCard(String(totalCount(focusS)), focusS.mode === 'checkin' ? 'Total check-ins' : 'Total days'));
    box.appendChild(statCard(denom ? monthCount(focusS, view.y, view.m) + '<small>/' + denom + '</small>' : '–', monLbl));
    var cc = document.createElement('div');
    cc.className = 'stat checkin-card';
    if (focusS.mode === 'checkin') {
      var done = !!focusS.checkins[todayKey()];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'checkin-btn' + (done ? ' done' : '');
      b.textContent = done ? '✓ Checked in today' : '✓ Check in today';
      b.title = done ? 'Click again to undo today\'s check-in' : '';
      b.addEventListener('click', function () { toggleToday(focusS); });
      cc.appendChild(b);
    } else {
      var note = document.createElement('div');
      note.className = 'stat-note';
      note.textContent = 'Counting up automatically since ' + humanDate(focusS.start) + '.';
      cc.appendChild(note);
    }
    box.appendChild(cc);
  } else {
    var active = 0, monthSum = 0;
    store.streaks.forEach(function (s) {
      if (currentStreak(s) > 0) active++;
      if (s.mode === 'checkin') monthSum += monthCount(s, view.y, view.m);
    });
    box.appendChild(statCard(String(store.streaks.length), 'Streaks'));
    box.appendChild(statCard(String(active), 'Alive right now 🔥'));
    box.appendChild(statCard(String(monthSum), 'Check-ins in ' + MONTHS[view.m].slice(0, 3)));
    var nc = document.createElement('div');
    nc.className = 'stat checkin-card';
    var nn = document.createElement('div');
    nn.className = 'stat-note';
    nn.textContent = 'Select a streak above to check in, backfill days, pin, edit or export it.';
    nc.appendChild(nn);
    box.appendChild(nc);
  }
}

/* ── manage list: pin / edit / csv / delete ── */
function togglePin(s) {
  var np = !s.pinned;
  store.streaks.forEach(function (x) { x.pinned = false; });
  s.pinned = np;
  save();
  renderAll();
  toast(np ? 'Pinned — this streak can show on your timer pages.' : 'Unpinned.');
}
function startEdit(s) {
  editId = s.id;
  $('stName').value = s.name;
  $('stStart').value = s.start;
  $('stStart').disabled = true;
  selColor = s.color; selIcon = s.icon; selMode = s.mode;
  $('addBtn').textContent = 'Save';
  $('cancelEdit').classList.add('on');
  refreshModePills();
  renderPickers();
  $('stName').focus();
  $('addForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function downloadBlob(content, mime, fname) {
  var blob = new Blob([content], { type: mime });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fname;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
}
function csvFor(s) {
  if (s.mode === 'countup') return 'start,days_since\n' + s.start + ',' + currentStreak(s) + '\n';
  return 'date\n' + Object.keys(s.checkins).sort().join('\n') + '\n';
}
function slug(n) { return n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'streak'; }
function renderManage() {
  var box = $('manage');
  box.innerHTML = '';
  store.streaks.forEach(function (s) {
    var row = document.createElement('div');
    row.className = 'mrow';
    var ic = document.createElement('span');
    ic.className = 'micon';
    setIconEl(ic, s.icon);
    var nm = document.createElement('span');
    nm.className = 'mname';
    nm.textContent = s.name;
    var cur = document.createElement('span');
    cur.className = 'mcur';
    cur.textContent = currentStreak(s) + ' 🔥';
    var act = document.createElement('span');
    act.className = 'mactions';
    var hb = document.createElement('button');
    hb.type = 'button';
    hb.textContent = s.hideAll ? 'show' : 'hide';
    hb.title = s.hideAll ? 'Show this streak\'s line on the All view' : 'Hide this streak\'s line from the All view';
    hb.addEventListener('click', function () { s.hideAll = !s.hideAll; save(); renderAll(); });
    var pin = document.createElement('button');
    pin.type = 'button';
    pin.className = s.pinned ? 'pinned' : '';
    pin.textContent = s.pinned ? '📌 pinned' : '📌 pin';
    pin.setAttribute('aria-label', (s.pinned ? 'Unpin ' : 'Pin ') + s.name);
    pin.addEventListener('click', function () { togglePin(s); });
    var ed = document.createElement('button');
    ed.type = 'button';
    ed.textContent = 'edit';
    ed.addEventListener('click', function () { startEdit(s); });
    var csv = document.createElement('button');
    csv.type = 'button';
    csv.textContent = 'csv';
    csv.setAttribute('aria-label', 'Download ' + s.name + ' as CSV');
    csv.addEventListener('click', function () { downloadBlob(csvFor(s), 'text/csv', slug(s.name) + '.csv'); });
    var del = document.createElement('button');
    del.type = 'button';
    del.textContent = 'delete';
    var delArmed = false, delArmTimer = null;
    del.addEventListener('click', function () {
      if (!delArmed) {
        delArmed = true;
        del.textContent = 'sure?';
        del.className = 'arm';
        delArmTimer = setTimeout(function () {
          delArmed = false;
          del.textContent = 'delete';
          del.className = '';
        }, 3000);
        return;
      }
      clearTimeout(delArmTimer);
      var idx = store.streaks.indexOf(s);
      store.streaks.splice(idx, 1);
      save();
      renderAll();
      toast('Deleted "' + s.name + '".', function () {
        store.streaks.splice(Math.min(idx, store.streaks.length), 0, s);
        save();
        renderAll();
      });
    });
    act.appendChild(pin); act.appendChild(hb); act.appendChild(ed); act.appendChild(csv); act.appendChild(del);
    row.appendChild(ic); row.appendChild(nm); row.appendChild(cur);
    if (s.mode === 'checkin') {
      var mc = document.createElement('button');
      mc.type = 'button';
      var doneToday = !!s.checkins[todayKey()];
      mc.className = 'mcheck' + (doneToday ? ' done' : '');
      mc.textContent = doneToday ? '✓ done today' : '✓ check in';
      mc.title = doneToday ? 'Click again to undo today\'s check-in' : 'Check in for today';
      mc.setAttribute('aria-label', 'Check in ' + s.name + ' for today');
      mc.addEventListener('click', function () { toggleToday(s); });
      row.appendChild(mc);
    } else {
      var md = document.createElement('span');
      md.className = 'mmode-plain';
      md.textContent = 'count-up';
      row.appendChild(md);
    }
    row.appendChild(act);
    if (s.hideAll) row.className += ' off';
    box.appendChild(row);
  });
}

/* ── export / import ── */
$('exportBtn').addEventListener('click', function () {
  var payload = {
    app: 'tomatotimers-streaks',
    version: 1,
    exported: new Date().toISOString(),
    streaks: store.streaks
  };
  downloadBlob(JSON.stringify(payload, null, 2), 'application/json', 'tomatotimers-streaks-' + todayKey() + '.json');
  toast('Backup downloaded.');
});
$('importBtn').addEventListener('click', function () { $('importFile').click(); });
$('importFile').addEventListener('change', function () {
  var f = this.files && this.files[0];
  this.value = '';
  if (!f) return;
  var r = new FileReader();
  r.onload = function () {
    try {
      var data = JSON.parse(String(r.result));
      if (!data || !Array.isArray(data.streaks)) throw new Error('bad shape');
      var added = 0, updated = 0;
      data.streaks.forEach(function (x) {
        var s = normStreak(x);
        if (!s) return;
        var old = byId(s.id);
        if (old) {
          var i = store.streaks.indexOf(old);
          store.streaks.splice(i, 1, s);
          updated++;
        } else { store.streaks.push(s); added++; }
      });
      if (!added && !updated) throw new Error('nothing valid');
      save();
      renderAll();
      toast('Imported ' + (added + updated) + ' streak' + (added + updated === 1 ? '' : 's') +
        (updated ? ' (' + updated + ' updated)' : '') + '.');
    } catch (e) {
      toast('That file doesn\'t look like a streaks backup.');
    }
  };
  r.readAsText(f);
});

/* ── presets (empty state) ── */
var PRESETS = [
  { name: 'Morning workout', icon: '🏃', color: '#DE4B3A', mode: 'checkin' },
  { name: 'Study every day', icon: '📚', color: '#4A90D9', mode: 'checkin' },
  { name: 'No sugar', icon: '🍎', color: '#7FA653', mode: 'checkin' },
  { name: 'Days since I quit smoking', icon: '🚭', color: '#E0A458', mode: 'countup' }
];
function initPresets() {
  var box = $('presetRow');
  PRESETS.forEach(function (p) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'preset-pill';
    b.textContent = p.icon + ' ' + p.name;
    b.addEventListener('click', function () {
      $('stName').value = p.name;
      selIcon = p.icon; selColor = p.color; selMode = p.mode;
      refreshModePills();
      renderPickers();
      $('stName').focus();
      $('addForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    box.appendChild(b);
  });
  /* demo data: 3 realistic streaks so first-time visitors (and Andy) can see
     a painted calendar — deletable like any other streak */
  var demo = document.createElement('button');
  demo.type = 'button';
  demo.className = 'preset-pill';
  demo.textContent = '✨ Load 3 example streaks';
  demo.addEventListener('click', loadExamples);
  box.appendChild(demo);
}
function loadExamples() {
  var t = todayKey();
  function daysAgoList(ns) {
    var o = {};
    ns.forEach(function (n) { o[addKey(t, -n)] = true; });
    return o;
  }
  store.streaks.push(
    { id: uid(), name: 'Morning run', mode: 'checkin', color: '#DE4B3A', icon: '🏃',
      start: addKey(t, -12), checkins: daysAgoList([12, 11, 10, 9, 7, 6, 5, 4, 3, 2, 1]),
      pinned: false, created: Date.now() },
    { id: uid(), name: 'Read 20 pages', mode: 'checkin', color: '#4A90D9', icon: '📚',
      start: addKey(t, -20), checkins: daysAgoList([19, 18, 17, 3, 2, 1, 0]),
      pinned: false, created: Date.now() },
    { id: uid(), name: 'Days without coffee', mode: 'countup', color: '#7FA653', icon: '☕',
      start: addKey(t, -45), checkins: {}, pinned: false, created: Date.now() }
  );
  save();
  renderAll();
  toast('3 example streaks added — delete them anytime from the list below.');
}

/* ── render everything ── */
function renderAll() {
  var has = store.streaks.length > 0;
  $('emptyState').style.display = has ? 'none' : 'block';
  $('chips').style.display = has ? 'flex' : 'none';
  $('calWrap').style.display = 'block'; /* calendar is the hero — always visible */
  $('stats').style.display = has ? 'flex' : 'none';
  $('manage').style.display = has ? 'block' : 'none';
  $('dataRow').style.display = has ? 'flex' : 'none';
  if (focusId !== 'all' && !byId(focusId)) focusId = 'all';
  renderCal();
  if (!has) return;
  renderChips();
  renderStats();
  renderManage();
}

/* ── boot ── */
$('stStart').value = todayKey();
renderDows();
renderPickers();
refreshModePills();
initPresets();
renderAll();
})();
