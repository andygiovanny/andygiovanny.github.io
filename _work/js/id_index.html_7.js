
/* ============================================================
   VIDEO GRID — lazy looping MP4s (replaces GIF thumbnails)
   Loads each clip only when it scrolls near the viewport,
   then keeps it looping muted, exactly like the old GIFs.
   ============================================================ */
(function () {
    var vids = document.querySelectorAll('.video-card video[data-src]');
    function start(v) {
        if (v.src) return;
        v.src = v.dataset.src;
        var p = v.play();
        if (p && p.catch) { p.catch(function () {}); }
    }
    if (!('IntersectionObserver' in window)) {
        for (var i = 0; i < vids.length; i++) { start(vids[i]); }
        return;
    }
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) { start(e.target); io.unobserve(e.target); }
        });
    }, { rootMargin: '300px' });
    for (var j = 0; j < vids.length; j++) { io.observe(vids[j]); }
})();
