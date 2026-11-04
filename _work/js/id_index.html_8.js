
/* ============================================================
   AMBIENCE INTEGRATION v13 — Loop-safe mode detection + pill preset dropdown.
   Reads tomato.js globals (mode flags + loopCounter + remainingTime).
   No function hooks. No button wrapping. No DOM polling.
   ============================================================ */
(function() {
    'use strict';

    const PRESETS_KEY = 'tt_ambience_presets_v1';
    const TIMER_AMBIENCE_KEY = 'tt_timer_ambience_settings_v1';
    const DEFAULT_PRESETS = {
        1: { name: 'Rainy Focus',    sounds: { rain: {active:true, vol:70}, thunder: {active:true, vol:40} } },
        2: { name: 'Cozy Cafe',      sounds: { cafe: {active:true, vol:75}, typing:  {active:true, vol:50} } },
        3: { name: 'Campfire Night', sounds: { campfire: {active:true, vol:80}, night: {active:true, vol:60} } },
        4: { name: 'Ocean Breeze',   sounds: { waves: {active:true, vol:80}, wind:   {active:true, vol:40} } }
    };

    const SOUNDS = [
        { id:'rain',     file:'ambience/audio/rain.ogg' },
        { id:'thunder',  file:'ambience/audio/thunder.ogg' },
        { id:'wind',     file:'ambience/audio/wind.ogg' },
        { id:'campfire', file:'ambience/audio/campfire.ogg' },
        { id:'waves',    file:'ambience/audio/waves.ogg' },
        { id:'cafe',     file:'ambience/audio/cafe.ogg' },
        { id:'birds',    file:'ambience/audio/birds.ogg' },
        { id:'night',    file:'ambience/audio/night.ogg' },
        { id:'typing',   file:'ambience/audio/typing.ogg' },
        { id:'Train',    file:'ambience/audio/train.ogg' },
        { id:'Airplane', file:'ambience/audio/airplane.ogg' },
        { id:'Metro',    file:'ambience/audio/metro.ogg' },
        { id:'Cricket',  file:'ambience/audio/cricket.ogg' },
        { id:'River',    file:'ambience/audio/river.ogg' },
        { id:'bird',     file:'ambience/audio/bird.ogg' }
    ];

    // ---- Audio Engine ----
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null, masterGain = null;
    const buffers = {}, activeNodes = {};

    function ensureAudio() {
        if (audioCtx) return;
        try {
            audioCtx = new AudioContext();
            masterGain = audioCtx.createGain();
            masterGain.gain.value = getVolume() / 100;
            masterGain.connect(audioCtx.destination);
            SOUNDS.forEach(function(s){ preload(s); });
        } catch(e){ console.error('[Ambience] Audio init failed', e); }
    }
    async function preload(sound) {
        if (buffers[sound.id]) return;
        try {
            const res = await fetch(sound.file);
            if (!res.ok) throw new Error(res.status);
            buffers[sound.id] = await audioCtx.decodeAudioData(await res.arrayBuffer());
        } catch(err){ console.error('[Ambience] Load fail', sound.file, err); }
    }
    function playSound(sound) {
        if (!audioCtx) ensureAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        if (!buffers[sound.id]) {
            preload(sound).then(function(){ if (sound._active) playSound(sound); });
            return;
        }
        if (activeNodes[sound.id]) stopSound(sound.id);
        const src = audioCtx.createBufferSource();
        src.buffer = buffers[sound.id];
        src.loop = true; src.loopStart = 0;
        const trim = 0.10;
        src.loopEnd = Math.max(src.buffer.duration - trim, src.buffer.duration * 0.98);
        const gain = audioCtx.createGain();
        const vol = (sound.volume !== undefined ? sound.volume : 50) / 100;
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.05);
        src.connect(gain); gain.connect(masterGain); src.start(0);
        activeNodes[sound.id] = { src: src, gain: gain };
    }
    function stopSound(id) {
        const node = activeNodes[id]; if (!node) return;
        const now = audioCtx.currentTime;
        node.gain.gain.cancelScheduledValues(now);
        node.gain.gain.setValueAtTime(node.gain.gain.value, now);
        node.gain.gain.linearRampToValueAtTime(0, now + 0.05);
        try { node.src.stop(now + 0.06); } catch(e){}
        setTimeout(function(){ try{ node.src.disconnect(); node.gain.disconnect(); }catch(e){} }, 80);
        delete activeNodes[id];
    }
    function stopAll() { Object.keys(activeNodes).forEach(function(id){ stopSound(id); }); }

    function applyPreset(slot) {
        let presets;
        try {
            const raw = localStorage.getItem(PRESETS_KEY);
            presets = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_PRESETS));
        } catch(e){ presets = JSON.parse(JSON.stringify(DEFAULT_PRESETS)); }
        const preset = presets[slot] || DEFAULT_PRESETS[slot];
        if (!preset) return;
        stopAll();
        SOUNDS.forEach(function(s){
            const cfg = preset.sounds[s.id];
            if (cfg && cfg.active && cfg.vol > 0) {
                s._active = true; s.volume = cfg.vol; playSound(s);
            } else {
                s._active = false; if (cfg) s.volume = cfg.vol || 0;
            }
        });
        _lastPresetName = preset.name || 'Unnamed';
        updatePresetLabel(_lastPresetName);
    }

    // ---- Settings ----
    function loadSettings() {
        try {
            const raw = localStorage.getItem(TIMER_AMBIENCE_KEY);
            if (raw) return JSON.parse(raw);
        } catch(e){}
        return { pomodoro: '1', shortBreak: '2', longBreak: '3', volume: 0 };
    }
    function saveSettings(s) {
        try { localStorage.setItem(TIMER_AMBIENCE_KEY, JSON.stringify(s)); } catch(e){}
    }
    function getVolume() {
        const s = loadSettings();
        return (s.volume !== undefined) ? s.volume : 0;
    }
    function isMuted() {
        return getVolume() <= 0;
    }

    // ---- UI: Preset Label ----
    const presetLabel = document.getElementById('ambiencePresetLabel');
    function updatePresetLabel(name) {
        if (!presetLabel) return;
        if (name && !isMuted()) {
            presetLabel.innerHTML = '<span class="play-icon">▶</span><span class="preset-name">' + name + '</span>';
        } else {
            presetLabel.innerHTML = '';
        }
    }
    function clearPresetLabel() {
        if (presetLabel) presetLabel.innerHTML = '';
    }

    // ---- UI: Volume Slider & Icon ----
    const pill = document.getElementById('ambienceMasterPill');
    const volIcon = document.getElementById('ambienceVolIcon');
    const volSlider = document.getElementById('ambienceVolSlider');
    let preMuteVolume = 80;

    function updatePillUI() {
        const vol = getVolume();
        if (volSlider) volSlider.value = vol;
        if (pill) {
            pill.classList.toggle('active', vol > 0);
            pill.classList.toggle('muted', vol <= 0);
        }
        if (volIcon) {
            if (vol <= 0) {
                volIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
            } else if (vol < 50) {
                volIcon.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
            } else {
                volIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
            }
        }
        updatePresetSelValue();
    }

    if (volSlider) {
        volSlider.value = getVolume();
        volSlider.addEventListener('input', function(e) {
            const val = parseInt(e.target.value);
            const s = loadSettings();
            s.volume = val;
            if (val > 0) preMuteVolume = val;
            saveSettings(s);
            updatePillUI();
            if (audioCtx && masterGain) {
                masterGain.gain.setTargetAtTime(val / 100, audioCtx.currentTime, 0.05);
            }
            // Mute = keep nodes playing at 0% volume; never stop them.
            if (val <= 0) { clearPresetLabel(); }
            else if (_wasRunning && Object.keys(activeNodes).length === 0) { playForCurrentMode(); }
            else if (_wasRunning) { updatePresetLabel(_lastPresetName); }
        });
    }

    if (volIcon) {
        volIcon.addEventListener('click', function(e) {
            e.preventDefault(); e.stopPropagation();
            const s = loadSettings();
            if (getVolume() > 0) {
                preMuteVolume = getVolume();
                s.volume = 0;
            } else {
                s.volume = preMuteVolume || 80;
            }
            saveSettings(s);
            updatePillUI();
            if (audioCtx && masterGain) {
                masterGain.gain.setTargetAtTime(getVolume() / 100, audioCtx.currentTime, 0.05);
            }
            // Mute = keep nodes playing at 0% volume; never stop them.
            if (getVolume() <= 0) { clearPresetLabel(); }
            else if (_wasRunning && Object.keys(activeNodes).length === 0) { playForCurrentMode(); }
            else if (_wasRunning) { updatePresetLabel(_lastPresetName); }
            return false;
        });
    }

    // ---- UI: Preset dropdown on the pill ----
    // Shows and edits the CURRENT mode's ambience slot — the same
    // 'tt_timer_ambience_settings_v1' slots the Custom Timer modal's
    // ambience dropdowns edit, so the two stay in sync both ways:
    // pill change saves to the slot; modal save refreshes the pill
    // via updatePillUI().
    const presetSel = document.getElementById('ambiencePresetSel');

    function currentSlotKey() {
        const mode = detectMode();
        return mode === 'Short Break' ? 'shortBreak' : (mode === 'Long Break' ? 'longBreak' : 'pomodoro');
    }

    function updatePresetSelValue() {
        if (!presetSel) return;
        const s = loadSettings();
        presetSel.value = s[currentSlotKey()] || '0';
    }

    function populatePresetSel() {
        if (!presetSel) return;
        let presets;
        try {
            const raw = localStorage.getItem(PRESETS_KEY);
            presets = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_PRESETS));
        } catch(e){ presets = JSON.parse(JSON.stringify(DEFAULT_PRESETS)); }
        presetSel.innerHTML = '';
        const off = document.createElement('option');
        off.value = '0'; off.textContent = 'Off'; presetSel.appendChild(off);
        for (let i = 1; i <= 4; i++) {
            const opt = document.createElement('option');
            opt.value = String(i);
            opt.textContent = (presets[i] && presets[i].name) ? presets[i].name : DEFAULT_PRESETS[i].name;
            presetSel.appendChild(opt);
        }
        updatePresetSelValue();
    }

    if (presetSel) {
        presetSel.addEventListener('change', function() {
            const s = loadSettings();
            s[currentSlotKey()] = presetSel.value;
            saveSettings(s);
            updatePillUI();
            if (_wasRunning) { stopAll(); playForCurrentMode(); }   // live switch while playing
        });
    }

    // ---- Mode Detection ----
    function detectMode() {
        if (typeof isShortCliked !== 'undefined' && isShortCliked) return 'Istirahat Sebentar';
        if (typeof isLongClicked !== 'undefined' && isLongClicked) return 'Istirahat Panjang';
        if (typeof isPomClicked !== 'undefined' && isPomClicked) return 'Pomodoro';
        const el = document.getElementById('timer_type');
        return el ? el.value : 'Pomodoro';
    }

    function playForCurrentMode() {
        // Always start the sound nodes, even when muted — "mute" just means
        // masterGain at 0%, so unmuting is instant (no pause/play needed).
        const s = loadSettings();
        const mode = detectMode();
        let slot = '0';
        if (mode === 'Pomodoro') slot = s.pomodoro;
        else if (mode === 'Istirahat Sebentar') slot = s.shortBreak;
        else if (mode === 'Istirahat Panjang') slot = s.longBreak;
        if (slot === '0' || !slot) { stopAll(); clearPresetLabel(); return; }
        applyPreset(parseInt(slot));
    }

    // ---- State Control ----
    let _lastPresetName = '';

    function startAmbience() {
        playForCurrentMode();  // nodes always play; volume 0 = silent, not stopped
    }
    function pauseAmbience() {
        if (audioCtx && audioCtx.state === 'running') {
            audioCtx.suspend();
        }
        clearPresetLabel();
    }
    function resumeAmbience() {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        if (!isMuted()) updatePresetLabel(_lastPresetName);
    }
    function stopAmbience() {
        stopAll();
        clearPresetLabel();
    }

    // ---- Main Poller: watches tomato.js globals (mode flags + loopCounter + remainingTime) ----
    // countdownHandle is NEVER nulled by tomato.js stopTimer(), so it cannot detect
    // "stopped". Reliable signals instead:
    //   mode    = window.isPomClicked / isShortCliked / isLongClicked
    //             (tomato.js sets them synchronously during loop auto-transitions)
    //   step    = window.loopCounter (increments exactly once per loop auto-transition)
    //   running = window.remainingTime is actually ticking (~1s cadence)
    let _wasRunning = false;
    let _lastMode = detectMode();
    let _lastRt = (typeof window.remainingTime === 'number') ? window.remainingTime : null;
    let _lastTickAt = 0;
    let _lastStep = window.isLoopClicked ? (window.loopCounter | 0) : -1;

    setInterval(function() {
        try {
            var now  = Date.now();
            var rt   = window.remainingTime;
            var mode = detectMode();
            var len  = (window.loopArray && window.loopArray.length) || 8;
            var step = window.isLoopClicked ? (window.loopCounter | 0) : -1;

            if (rt !== _lastRt) {
                var _delta = (_lastRt == null) ? 0 : (_lastRt - rt);
                if (_delta > 400 && _delta < 5200) {
                    _lastTickAt = now;   // genuine ~1s decrement(s) -> timer is ticking
                } else if (typeof rt === 'number' && rt % 60000 === 0) {
                    _lastTickAt = 0;     // one-shot reset to a round-minute value
                }                        // (mode buttons) -> timer stopped NOW
                _lastRt = rt;
            }
            // ticking = a genuine ~1s decrement was seen very recently.
            // Mode-button resets land on round-minute values with non-tick deltas,
            // so they clear the stamp immediately instead of looking like a tick.
            var ticking = _lastTickAt > 0 && (now - _lastTickAt) < 1800;

            var loopStepped = (step !== _lastStep) && step >= 0 && step < len;
            var loopEnded   = window.isLoopClicked && step >= len; // final Long Break finished
            _lastStep = step;

            var isRunning = loopStepped ? true : (loopEnded ? false : ticking);

            // Loop auto-transition: tomato.js has already updated the mode flags
            // synchronously at this point. Trigger on loopCounter (not mode),
            // because the loop sequence repeats Pomodoro (P->S->P->...).
            if (loopStepped) {
                _lastMode = mode;
                updatePillUI();   // pill dropdown follows the current mode's slot
                // Only switch presets if the timer is genuinely running through
                // this step. Clicking the Loop button also bumps loopCounter
                // (arm, -1 -> 0) but does NOT start the timer — no ticks follow,
                // so `ticking` stays false and we stay silent.
                if (ticking || _wasRunning) {
                    _wasRunning = true;
                    // The transition's reset just cleared the tick stamp; bridge
                    // the gap until the new mode's first real ~1s tick arrives.
                    _lastTickAt = now;
                    stopAll();
                    playForCurrentMode();
                } else {
                    _wasRunning = false;
                }
                return;
            }

            // Timer just started
            if (isRunning && !_wasRunning) {
                _wasRunning = true;
                _lastMode = mode;
                if (audioCtx && audioCtx.state === 'suspended' && Object.keys(activeNodes).length > 0) {
                    resumeAmbience();
                } else {
                    startAmbience();
                }
            }

            // Timer just stopped / paused / loop finished
            if (!isRunning && _wasRunning) {
                _wasRunning = false;
                pauseAmbience();
            }

            // Mode changed (manual mode-button click); switch live if running
            if (mode !== _lastMode) {
                _lastMode = mode;
                updatePillUI();   // pill dropdown follows the current mode's slot
                if (isRunning) {
                    stopAll();
                    playForCurrentMode();
                }
            }
        } catch(err) { console.error('[Ambience] Poll error', err); }
    }, 300);

    // ---- Play at 00:00: fresh loop if the loop finished, else replay section ----
    // tomato.js: onStartTimer() -> stopTimer() -> startAlarm(), which rings
    // whenever remainingTime < 1000. So at 00:00, Play used to just beep+stop.
    // If the loop ran to the end (loopCounter past the last step), Play starts
    // a brand-new loop from Pomodoro. Otherwise refilling the timer BEFORE
    // onStartTimer() means startAlarm() sees a full timer and stays silent,
    // and the countdown replays the current section (gMinutes still holds the
    // active mode's minutes, custom values included).
    // Loop auto-transitions call onStartTimer() directly, never this function,
    // so the Pomodoro -> Break chain is unaffected.
    window.onPlayClick = function() {
        if (window.isLoopClicked && typeof window.loopArray !== 'undefined'
                && window.loopCounter >= window.loopArray.length) {
            if (typeof onLoopTimer === 'function') onLoopTimer();
        } else if ((window.remainingTime || 0) <= 0 && typeof resetTimer === 'function') {
            resetTimer();
        }
        onStartTimer();
    };

    /* ── keyboard shortcuts: Space = play/pause, → = skip ── */
    /* Space clicks the play/pause button so the icon and ambience follow
       through the same single path as a mouse click. */
    (function () {
        document.addEventListener('keydown', function (e) {
            var tag = (e.target && e.target.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
            if (document.querySelector('.modal.show, .jconfirm-box')) return;
            var zo = document.getElementById('tm_zero_overlay');
            if (zo && !zo.classList.contains('d-none')) return;
            if (e.code === 'Space') {
                e.preventDefault();
                var pb = document.getElementById('playBtn');
                if (pb) pb.click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (typeof window.onSkipPhase === 'function') window.onSkipPhase();
            }
        });
    })();

    // ---- Instant start/stop response on real user clicks ----
    // Listener only: it does NOT wrap or replace any onclick attribute, and
    // reads state AFTER tomato.js handlers have run (setTimeout 0).
    document.addEventListener('click', function(e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var startish = t.closest('a[onclick*="onStartTimer"], .to-do-button[onclick*="startTaskTimer"]');
        var playpause = t.closest('#playBtn');
        // NOTE: #loop_timer_button is STOPPISH, not startish — tomato.js onLoop()
        // skips onStartTimer() for the first step (loopCounter == 0), so clicking
        // Loop only ARMS loop mode (resets to Pomodoro) without starting the timer.
        // Mode buttons are STOPPISH too: tomato.js mode handlers clearInterval
        // and reset to a round-minute value WITHOUT restarting the countdown.
        var stopish  = t.closest('#resetBtn, #loop_timer_button, #pomodoro_timer_button, #short_break_timer_button, #long_break_timer_button');
        var skip     = t.closest('#skipBtn');
        if (!startish && !stopish && !playpause && !skip) return;
        setTimeout(function() {
            if (skip) {
                // Skip inside a loop auto-starts the next phase (tomato.js onLoop
                // calls onStartTimer for every step past the first). Bridge the
                // tick gap and switch the sound straight to the new phase, exactly
                // like the poller's loopStepped path. Any non-loop skip stops the
                // timer (mode functions reset without starting) -> pause instead.
                var _len  = (window.loopArray && window.loopArray.length) || 8;
                var _step = (typeof window.loopCounter !== 'undefined') ? (window.loopCounter | 0) : -1;
                if (window.isLoopClicked && _step >= 0 && _step < _len) {
                    _wasRunning = true;
                    _lastTickAt = Date.now();
                    _lastRt = window.remainingTime;
                    _lastMode = detectMode();
                    updatePillUI();
                    stopAll();
                    playForCurrentMode();
                } else {
                    _wasRunning = false;
                    _lastTickAt = 0;
                    _lastRt = window.remainingTime;
                    _lastMode = detectMode();
                    updatePillUI();
                    pauseAmbience();
                }
                return;
            }
            if (stopish || (playpause && window.ttControlsIsRunning && !window.ttControlsIsRunning())) {
                _wasRunning = false;
                _lastTickAt = 0;
                _lastRt = window.remainingTime;
                _lastMode = detectMode();
                updatePillUI();   // mode buttons are stopish — keep the pill in sync
                pauseAmbience();
            } else if ((window.remainingTime || 0) > 0 || window.isLoopClicked) {
                _lastTickAt = Date.now(); // hold until real ticks take over
                _lastRt = window.remainingTime;
                if (!_wasRunning) {
                    _wasRunning = true;
                    _lastMode = detectMode();
                    startAmbience();
                }
            }
        }, 0);
    }, true);

    // ---- Windows blank tab fix (run FIRST, before anything else) ----
    (function fixBaseTargetBlank() {
        document.querySelectorAll('a[href="javascript:void(0)"]').forEach(function(link) {
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_self');
            }
        });
    })();

    // Dynamic links (todo Edit/Delete etc.) are injected AFTER page load, so the
    // one-time patch above never sees them. Block the blank navigation at click
    // time instead — the link's own onclick (editTodo/deleteTodo) still runs,
    // because preventDefault only cancels the navigation, not event handlers.
    document.addEventListener('click', function(e) {
        var a = e.target && e.target.closest ? e.target.closest('a[href^="javascript:"]') : null;
        if (a) e.preventDefault();
    }, true);

    // ---- Notification permission fix ----
    // tomato.js requests Notification permission at page load. Firefox and
    // Safari REQUIRE a user gesture for requestPermission(), so the page-load
    // request is silently ignored on the live site and permission stays
    // 'default' forever -> new Notification() does nothing at timer end.
    // (It works on localhost only because permission was granted there once
    // and persists in your browser profile.)
    // Fix: ask again on the first real user interaction with the page.
    (function fixNotificationPermission() {
        function ask() {
            try {
                if (window.Notification && Notification.permission === 'default') {
                    Notification.requestPermission();
                }
            } catch (e) {}
            document.removeEventListener('click', ask, true);
        }
        document.addEventListener('click', ask, true);
    })();

    // ---- Safari completion-beep unlock ----
    // tomato.js plays the timer-end beep via audio.play() from a setInterval
    // callback. Safari (and iOS) block HTMLAudioElement.play() unless the
    // element was first unlocked by a real user gesture. Warm it up on the
    // first click anywhere: play it MUTED for a tick, then restore.
    // Inaudible, one-time. ('audio' is tomato.js's global beep element.)
    (function unlockTimerBeep() {
        function unlock() {
            try {
                var beep = window.audio;
                if (beep && beep.paused) {
                    beep.muted = true;
                    var p = beep.play();
                    var restore = function() {
                        try { beep.pause(); beep.currentTime = 0; } catch (e) {}
                        beep.muted = false;
                    };
                    if (p && p.then) { p.then(restore).catch(restore); } else { restore(); }
                }
            } catch (e) {}
            document.removeEventListener('click', unlock, true);
        }
        document.addEventListener('click', unlock, true);
    })();

    // ---- UI: Dropdowns ----
    function populateDropdowns() {
        let presets;
        try {
            const raw = localStorage.getItem(PRESETS_KEY);
            presets = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_PRESETS));
        } catch(e){ presets = JSON.parse(JSON.stringify(DEFAULT_PRESETS)); }
        const s = loadSettings();
        [
            { el:'pomodoro_ambience',     key:'pomodoro' },
            { el:'short_break_ambience',  key:'shortBreak' },
            { el:'long_break_ambience',   key:'longBreak' }
        ].forEach(function(item){
            const sel = document.getElementById(item.el);
            if (!sel) return;
            const oldVal = sel.value;
            sel.innerHTML = '';
            const none = document.createElement('option');
            none.value = '0'; none.textContent = 'None / Off'; sel.appendChild(none);
            for (let i = 1; i <= 4; i++) {
                const opt = document.createElement('option');
                opt.value = String(i);
                const name = (presets[i] && presets[i].name) ? presets[i].name : DEFAULT_PRESETS[i].name;
                opt.textContent = 'Preset ' + i + ': ' + name;
                sel.appendChild(opt);
            }
            sel.value = s[item.key] || '0';
            if (oldVal && sel.querySelector('option[value="' + oldVal + '"]')) sel.value = oldVal;
        });
    }

    const saveBtn = document.getElementById('SaveSet');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            try {
                const s = loadSettings();
                const p = document.getElementById('pomodoro_ambience');
                const sb = document.getElementById('short_break_ambience');
                const lb = document.getElementById('long_break_ambience');
                if (p)  s.pomodoro    = p.value;
                if (sb) s.shortBreak  = sb.value;
                if (lb) s.longBreak   = lb.value;
                saveSettings(s);
                // Refresh the pill right away and re-apply the sound if the
                // timer is running (same as ttEyeAmbienceRefresh on other pages).
                updatePillUI();
                if (_wasRunning) { stopAll(); playForCurrentMode(); }
            } catch(err) { console.error('[Ambience] Save error', err); }
        });
    }
    if (typeof $ !== 'undefined') {
        $('#custom-timer').on('show.bs.modal', function() {
            // populateDropdowns restores the currently-shown value after
            // rebuilding the options — clear first so a freshly-saved
            // pill choice actually wins.
            ['pomodoro_ambience', 'short_break_ambience', 'long_break_ambience'].forEach(function(id) {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            populateDropdowns();
        });
    }
    window.addEventListener('focus', function() { populateDropdowns(); populatePresetSel(); });
    window.addEventListener('storage', function(e) {
        if (e.key === PRESETS_KEY) { populateDropdowns(); populatePresetSel(); }
    });

    // Init
    updatePillUI();
    populateDropdowns();
    populatePresetSel();
    console.log('[Ambience] v13 loaded. Vol:', getVolume(), 'Mode:', detectMode());
})();
