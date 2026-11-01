# Insert the pinned-countdown chip (days-until) into the 20 translated timer pages.
# Extracts the exact CSS/HTML/JS blocks from the English masters, translates the
# user-visible strings, points the link at /<lang>/days-until/, and inserts at
# page-type-specific anchors. Aborts on ANY mismatch — no partial writes.
import io, os, re, sys, shutil

ROOT = r"C:\Users\andyg\Documents\GitHub\andygiovanny.github.io"
BAK = os.path.join(ROOT, "_backups", "2026-10-31-pin-translations")
LANGS = ["id", "es", "pt", "vi"]
MAIN = "index.html"
OTHERS = ["52-17/index.html", "20-20-20-rule/index.html", "flowtime/index.html", "custom-timer/index.html"]

def read(p):
    with io.open(p, encoding="utf-8") as f: return f.read()

def extract(text, start_marker, end_marker, label):
    i = text.find(start_marker)
    assert i >= 0, "start not found: " + label
    j = text.find(end_marker, i)
    assert j >= 0, "end not found: " + label
    return text[i:j + len(end_marker)]

# ---- extract EN blocks -------------------------------------------------
en_main = read(os.path.join(ROOT, "index.html"))
en_5217 = read(os.path.join(ROOT, "52-17", "index.html"))

main_css = extract(en_main,
    "    /* Pinned countdown chip (days-until)",
    "body.theme-classic .pin-chip .pc-time .pc-days { color: #c65e5e; }",
    "main css")
# The wrapper div contains <script>...</script> then </div>. Anchor on the chip
# comment, walk back to its wrapper div, forward past </script> to the close.
c = en_main.find("<!-- Pinned countdown chip")
assert c >= 0, "main chip comment not found"
i = en_main.rfind('<div class="col-lg-12" style="text-align:left">', 0, c)
assert i >= 0, "main wrapper div not found"
j = en_main.find("</script>", c)
j = en_main.find("</div>", j)
main_html = en_main[i:j + len("</div>")]

other_css = extract(en_5217,
    "  /* ── pinned countdown chip (days-until)",
    "html.theme-dark .pin-chip { box-shadow: 0 3px 10px rgba(0,0,0,.3); }",
    "other css")
other_html = extract(en_5217,
    "  <!-- Pinned countdown chip (days-until)",
    "  </script>", "other html")

assert main_css.count("pin-chip") >= 10 and other_css.count("pin-chip") >= 8
assert main_html.count("pinChip") >= 2 and other_html.count("pinChip") >= 2

# ---- translations --------------------------------------------------------
T = {
 "id": dict(title="Hitung mundur tersemat — buka Days Until", dflt="Hitung Mundur",
            today="🎉 Hari Ini", ended="Berakhir", day=" hari", days=" hari"),
 "es": dict(title="Cuenta regresiva fijada — abrir Days Until", dflt="Cuenta Regresiva",
            today="🎉 Hoy", ended="Terminó", day=" día", days=" días"),
 "pt": dict(title="Contagem regressiva fixada — abrir Days Until", dflt="Contagem Regressiva",
            today="🎉 Hoje", ended="Terminou", day=" dia", days=" dias"),
 "vi": dict(title="Đếm ngược đã ghim — mở Days Until", dflt="Đếm Ngược",
            today="🎉 Hôm Nay", ended="Đã kết thúc", day=" ngày", days=" ngày"),
}

def localize(block, lang):
    t = T[lang]; n0 = block
    def rep(old, new, cnt):
        nonlocal block
        c = block.count(old)
        assert c == cnt, "expected %d of %r, found %d (lang=%s)" % (cnt, old, c, lang)
        block = block.replace(old, new)
    rep("Pinned countdown — open Days Until", t["title"], 1)
    rep("String(c.name || 'Countdown')", "String(c.name || '%s')" % t["dflt"], 1)
    rep("'🎉 Today · '", "'%s · '" % t["today"], 1)
    rep("'🎉 Today'", "'%s'" % t["today"], 1)
    rep("'Ended'", "'%s'" % t["ended"], 1)
    rep("? ' day' : ' days'", "? '%s' : '%s'" % (t["day"].strip(), t["days"].strip()), 1)
    rep("'/days-until/'", "'/%s/days-until/'" % lang, 2)
    return block

# ---- inserters -----------------------------------------------------------
def insert_main(path, lang):
    txt = read(path)
    assert "pin-chip" not in txt, "already has pin chip: " + path
    # CSS: before the FIRST </style>
    k = txt.find("</style>")
    assert k >= 0, "no </style> in " + path
    txt = txt[:k] + "\n" + main_css + "\n" + txt[k:]
    # HTML: after the </div> that closes the mode-tabs div (line with loop button, then next </div>)
    k = txt.find('id="loop_timer_button"')
    assert k >= 0, "no loop button in " + path
    k = txt.find("</div>", k)
    assert k >= 0, "no closing div after loop button in " + path
    k += len("</div>")
    txt = txt[:k] + "\n\n" + localize(main_html, lang) + txt[k:]
    return txt

def insert_other(path, lang, is_custom):
    txt = read(path)
    assert "pin-chip" not in txt, "already has pin chip: " + path
    # CSS: after the page's .stage rule
    anchor = "  .stage { max-width: 780px; margin: 0 auto; padding: 12px 20px 24px; text-align: center; }" if is_custom \
             else "  .stage { position: relative; }"
    k = txt.find(anchor)
    assert k >= 0, "no .stage anchor in " + path
    k += len(anchor)
    txt = txt[:k] + "\n\n" + other_css + txt[k:]
    # HTML: after the </div> closing .header-left (theme-select's </select>, then its </div>)
    k = txt.find('id="theme-select"')
    assert k >= 0, "no theme-select in " + path
    k = txt.find("</select>", k)
    assert k >= 0, "no </select> after theme-select in " + path
    after = txt[k:k + 40]
    if "</div>" in after:                      # </select></div> on one line
        k += after.find("</div>") + len("</div>")
    else:                                      # </div> on a following line
        k = txt.find("</div>", k) + len("</div>")
    txt = txt[:k] + "\n" + localize(other_html, lang) + txt[k:]
    return txt

# ---- run -----------------------------------------------------------------
targets = []
for lang in LANGS:
    targets.append((os.path.join(ROOT, lang, "index.html"), lang, "main"))
    for rel in OTHERS:
        targets.append((os.path.join(ROOT, lang, rel.replace("/", os.sep)), lang,
                        "custom" if rel.startswith("custom-timer") else "other"))

results = []
for path, lang, kind in targets:
    assert os.path.exists(path), "missing: " + path
    new = insert_main(path, lang) if kind == "main" else insert_other(path, lang, kind == "custom")
    # sanity on the result
    assert new.count("pin-chip") >= 8, "pin css missing in result: " + path
    assert new.count("'/%s/days-until/'" % lang) == 2, "bad link count: " + path
    assert "Pinned countdown — open Days Until" not in new, "untranslated title: " + path
    results.append((path, new))

# all-or-nothing: back up, then write
for path, _ in results:
    rel = os.path.relpath(path, ROOT)
    dst = os.path.join(BAK, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(path, dst)
for path, new in results:
    with io.open(path, "w", encoding="utf-8", newline="") as f: f.write(new)
    print("OK", os.path.relpath(path, ROOT))
print("DONE — %d files updated, backups in %s" % (len(results), BAK))
