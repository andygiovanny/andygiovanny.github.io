
(function () {
    var KEY = 'tt_streaks_v1';
    var chip = document.getElementById('streakChip');
    if (!chip) return;
    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function toKey(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
    function parseKey(k) {
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(k));
        if (!m) return null;
        var d = new Date(+m[1], +m[2] - 1, +m[3]);
        if (d.getFullYear() !== +m[1] || d.getMonth() !== +m[2] - 1 || d.getDate() !== +m[3]) return null;
        return d;
    }
    function addKey(k, n) { var d = parseKey(k); d.setDate(d.getDate() + n); return toKey(d); }
    /* Same math as the streaks page: count-up = days since start;
       check-in = run ending today (or yesterday if today isn't checked in yet). */
    function currentStreak(s) {
        var t = toKey(new Date());
        if (s.mode === 'countup') {
            return t < s.start ? 0 :
                Math.round((parseKey(t) - parseKey(s.start)) / 86400000) + 1;
        }
        var ck = s.checkins || {};
        var end = t;
        if (!ck[end]) end = addKey(t, -1);
        if (!ck[end]) return 0;
        var n = 0, d = end;
        while (ck[d] && n < 4000) { n++; d = addKey(d, -1); }
        return n;
    }
    function readPin() {
        try {
            var raw = localStorage.getItem(KEY);
            if (!raw) return null;
            var list = (JSON.parse(raw) || {}).streaks || [];
            for (var i = 0; i < list.length; i++) {
                var s = list[i];
                if (s && s.pinned && typeof s.name === 'string') {
                    return { name: s.name, mode: s.mode === 'countup' ? 'countup' : 'checkin',
                             start: typeof s.start === 'string' ? s.start : toKey(new Date()),
                             checkins: (s.checkins && typeof s.checkins === 'object') ? s.checkins : {},
                             color: s.color, icon: s.icon };
                }
            }
        } catch (e) {}
        return null;
    }
    function setIcon(el, v) {
        el.innerHTML = '';
        if (typeof v === 'string' && v.indexOf('img:') === 0) {
            var img = document.createElement('img');
            img.src = '/assets/images/icons/' + v.slice(4) + '.png';
            img.alt = '';
            el.appendChild(img);
        } else if (v) { el.textContent = v; }
    }
    function show() {
        var s = readPin();
        if (!s) { chip.style.display = 'none'; return; }
        document.getElementById('scName').textContent = s.name;
        setIcon(document.getElementById('scIcon'), s.icon);
        var timeEl = document.getElementById('scTime');
        timeEl.innerHTML = '';
        var n = currentStreak(s);
        if (n > 0) {
            timeEl.appendChild(document.createTextNode('🔥 '));
            var dEl = document.createElement('span');
            dEl.className = 'pc-days';
            dEl.textContent = n + '-day';
            timeEl.appendChild(dEl);
            timeEl.appendChild(document.createTextNode(' streak'));
        } else {
            timeEl.textContent = s.mode === 'countup' ? 'Starts soon' : 'Check in today to start!';
        }
        if (s.color) chip.style.borderLeftColor = s.color;
        chip.style.display = 'flex';
    }
    chip.addEventListener('click', function () { window.location.href = '/streaks/'; });
    chip.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            window.location.href = '/streaks/';
        }
    });
    window.addEventListener('storage', function (ev) { if (ev.key === KEY) show(); });
    show();
})();
