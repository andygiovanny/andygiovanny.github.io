
(function () {
    var KEY = 'tt_countdowns_v1';
    var chip = document.getElementById('pinChip');
    if (!chip) return;
    var pinned = null, timer = null;
    /* First visit ever: seed a pinned welcome countdown (+30 days) so new
       users discover the pin feature. Once removed it never comes back. */
    if (localStorage.getItem(KEY) == null) {
      try {
        var st = new Date(Date.now() + 30 * 86400000);
        localStorage.setItem(KEY, JSON.stringify({ countdowns: [{ id: 'seed_welcome',
          name: '👋 ¡Haz clic!',
          target: st.getFullYear() + '-' + pad(st.getMonth() + 1) + '-' + pad(st.getDate()) +
                  'T' + pad(st.getHours()) + ':' + pad(st.getMinutes()),
          color: '#DE4B3A', icon: 'img:duck-astronaut', pinned: true, created: Date.now() }] }));
      } catch (e) {}
    }

    function parseTarget(s) {
        var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(s);
        if (!m) return null;
        var d = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], 0, 0);
        if (d.getFullYear() !== +m[1] || d.getMonth() !== +m[2] - 1 || d.getDate() !== +m[3]) return null;
        return d;
    }
    function readPin() {
        try {
            var raw = localStorage.getItem(KEY);
            if (!raw) return null;
            var list = (JSON.parse(raw) || {}).countdowns || [];
            for (var i = 0; i < list.length; i++) {
                var c = list[i];
                if (c && c.pinned && typeof c.target === 'string') {
                    var t = parseTarget(c.target);
                    if (t) return { name: String(c.name || 'Cuenta Regresiva'), target: t,
                                    color: c.color, icon: c.icon };
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
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function render() {
        if (!pinned) return;
        var now = new Date();
        var startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var isToday = pinned.target >= startToday &&
                      pinned.target < startToday.getTime() + 86400000;
        var timeEl = document.getElementById('pcTime');
        var diff = pinned.target - now;
        if (diff <= 0) { timeEl.textContent = isToday ? '🎉 Hoy' : 'Terminó'; return; }
        var sec = Math.floor(diff / 1000);
        var days = Math.floor(sec / 86400);
        var clock = pad(Math.floor(sec % 86400 / 3600)) + ':' +
                    pad(Math.floor(sec % 3600 / 60)) + ':' + pad(sec % 60);
        timeEl.innerHTML = '';
        if (isToday) {
            timeEl.appendChild(document.createTextNode('🎉 Hoy · ' + clock));
        } else {
            var dEl = document.createElement('span');
            dEl.className = 'pc-days';
            dEl.textContent = days + (days === 1 ? ' día' : ' días');
            timeEl.appendChild(dEl);
            timeEl.appendChild(document.createTextNode(' · ' + clock));
        }
    }
    function show() {
        pinned = readPin();
        if (!pinned) { chip.style.display = 'none'; return; }
        document.getElementById('pcName').textContent = pinned.name;
        setIcon(document.getElementById('pcIcon'), pinned.icon);
        if (pinned.color) chip.style.borderLeftColor = pinned.color;
        chip.style.display = 'flex';
        render();
        if (timer) clearInterval(timer);
        timer = setInterval(render, 1000);
    }
    chip.addEventListener('click', function () { window.location.href = '/es/days-until/'; });
    chip.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            window.location.href = '/es/days-until/';
        }
    });
    window.addEventListener('storage', function (ev) { if (ev.key === KEY) show(); });
    show();
})();
