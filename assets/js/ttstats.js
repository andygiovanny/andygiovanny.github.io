/* TomatoTimers Stats v1 — shared session recorder + aggregation.
   Every timer page includes this file and calls:
     ttStats.recordSession(timerId, 'focus'|'break', startTsMs, durMs)
     ttStats.recordTask(timerId, tsMs)
   The stats page (and future pin chips) read via ttStats.data() plus the
   pure helpers ttStats.report(fromTs, toTs) and ttStats.dailySeries(days).
   Storage: localStorage 'tt_stats_v1' = { v:1, s:[{tm,k,s,d}], t:[{tm,ts}] }.
   Timer ids: 'pomodoro', '52-17', '202020', 'flowtime', 'custom'. */
(function () {
    'use strict';
    var KEY = 'tt_stats_v1', VER = 1;
    var MAX_SESSIONS = 8000, MAX_TASKS = 4000, MIN_SESSION_MS = 10000;

    function empty() { return { v: VER, s: [], t: [] }; }

    function load() {
        try {
            var raw = localStorage.getItem(KEY);
            if (!raw) return null;
            var d = JSON.parse(raw);
            if (!d || d.v !== VER || !Array.isArray(d.s) || !Array.isArray(d.t)) return null;
            return d;
        } catch (e) { return null; }
    }

    function ensure() { return load() || empty(); }

    function write(d) {
        try { localStorage.setItem(KEY, JSON.stringify(d)); }
        catch (e) {
            // quota: drop the oldest half and retry once
            try {
                d.s = d.s.slice(Math.ceil(d.s.length / 2));
                d.t = d.t.slice(Math.ceil(d.t.length / 2));
                localStorage.setItem(KEY, JSON.stringify(d));
            } catch (e2) { /* give up quietly — stats must never break a timer */ }
        }
    }

    function recordSession(timerId, kind, startTs, durMs) {
        if (!timerId || (kind !== 'focus' && kind !== 'break')) return;
        if (!(startTs > 0) || !(durMs >= MIN_SESSION_MS)) return;
        var d = ensure();
        d.s.push({ tm: timerId, k: kind, s: Math.round(startTs), d: Math.round(durMs / 1000) });
        if (d.s.length > MAX_SESSIONS) d.s = d.s.slice(-MAX_SESSIONS);
        write(d);
    }

    function recordTask(timerId, ts) {
        if (!timerId) return;
        var d = ensure();
        d.t.push({ tm: timerId, ts: Math.round(ts || Date.now()) });
        if (d.t.length > MAX_TASKS) d.t = d.t.slice(-MAX_TASKS);
        write(d);
    }

    function clear() { write(empty()); }

    function data() { return load() || empty(); }

    /* ── pure helpers (also used by pin chips and the unit tests) ── */

    function dayStart(ts) { var d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }

    function dayKey(ts) {
        var d = new Date(ts);
        var m = String(d.getMonth() + 1), dd = String(d.getDate());
        return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m) + '-' + (dd.length < 2 ? '0' + dd : dd);
    }

    function blankPer() { return { focusSec: 0, breakSec: 0, focusN: 0, breakN: 0, tasks: 0 }; }
    function blankReport() { return { focusSec: 0, breakSec: 0, focusN: 0, breakN: 0, tasks: 0, perTimer: {} }; }

    function addTo(rep, timer, b) {
        var p = rep.perTimer[timer] || (rep.perTimer[timer] = blankPer());
        p.focusSec += b.focusSec; p.breakSec += b.breakSec;
        p.focusN += b.focusN; p.breakN += b.breakN; p.tasks += b.tasks;
        rep.focusSec += b.focusSec; rep.breakSec += b.breakSec;
        rep.focusN += b.focusN; rep.breakN += b.breakN; rep.tasks += b.tasks;
    }

    /* Sum everything in [fromTs, toTs). Omit toTs for an open end. */
    function report(fromTs, toTs) {
        var d = data(), rep = blankReport();
        if (toTs == null) toTs = Infinity;
        for (var i = 0; i < d.s.length; i++) {
            var s = d.s[i];
            if (s.s < fromTs || s.s >= toTs) continue;
            var b = blankPer();
            if (s.k === 'focus') { b.focusSec = s.d; b.focusN = 1; }
            else { b.breakSec = s.d; b.breakN = 1; }
            addTo(rep, s.tm, b);
        }
        for (var j = 0; j < d.t.length; j++) {
            var t = d.t[j];
            if (t.ts < fromTs || t.ts >= toTs) continue;
            addTo(rep, t.tm, { focusSec: 0, breakSec: 0, focusN: 0, breakN: 0, tasks: 1 });
        }
        return rep;
    }

    /* Focus/break seconds for each of the last `days` local days (oldest → today). */
    function dailySeries(days, endTs) {
        var d = data();
        var today = dayStart(endTs || Date.now());
        var out = [];
        for (var i = days - 1; i >= 0; i--) {
            var start = today - i * 86400000;
            out.push({ day: dayKey(start), start: start, focusSec: 0, breakSec: 0 });
        }
        var idx = {};
        for (var k = 0; k < out.length; k++) idx[out[k].day] = out[k];
        for (var m = 0; m < d.s.length; m++) {
            var s = d.s[m];
            var cell = idx[dayKey(s.s)];
            if (!cell) continue;
            if (s.k === 'focus') cell.focusSec += s.d; else cell.breakSec += s.d;
        }
        return out;
    }

    window.ttStats = {
        KEY: KEY, VER: VER,
        recordSession: recordSession, recordTask: recordTask,
        clear: clear, data: data,
        dayStart: dayStart, dayKey: dayKey,
        report: report, dailySeries: dailySeries
    };
})();
