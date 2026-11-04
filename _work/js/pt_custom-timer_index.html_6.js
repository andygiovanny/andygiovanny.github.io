
/* ══════════════════════════════════════════════════════════════
   AMBIENCE — WebAudio engine (single 'custom' slot)
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var PRESETS_KEY = 'tt_ambience_presets_v1';
  var SETTINGS_KEY = 'tt_timer_ambience_settings_v1';
  var DEFAULT_PRESETS = [
    { id: 1, name: 'Rainy Focus', sounds: [{ s: 'rain', v: 0.8 }, { s: 'thunder', v: 0.35 }] },
    { id: 2, name: 'Cozy Cafe', sounds: [{ s: 'cafe', v: 0.7 }, { s: 'typing', v: 0.5 }] },
    { id: 3, name: 'Campfire Night', sounds: [{ s: 'campfire', v: 0.7 }, { s: 'night', v: 0.4 }] },
    { id: 4, name: 'Ocean Breeze', sounds: [{ s: 'waves', v: 0.7 }, { s: 'wind', v: 0.45 }] }
  ];
  var svgVolume = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/></svg>';
  var svgMute = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
  var svgLow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
  var svgHigh = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';

  var audioCtx = null, masterGain = null;
  var activeNodes = [];
  var buffers = {};
  var ambienceSounds = ['rain', 'thunder', 'wind', 'campfire', 'waves', 'cafe', 'birds', 'night', 'typing', 'train', 'airplane', 'metro', 'cricket', 'river', 'bird', 'chalkboard', 'restaurant', 'barn'];
  var cacheBust = '';
  try {
    var link = document.querySelector('link[rel="canonical"]');
    if (link) {
      var u = new URL(link.href);
      var parts = u.pathname.split('/').filter(Boolean);
      if (parts.length > 1) cacheBust = '/' + parts.slice(0, -1).join('/');
    }
  } catch (e) {}

  var presetSel = document.getElementById('ambiencePresetSel');
  var volSlider = document.getElementById('ambienceVolSlider');
  var volIcon = document.getElementById('ambienceVolIcon');
  var presetLabel = document.getElementById('ambiencePresetLabel');

  function loadJSON(key, fallback) { try { var v = JSON.parse(localStorage.getItem(key)); return (v === null || v === undefined) ? fallback : v; } catch (e) { return fallback; } }
  function saveJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
  function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function loadSlotSettings() {
    var all = loadJSON(SETTINGS_KEY, {});
    if (!all.custom || typeof all.custom !== 'object') all.custom = { custom: '0', volume: 0 };
    if (typeof all.custom.custom !== 'string') all.custom.custom = '0';
    if (typeof all.custom.volume !== 'number' || isNaN(all.custom.volume)) all.custom.volume = 0;
    return all;
  }
  function saveSlotSettings(all) { saveJSON(SETTINGS_KEY, all); }
  function currentSlot() { return loadSlotSettings().custom; }

  function getPresets() {
    var saved = loadJSON(PRESETS_KEY, null);
    if (Array.isArray(saved) && saved.length) return saved;
    return DEFAULT_PRESETS.map(function (p) { return { id: p.id, name: p.name, sounds: p.sounds.map(function (s) { return { s: s.s, v: s.v }; }) }; });
  }

  function buildSoundUrl(sound) { return cacheBust + '/ambience/audio/' + encodeURIComponent(sound) + '.ogg'; }

  function ensureAudio() {
    if (audioCtx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = new AC();
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.value = 0;
  }

  function loadBuffer(sound) {
    return new Promise(function (resolve) {
      if (buffers[sound]) return resolve(buffers[sound]);
      fetch(buildSoundUrl(sound)).then(function (r) { return r.arrayBuffer(); }).then(function (ab) {
        audioCtx.decodeAudioData(ab, function (buf) { buffers[sound] = buf; resolve(buf); }, function () { resolve(null); });
      }).catch(function () { resolve(null); });
    });
  }

  function stopAll() {
    activeNodes.forEach(function (n) { try { n.source.stop(); } catch (e) {} try { n.source.disconnect(); } catch (e) {} try { n.gain.disconnect(); } catch (e) {} });
    activeNodes = [];
  }

  function startNodes(preset) {
    if (!audioCtx) return;
    stopAll();
    (preset.sounds || []).forEach(function (snd) {
      loadBuffer(snd.s).then(function (buf) {
        if (!buf) return;
        if (!audioCtx) return;
        var src = audioCtx.createBufferSource();
        src.buffer = buf; src.loop = true;
        var g = audioCtx.createGain();
        g.gain.value = Math.max(0, Math.min(1, snd.v == null ? 0.6 : snd.v));
        src.connect(g); g.connect(masterGain);
        try { src.start(); } catch (e) {}
        activeNodes.push({ source: src, gain: g });
      });
    });
  }

  function applyMasterVolume() {
    if (!masterGain || !audioCtx) return;
    var vol = Math.max(0, Math.min(1, currentSlot().volume));
    masterGain.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.03);
  }

  function getPresetById(id) {
    var list = getPresets();
    for (var i = 0; i < list.length; i++) { if (String(list[i].id) === String(id)) return list[i]; }
    return null;
  }

  function renderIcon() {
    var vol = Math.max(0, Math.min(1, currentSlot().volume));
    var icon;
    if (vol === 0) icon = svgMute;
    else if (vol < 0.5) icon = svgLow;
    else icon = svgHigh;
    if (volIcon) volIcon.innerHTML = icon;
    if (volSlider) volSlider.value = String(Math.round(vol * 100));
    if (presetSel) presetSel.value = currentSlot().custom;
  }

  function showLabel(name) {
    if (!presetLabel) return;
    presetLabel.innerHTML = '<span class="play-icon">\u25B6</span><span class="preset-name">' + escapeHtml(name) + '</span>';
    presetLabel.classList.remove('show');
    void presetLabel.offsetWidth;
    presetLabel.classList.add('show');
  }

  function hideLabel() {
    if (presetLabel) presetLabel.classList.remove('show');
  }

  function applyPreset() {
    var slot = currentSlot();
    var id = slot.custom;
    if (!id || id === '0' || !audioCtx) { stopAll(); return; }
    var p = getPresetById(id);
    if (!p) { stopAll(); return; }
    if (audioCtx.state === 'suspended') { audioCtx.resume().catch(function () {}); }
    startNodes(p);
    applyMasterVolume();
    showLabel(p.name);
  }

  function populatePresets() {
    if (!presetSel) return;
    var list = getPresets();
    presetSel.innerHTML = '<option value="0">Desligado</option>' + list.map(function (p) {
      return '<option value="' + escapeHtml(String(p.id)) + '">' + escapeHtml(p.name) + '</option>';
    }).join('');
    var cur = currentSlot().custom;
    var has = false;
    for (var i = 0; i < presetSel.options.length; i++) { if (presetSel.options[i].value === cur) { has = true; break; } }
    if (!has) cur = '0';
    presetSel.value = cur;
    if (cur !== String(presetSel.value)) {
      var all = loadSlotSettings();
      all.custom.custom = presetSel.value;
      saveSlotSettings(all);
    }
    renderIcon();
  }

  if (presetSel) {
    presetSel.addEventListener('change', function () {
      var all = loadSlotSettings();
      all.custom.custom = presetSel.value;
      saveSlotSettings(all);
      if (audioCtx) { applyPreset(); }
      renderIcon();
      if (window.byoOnPillChange) window.byoOnPillChange(presetSel.value); /* keep the current phase's sound in sync */
    });
  }
  if (volSlider) {
    volSlider.addEventListener('input', function () {
      var all = loadSlotSettings();
      all.custom.volume = Number(volSlider.value) / 100;
      saveSlotSettings(all);
      ensureAudio();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
      applyMasterVolume();
      renderIcon();
    });
  }

  window.byoAmbience = {
    onPlay: function () {
      ensureAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
      applyPreset();
    },
    onPause: function () {
      if (audioCtx && audioCtx.state === 'running') audioCtx.suspend().catch(function () {});
      hideLabel();
    },
    refresh: function () { /* switch the playing sound to the stored preset — only while playing */
      if (audioCtx && audioCtx.state === 'running') applyPreset();
    },
    listPresets: function () {
      return getPresets().map(function (p) { return { id: String(p.id), name: p.name }; });
    },
    getPresetId: function () { return currentSlot().custom; },
    setPresetId: function (id) { /* storage + pill UI only — never starts audio by itself */
      id = String(id == null ? '0' : id);
      if (id !== '0' && !getPresetById(id)) id = '0';
      var all = loadSlotSettings();
      all.custom.custom = id;
      saveSlotSettings(all);
      if (presetSel) presetSel.value = id;
      renderIcon();
      return id;
    }
  };

  function initAmbience() {
    populatePresets();
    if (window.byoSyncAmbienceFromProfile) window.byoSyncAmbienceFromProfile(); /* apply the current phase's focus sound */
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAmbience);
  } else {
    initAmbience();
  }
})();
