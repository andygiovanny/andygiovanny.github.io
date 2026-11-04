
(function () {
  var THEME_KEY = 'site-theme';
  function apply(t) {
    document.documentElement.classList.remove('theme-dark', 'theme-classic');
    if (t === 'dark') document.documentElement.classList.add('theme-dark');
    else if (t === 'classic') document.documentElement.classList.add('theme-classic');
    var sel = document.getElementById('theme-select');
    if (sel) sel.value = t;
  }
  function saved() { try { return localStorage.getItem(THEME_KEY) || 'light'; } catch (e) { return 'light'; } }
  apply(saved());
  document.addEventListener('DOMContentLoaded', function () {
    apply(saved());
    var sel = document.getElementById('theme-select');
    if (sel) sel.addEventListener('change', function () {
      try { localStorage.setItem(THEME_KEY, this.value); } catch (e) {}
      apply(this.value);
    });
  });
})();
