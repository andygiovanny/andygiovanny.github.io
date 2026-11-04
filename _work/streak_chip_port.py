# Port the streak pin chip to all timer pages that already have the days-until chip.
# EN sub-pages (52-17, 20-20-20-rule, flowtime, custom-timer) + all 20 translated
# timer pages. EN index.html already has the chip (added by hand) — skipped here.
import io, os, sys

BASE = r"C:\Users\andyg\Documents\GitHub\andygiovanny.github.io"

L10N = {
  "en": {"title": "Pinned streak — open Streak Counter", "link": "/streaks/",
         "seed": "Pomodoro Streak", "num": "n + '-day'", "post": " streak"},
  "id": {"title": "Streak tersemat — buka Streak Counter", "link": "/id/streaks/",
         "seed": "Streak Pomodoro", "num": "'Streak ' + n", "post": " hari"},
  "es": {"title": "Racha fijada — abrir Streak Counter", "link": "/es/streaks/",
         "seed": "Racha Pomodoro", "num": "'Racha de ' + n", "post": " días"},
  "pt": {"title": "Sequência fixada — abrir Streak Counter", "link": "/pt/streaks/",
         "seed": "Sequência Pomodoro", "num": "'Sequência de ' + n", "post": " dias"},
  "vi": {"title": "Chuỗi đã ghim — mở Streak Counter", "link": "/vi/streaks/",
         "seed": "Chuỗi Pomodoro", "num": "'Chuỗi ' + n", "post": " ngày"},
}

MARKUP = """
            <!-- Pinned streak chip (streaks) — populated by the script below;
                 stays display:none when nothing is pinned -->
            <div class="pin-chip" id="streakChip" style="display:none" role="link" tabindex="0"
                 title="__TITLE__">
                <span class="pc-icon" id="scIcon"></span>
                <span class="pc-body">
                    <span class="pc-name" id="scName"></span>
                    <span class="pc-time" id="scTime"></span>
                </span>
            </div>
<script>
(function () {
    var KEY = 'tt_streaks_v1';
    var chip = document.getElementById('streakChip');
    if (!chip) return;
    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function toKey(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
    /* First visit ever: seed a pinned Pomodoro streak (starts today, today
       pre-checked) so new users discover streaks + this pin chip. Deleting or
       unpinning it is permanent — it never comes back. */
    if (localStorage.getItem(KEY) == null) {
      try {
        var sd = toKey(new Date());
        var sck = {}; sck[sd] = true;
        localStorage.setItem(KEY, JSON.stringify({ streaks: [{ id: 'seed_pomodoro',
          name: '__SEED__', mode: 'checkin', color: '#DE4B3A', icon: 'img:duck-tomato',
          start: sd, checkins: sck, pinned: true, created: Date.now() }] }));
      } catch (e) {}
    }
    function parseKey(k) {
        var m = /^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(String(k));
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
        timeEl.appendChild(document.createTextNode('🔥 '));
        var dEl = document.createElement('span');
        dEl.className = 'pc-days';
        dEl.textContent = __NUM__;
        timeEl.appendChild(dEl);
        timeEl.appendChild(document.createTextNode('__POST__'));
        if (s.color) chip.style.borderLeftColor = s.color;
        chip.style.display = 'flex';
    }
    chip.addEventListener('click', function () { window.location.href = '__LINK__'; });
    chip.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            window.location.href = '__LINK__';
        }
    });
    window.addEventListener('storage', function (ev) { if (ev.key === KEY) show(); });
    show();
})();
</script>"""

def chip_block(lang):
    t = L10N[lang]
    return (MARKUP.replace("__TITLE__", t["title"]).replace("__SEED__", t["seed"])
                  .replace("__NUM__", t["num"]).replace("__POST__", t["post"])
                  .replace("__LINK__", t["link"]))

targets = []
targets.append(("en", r"\52-17\index.html"))
targets.append(("en", r"\20-20-20-rule\index.html"))
targets.append(("en", r"\flowtime\index.html"))
targets.append(("en", r"\custom-timer\index.html"))
for lang in ["id", "es", "pt", "vi"]:
    for page in [r"\index.html", r"\52-17\index.html", r"\20-20-20-rule\index.html",
                 r"\flowtime\index.html", r"\custom-timer\index.html"]:
        targets.append((lang, "\\" + lang + page))

for lang, rel in targets:
    p = BASE + rel
    h = io.open(p, encoding="utf-8").read()
    if 'id="streakChip"' in h:
        print("SKIP (already has chip):", rel)
        continue
    # 1. CSS spacing rule after the first .pin-chip:hover rule
    hi = h.find(".pin-chip:hover")
    assert hi >= 0, "no .pin-chip:hover in " + rel
    close = h.find("}", hi)
    assert close >= 0
    h = h[:close + 1] + "\n    #streakChip { margin-top: 8px; }" + h[close + 1:]
    # 2. insert markup+script right after the countdown chip's script block
    j = h.find("tt_countdowns_v1")
    assert j >= 0, "no countdown chip script in " + rel
    s_end = h.find("</script>", j)
    assert s_end >= 0
    h = h[:s_end + len("</script>")] + chip_block(lang) + h[s_end + len("</script>"):]
    io.open(p, "w", encoding="utf-8", newline="\n").write(h)
    print("OK:", rel)

print("DONE")
