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

    /* Current + longest run of consecutive local days that contain at least
       one focus session. Today counts if it already has focus; otherwise the
       streak lives through yesterday (same convention as the Streak tool). */
    function focusStreaks() {
        var d = data(), set = {};
        for (var i = 0; i < d.s.length; i++) {
            var s = d.s[i];
            if (s.k !== 'focus') continue;
            var k = dayKey(s.s);
            set[k] = true;
        }
        var cur = 0, t = dayStart(Date.now());
        if (!set[dayKey(t)]) t -= 86400000;
        while (set[dayKey(t)]) { cur++; t -= 86400000; }
        var keys = Object.keys(set).sort();
        var longest = 0, run = 0, prev = null;
        for (var j = 0; j < keys.length; j++) {
            var ts = new Date(keys[j] + 'T00:00:00').getTime();
            run = (prev !== null && ts - prev === 86400000) ? run + 1 : 1;
            if (run > longest) longest = run;
            prev = ts;
        }
        return { current: cur, longest: longest };
    }

    /* Focus seconds split by weekday (0=Sun..6=Sat) and by hour of day
       (0-23), for sessions started inside [fromTs, toTs). Open end if toTs
       omitted. Focus sessions only — breaks have no "when". */
    function distribution(fromTs, toTs) {
        var d = data();
        if (toTs == null) toTs = Infinity;
        var byHour = [], byDow = [];
        for (var h = 0; h < 24; h++) byHour.push(0);
        for (var w = 0; w < 7; w++) byDow.push(0);
        for (var i = 0; i < d.s.length; i++) {
            var s = d.s[i];
            if (s.s < fromTs || s.s >= toTs) continue;
            if (s.k !== 'focus') continue;
            var dt = new Date(s.s);
            byHour[dt.getHours()] += s.d;
            byDow[dt.getDay()] += s.d;
        }
        return { byHour: byHour, byDow: byDow };
    }

    /* Validate + merge an exported stats object into the live store.
       Exact duplicates (same timer/kind/start/duration, same task ts) are
       skipped, junk entries are dropped, caps applied afterwards.
       Returns {addedS, addedT} or null if the file shape is invalid. */
    function mergeImport(obj) {
        if (!obj || typeof obj !== 'object') return null;
        if (obj.v !== VER || !Array.isArray(obj.s) || !Array.isArray(obj.t)) return null;
        var cur = ensure();
        var beforeS = cur.s.length, beforeT = cur.t.length;
        var seenS = {}, seenT = {};
        for (var i = 0; i < cur.s.length; i++) {
            var x = cur.s[i];
            seenS[x.tm + '|' + x.k + '|' + x.s + '|' + x.d] = true;
        }
        for (var j = 0; j < cur.t.length; j++) {
            seenT[cur.t[j].tm + '|' + cur.t[j].ts] = true;
        }
        for (var m = 0; m < obj.s.length; m++) {
            var e = obj.s[m];
            if (!e || typeof e !== 'object') continue;
            if (!e.tm || (e.k !== 'focus' && e.k !== 'break')) continue;
            if (!(e.s > 0) || !(e.d >= MIN_SESSION_MS / 1000)) continue;
            var key = String(e.tm) + '|' + e.k + '|' + Math.round(e.s) + '|' + Math.round(e.d);
            if (seenS[key]) continue;
            seenS[key] = true;
            cur.s.push({ tm: String(e.tm), k: e.k, s: Math.round(e.s), d: Math.round(e.d) });
        }
        for (var n = 0; n < obj.t.length; n++) {
            var g = obj.t[n];
            if (!g || typeof g !== 'object' || !g.tm || !(g.ts > 0)) continue;
            var tkey = String(g.tm) + '|' + Math.round(g.ts);
            if (seenT[tkey]) continue;
            seenT[tkey] = true;
            cur.t.push({ tm: String(g.tm), ts: Math.round(g.ts) });
        }
        if (cur.s.length > MAX_SESSIONS) cur.s = cur.s.slice(-MAX_SESSIONS);
        if (cur.t.length > MAX_TASKS) cur.t = cur.t.slice(-MAX_TASKS);
        write(cur);
        return { addedS: cur.s.length - beforeS, addedT: cur.t.length - beforeT };
    }

    window.ttStats = {
        KEY: KEY, VER: VER,
        recordSession: recordSession, recordTask: recordTask,
        clear: clear, data: data,
        dayStart: dayStart, dayKey: dayKey,
        report: report, dailySeries: dailySeries,
        focusStreaks: focusStreaks, distribution: distribution,
        mergeImport: mergeImport
    };
})();
