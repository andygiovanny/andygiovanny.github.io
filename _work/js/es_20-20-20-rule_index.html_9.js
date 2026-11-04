
/* ── custom timer modal: durations + chime; ambience dropdowns are wired
   by the ambience script (same element IDs as the main page modal) ── */
(function () {
  var SETTINGS_KEY = 'tt_2020_settings_v1';
  var NOTIFY_KEY = 'tt_notify_sounds_v1';
  var CHIME_FILES = { 1: '/assets/sounds/beep.mp3', 2: '/assets/sounds/Notification 1.mp3',
                      3: '/assets/sounds/Notification 2.mp3', 4: '/assets/sounds/Notification 3.mp3',
                      5: '/assets/sounds/Notification 4.mp3', 6: '/assets/sounds/Notification 5.mp3' };
  var overlay = document.getElementById('ctOverlay');
  if (!overlay) return;

  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch (e) { return {}; }
  }
  function openModal() {
    var s = loadSettings();
    document.getElementById('ct_work').value = s.workMin || Math.round(WORK_S / 60);
    document.getElementById('ct_break').value = s.breakSec || BREAK_S;
    document.getElementById('ct_snooze').value = s.snoozeSec || SNOOZE_S;
    var chime = 1;
    try { chime = parseInt(JSON.parse(localStorage.getItem(NOTIFY_KEY) || '{}').eye) || 1; } catch (e) {}
    document.getElementById('ct_notify').value = String(chime);
    overlay.classList.add('open');
  }
  function closeModal() { overlay.classList.remove('open'); }

  document.getElementById('customTimerBtn').addEventListener('click', openModal);
  document.getElementById('ct_cancel').addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  document.getElementById('ct_notify_test').addEventListener('click', function () {
    var n = document.getElementById('ct_notify').value;
    playChimeFile(CHIME_FILES[n] || CHIME_FILES[1]);
  });

  document.getElementById('SaveSet').addEventListener('click', function () {
    var workMin  = Math.min(180, Math.max(1, parseFloat(document.getElementById('ct_work').value) || 20));
    var breakSec = Math.min(300, Math.max(5, parseFloat(document.getElementById('ct_break').value) || 20));
    var snoozeSec = Math.min(600, Math.max(10, parseFloat(document.getElementById('ct_snooze').value) || 60));
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ workMin: workMin, breakSec: breakSec, snoozeSec: snoozeSec })); } catch (e) {}
    WORK_S = Math.round(workMin * 60); BREAK_S = Math.round(breakSec); SNOOZE_S = Math.round(snoozeSec);
    if (!timer) { left = WORK_S; breakLeft = BREAK_S; snoozeLeft = SNOOZE_S; }   // apply now if idle
    var n = parseInt(document.getElementById('ct_notify').value) || 1;
    try {
      var map = JSON.parse(localStorage.getItem(NOTIFY_KEY) || '{}');
      map.eye = n;
      localStorage.setItem(NOTIFY_KEY, JSON.stringify(map));
    } catch (e) {}
    closeModal();
    toast('ajustes guardados');
    paint();
    // the ambience script's own SaveSet listener runs after this one —
    // defer so it saves first, then re-apply the picked presets right away
    setTimeout(function () {
      if (window.ttEyeAmbienceRefresh) window.ttEyeAmbienceRefresh();
    }, 0);
  });
})();
