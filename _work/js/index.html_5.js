
  /* Apply saved theme before first paint (light is default) */
  (function () {
    var t = null;
    try { t = localStorage.getItem('tt_theme_v1'); } catch (e) {}
    if (t === 'dark') document.body.classList.add('theme-dark');
    else if (t === 'classic') document.body.classList.add('theme-classic');
    /* 'light' (and first visit) needs no class */
  })();
