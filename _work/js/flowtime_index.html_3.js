
/* ── Theme: light (default) / dark — shares 'tt_theme_v1' with the main page ── */
(function () {
  var THEME_KEY = 'tt_theme_v1';
  function saved() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function apply(theme) {
    if (theme !== 'dark') theme = 'light';   // 'classic' on the main page = light here
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    var logo = document.getElementById('logo');
    if (logo) { logo.dataset.fb = ''; logo.src = '/assets/images/' + (theme === 'dark' ? 'logo-dark.svg' : 'logo.svg'); }
    var sel = document.getElementById('theme-select');
    if (sel) sel.value = theme;
  }
  apply(saved());   // before first paint — no flash
  document.addEventListener('DOMContentLoaded', function () {
    apply(saved());
    var sel = document.getElementById('theme-select');
    if (sel) sel.addEventListener('change', function () {
      try { localStorage.setItem(THEME_KEY, this.value); } catch (e) {}
      apply(this.value);
    });
  });
})();
