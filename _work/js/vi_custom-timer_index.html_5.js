
(function () {
'use strict';
var $ = function (id) { return document.getElementById(id); };
var LS = {
  get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ── toast ── */
var toastTimer = null;
function toast(msg) {
  var t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
}

/* ── config ── */
var DEFAULTS = [
  { name: 'Giai đoạn 1', len: 25, unit: 'min' },
  { name: 'Giai đoạn 2', len: 5, unit: 'min' },
  { name: 'Giai đoạn 3', len: 15, unit: 'min' }
];
/* ── saved timers (named, multiple) ──
   byo_timers  = [{ id, name, sections, loop, bar, extend, extendLen }, ...]
   byo_current = id of the timer shown on stage                       */
function uid() { return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function normExtLen(x) {
  return (x && Number(x.len)) ? { len: Math.max(1, Math.min(999, Number(x.len))), unit: x.unit === 'sec' ? 'sec' : 'min' } : { len: 1, unit: 'min' };
}
function normSections(list) {
  return list.map(function (s, i) {
    return {
      name: String((s && s.name) || ('Giai đoạn ' + (i + 1))).slice(0, 40),
      len: Math.max(1, Math.min(999, Number(s && s.len) || 1)),
      unit: (s && s.unit) === 'sec' ? 'sec' : 'min',
      ambience: typeof (s && s.ambience) === 'string' ? String(s.ambience).slice(0, 20) : '0'
    };
  });
}
var timers = LS.get('byo_timers', null);
if (!Array.isArray(timers)) {
  var oldCfg = LS.get('byo_config', null); /* migrate the single saved timer */
  timers = (oldCfg && Array.isArray(oldCfg.sections) && oldCfg.sections.length)
    ? [{ id: uid(), name: 'Hẹn Giờ Của Tôi', sections: normSections(oldCfg.sections), loop: !!oldCfg.loop, bar: oldCfg.bar !== false, extend: !!oldCfg.extend, extendLen: normExtLen(oldCfg.extendLen) }]
    : [];
  LS.set('byo_timers', timers);
}
var currentId = LS.get('byo_current', null);
if (!timers.some(function (t) { return t.id === currentId; })) currentId = timers.length ? timers[0].id : null;
function currentTimer() { return timers.filter(function (t) { return t.id === currentId; })[0] || null; }
function cfgOf(t) { return { sections: t.sections, loop: t.loop, bar: t.bar, extend: t.extend, extendLen: t.extendLen }; }
var cfg = currentTimer() ? JSON.parse(JSON.stringify(cfgOf(currentTimer()))) : null;

/* ── shared timer via link (#share=...) — saved as its own named timer ── */
try {
  var hm = location.hash.match(/#share=(.+)$/);
  if (hm) {
    var parsed = JSON.parse(decodeURIComponent(hm[1]));
    if (parsed && Array.isArray(parsed.sections) && parsed.sections.length) {
      var sharedTimer = {
        id: uid(),
        name: String(parsed.name || 'Hẹn giờ được chia sẻ').slice(0, 40),
        sections: normSections(parsed.sections),
        loop: !!parsed.loop,
        bar: parsed.bar !== false,
        extend: !!parsed.extend,
        extendLen: normExtLen(parsed.extendLen)
      };
      var sharedSig = JSON.stringify(cfgOf(sharedTimer));
      var dupe = timers.filter(function (t) { return JSON.stringify(cfgOf(t)) === sharedSig && t.name === sharedTimer.name; })[0];
      if (dupe) {
        currentId = dupe.id;
        cfg = JSON.parse(JSON.stringify(cfgOf(dupe)));
      } else {
        timers.push(sharedTimer);
        currentId = sharedTimer.id;
        cfg = JSON.parse(JSON.stringify(cfgOf(sharedTimer)));
      }
      LS.set('byo_timers', timers); LS.set('byo_current', currentId);
      setTimeout(function () { toast('Đã thêm hẹn giờ được chia sẻ \u2014 nhấn play, hoặc Sửa Hẹn Giờ Của Tôi để chỉnh lại'); }, 500);
    }
  }
} catch (e) { /* bad share link: ignore and fall back to the saved timers */ }

/* ── stats ── */
function todayStr() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
var stats = LS.get('byo_stats', { date: todayStr(), phases: 0, min: 0 });
function statsNewDay() {
  if (stats.date !== todayStr()) { stats = { date: todayStr(), phases: 0, min: 0 }; LS.set('byo_stats', stats); }
}
function addPhaseStat(minutes) {
  statsNewDay(); stats.phases += 1; stats.min += Math.round(minutes); LS.set('byo_stats', stats); renderStats();
}
function renderStats() {
  $('statsLine').innerHTML = 'Hôm nay: ' + stats.phases + ' giai đoạn &middot; ' + stats.min + ' phút';
}

/* ── sound ── */
function playSound() {
  var a = new Audio('/assets/sounds/' + $('soundSel').value);
  a.volume = Number($('volRange').value) / 100;
  a.play().catch(function () {});
}
/* ── per-phase focus sound (two-way sync with the ambience pill) ──
   Each phase remembers an ambience preset id ('0' = off), stored inside
   the phase itself — so it rides along with saves, duplicates, reorders
   and share links. The pill shows the current phase's sound; changing
   the pill on-the-go updates the current phase. */
function phaseSound(sec) { return String((sec && sec.ambience) || '0'); }
function persistPhaseSound(i, id) { /* write through to the saved profile */
  var t = currentTimer();
  if (t && t.sections[i]) { t.sections[i].ambience = id; LS.set('byo_timers', timers); }
}
function syncPillToPhase() { /* push the current phase's sound to the pill (live switch while playing) */
  if (!window.byoAmbience || !cfg) return;
  var sec = cfg.sections[idx];
  var applied = window.byoAmbience.setPresetId(phaseSound(sec));
  if (sec && applied !== phaseSound(sec)) { sec.ambience = applied; persistPhaseSound(idx, applied); }
  window.byoAmbience.refresh();
}
window.byoOnPillChange = function (id) { /* pill changed on-the-go → becomes the current phase's sound */
  if (!cfg || !cfg.sections[idx]) return;
  cfg.sections[idx].ambience = id;
  persistPhaseSound(idx, id);
};
window.byoSyncAmbienceFromProfile = function () { /* runs once, when the ambience engine is ready */
  var pillNow = window.byoAmbience ? window.byoAmbience.getPresetId() : '0';
  var changed = false;
  timers.forEach(function (t) { /* migrate: timers without per-phase sounds adopt the current pill */
    var seed = (typeof t.ambience === 'string') ? t.ambience : pillNow;
    t.sections.forEach(function (s) { if (typeof s.ambience !== 'string') { s.ambience = seed; changed = true; } });
    if ('ambience' in t) { delete t.ambience; changed = true; }
  });
  if (changed) {
    LS.set('byo_timers', timers);
    var ct = currentTimer();
    if (ct && cfg) cfg.sections = JSON.parse(JSON.stringify(ct.sections));
  }
  syncPillToPhase();
};
function fillPhaseSoundSel(sel, selected) {
  var want = String(selected == null ? '0' : selected);
  sel.innerHTML = '<option value="0">Off</option>';
  if (window.byoAmbience) {
    window.byoAmbience.listPresets().forEach(function (p) {
      var o = document.createElement('option');
      o.value = String(p.id); o.textContent = p.name;
      sel.appendChild(o);
    });
  }
  sel.value = want;
  if (sel.value !== want) sel.value = '0';
}


/* ── timer engine ── */
var idx = 0, total = 0, remaining = 0, running = false, lastTick = 0, timerId = null;
var ICON_PLAY = '<path d="M8 5v14l11-7z"/>';
var ICON_PAUSE = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';

function secOf(sec) { return sec.unit === 'min' ? sec.len * 60 : sec.len; }
function fmt(s) {
  s = Math.max(0, Math.round(s));
  var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
}
function render() {
  var sec = cfg.sections[idx];
  $('secName').textContent = sec.name;
  $('secPos').textContent = 'Giai đoạn ' + (idx + 1) + ' / ' + cfg.sections.length;
  $('loopBadge').classList.toggle('on', !!cfg.loop);
  $('digits').textContent = fmt(remaining);
  $('digits').classList.remove('done');
  var frac = total > 0 ? remaining / total : 0;
  $('barFill').style.width = (frac * 100) + '%';
  $('barLeft').textContent = sec.name;
  $('barRight').textContent = fmt(remaining);
  $('barWrap').style.display = cfg.bar ? '' : 'none';
  $('extendWrap').classList.toggle('on', !!cfg.extend && running);
  $('extendBtn').textContent = '＋' + cfg.extendLen.len + ' ' + cfg.extendLen.unit;
  document.title = fmt(remaining) + ' \u00B7 ' + sec.name + ' \u2014 Hẹn Giờ Tùy Chỉnh | TomatoTimers';
}
function renderPlayIcon() { $('playIcon').innerHTML = running ? ICON_PAUSE : ICON_PLAY; }
function loadSection(i) { idx = i; total = secOf(cfg.sections[i]); remaining = total; render(); syncPillToPhase(); }

function tick() {
  if (!running) return;
  var now = Date.now();
  remaining -= (now - lastTick) / 1000;
  lastTick = now;
  if (remaining <= 0) { onSectionEnd(); return; }
  render();
}
function start() {
  if (running || !cfg) return;
  running = true; lastTick = Date.now();
  timerId = setInterval(tick, 250);
  render(); renderPlayIcon();
  if (window.byoAmbience) window.byoAmbience.onPlay();
}
function pause() {
  running = false; clearInterval(timerId);
  render(); renderPlayIcon();
  if (window.byoAmbience) window.byoAmbience.onPause();
}
function onSectionEnd() {
  playSound();
  addPhaseStat(secOf(cfg.sections[idx]) / 60);
  var next = idx + 1;
  if (next >= cfg.sections.length) {
    if (cfg.loop) { toast('Hoàn thành chuỗi \u2014 đang lặp lại \uD83D\uDD01'); next = 0; }
    else { finish(); return; }
  } else {
    toast('Tiếp theo: ' + cfg.sections[next].name);
  }
  loadSection(next);
  lastTick = Date.now();
}
function finish() {
  pause();
  $('digits').textContent = 'Xong!';
  $('digits').classList.add('done');
  $('secPos').textContent = 'Hoàn thành chuỗi \u2014 nhấn play để bắt đầu lại';
  document.title = 'Done \u2014 Hẹn Giờ Tùy Chỉnh | TomatoTimers';
}
$('playBtn').addEventListener('click', function () { running ? pause() : start(); });
$('resetBtn').addEventListener('click', function () {
  if (!cfg) return; pause(); loadSection(0); toast('Quay lại giai đoạn 1');
});
$('skipBtn').addEventListener('click', function () {
  if (!cfg) return;
  var next = idx + 1;
  if (next >= cfg.sections.length) { cfg.loop ? (next = 0) : (finish(), 0); }
  if (next < cfg.sections.length) { loadSection(next); if (running) lastTick = Date.now(); }
});
$('extendBtn').addEventListener('click', function () {
  var add = secOf(cfg.extendLen);
  remaining += add; total += add; render(); toast('＋' + cfg.extendLen.len + ' ' + cfg.extendLen.unit);
});
$('statsReset').addEventListener('click', function () {
  stats = { date: todayStr(), phases: 0, min: 0 }; LS.set('byo_stats', stats); renderStats();
});

/* ── share link ── */
function legacyCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
}
function copyText(text, done) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text); done(); });
  } else { legacyCopy(text); done(); }
}
$('shareBtn').addEventListener('click', function () {
  if (!cfg) return;
  var t = currentTimer();
  var link = location.href.split('#')[0] + '#share=' + encodeURIComponent(JSON.stringify({
    v: 1, name: t ? t.name : 'Hẹn giờ tùy chỉnh',
    sections: cfg.sections, loop: cfg.loop, bar: cfg.bar, extend: cfg.extend, extendLen: cfg.extendLen
  }));
  copyText(link, function () { toast('Đã sao chép link chia sẻ \u2014 gửi cho bất kỳ ai'); });
});
$('soundSel').value = LS.get('byo_sound', 'beep.mp3');
$('volRange').value = LS.get('byo_vol', 80);
$('soundSel').addEventListener('change', function () { LS.set('byo_sound', this.value); playSound(); });
$('volRange').addEventListener('input', function () { LS.set('byo_vol', Number(this.value)); });

