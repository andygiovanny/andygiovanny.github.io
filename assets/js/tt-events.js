/* TomatoTimers — shared GA4 event helper + autowire.
   TTEvent(name, params): fires a custom GA4 event only when gtag is
   actually loaded; silently no-ops under ad blockers. Never throws. */
(function () {
  'use strict';
  window.TTEvent = function (name, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, params || {});
      }
    } catch (e) { /* never let analytics break a timer */ }
  };

  /* Autowire — runs on load, after every other script has defined its globals.
     Handles the events that are IDENTICAL on every page:
       task_completed (piggybacks on the shared ttStats recorder),
       theme_toggle, lang_switch, card_click. */
  window.addEventListener('load', function () {
    var TM = window.TT_TECHNIQUE || 'unknown';

    if (window.ttStats && typeof window.ttStats.recordTask === 'function') {
      var _rt = window.ttStats.recordTask;
      window.ttStats.recordTask = function (tid, ts) {
        window.TTEvent('task_completed', { technique: tid || TM });
        return _rt.apply(this, arguments);
      };
    }

    var themeSel = document.getElementById('theme-select');
    if (themeSel) {
      themeSel.addEventListener('change', function () {
        window.TTEvent('theme_toggle', { theme: themeSel.value });
      });
    }

    var langSel = document.getElementById('lang-select');
    if (langSel) {
      langSel.addEventListener('change', function () {
        window.TTEvent('lang_switch', { lang: (langSel.value || '').replace(/\//g, '') || 'en' });
      });
    }

    document.addEventListener('click', function (e) {
      var card = (e.target && e.target.closest) ? e.target.closest('a.tt-card') : null;
      if (card) {
        window.TTEvent('card_click', { href: card.getAttribute('href') || '' });
      }
    });
  });
})();
