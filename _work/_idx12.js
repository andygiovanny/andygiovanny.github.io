
// ============================================================
// Timer controls v1 — round buttons: reset, alternating
// play/pause, skip. tomato.js exposes no "running" flag, so the
// icon state reuses the same remainingTime tick detector the
// ambience poller uses.
// ============================================================
(function () {
    'use strict';
    var playBtn   = document.getElementById('playBtn');
    var resetBtn  = document.getElementById('resetBtn');
    var skipBtn   = document.getElementById('skipBtn');
    var playIcon  = document.getElementById('playIcon');
    var pauseIcon = document.getElementById('pauseIcon');
    if (!playBtn) return;

    var _lastRt = (typeof window.remainingTime === 'number') ? window.remainingTime : null;
    var _lastTickAt = 0;

    function isRunning() {
        return _lastTickAt > 0 && (Date.now() - _lastTickAt) < 1800 && (window.remainingTime || 0) > 0;
    }
    window.ttControlsIsRunning = isRunning;   // used by the ambience instant-response listener

    function render() {
        var running = isRunning();
        if (playIcon)  playIcon.style.display  = running ? 'none' : '';
        if (pauseIcon) pauseIcon.style.display = running ? '' : 'none';
    }

    setInterval(function () {
        var rt = window.remainingTime;
        if (rt !== _lastRt) {
            var d = (_lastRt == null) ? 0 : (_lastRt - rt);
            if (d > 400 && d < 5200) _lastTickAt = Date.now();                    // genuine ~1s tick
            else if (typeof rt === 'number' && rt % 60000 === 0) _lastTickAt = 0; // reset to round minute
            _lastRt = rt;
        }
        render();
    }, 300);

    playBtn.addEventListener('click', function () {
        if (isRunning()) {
            _lastTickAt = 0;
            onStopTimer();
        } else {
            _lastTickAt = Date.now();   // hold until real ticks take over
            onPlayClick();
        }
        render();
    });

    if (resetBtn) resetBtn.addEventListener('click', function () {
        _lastTickAt = 0;
        onResetTimer();
        render();
    });

    // Skip: in loop mode, advance the real cycle — the same onLoop() tomato.js
    // calls at a natural phase end (loads the next phase and auto-starts it).
    // Guarded to step < len-1: onLoop's own guard is `==` (not `>=`), so calling
    // it past the final phase would index loopArray out of bounds. Skipping the
    // final phase (or an already-finished loop) ends the loop back at Pomodoro.
    // Outside loop mode: simple toggle — focus -> short break, any break -> focus.
    window.onSkipPhase = function () {
        var len  = (window.loopArray && window.loopArray.length) || 8;
        var step = (typeof window.loopCounter !== 'undefined') ? (window.loopCounter | 0) : -1;
        var looping = (typeof isLoopClicked !== 'undefined') && isLoopClicked
                   && (typeof onLoop === 'function');
        if (looping && step >= 0 && step < len - 1) {
            onLoop();
            _lastTickAt = Date.now();   // auto-started: hold the pause icon until real ticks
        } else if (looping) {
            onPomodoroTimer();
            _lastTickAt = 0;
        } else {
            _lastTickAt = 0;
            var onBreak = (typeof isShortCliked !== 'undefined' && isShortCliked)
                       || (typeof isLongClicked !== 'undefined' && isLongClicked);
            if (onBreak) onPomodoroTimer(); else onShortTimer();
        }
        render();
    };
    if (skipBtn) skipBtn.addEventListener('click', window.onSkipPhase);

    render();
})();
