
/* Language memory: if the visitor picked a language before, go straight to it. */
(function () {
  try {
    var l = localStorage.getItem('tt_lang');
    if (!l || l === 'en') return;
    var p = location.pathname;
    if (/^\/(id|es|pt|vi)(\/|$)/.test(p)) return;  // already on a translation
    location.replace('/' + l + (p === '/' ? '/' : p));
  } catch (e) {}
})();
