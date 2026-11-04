
  /* ── Theme system: Dark (default) / Classic Tomato ── */
  (function () {
    var THEME_KEY = 'tt_theme_v1';

    function getSavedTheme() {
      try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
    }

    /* Sync the hidden legacy #theme-toggle so tomato.js performs the Classic Tomato
       image swaps (logo/play/pause/reset) and switches the mascot animation set */
    function syncLegacyToggle(isClassic) {
      var t = document.getElementById('theme-toggle');
      if (!t || t.checked === isClassic) return;
      t.checked = isClassic;
      if (window.jQuery) {
        window.jQuery(t).trigger('change');
      } else {
        var byId = function (id) { return document.getElementById(id); };
        var imgs = isClassic
          ? { logo: 'tomato.svg', resetButton: 'tomatoreset.svg', startButton: 'tomatoplay.svg', stopButton: 'tomatopause.svg' }
          : { logo: 'logo.svg', resetButton: 'rest-button.svg', startButton: 'play-button.svg', stopButton: 'stop-button.svg' };
        for (var id in imgs) { if (byId(id)) byId(id).src = 'assets/images/' + imgs[id]; }
      }
    }

    function applyTheme(theme) {
      if (theme !== 'dark' && theme !== 'classic') theme = 'light'; // light is the default
      document.body.classList.toggle('theme-dark', theme === 'dark');
      document.body.classList.toggle('theme-classic', theme === 'classic');
      // 'light' = no extra class, original styling
      syncLegacyToggle(theme === 'classic');
      // Dark theme uses cream-text logo variants; classic keeps tomato.js's
      // tomato.svg swap (runs inside syncLegacyToggle), light uses the originals.
      if (theme !== 'classic') {
        var logoImg = document.getElementById('logo');
        if (logoImg) logoImg.src = 'assets/images/' + (theme === 'dark' ? 'logo-dark.svg' : 'logo.svg');
      }
      var footerLogo = document.getElementById('footerLogo');
      if (footerLogo) footerLogo.src = 'assets/images/' + (theme === 'dark' ? 'footer-logo-dark.svg' : 'footer-logo.svg');
      var sel = document.getElementById('theme-select');
      if (sel) sel.value = theme;
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    }

    window.ttApplyTheme = applyTheme;

    document.addEventListener('DOMContentLoaded', function () {
      applyTheme(getSavedTheme() || 'light');
      var sel = document.getElementById('theme-select');
      if (sel) {
        sel.addEventListener('change', function () { applyTheme(this.value); });
      }
    });
  })();
