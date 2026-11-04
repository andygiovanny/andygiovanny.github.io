
/* ============================================================
   AMBIENCE INTEGRATION (20-20-20 edition) — same presets and storage as
   the main timer page ('tt_ambience_presets_v1' / settings), so ambience
   choices follow the user. Mode detection reads the eye-timer's globals:
   work -> Pomodoro preset slot, break -> Short Break preset slot.
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
        { id:'rain',     file:'/ambience/audio/rain.ogg' },
        { id:'thunder',  file:'/ambience/audio/thunder.ogg' },
        { id:'wind',     file:'/ambience/audio/wind.ogg' },
        { id:'campfire', file:'/ambience/audio/campfire.ogg' },
        { id:'waves',    file:'/ambience/audio/waves.ogg' },
        { id:'cafe',     file:'/ambience/audio/cafe.ogg' },
        { id:'birds',    file:'/ambience/audio/birds.ogg' },
        { id:'night',    file:'/ambience/audio/night.ogg' },
        { id:'typing',   file:'/ambience/audio/typing.ogg' },
        { id:'Train',    file:'/ambience/audio/train.ogg' },
        { id:'Airplane', file:'/ambience/audio/airplane.ogg' },
        { id:'Metro',    file:'/ambience/audio/metro.ogg' },
        { id:'Cricket',  file:'/ambience/audio/cricket.ogg' },
        { id:'River',    file:'/ambience/audio/river.ogg' },
        { id:'bird',     file:'/ambience/audio/bird.ogg' },
        { id:'chalkboard', file:'/ambience/audio/chalkboard.ogg' },
        { id:'restaurant', file:'/ambience/audio/restaurant.ogg' }
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
        }        updatePresetSelValue();
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
    // 'tt_timer_ambience_settings_v1' slots the settings modal's
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
        return (window.mode === 'break') ? 'Short Break' : 'Pomodoro';
    }

    function playForCurrentMode() {
        // Always start the sound nodes, even when muted — "mute" just means
        // masterGain at 0%, so unmuting is instant (no pause/play needed).
        const s = loadSettings();
        const mode = detectMode();
        let slot = '0';
        if (mode === 'Pomodoro') slot = s.pomodoro;
        else if (mode === 'Short Break') slot = s.shortBreak;
        else if (mode === 'Long Break') slot = s.longBreak;
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

    // ---- Main Poller: watches the eye-timer's globals ----
    // running = the engine's interval handle is non-null (it nulls on stop).
    // mode    = 'work' | 'break' | 'snooze' | 'idle' (global var).
    let _wasRunning = false;
    let _lastMode = detectMode();

    setInterval(function() {
        try {
            var running = !!window.timer;
            var mode = detectMode();

            if (running && !_wasRunning) {
                _wasRunning = true;
                _lastMode = mode;
                if (audioCtx && audioCtx.state === 'suspended' && Object.keys(activeNodes).length > 0) {
                    resumeAmbience();
                } else {
                    startAmbience();
                }
            }
            if (!running && _wasRunning) {
                _wasRunning = false;
                pauseAmbience();
            }
            if (mode !== _lastMode) {
                _lastMode = mode;
                updatePillUI();
                if (running) {
                    stopAll();
                    playForCurrentMode();
                }
            }
        } catch(err) { console.error('[Ambience] Poll error', err); }
    }, 300);

    // ---- Notification permission fix ----
    // Ask on the first real user interaction (Firefox/Safari require a
    // user gesture for requestPermission).
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
            } catch(err) { console.error('[Ambience] Save error', err); }
        });
    }
    if (typeof window.jQuery !== 'undefined') {
        window.jQuery('#custom-timer').on('show.bs.modal', populateDropdowns);
    }
    // Re-read the ambience slots every time the settings modal opens, so
    // changes made via the pill dropdown show up instantly (previously the
    // modal only refreshed on window focus / reload).
    const settingsBtn = document.getElementById('rewardSettingsBtn');
    if (settingsBtn) settingsBtn.addEventListener('click', function() {
        // populateDropdowns restores the currently-shown value after
        // rebuilding the options — clear first so the freshly-saved
        // pill choice actually wins.
        ['pomodoro_ambience', 'short_break_ambience', 'long_break_ambience'].forEach(function(id) {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        populateDropdowns();
    });
    window.addEventListener('focus', function() { populateDropdowns(); populatePresetSel(); });
    window.addEventListener('storage', function(e) {
        if (e.key === PRESETS_KEY) { populateDropdowns(); populatePresetSel(); }
    });

    // Let the custom-timer modal re-apply ambience right after saving.
    // Only touches sound when the timer is actually running.
    window.ttEyeAmbienceRefresh = function () {
        try {
            updatePillUI();
            if (!!window.timer) { stopAll(); playForCurrentMode(); }
        } catch (e) {}
    };

    // Init
    updatePillUI();
    populateDropdowns();
    populatePresetSel();
    console.log('[Ambience] 20-20-20 loaded. Vol:', getVolume(), 'Mode:', detectMode());
})();
