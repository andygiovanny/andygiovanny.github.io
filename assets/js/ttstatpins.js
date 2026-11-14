/* TomatoTimers Stats Pins v2 — shared stats pin chip for timer pages.
   A pin is a METRIC x TIMEFRAME combo: 4 metrics (focus/breaks/tasks/sessions)
   x 5 timeframes (today/week/month/custom/all) = 20 options, max 5 pinned,
   stored in tt_stat_pins_v1 as e.g. 'focus:today'. Renders ONE combined chip
   into #statsPins; each pinned combo is an invisible column (muted label on
   top, bold value below). Localized via <html lang>; falls back to English.
   Requires ttstats.js loaded first. */
(function () {
    var KEY = 'tt_stat_pins_v1';
    /* First visit ever: pin all four "today" metrics so new users discover
       the chip. Once edited it never comes back. */
    if (localStorage.getItem(KEY) == null) {
        try { localStorage.setItem(KEY, JSON.stringify({ pins: ['focus:today', 'breaks:today', 'tasks:today', 'sessions:today'] })); } catch (e) {}
    }
    function lang() {
        var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
        return /^(id|es|pt|vi)$/.test(l) ? l : 'en';
    }
    var L = {
        en: { focus: 'Focus',  breaks: 'Breaks', tasks: 'Tasks',    sessions: 'Sessions',
              today: 'Today', week: 'This week', month: 'This month', custom: 'Custom', all: 'All time' },
        id: { focus: 'Fokus',  breaks: 'Istirahat', tasks: 'Tugas', sessions: 'Sesi',
              today: 'Hari ini', week: 'Minggu ini', month: 'Bulan ini', custom: 'Kustom', all: 'Sepanjang waktu' },
        es: { focus: 'Enfoque', breaks: 'Descansos', tasks: 'Tareas', sessions: 'Sesiones',
              today: 'Hoy', week: 'Esta semana', month: 'Este mes', custom: 'Personalizado', all: 'Todo el tiempo' },
        pt: { focus: 'Foco',   breaks: 'Pausas', tasks: 'Tarefas', sessions: 'Sessões',
              today: 'Hoje', week: 'Esta semana', month: 'Este mês', custom: 'Personalizado', all: 'Todo o tempo' },
        vi: { focus: 'Tập trung', breaks: 'Nghỉ', tasks: 'Việc', sessions: 'Phiên',
              today: 'Hôm nay', week: 'Tuần này', month: 'Tháng này', custom: 'Tùy chọn', all: 'Mọi lúc' }
    };
    function fmtDur(sec) {
        sec = Math.round(sec);
        if (sec <= 0) return '0m';
        var h = Math.floor(sec / 3600), m = Math.round(sec % 3600 / 60);
        if (h && m) return h + 'h ' + m + 'm';
        if (h) return h + 'h';
        return m + 'm';
    }
    function startOfToday() { var d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }
    function customRange() {
        try {
            var c = JSON.parse(localStorage.getItem('tt_stats_custom_range') || 'null');
            if (c && c.f && c.t) {
                return { from: new Date(c.f + 'T00:00:00').getTime(),
                         to: new Date(c.t + 'T00:00:00').getTime() + 864e5 };
            }
        } catch (e) {}
        return null;
    }
    function fromFor(seg) {
        var t0 = startOfToday();
        if (seg === 'today') return t0;
        if (seg === 'week') return t0 - 6 * 86400000;
        if (seg === 'month') return t0 - 29 * 86400000;
        if (seg === 'custom') { var c = customRange(); return c ? c.from : t0; }
        return 0; /* all */
    }
    function toFor(seg) {
        if (seg === 'custom') { var c = customRange(); if (c) return c.to; }
        return Infinity;
    }
    var METRICS = {
        focus:    { icon: 'img:duck-headphones',
                    val: function (r) { return fmtDur(r.focusSec); } },
        breaks:   { icon: 'img:duck-strawhat',
                    val: function (r) { return fmtDur(r.breakSec); } },
        tasks:    { icon: 'img:duck-school',
                    val: function (r) { return String(r.tasks); } },
        sessions: { icon: 'img:duck-monocle',
                    val: function (r) { return String(r.focusN + r.breakN); } }
    };
    var MIGRATE = { today: 'focus:today', week: 'focus:week',
                    breaks: 'breaks:today', tasks: 'tasks:today', sessions: 'sessions:today' };
    function valid(id) {
        var p = id.split(':');
        return p.length === 2 && METRICS[p[0]] && /^(today|week|month|custom|all)$/.test(p[1]);
    }
    function readPins() {
        try {
            var o = JSON.parse(localStorage.getItem(KEY) || 'null');
            if (o && Array.isArray(o.pins)) {
                return o.pins.map(function (p) { return MIGRATE[p] || p; })
                             .filter(valid);
            }
        } catch (e) {}
        return [];
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
    function go() { window.location.href = '/stats/'; }
    function render() {
        var wrap = document.getElementById('statsPins');
        if (!wrap || !window.ttStats) return;
        var pins = readPins().slice(0, 5);
        wrap.innerHTML = '';
        if (!pins.length) { wrap.style.display = 'none'; return; }
        wrap.style.display = 'inline';
        var T = L[lang()] || L.en;
        var firstMetric = pins[0].split(':')[0];
        var chip = document.createElement('div');
        chip.className = 'pin-chip';
        chip.setAttribute('role', 'link');
        chip.tabIndex = 0;
        chip.title = 'Stats';
        var ic = document.createElement('span');
        ic.className = 'pc-icon';
        setIcon(ic, METRICS[firstMetric].icon);
        var body = document.createElement('span');
        body.className = 'pc-body';
        var tm = document.createElement('span');
        tm.className = 'pc-time';
        var first = true;
        pins.forEach(function (id) {
            var parts = id.split(':');
            var m = METRICS[parts[0]], seg = parts[1];
            var r = window.ttStats.report(fromFor(seg), toFor(seg));
            var block = document.createElement('span');
            block.className = 'pc-block';
            if (first) { block.classList.add('pc-first'); first = false; }
            var lab = document.createElement('i');
            lab.textContent = T[parts[0]] + ' · ' + T[seg];
            var v = document.createElement('b');
            v.textContent = m.val(r);
            block.appendChild(lab);
            block.appendChild(v);
            tm.appendChild(block);
        });
        body.appendChild(tm);
        chip.appendChild(ic);
        chip.appendChild(body);
        chip.addEventListener('click', go);
        chip.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(); }
        });
        wrap.appendChild(chip);
    }
    window.addEventListener('storage', function (ev) {
        if (ev.key === KEY || ev.key === 'tt_stats_v1' || ev.key === 'tt_stats_custom_range') render();
    });
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { render(); setInterval(render, 30000); });
    } else {
        render();
        setInterval(render, 30000);
    }
})();
