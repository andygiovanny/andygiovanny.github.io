# 1) Remove the empty-state mascot image from the 5 days-until pages (text only).
# 2) Seed a first-time "Click me" countdown (pinned, +30 days, duck-astronaut icon)
#    into all 25 timer pages' pin-chip IIFE + the 5 days-until pages' store init.
#    Seeds ONLY when localStorage has no 'tt_countdowns_v1' key at all (true first visit).
# Aborts on ANY mismatch — no partial writes. Backups first.
import io, os, shutil

ROOT = r"C:\Users\andyg\Documents\GitHub\andygiovanny.github.io"
BAK = os.path.join(ROOT, "_backups", "2026-11-01-seed-welcome")

NAMES = {
    "en": "👋 Click me!",
    "id": "👋 Klik aku!",
    "es": "👋 ¡Haz clic!",
    "pt": "👋 Clique aqui!",
    "vi": "👋 Nhấn vào tôi!",
}
ICON = "img:duck-astronaut"
COLOR = "#DE4B3A"

def read(p):
    with io.open(p, encoding="utf-8") as f: return f.read()

def rep1(txt, old, new, path):
    n = txt.count(old)
    assert n == 1, "expected 1 of %r in %s, found %d" % (old[:60], path, n)
    return txt.replace(old, new)

# ── days-until pages ──────────────────────────────────────────────────────
DU_COMMENT = "    <!-- MASCOT PLACEHOLDER: permanent art TBD — reusing tomato-cartoon.svg for now -->\n"
DU_CSS = "  .empty img { width: 150px; height: auto; opacity: .95; }\n"
STORE_ANCHOR = "var store = LS.get(STORE_KEY, null);\n"

def seed_store(lang):
    return (
        "var store = LS.get(STORE_KEY, null);\n"
        "/* First visit ever (no store key at all): seed a pinned welcome countdown\n"
        "   so new users discover the board + the pin-to-timer feature. Deleting or\n"
        "   unpinning it is permanent — it never comes back. */\n"
        "if (store == null && localStorage.getItem(STORE_KEY) == null) {\n"
        "  var _st = new Date(Date.now() + 30 * 86400000);\n"
        "  store = { countdowns: [{ id: uid(), name: '" + NAMES[lang] + "',\n"
        "    target: _st.getFullYear() + '-' + pad2(_st.getMonth() + 1) + '-' + pad2(_st.getDate()) +\n"
        "            'T' + pad2(_st.getHours()) + ':' + pad2(_st.getMinutes()),\n"
        "    color: COLORS[0], icon: '" + ICON + "', pinned: true, created: Date.now() }] };\n"
        "  LS.set(STORE_KEY, store);\n"
        "}\n"
    )

def patch_days_until(path, lang):
    txt = read(path)
    # 1) drop the empty-state mascot image (comment + img line, NOT the Timers card img)
    lines = txt.split("\n")
    out = []
    removed_img = removed_comment = False
    for i, ln in enumerate(lines):
        if not removed_comment and ln.rstrip("\n") == DU_COMMENT.rstrip("\n"):
            removed_comment = True
            continue
        if not removed_img and 'src="/assets/images/tomato-cartoon.svg"' in ln and "loading=" not in ln:
            removed_img = True
            continue
        out.append(ln)
    assert removed_comment and removed_img, "empty-state img not found in " + path
    txt = "\n".join(out)
    txt = rep1(txt, DU_CSS.rstrip("\n") + "\n", "", path) if DU_CSS.rstrip("\n") in txt else txt
    assert ".empty img" not in txt, "empty img css still present in " + path
    # 2) seed on true first visit
    txt = rep1(txt, STORE_ANCHOR, seed_store(lang), path)
    return txt

# ── timer pages (pin-chip IIFE) ───────────────────────────────────────────
CHIP_ANCHOR = "var pinned = null, timer = null;\n"

def seed_chip(lang):
    pad = "    "
    return (
        CHIP_ANCHOR +
        pad + "/* First visit ever: seed a pinned welcome countdown (+30 days) so new\n" +
        pad + "   users discover the pin feature. Once removed it never comes back. */\n" +
        pad + "if (localStorage.getItem(KEY) == null) {\n" +
        pad + "  try {\n" +
        pad + "    var st = new Date(Date.now() + 30 * 86400000);\n" +
        pad + "    localStorage.setItem(KEY, JSON.stringify({ countdowns: [{ id: 'seed_welcome',\n" +
        pad + "      name: '" + NAMES[lang] + "',\n" +
        pad + "      target: st.getFullYear() + '-' + pad(st.getMonth() + 1) + '-' + pad(st.getDate()) +\n" +
        pad + "              'T' + pad(st.getHours()) + ':' + pad(st.getMinutes()),\n" +
        pad + "      color: '" + COLOR + "', icon: '" + ICON + "', pinned: true, created: Date.now() }] }));\n" +
        pad + "  } catch (e) {}\n" +
        pad + "}\n"
    )

def patch_timer(path, lang):
    txt = read(path)
    assert "pin-chip" in txt, "no pin chip in " + path
    assert "seed_welcome" not in txt, "already seeded: " + path
    return rep1(txt, CHIP_ANCHOR, seed_chip(lang), path)

# ── run ───────────────────────────────────────────────────────────────────
jobs = []
jobs.append((os.path.join(ROOT, "days-until", "index.html"), "en", "du"))
for lang in ["id", "es", "pt", "vi"]:
    jobs.append((os.path.join(ROOT, lang, "days-until", "index.html"), lang, "du"))

TIMER_PAGES = ["index.html", "52-17/index.html", "20-20-20-rule/index.html",
               "flowtime/index.html", "custom-timer/index.html"]
for rel in TIMER_PAGES:
    jobs.append((os.path.join(ROOT, rel.replace("/", os.sep)), "en", "chip"))
for lang in ["id", "es", "pt", "vi"]:
    for rel in TIMER_PAGES:
        jobs.append((os.path.join(ROOT, lang, rel.replace("/", os.sep)), lang, "chip"))

results = []
for path, lang, kind in jobs:
    assert os.path.exists(path), "missing: " + path
    new = patch_days_until(path, lang) if kind == "du" else patch_timer(path, lang)
    assert "seed_welcome" in new or "uid(), name:" in new, "seed missing in result: " + path
    results.append((path, new))

for path, _ in results:
    dst = os.path.join(BAK, os.path.relpath(path, ROOT))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(path, dst)
for path, new in results:
    with io.open(path, "w", encoding="utf-8", newline="") as f: f.write(new)
    print("OK", os.path.relpath(path, ROOT))
print("DONE — %d files updated, backups in %s" % (len(results), BAK))