/* ── builder ── */
var overlay = $('builder-overlay');
var draft = [], draftTgl = { loop: true, bar: true, extend: true, extendLen: { len: 1, unit: 'min' } };

function makeRow(sec, i) {
  var row = document.createElement('div');
  row.className = 'b-row'; row.draggable = true;

  var drag = document.createElement('span');
  drag.className = 'b-drag'; drag.textContent = '\u2630'; drag.title = 'Kéo để sắp xếp lại';

  var name = document.createElement('input');
  name.type = 'text'; name.value = sec.name; name.maxLength = 40; name.placeholder = 'Tên giai đoạn';
  name.setAttribute('aria-label', 'Tên giai đoạn');

  var len = document.createElement('input');
  len.type = 'number'; len.value = sec.len; len.min = 1; len.max = 999; len.step = 1;
  len.setAttribute('aria-label', 'Độ dài giai đoạn');
  var unitWrap = document.createElement('select');
  unitWrap.style.cssText = 'font-family:inherit;font-size:14px;padding:7px 8px 5px;border-radius:50px;border:1px solid var(--border);background:var(--input);color:var(--text);cursor:pointer;outline:none;';
  ['min', 'sec'].forEach(function (u) {
    var o = document.createElement('option'); o.value = u; o.textContent = u; unitWrap.appendChild(o);
  });
  unitWrap.value = sec.unit;

  var sound = document.createElement('select');
  sound.className = 'b-sound';
  sound.title = 'Âm thanh ambience cho giai đoạn này';
  sound.setAttribute('aria-label', 'Âm thanh ambience cho giai đoạn này');
  fillPhaseSoundSel(sound, sec.ambience);

  var dup = document.createElement('button');
  dup.className = 'b-dup'; dup.type = 'button'; dup.title = 'Nhân bản giai đoạn';
  dup.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  var del = document.createElement('button');
  del.className = 'b-del'; del.type = 'button'; del.textContent = '\u00D7'; del.title = 'Xóa giai đoạn';

  name.addEventListener('input', function () { sec.name = name.value; });
  len.addEventListener('input', function () { sec.len = Math.max(1, Math.min(999, Number(len.value) || 1)); });
  unitWrap.addEventListener('change', function () { sec.unit = unitWrap.value; });
  sound.addEventListener('change', function () { sec.ambience = sound.value; });
  dup.addEventListener('click', function () {
    draft.splice(i + 1, 0, JSON.parse(JSON.stringify(sec)));
    renderBuilder();
  });
  del.addEventListener('click', function () {
    draft.splice(i, 1); renderBuilder();
  });

  row.addEventListener('dragstart', function (e) {
    row.classList.add('dragging');
    e.dataTransfer.setData('text/plain', String(i));
  });
  row.addEventListener('dragend', function () { row.classList.remove('dragging'); });
  row.addEventListener('dragover', function (e) { e.preventDefault(); });
  row.addEventListener('drop', function (e) {
    e.preventDefault();
    var from = Number(e.dataTransfer.getData('text/plain'));
    if (isNaN(from) || from === i) return;
    var moved = draft.splice(from, 1)[0];
    draft.splice(i, 0, moved);
    renderBuilder();
  });

  row.appendChild(drag); row.appendChild(name); row.appendChild(len); row.appendChild(unitWrap); row.appendChild(sound); row.appendChild(dup); row.appendChild(del);
  return row;
}
function renderBuilder() {
  var wrap = $('b-rows'); wrap.innerHTML = '';
  draft.forEach(function (sec, i) { wrap.appendChild(makeRow(sec, i)); });
  $('tglLoop').checked = draftTgl.loop;
  $('tglBar').checked = draftTgl.bar;
  $('tglExtend').checked = draftTgl.extend;
  $('extendLenNum').value = draftTgl.extendLen.len;
  $('extendLenUnit').value = draftTgl.extendLen.unit;
  $('extendLenRow').classList.toggle('on', !!draftTgl.extend);
  $('b-err').textContent = '';
}
var editingNew = false;
function openBuilder(isNew) {
  editingNew = !!isNew;
  var t = currentTimer();
  draft = (!editingNew && cfg) ? JSON.parse(JSON.stringify(cfg.sections)) : JSON.parse(JSON.stringify(DEFAULTS));
  draftTgl = (!editingNew && cfg)
    ? { loop: cfg.loop, bar: cfg.bar, extend: cfg.extend, extendLen: JSON.parse(JSON.stringify(cfg.extendLen || { len: 1, unit: 'min' })) }
    : { loop: true, bar: true, extend: true, extendLen: { len: 1, unit: 'min' } };
  $('b-name').value = (!editingNew && t) ? t.name : '';
  $('builderTitle').textContent = editingNew ? 'Tạo Hẹn Giờ Mới' : 'Sửa Hẹn Giờ Của Tôi';
  renderBuilder();
  overlay.classList.add('open');
  setTimeout(function () { $('b-name').focus(); }, 60);
}
function closeBuilder() { overlay.classList.remove('open'); }
$('editTimerBtn').addEventListener('click', function () { openBuilder(false); });
$('tglExtend').addEventListener('change', function () {
  $('extendLenRow').classList.toggle('on', this.checked);
});
$('extendLenNum').addEventListener('input', function () {
  this.value = Math.max(1, Math.min(999, Number(this.value) || 1));
});
$('b-add').addEventListener('click', function () {
  draft.push({ name: 'Giai đoạn ' + (draft.length + 1), len: 5, unit: 'min' });
  renderBuilder();
  var rows = $('b-rows').children; var last = rows[rows.length - 1];
  if (last) last.querySelector('input[type=text]').focus();
});
$('b-save').addEventListener('click', function () {
  if (!draft.length) { $('b-err').textContent = 'Thêm ít nhất một giai đoạn.'; return; }
  draft.forEach(function (s, i) { if (!s.name.trim()) s.name = 'Giai đoạn ' + (i + 1); });
  var name = $('b-name').value.trim().slice(0, 40) || 'Hẹn Giờ Của Tôi';
  var data = {
    sections: draft,
    loop: $('tglLoop').checked,
    bar: $('tglBar').checked,
    extend: $('tglExtend').checked,
    extendLen: { len: Math.max(1, Math.min(999, Number($('extendLenNum').value) || 1)), unit: $('extendLenUnit').value }
  };
  var t = editingNew ? null : currentTimer();
  if (!t) {
    t = { id: uid() };
    timers.push(t);
  }
  t.name = name;
  t.sections = data.sections; t.loop = data.loop; t.bar = data.bar; t.extend = data.extend; t.extendLen = data.extendLen;
  currentId = t.id;
  LS.set('byo_timers', timers); LS.set('byo_current', currentId);
  cfg = JSON.parse(JSON.stringify(data));
  if (location.hash.indexOf('#share=') === 0) {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }
  renderPicker();
  pause(); loadSection(0); closeBuilder();
  toast('Đã lưu hẹn giờ \u2014 nhấn play!');
});
$('b-cancel').addEventListener('click', function () {
  if (!cfg) { $('b-err').textContent = 'Hãy tạo hẹn giờ trước \u2014 chỉ mất vài giây thôi.'; return; }
  closeBuilder();
});
overlay.addEventListener('click', function (e) {
  if (e.target === overlay && cfg) closeBuilder();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && cfg && overlay.classList.contains('open')) closeBuilder();
});
document.addEventListener('keydown', function (e) {
  if (!cfg || overlay.classList.contains('open')) return;
  var tag = (e.target && e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
  if (e.code === 'Space') { e.preventDefault(); running ? pause() : start(); }
  else if (e.key === 'ArrowRight') { $('skipBtn').click(); }
});

/* ── timer picker ── */
function renderPicker() {
  var sel = $('timerPicker');
  sel.innerHTML = '';
  if (!timers.length) {
    var o = document.createElement('option');
    o.textContent = 'Chưa có hẹn giờ nào'; o.value = '';
    sel.appendChild(o); sel.disabled = true;
    $('delTimerBtn').disabled = true;
    return;
  }
  sel.disabled = false;
  timers.forEach(function (t) {
    var o = document.createElement('option');
    o.value = t.id; o.textContent = t.name;
    if (t.id === currentId) o.selected = true;
    sel.appendChild(o);
  });
  $('delTimerBtn').disabled = false;
}
$('timerPicker').addEventListener('change', function () {
  var t = timers.filter(function (x) { return x.id === this.value; }, this)[0];
  if (!t) return;
  pause();
  currentId = t.id;
  LS.set('byo_current', currentId);
  cfg = JSON.parse(JSON.stringify(cfgOf(t)));
  loadSection(0); renderPlayIcon();
  toast('Đã tải \u201C' + t.name + '\u201D');
});
$('newTimerBtn').addEventListener('click', function () { openBuilder(true); });
$('dupTimerBtn').addEventListener('click', function () {
  var t = currentTimer();
  if (!t) return;
  var copy = JSON.parse(JSON.stringify(t));
  copy.id = uid();
  copy.name = (t.name + ' bản sao').slice(0, 40);
  timers.push(copy);
  pause();
  currentId = copy.id;
  LS.set('byo_timers', timers); LS.set('byo_current', currentId);
  cfg = JSON.parse(JSON.stringify(cfgOf(copy)));
  renderPicker(); loadSection(0); renderPlayIcon();
  toast('Đã nhân bản thành \u201C' + copy.name + '\u201D');
});
$('delTimerBtn').addEventListener('click', function () {
  var t = currentTimer();
  if (!t) return;
  if (!confirm('Xóa hẹn giờ \u201C' + t.name + '\u201D? Không thể hoàn tác.')) return;
  timers = timers.filter(function (x) { return x.id !== t.id; });
  currentId = timers.length ? timers[0].id : null;
  LS.set('byo_timers', timers); LS.set('byo_current', currentId);
  if (currentTimer()) {
    cfg = JSON.parse(JSON.stringify(cfgOf(currentTimer())));
    renderPicker(); pause(); loadSection(0); renderPlayIcon();
    toast('Đã xóa \u2014 đang hiển thị \u201C' + currentTimer().name + '\u201D');
  } else {
    cfg = null;
    renderPicker();
    $('secName').textContent = 'Tạo hẹn giờ của bạn';
    $('secPos').textContent = 'nhấn ＋ Mới để bắt đầu';
    $('digits').textContent = '--:--';
    $('barWrap').style.display = 'none';
    openBuilder(true);
  }
});

/* ── task list ── */
var COLORS = ['#DE4B3A', '#E8963C', '#E8C53C', '#7FA653', '#4A7FA6', '#8C5AA6'];
var tasks = LS.get('byo_tasks', []);
var selColor = 0;
(function renderDots() {
  var wrap = $('dotRow');
  COLORS.forEach(function (c, i) {
    var d = document.createElement('span');
    d.className = 'dot' + (i === 0 ? ' sel' : '');
    d.style.background = c; d.title = 'Màu công việc';
    d.addEventListener('click', function () {
      selColor = i;
      wrap.querySelectorAll('.dot').forEach(function (x) { x.classList.remove('sel'); });
      d.classList.add('sel');
    });
    wrap.appendChild(d);
  });
})();
function saveTasks() { LS.set('byo_tasks', tasks); }
function renderTasks() {
  var list = $('taskList'); list.innerHTML = '';
  tasks.forEach(function (t, i) {
    var li = document.createElement('li');
    if (t.done) li.className = 'done';
    var dot = document.createElement('span'); dot.className = 't-dot'; dot.style.background = COLORS[t.color] || COLORS[0];
    var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!t.done;
    cb.setAttribute('aria-label', 'Đánh dấu việc đã xong');
    cb.addEventListener('change', function () { t.done = cb.checked; saveTasks(); renderTasks(); });
    var nm = document.createElement('span'); nm.className = 't-name'; nm.textContent = t.name;
    li.appendChild(cb); li.appendChild(dot); li.appendChild(nm);
    if (t.est) { var est = document.createElement('span'); est.className = 't-est'; est.textContent = t.est + 'm'; li.appendChild(est); }
    var del = document.createElement('button'); del.className = 't-del'; del.type = 'button'; del.textContent = '\u00D7'; del.title = 'Xóa việc';
    del.addEventListener('click', function () { tasks.splice(i, 1); saveTasks(); renderTasks(); });
    li.appendChild(del);
    list.appendChild(li);
  });
  $('taskEmpty').style.display = tasks.length ? 'none' : '';
}
function addTask() {
  var name = $('taskName').value.trim();
  if (!name) { $('taskName').focus(); return; }
  var est = Math.max(1, Math.min(999, Number($('taskEst').value) || 0));
  tasks.push({ name: name, est: est || null, color: selColor, done: false });
  $('taskName').value = ''; $('taskEst').value = '';
  saveTasks(); renderTasks(); $('taskName').focus();
}
$('taskAdd').addEventListener('click', addTask);
$('taskName').addEventListener('keydown', function (e) { if (e.key === 'Enter') addTask(); });

/* ── BuySellAds loader (same as the other timer pages) ── */
(function () {
  var bsa_optimize = document.createElement('script');
  bsa_optimize.type = 'text/javascript';
  bsa_optimize.async = true;
  bsa_optimize.src = 'https://cdn4.buysellads.net/pub/tomatotimers.js?' + (new Date() - new Date() % 600000);
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(bsa_optimize);
})();

/* ── init ── */
document.addEventListener('DOMContentLoaded', function () {
  renderStats(); renderTasks(); renderPicker();
  if (cfg && cfg.sections && cfg.sections.length) {
    loadSection(0); renderPlayIcon();
  } else {
    $('secName').textContent = 'Tạo hẹn giờ của bạn';
    $('secPos').textContent = 'nhấn ＋ Mới để bắt đầu';
    $('digits').textContent = '--:--';
    $('barWrap').style.display = 'none';
    openBuilder(true);
  }
});
})();
