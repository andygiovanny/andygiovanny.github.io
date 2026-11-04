
/* ── mascot follows the cursor: gentle 3D tilt on the wrapper + a small
   drift on the chick itself. Whole-image only (the 5 state SVGs are flat
   artwork), so faces can never distort. Skipped for reduced-motion users. */
(function () {
  var wrap = document.querySelector('.mascot-wrap');
  var img = document.getElementById('tomato');
  if (!wrap || !img) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var TILT = 5;    // degrees of tilt, deliberately subtle
  var SHIFT = 5;   // px the chick drifts toward the cursor
  var RANGE = 420; // px from mascot center for full effect

  function onMove(e) {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    var r = wrap.getBoundingClientRect();
    var dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / RANGE));
    var dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / RANGE));
    wrap.style.transform = 'perspective(1100px) rotateX(' + (-dy * TILT).toFixed(2) +
                           'deg) rotateY(' + (dx * TILT).toFixed(2) + 'deg)';
    img.style.transform = 'translate(' + (dx * SHIFT).toFixed(2) + 'px,' + (dy * SHIFT).toFixed(2) + 'px)';
  }

  if (window.PointerEvent) document.addEventListener('pointermove', onMove);
  else document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget) { wrap.style.transform = ''; img.style.transform = ''; }
  });
})();
