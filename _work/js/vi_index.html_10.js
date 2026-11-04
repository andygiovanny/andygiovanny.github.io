
// ============================================================
// Notification chime picker — per-timer chime map, built to be
// shared by future timers (20-20-20, etc.):
//   localStorage 'tt_notify_sounds_v1' = { main: 1..6, eye: 1..6, ... }
// Each timer page reads/writes only its own key. tomato.js owns
// the global `audio` alarm object — we just repoint its src.
// ============================================================
(function () {
    var NOTIFY_KEY = 'tt_notify_sounds_v1';
    var NOTIFY_FILES = {
        1: 'assets/sounds/beep.mp3',   // default
        2: 'assets/sounds/Notification 1.mp3',
        3: 'assets/sounds/Notification 2.mp3',
        4: 'assets/sounds/Notification 3.mp3',
        5: 'assets/sounds/Notification 4.mp3',
        6: 'assets/sounds/Notification 5.mp3'
    };

    function getChime(timerId) {
        try {
            var map = JSON.parse(localStorage.getItem(NOTIFY_KEY) || '{}');
            var n = parseInt(map[timerId], 10);
            return (n >= 1 && n <= 6) ? n : 1;
        } catch (e) { return 1; }
    }
    function setChime(timerId, n) {
        try {
            var map = JSON.parse(localStorage.getItem(NOTIFY_KEY) || '{}');
            map[timerId] = n;
            localStorage.setItem(NOTIFY_KEY, JSON.stringify(map));
        } catch (e) {}
    }
    function applyChime() {
        var file = NOTIFY_FILES[getChime('main')] || NOTIFY_FILES[1];
        try { if (typeof audio !== 'undefined' && audio) audio.src = file; } catch (e) {}
    }

    document.addEventListener('DOMContentLoaded', function () {
        applyChime();
        var sel = document.getElementById('notify_sound');
        var testBtn = document.getElementById('notify_sound_test');
        if (sel) sel.value = String(getChime('main'));
        if (testBtn && sel) {
            testBtn.addEventListener('click', function () {
                var f = NOTIFY_FILES[parseInt(sel.value, 10)] || NOTIFY_FILES[1];
                try { var a = new Audio(f); a.play(); } catch (e) {}
            });
        }
        var saveBtn = document.getElementById('SaveSet');
        if (saveBtn && sel) {
            saveBtn.addEventListener('click', function () {
                setChime('main', parseInt(sel.value, 10) || 1);
                applyChime();
            });
        }
    });
})();
