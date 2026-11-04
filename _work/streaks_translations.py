# Build id/es/pt/vi streaks pages from the EN master (streaks/index.html).
# Exact-match literal replacement, count-asserted; aborts on any miss.
import io, re, sys

BASE = r"C:\Users\andyg\Documents\GitHub\andygiovanny.github.io"
SRC = BASE + r"\streaks\index.html"
LANGS = ["id", "es", "pt", "vi"]

R = []  # (en, {lang: translated}, expected_count)
def r(en, id_, es, pt, vi, count=1):
    R.append((en, {"id": id_, "es": es, "pt": pt, "vi": vi}, count))

# ── head / meta ──
r('<html lang="en">', '<html lang="id">', '<html lang="es">', '<html lang="pt">', '<html lang="vi">')
r('<title>Streak Counter — Daily Check-ins &amp; Days Since Anything | TomatoTimers</title>',
  '<title>Streak Counter — Check-in Harian &amp; Hitung Hari Sejak Apa Pun | TomatoTimers</title>',
  '<title>Streak Counter — Check-ins Diarios y Días Desde Cualquier Cosa | TomatoTimers</title>',
  '<title>Streak Counter — Check-ins Diários e Dias Desde Qualquer Coisa | TomatoTimers</title>',
  '<title>Streak Counter — Check-in Hàng Ngày &amp; Đếm Ngày Từ Bất Cứ Điều Gì | TomatoTimers</title>')
r('<meta name="description" content="Free streak counter with a big calendar view: build daily check-in streaks or count days since anything. Colors, icons, JSON export, no sign-up — data stays in your browser.">',
  '<meta name="description" content="Penghitung streak gratis dengan tampilan kalender besar: bangun streak check-in harian atau hitung hari sejak apa pun. Warna, ikon, ekspor JSON, tanpa daftar — data tersimpan di browsermu.">',
  '<meta name="description" content="Contador de rachas gratis con una gran vista de calendario: crea rachas de check-in diarias o cuenta días desde cualquier cosa. Colores, iconos, exportación JSON, sin registro — los datos se quedan en tu navegador.">',
  '<meta name="description" content="Contador de sequências grátis com uma grande visualização de calendário: crie sequências de check-in diárias ou conte dias desde qualquer coisa. Cores, ícones, exportação JSON, sem cadastro — os dados ficam no seu navegador.">',
  '<meta name="description" content="Bộ đếm chuỗi miễn phí với chế độ xem lịch lớn: xây chuỗi check-in hàng ngày hoặc đếm số ngày từ bất cứ điều gì. Màu sắc, biểu tượng, xuất JSON, không cần đăng ký — dữ liệu ở lại trong trình duyệt của bạn.">')
r('<meta name="keywords" content="streak counter, habit streak tracker, days in a row counter, don\'t break the chain, days since counter, sobriety day counter, streak calendar">',
  '<meta name="keywords" content="penghitung streak, pelacak streak kebiasaan, hitung hari berturut-turut, jangan putus rantai, penghitung hari sejak, kalender streak">',
  '<meta name="keywords" content="contador de rachas, seguimiento de hábitos, días seguidos, no rompas la cadena, contador de días desde, calendario de rachas">',
  '<meta name="keywords" content="contador de sequências, rastreador de hábitos, dias seguidos, não quebre a corrente, contador de dias desde, calendário de sequências">',
  '<meta name="keywords" content="bộ đếm chuỗi, theo dõi thói quen, số ngày liên tiếp, đừng phá chuỗi, đếm ngày từ khi, lịch chuỗi ngày">')
r('<link rel="canonical" href="https://www.tomatotimers.com/streaks/">',
  '<link rel="canonical" href="https://www.tomatotimers.com/id/streaks/">',
  '<link rel="canonical" href="https://www.tomatotimers.com/es/streaks/">',
  '<link rel="canonical" href="https://www.tomatotimers.com/pt/streaks/">',
  '<link rel="canonical" href="https://www.tomatotimers.com/vi/streaks/">')
r('<meta property="og:title" content="Streak Counter — Daily Check-ins &amp; Days Since Anything | TomatoTimers">',
  '<meta property="og:title" content="Streak Counter — Check-in Harian &amp; Hitung Hari Sejak Apa Pun | TomatoTimers">',
  '<meta property="og:title" content="Streak Counter — Check-ins Diarios y Días Desde Cualquier Cosa | TomatoTimers">',
  '<meta property="og:title" content="Streak Counter — Check-ins Diários e Dias Desde Qualquer Coisa | TomatoTimers">',
  '<meta property="og:title" content="Streak Counter — Check-in Hàng Ngày &amp; Đếm Ngày Từ Bất Cứ Điều Gì | TomatoTimers">')
r('<meta property="og:description" content="Free streak counter with a big calendar view: build daily check-in streaks or count days since anything. No sign-up — data stays in your browser.">',
  '<meta property="og:description" content="Penghitung streak gratis dengan tampilan kalender besar: bangun streak check-in harian atau hitung hari sejak apa pun. Tanpa daftar — data tersimpan di browsermu.">',
  '<meta property="og:description" content="Contador de rachas gratis con una gran vista de calendario: crea rachas de check-in diarias o cuenta días desde cualquier cosa. Sin registro — los datos se quedan en tu navegador.">',
  '<meta property="og:description" content="Contador de sequências grátis com visualização de calendário grande: crie sequências de check-in diárias ou conte dias desde qualquer coisa. Sem cadastro — os dados ficam no seu navegador.">',
  '<meta property="og:description" content="Bộ đếm chuỗi miễn phí với chế độ xem lịch lớn: xây chuỗi check-in hàng ngày hoặc đếm số ngày từ bất cứ điều gì. Không cần đăng ký — dữ liệu ở lại trong trình duyệt của bạn.">')
r('<meta property="og:url" content="https://www.tomatotimers.com/streaks/">',
  '<meta property="og:url" content="https://www.tomatotimers.com/id/streaks/">',
  '<meta property="og:url" content="https://www.tomatotimers.com/es/streaks/">',
  '<meta property="og:url" content="https://www.tomatotimers.com/pt/streaks/">',
  '<meta property="og:url" content="https://www.tomatotimers.com/vi/streaks/">')
r('<meta property="og:locale" content="en_US">',
  '<meta property="og:locale" content="id_ID">',
  '<meta property="og:locale" content="es_ES">',
  '<meta property="og:locale" content="pt_BR">',
  '<meta property="og:locale" content="vi_VN">')
r('<meta name="twitter:title" content="Streak Counter — Daily Check-ins &amp; Days Since Anything">',
  '<meta name="twitter:title" content="Streak Counter — Check-in Harian &amp; Hitung Hari Sejak Apa Pun">',
  '<meta name="twitter:title" content="Streak Counter — Check-ins Diarios y Días Desde Cualquier Cosa">',
  '<meta name="twitter:title" content="Streak Counter — Check-ins Diários e Dias Desde Qualquer Coisa">',
  '<meta name="twitter:title" content="Streak Counter — Check-in Hàng Ngày &amp; Đếm Ngày Từ Bất Cứ Điều Gì">')
r('<meta name="twitter:description" content="Free streak counter with a big calendar view: build daily check-in streaks or count days since anything. No sign-up — data stays in your browser.">',
  '<meta name="twitter:description" content="Penghitung streak gratis dengan tampilan kalender besar: bangun streak check-in harian atau hitung hari sejak apa pun. Tanpa daftar — data tersimpan di browsermu.">',
  '<meta name="twitter:description" content="Contador de rachas gratis con una gran vista de calendario: crea rachas de check-in diarias o cuenta días desde cualquier cosa. Sin registro — los datos se quedan en tu navegador.">',
  '<meta name="twitter:description" content="Contador de sequências grátis com visualização de calendário grande: crie sequências de check-in diárias ou conte dias desde qualquer coisa. Sem cadastro — os dados ficam no seu navegador.">',
  '<meta name="twitter:description" content="Bộ đếm chuỗi miễn phí với chế độ xem lịch lớn: xây chuỗi check-in hàng ngày hoặc đếm số ngày từ bất cứ điều gì. Không cần đăng ký — dữ liệu ở lại trong trình duyệt của bạn.">')

# ── JSON-LD ──
r('"name": "Streak Counter — Daily Streaks & Days-Since Tracker | TomatoTimers",',
  '"name": "Streak Counter — Streak Harian & Pelacak Hari-Sejak | TomatoTimers",',
  '"name": "Streak Counter — Rachas Diarias y Contador de Días | TomatoTimers",',
  '"name": "Streak Counter — Sequências Diárias e Contador de Dias | TomatoTimers",',
  '"name": "Streak Counter — Chuỗi Ngày & Bộ Đếm Ngày | TomatoTimers",')
r('"description": "Free online streak counter: build daily check-in streaks or count up the days since anything, watch every streak draw its own colored line across a big calendar, pin one to your timer pages and export your data anytime. Stored in the browser only."',
  '"description": "Penghitung streak online gratis: bangun streak check-in harian atau hitung maju hari sejak apa pun, lihat setiap streak menggambar garis berwarna di kalender besar, pin salah satu ke halaman timermu, dan ekspor datamu kapan saja. Tersimpan hanya di browser."',
  '"description": "Contador de rachas online gratis: crea rachas de check-in diarias o cuenta los días desde cualquier cosa, mira cómo cada racha dibuja su propia línea de color en un gran calendario, fija una en tus páginas de temporizador y exporta tus datos cuando quieras. Guardado solo en el navegador."',
  '"description": "Contador de sequências online grátis: crie sequências de check-in diárias ou conte os dias desde qualquer coisa, veja cada sequência desenhar sua própria linha colorida em um grande calendário, fixe uma nas suas páginas de timer e exporte seus dados quando quiser. Salvo apenas no navegador."',
  '"description": "Bộ đếm chuỗi online miễn phí: xây chuỗi check-in hàng ngày hoặc đếm số ngày từ bất cứ điều gì, xem mỗi chuỗi vẽ đường màu riêng trên lịch lớn, ghim một chuỗi lên các trang hẹn giờ và xuất dữ liệu bất cứ lúc nào. Chỉ lưu trong trình duyệt."')
r('"position": 1,\n      "name": "Pomodoro Timer",',
  '"position": 1,\n      "name": "Timer Pomodoro",',
  '"position": 1,\n      "name": "Temporizador Pomodoro",',
  '"position": 1,\n      "name": "Timer Pomodoro",',
  '"position": 1,\n      "name": "Hẹn Giờ Pomodoro",')
r('"item": "https://www.tomatotimers.com/streaks/"',
  '"item": "https://www.tomatotimers.com/id/streaks/"',
  '"item": "https://www.tomatotimers.com/es/streaks/"',
  '"item": "https://www.tomatotimers.com/pt/streaks/"',
  '"item": "https://www.tomatotimers.com/vi/streaks/"')
r('"url": "https://www.tomatotimers.com/streaks/",',
  '"url": "https://www.tomatotimers.com/id/streaks/",',
  '"url": "https://www.tomatotimers.com/es/streaks/",',
  '"url": "https://www.tomatotimers.com/pt/streaks/",',
  '"url": "https://www.tomatotimers.com/vi/streaks/",')

# FAQ JSON-LD (5 Q&A) — names and answers; visible versions handled separately below
r('"name": "How does the streak counter work?",',
  '"name": "Bagaimana cara kerja penghitung streak?",',
  '"name": "¿Cómo funciona el contador de rachas?",',
  '"name": "Como funciona o contador de sequências?",',
  '"name": "Bộ đếm chuỗi hoạt động thế nào?",')
r('"text": "Two ways. A check-in streak asks you to tap once a day — every check-in extends your chain, and the calendar draws it as a colored line. A count-up streak just needs a start date and then ticks up forever, perfect for \\"days since I quit\\" trackers. Both live on one big calendar, each with its own color and icon."',
  '"text": "Dua cara. Streak check-in memintamu mengetuk sekali sehari — setiap check-in memperpanjang rantaimu, dan kalender menggambarnya sebagai garis berwarna. Streak count-up hanya butuh tanggal mulai lalu terus bertambah selamanya, cocok untuk pelacak \'hari sejak berhenti\'. Keduanya tampil di satu kalender besar, masing-masing dengan warna dan ikon sendiri."',
  '"text": "De dos maneras. Una racha de check-in te pide tocar una vez al día — cada check-in extiende tu cadena, y el calendario la dibuja como una línea de color. Una racha de cuenta ascendente solo necesita una fecha de inicio y luego sube para siempre, perfecta para contadores de \'días desde que lo dejé\'. Ambas viven en un mismo calendario grande, cada una con su propio color e icono."',
  '"text": "De duas formas. Uma sequência de check-in pede um toque por dia — cada check-in estende sua corrente, e o calendário a desenha como uma linha colorida. Uma sequência de contagem progressiva só precisa de uma data de início e depois sobe para sempre, perfeita para contadores de \'dias desde que parei\'. As duas vivem no mesmo calendário grande, cada uma com sua própria cor e ícone."',
  '"text": "Hai cách. Chuỗi check-in yêu cầu bạn chạm một lần mỗi ngày — mỗi lần check-in nối dài chuỗi của bạn, và lịch vẽ nó thành một đường màu. Chuỗi đếm lên chỉ cần ngày bắt đầu rồi tự tăng mãi mãi, hoàn hảo cho kiểu theo dõi \'số ngày kể từ khi bỏ\'. Cả hai cùng nằm trên một lịch lớn, mỗi chuỗi có màu và biểu tượng riêng."')
r('"name": "What happens if I miss a day?",',
  '"name": "Apa yang terjadi kalau aku melewatkan sehari?",',
  '"name": "¿Qué pasa si me salto un día?",',
  '"name": "O que acontece se eu perder um dia?",',
  '"name": "Nếu lỡ một ngày thì sao?",')
r('"text": "For check-in streaks the current run breaks — but your best streak is kept forever, so a miss never erases your proudest run. Forgot to check in yesterday? No punishment here: tap any past day on the calendar to backfill it. It runs on the honor system, just like a paper calendar."',
  '"text": "Untuk streak check-in, rangkaian saat ini putus — tapi streak terbaikmu tersimpan selamanya, jadi sekali bolong tidak menghapus rangkaian paling membanggakanmu. Lupa check-in kemarin? Tidak ada hukuman di sini: ketuk hari mana pun di masa lalu pada kalender untuk mengisinya. Semuanya berjalan dengan sistem kejujuran, seperti kalender kertas."',
  '"text": "En las rachas de check-in la serie actual se rompe — pero tu mejor racha se guarda para siempre, así que un fallo nunca borra tu serie más orgullosa. ¿Olvidaste hacer check-in ayer? Aquí no hay castigo: toca cualquier día pasado en el calendario para rellenarlo. Funciona con el sistema de honor, igual que un calendario de papel."',
  '"text": "Nas sequências de check-in, a série atual quebra — mas sua melhor sequência fica guardada para sempre, então uma falha nunca apaga sua série mais orgulhosa. Esqueceu de fazer check-in ontem? Sem punição aqui: toque em qualquer dia passado no calendário para preenchê-lo. Funciona no sistema da honra, como um calendário de papel."',
  '"text": "Với chuỗi check-in, chuỗi hiện tại sẽ đứt — nhưng chuỗi dài nhất của bạn được giữ mãi mãi, nên một lần lỡ không bao giờ xóa thành tích đáng tự hào nhất. Quên check-in hôm qua? Không phạt đâu: chạm vào bất kỳ ngày nào trong quá khứ trên lịch để điền lại. Hoạt động theo hệ thống danh dự, giống lịch giấy."')
r('"name": "What\'s the difference between a check-in streak and a count-up?",',
  '"name": "Apa bedanya streak check-in dan count-up?",',
  '"name": "¿Cuál es la diferencia entre una racha de check-in y una cuenta ascendente?",',
  '"name": "Qual é a diferença entre uma sequência de check-in e uma contagem progressiva?",',
  '"name": "Chuỗi check-in và chuỗi đếm lên khác nhau thế nào?",')
r('"text": "A check-in streak is a daily ritual — you mark each day you showed up, and missing a day resets the current count. A count-up is automatic: set the day you started (or quit) something and it counts up forever with zero maintenance. Use check-ins for habits you build, count-ups for things you left behind."',
  '"text": "Streak check-in adalah ritual harian — kamu menandai setiap hari kamu hadir, dan melewatkan sehari mengulang hitungan saat ini. Count-up otomatis: atur hari kamu mulai (atau berhenti) sesuatu dan dia menghitung terus tanpa perawatan. Pakai check-in untuk kebiasaan yang kamu bangun, count-up untuk hal yang kamu tinggalkan."',
  '"text": "Una racha de check-in es un ritual diario — marcas cada día que apareciste, y faltar un día reinicia la cuenta actual. Una cuenta ascendente es automática: defines el día en que empezaste (o dejaste) algo y cuenta hacia arriba para siempre sin mantenimiento. Usa check-ins para los hábitos que construyes, cuentas ascendentes para lo que dejaste atrás."',
  '"text": "Uma sequência de check-in é um ritual diário — você marca cada dia em que apareceu, e perder um dia zera a contagem atual. Uma contagem progressiva é automática: defina o dia em que você começou (ou parou) algo e ela conta para cima para sempre, sem manutenção. Use check-ins para hábitos que você constrói, contagens para o que ficou para trás."',
  '"text": "Chuỗi check-in là một nghi thức hàng ngày — bạn đánh dấu mỗi ngày mình xuất hiện, và bỏ lỡ một ngày sẽ reset số đếm hiện tại. Đếm lên thì tự động: đặt ngày bạn bắt đầu (hoặc bỏ) một việc và nó cứ tăng mãi không cần chăm sóc. Dùng check-in cho thói quen bạn đang xây, đếm lên cho những thứ bạn đã bỏ lại phía sau."')
r('"name": "Is my data saved? Can I move it to another device?",',
  '"name": "Apakah dataku tersimpan? Bisakah dipindah ke perangkat lain?",',
  '"name": "¿Se guardan mis datos? ¿Puedo moverlos a otro dispositivo?",',
  '"name": "Meus dados são salvos? Posso mover para outro dispositivo?",',
  '"name": "Dữ liệu của tôi có được lưu không? Chuyển sang thiết bị khác được không?",')
r('"text": "No account, ever. Your streaks are saved in this browser\'s local storage, so they\'re still here when you come back — but they live on this device only and nothing is uploaded anywhere. To move or back up your data, use Export to download a JSON file and Import to restore it anywhere; each streak can also be downloaded as a CSV of its dates."',
  '"text": "Tanpa akun, selamanya. Streak-mu tersimpan di local storage browser ini, jadi tetap ada saat kamu kembali — tapi hanya hidup di perangkat ini dan tidak ada yang diunggah ke mana pun. Untuk memindahkan atau mencadangkan data, gunakan Ekspor untuk mengunduh file JSON dan Impor untuk memulihkannya di mana saja; setiap streak juga bisa diunduh sebagai CSV berisi tanggal-tanggalnya."',
  '"text": "Sin cuenta, nunca. Tus rachas se guardan en el almacenamiento local de este navegador, así que siguen aquí cuando vuelves — pero viven solo en este dispositivo y nada se sube a ningún sitio. Para mover o respaldar tus datos, usa Exportar para descargar un archivo JSON e Importar para restaurarlo en cualquier lugar; cada racha también se puede descargar como un CSV con sus fechas."',
  '"text": "Sem conta, nunca. Suas sequências ficam salvas no armazenamento local deste navegador, então continuam aqui quando você volta — mas vivem apenas neste dispositivo e nada é enviado para lugar nenhum. Para mover ou fazer backup dos seus dados, use Exportar para baixar um arquivo JSON e Importar para restaurá-lo em qualquer lugar; cada sequência também pode ser baixada como um CSV com suas datas."',
  '"text": "Không cần tài khoản, bao giờ hết. Chuỗi của bạn được lưu trong bộ nhớ cục bộ của trình duyệt này, nên vẫn còn đây khi bạn quay lại — nhưng chúng chỉ sống trên thiết bị này và không có gì được tải lên cả. Để di chuyển hoặc sao lưu dữ liệu, dùng Xuất để tải file JSON và Nhập để khôi phục ở bất cứ đâu; mỗi chuỗi cũng có thể tải xuống dạng CSV gồm các ngày."')
r('"name": "What does pinning a streak do?",',
  '"name": "Apa fungsi menyematkan streak?",',
  '"name": "¿Qué hace fijar una racha?",',
  '"name": "O que faz fixar uma sequência?",',
  '"name": "Ghim một chuỗi có tác dụng gì?",')
r('"text": "Pinning marks one streak as your current focus. Your pinned streak can then show on your TomatoTimers timer pages, so the chain you\'re building stays visible while you work — and on days you haven\'t checked in yet, it\'s there to remind you."',
  '"text": "Menyematkan menandai satu streak sebagai fokus utamamu. Streak yang disematkan bisa tampil di halaman-halaman timer TomatoTimers, jadi rantai yang sedang kamu bangun tetap terlihat saat kamu bekerja — dan di hari-hari kamu belum check-in, dia ada di sana untuk mengingatkanmu."',
  '"text": "Fijar marca una racha como tu enfoque actual. Tu racha fijada puede aparecer en tus páginas de temporizador de TomatoTimers, así la cadena que estás construyendo se mantiene visible mientras trabajas — y los días que aún no has hecho check-in, está ahí para recordártelo."',
  '"text": "Fixar marca uma sequência como seu foco atual. Sua sequência fixada pode aparecer nas suas páginas de timer do TomatoTimers, então a corrente que você está construindo fica visível enquanto trabalha — e nos dias em que você ainda não fez check-in, ela está lá para lembrar você."',
  '"text": "Ghim đánh dấu một chuỗi là tâm điểm hiện tại của bạn. Chuỗi đã ghim có thể hiện trên các trang hẹn giờ TomatoTimers của bạn, nên chuỗi bạn đang xây luôn hiển thị trong khi làm việc — và những ngày bạn chưa check-in, nó ở đó để nhắc bạn."')
print("part1 loaded:", len(R), "rows")

# ── body: nav / header / form ──
r('<span>Support the channel and check out the videos!</span>',
  '<span>Dukung channel dan tonton videonya!</span>',
  '<span>¡Apoya al canal y mira los videos!</span>',
  '<span>Apoie o canal e assista os vídeos!</span>',
  '<span>Ủng hộ kênh và xem video nhé!</span>')
r('>How It Works</button>', '>Cara Kerja</button>', '>Cómo Funciona</button>', '>Como Funciona</button>', '>Cách Hoạt Động</button>')
r('>Timers</button>', '>Timer</button>', '>Temporizadores</button>', '>Timers</button>', '>Hẹn Giờ</button>')
r('class="button-style">Pomodoro Timer</a>', 'class="button-style">Timer Pomodoro</a>', 'class="button-style">Temporizador Pomodoro</a>', 'class="button-style">Timer Pomodoro</a>', 'class="button-style">Hẹn Giờ Pomodoro</a>')
r('<option value="light">Light Theme</option>', '<option value="light">Tema Terang</option>', '<option value="light">Tema Claro</option>', '<option value="light">Tema Claro</option>', '<option value="light">Giao Diện Sáng</option>')
r('<option value="dark">Dark Theme</option>', '<option value="dark">Tema Gelap</option>', '<option value="dark">Tema Oscuro</option>', '<option value="dark">Tema Escuro</option>', '<option value="dark">Giao Diện Tối</option>')
r('<h1 class="sr-only">Streak Counter — Daily Check-in Streaks &amp; Days-Since Tracker</h1>',
  '<h1 class="sr-only">Streak Counter — Streak Check-in Harian &amp; Pelacak Hari-Sejak</h1>',
  '<h1 class="sr-only">Streak Counter — Rachas de Check-in Diario y Contador de Días</h1>',
  '<h1 class="sr-only">Streak Counter — Sequências de Check-in Diário e Contador de Dias</h1>',
  '<h1 class="sr-only">Streak Counter — Chuỗi Check-in Hàng Ngày &amp; Bộ Đếm Ngày</h1>')
r("""<p class="lead">Build a chain and don't break it. Check in daily, or count up from any day —
    every streak draws its own colored line across the calendar.</p>""",
  """<p class="lead">Bangun rantai dan jangan putus. Check-in setiap hari, atau hitung maju dari tanggal mana pun —
    setiap streak menggambar garis berwarnanya sendiri di kalender.</p>""",
  """<p class="lead">Construye una cadena y no la rompas. Haz check-in a diario, o cuenta hacia arriba desde cualquier día —
    cada racha dibuja su propia línea de color en el calendario.</p>""",
  """<p class="lead">Construa uma corrente e não a quebre. Faça check-in diariamente, ou conte para cima a partir de qualquer dia —
    cada sequência desenha sua própria linha colorida no calendário.</p>""",
  """<p class="lead">Xây một chuỗi và đừng để đứt. Check-in mỗi ngày, hoặc đếm lên từ bất kỳ ngày nào —
    mỗi chuỗi vẽ đường màu riêng trên lịch.</p>""")
r('aria-label="Pick an icon" aria-haspopup="true" aria-expanded="false" title="Pick an icon"',
  'aria-label="Pilih ikon" aria-haspopup="true" aria-expanded="false" title="Pilih ikon"',
  'aria-label="Elige un icono" aria-haspopup="true" aria-expanded="false" title="Elige un icono"',
  'aria-label="Escolher ícone" aria-haspopup="true" aria-expanded="false" title="Escolher ícone"',
  'aria-label="Chọn biểu tượng" aria-haspopup="true" aria-expanded="false" title="Chọn biểu tượng"')
r('role="radiogroup" aria-label="Pick a color"', 'role="radiogroup" aria-label="Pilih warna"',
  'role="radiogroup" aria-label="Elige un color"', 'role="radiogroup" aria-label="Escolher cor"',
  'role="radiogroup" aria-label="Chọn màu"')
r('<div class="icon-sec-label">Mascot</div>', '<div class="icon-sec-label">Maskot</div>',
  '<div class="icon-sec-label">Mascota</div>', '<div class="icon-sec-label">Mascote</div>',
  '<div class="icon-sec-label">Linh vật</div>')
r('aria-label="Mascot icons"', 'aria-label="Ikon maskot"', 'aria-label="Iconos de mascota"',
  'aria-label="Ícones de mascote"', 'aria-label="Biểu tượng linh vật"')
r('aria-label="Emoji icons"', 'aria-label="Ikon emoji"', 'aria-label="Iconos emoji"',
  'aria-label="Ícones emoji"', 'aria-label="Biểu tượng emoji"')
r('<label class="sr-only" for="stName">Streak name</label>',
  '<label class="sr-only" for="stName">Nama streak</label>',
  '<label class="sr-only" for="stName">Nombre de la racha</label>',
  '<label class="sr-only" for="stName">Nome da sequência</label>',
  '<label class="sr-only" for="stName">Tên chuỗi</label>')
r('placeholder="Name your streak (e.g. Morning run)"',
  'placeholder="Beri nama streak-mu (mis. Lari pagi)"',
  'placeholder="Ponle nombre a tu racha (p. ej. Correr por la mañana)"',
  'placeholder="Dê um nome à sua sequência (ex.: Corrida matinal)"',
  'placeholder="Đặt tên chuỗi của bạn (vd. Chạy bộ buổi sáng)"')
r('data-mode="checkin">✓ Daily check-in</button>', 'data-mode="checkin">✓ Check-in harian</button>',
  'data-mode="checkin">✓ Check-in diario</button>', 'data-mode="checkin">✓ Check-in diário</button>',
  'data-mode="checkin">✓ Check-in hàng ngày</button>')
r('data-mode="countup">⏱ Count up from a date</button>', 'data-mode="countup">⏱ Hitung maju dari tanggal</button>',
  'data-mode="countup">⏱ Cuenta hacia arriba desde una fecha</button>',
  'data-mode="countup">⏱ Contagem a partir de uma data</button>',
  'data-mode="countup">⏱ Đếm lên từ một ngày</button>')
r('id="startLbl">Started</label>', 'id="startLbl">Mulai</label>', 'id="startLbl">Comenzó</label>',
  'id="startLbl">Começou</label>', 'id="startLbl">Bắt đầu</label>')
r('aria-label="Start date"', 'aria-label="Tanggal mulai"', 'aria-label="Fecha de inicio"',
  'aria-label="Data de início"', 'aria-label="Ngày bắt đầu"')
r('id="addBtn">Add streak</button>', 'id="addBtn">Tambah streak</button>', 'id="addBtn">Añadir racha</button>',
  'id="addBtn">Adicionar sequência</button>', 'id="addBtn">Thêm chuỗi</button>')
r('id="cancelEdit">Cancel edit</button>', 'id="cancelEdit">Batal edit</button>',
  'id="cancelEdit">Cancelar edición</button>', 'id="cancelEdit">Cancelar edição</button>',
  'id="cancelEdit">Hủy chỉnh sửa</button>')

# ── calendar nav / data row / empty state ──
r('id="calPrev" aria-label="Previous month">‹ Prev</button>', 'id="calPrev" aria-label="Bulan sebelumnya">‹ Sebelumnya</button>',
  'id="calPrev" aria-label="Mes anterior">‹ Ant.</button>', 'id="calPrev" aria-label="Mês anterior">‹ Ant.</button>',
  'id="calPrev" aria-label="Tháng trước">‹ Trước</button>')
r('id="calToday">Today</button>', 'id="calToday">Hari Ini</button>', 'id="calToday">Hoy</button>',
  'id="calToday">Hoje</button>', 'id="calToday">Hôm Nay</button>')
r('id="calNext" aria-label="Next month">Next ›</button>', 'id="calNext" aria-label="Bulan berikutnya">Berikutnya ›</button>',
  'id="calNext" aria-label="Mes siguiente">Sig. ›</button>', 'id="calNext" aria-label="Próximo mês">Próx. ›</button>',
  'id="calNext" aria-label="Tháng sau">Sau ›</button>')
r('id="exportBtn">⬇ Export all (JSON)</button>', 'id="exportBtn">⬇ Ekspor semua (JSON)</button>',
  'id="exportBtn">⬇ Exportar todo (JSON)</button>', 'id="exportBtn">⬇ Exportar tudo (JSON)</button>',
  'id="exportBtn">⬇ Xuất tất cả (JSON)</button>')
r('id="importBtn">⬆ Import</button>', 'id="importBtn">⬆ Impor</button>', 'id="importBtn">⬆ Importar</button>',
  'id="importBtn">⬆ Importar</button>', 'id="importBtn">⬆ Nhập</button>')
r('<span class="data-note">Saved in this browser — export a backup to move devices.</span>',
  '<span class="data-note">Tersimpan di browser ini — ekspor cadangan untuk pindah perangkat.</span>',
  '<span class="data-note">Guardado en este navegador — exporta una copia para cambiar de dispositivo.</span>',
  '<span class="data-note">Salvo neste navegador — exporte um backup para mudar de dispositivo.</span>',
  '<span class="data-note">Được lưu trong trình duyệt này — xuất bản sao lưu để chuyển thiết bị.</span>')
r('<p>No streaks yet — start your first one, or pick a suggestion:</p>',
  '<p>Belum ada streak — mulai yang pertama, atau pilih saran:</p>',
  '<p>Aún no hay rachas — empieza la primera, o elige una sugerencia:</p>',
  '<p>Ainda não há sequências — comece a primeira, ou escolha uma sugestão:</p>',
  '<p>Chưa có chuỗi nào — bắt đầu chuỗi đầu tiên, hoặc chọn một gợi ý:</p>')

# ── footer ──
r('rel="noopener noreferrer">Advertise Here &#127919;</a>', 'rel="noopener noreferrer">Pasang Iklan di Sini &#127919;</a>',
  'rel="noopener noreferrer">Anuncia Aquí &#127919;</a>', 'rel="noopener noreferrer">Anuncie Aqui &#127919;</a>',
  'rel="noopener noreferrer">Quảng Cáo Ở Đây &#127919;</a>')
r('font-weight: 700;">Email me</a>', 'font-weight: 700;">Email saya</a>', 'font-weight: 700;">Envíame un email</a>',
  'font-weight: 700;">Me envie um email</a>', 'font-weight: 700;">Gửi email cho tôi</a>')
r('    Found a bug? <a href=', '    Menemukan bug? <a href=', '    ¿Encontraste un error? <a href=',
  '    Encontrou um bug? <a href=', '    Phát hiện lỗi? <a href=')
r('<div class="foot-note">Free &amp; no sign-up — your streaks stay in this browser.</div>',
  '<div class="foot-note">Gratis &amp; tanpa daftar — streak-mu tetap tersimpan di browser ini.</div>',
  '<div class="foot-note">Gratis y sin registro — tus rachas se quedan en este navegador.</div>',
  '<div class="foot-note">Grátis e sem cadastro — suas sequências ficam neste navegador.</div>',
  '<div class="foot-note">Miễn phí &amp; không cần đăng ký — các chuỗi của bạn ở lại trong trình duyệt này.</div>')
print("part2 loaded:", len(R), "rows total")

# ── explainer: intro + visible FAQ (mirror of JSON-LD, with <strong> tags) ──
r('<h2>How It Works</h2>', '<h2>Cara Kerja</h2>', '<h2>Cómo Funciona</h2>', '<h2>Como Funciona</h2>', '<h2>Cách Hoạt Động</h2>')
r("""<p><strong>Streak Counter</strong> is a calendar for the chains you're building. Two ways to play: a <strong>check-in streak</strong> asks you to tap once a day — every check-in extends your chain, and the calendar draws it as a colored line. A <strong>count-up streak</strong> just needs a start date and then ticks up forever, perfect for "days since I quit" trackers. Both live on one big calendar, each with its own color and icon, so a good month literally paints itself. Tracking lots of things? Hit <strong>hide</strong> on a streak to remove its line from the All view — the streak keeps counting, your calendar stays clean. The All view draws up to five lines at once; beyond that, extra streaks roll up into a tiny "+N" badge on the days they're active, and hiding one slides the next streak up into its lane.</p>""",
  """<p><strong>Streak Counter</strong> adalah kalender untuk rantai yang sedang kamu bangun. Dua cara bermain: <strong>streak check-in</strong> memintamu mengetuk sekali sehari — setiap check-in memperpanjang rantaimu, dan kalender menggambarnya sebagai garis berwarna. <strong>Streak count-up</strong> hanya butuh tanggal mulai lalu terus bertambah selamanya, cocok untuk pelacak "hari sejak berhenti". Keduanya tampil di satu kalender besar dengan warna dan ikon masing-masing, jadi bulan yang rajin benar-benar melukis dirinya sendiri. Melacak banyak hal? Tekan <strong>sembunyikan</strong> pada sebuah streak untuk menghilangkan garisnya dari tampilan Semua — streak tetap menghitung, kalendermu tetap bersih. Tampilan All menggambar maksimal lima garis sekaligus; selebihnya, streak ekstra digabung ke badge kecil "+N" pada hari-hari saat aktif, dan menyembunyikan satu streak menggeser streak berikutnya naik ke jalurnya.</p>""",
  """<p><strong>Streak Counter</strong> es un calendario para las cadenas que estás construyendo. Dos formas de jugar: una <strong>racha de check-in</strong> te pide tocar una vez al día — cada check-in extiende tu cadena, y el calendario la dibuja como una línea de color. Una <strong>racha de cuenta ascendente</strong> solo necesita una fecha de inicio y luego sube para siempre, perfecta para contadores de "días desde que lo dejé". Ambas viven en un mismo calendario grande, cada una con su color e icono, así que un buen mes literalmente se pinta solo. ¿Sigues muchas cosas? Pulsa <strong>ocultar</strong> en una racha para quitar su línea de la vista Todas — la racha sigue contando, tu calendario se mantiene limpio. La vista Todas dibuja hasta cinco líneas a la vez; más allá, las rachas extra se agrupan en una pequeña insignia "+N" en los días en que están activas, y ocultar una desliza la siguiente racha hacia su carril.</p>""",
  """<p><strong>Streak Counter</strong> é um calendário para as correntes que você está construindo. Duas formas de jogar: uma <strong>sequência de check-in</strong> pede um toque por dia — cada check-in estende sua corrente, e o calendário a desenha como uma linha colorida. Uma <strong>sequência de contagem progressiva</strong> só precisa de uma data de início e depois sobe para sempre, perfeita para contadores de "dias desde que parei". As duas vivem no mesmo calendário grande, cada uma com sua cor e ícone, então um bom mês literalmente se pinta sozinho. Acompanhando muitas coisas? Toque em <strong>ocultar</strong> numa sequência para tirar a linha dela da visão Todas — a sequência continua contando, seu calendário fica limpo. A visão Todas desenha até cinco linhas por vez; além disso, sequências extras viram um pequeno selo "+N" nos dias em que estão ativas, e ocultar uma faz a próxima subir para a faixa dela.</p>""",
  """<p><strong>Streak Counter</strong> là một tờ lịch cho những chuỗi bạn đang xây. Hai cách chơi: <strong>chuỗi check-in</strong> yêu cầu bạn chạm một lần mỗi ngày — mỗi lần check-in nối dài chuỗi, và lịch vẽ nó thành một đường màu. <strong>Chuỗi đếm lên</strong> chỉ cần ngày bắt đầu rồi tự tăng mãi mãi, hoàn hảo cho kiểu theo dõi "số ngày kể từ khi bỏ". Cả hai cùng nằm trên một lịch lớn, mỗi chuỗi có màu và biểu tượng riêng, nên một tháng đẹp thực sự tự vẽ nên mình. Theo dõi nhiều thứ? Bấm <strong>ẩn</strong> ở một chuỗi để gỡ đường của nó khỏi chế độ xem Tất cả — chuỗi vẫn tiếp tục đếm, lịch của bạn vẫn gọn. Chế độ xem Tất cả vẽ tối đa năm đường một lúc; nhiều hơn nữa, các chuỗi phụ gom vào một huy hiệu "+N" nhỏ vào những ngày chúng hoạt động, và ẩn một chuỗi sẽ đẩy chuỗi kế tiếp lên làn của nó.</p>""")

r('<h2>How does the streak counter work?</h2>', '<h2>Bagaimana cara kerja penghitung streak?</h2>',
  '<h2>¿Cómo funciona el contador de rachas?</h2>', '<h2>Como funciona o contador de sequências?</h2>',
  '<h2>Bộ đếm chuỗi hoạt động thế nào?</h2>')
r("""<p>Two ways. A check-in streak asks you to tap once a day — every check-in extends your chain, and the calendar draws it as a colored line. A count-up streak just needs a start date and then ticks up forever, perfect for "days since I quit" trackers. Both live on one big calendar, each with its own color and icon.</p>""",
  """<p>Dua cara. Streak check-in memintamu mengetuk sekali sehari — setiap check-in memperpanjang rantaimu, dan kalender menggambarnya sebagai garis berwarna. Streak count-up hanya butuh tanggal mulai lalu terus bertambah selamanya, cocok untuk pelacak "hari sejak berhenti". Keduanya tampil di satu kalender besar, masing-masing dengan warna dan ikon sendiri.</p>""",
  """<p>De dos maneras. Una racha de check-in te pide tocar una vez al día — cada check-in extiende tu cadena, y el calendario la dibuja como una línea de color. Una racha de cuenta ascendente solo necesita una fecha de inicio y luego sube para siempre, perfecta para contadores de "días desde que lo dejé". Ambas viven en un mismo calendario grande, cada una con su propio color e icono.</p>""",
  """<p>De duas formas. Uma sequência de check-in pede um toque por dia — cada check-in estende sua corrente, e o calendário a desenha como uma linha colorida. Uma sequência de contagem progressiva só precisa de uma data de início e depois sobe para sempre, perfeita para contadores de "dias desde que parei". As duas vivem no mesmo calendário grande, cada uma com sua própria cor e ícone.</p>""",
  """<p>Hai cách. Chuỗi check-in yêu cầu bạn chạm một lần mỗi ngày — mỗi lần check-in nối dài chuỗi của bạn, và lịch vẽ nó thành một đường màu. Chuỗi đếm lên chỉ cần ngày bắt đầu rồi tự tăng mãi mãi, hoàn hảo cho kiểu theo dõi "số ngày kể từ khi bỏ". Cả hai cùng nằm trên một lịch lớn, mỗi chuỗi có màu và biểu tượng riêng.</p>""")

r('<h2>What happens if I miss a day?</h2>', '<h2>Apa yang terjadi kalau aku melewatkan sehari?</h2>',
  '<h2>¿Qué pasa si me salto un día?</h2>', '<h2>O que acontece se eu perder um dia?</h2>',
  '<h2>Nếu lỡ một ngày thì sao?</h2>')
r("""<p>For check-in streaks the current run breaks — but your <strong>best streak</strong> is kept forever, so a miss never erases your proudest run. Forgot to check in yesterday? No punishment here: tap any past day on the calendar to backfill it. It runs on the honor system, just like a paper calendar.</p>""",
  """<p>Untuk streak check-in, rangkaian saat ini putus — tapi <strong>streak terbaik</strong>mu tersimpan selamanya, jadi sekali bolong tidak menghapus rangkaian paling membanggakanmu. Lupa check-in kemarin? Tidak ada hukuman di sini: ketuk hari mana pun di masa lalu pada kalender untuk mengisinya. Semuanya berjalan dengan sistem kejujuran, seperti kalender kertas.</p>""",
  """<p>En las rachas de check-in la serie actual se rompe — pero tu <strong>mejor racha</strong> se guarda para siempre, así que un fallo nunca borra tu serie más orgullosa. ¿Olvidaste hacer check-in ayer? Aquí no hay castigo: toca cualquier día pasado en el calendario para rellenarlo. Funciona con el sistema de honor, igual que un calendario de papel.</p>""",
  """<p>Nas sequências de check-in, a série atual quebra — mas sua <strong>melhor sequência</strong> fica guardada para sempre, então uma falha nunca apaga sua série mais orgulhosa. Esqueceu de fazer check-in ontem? Sem punição aqui: toque em qualquer dia passado no calendário para preenchê-lo. Funciona no sistema da honra, como um calendário de papel.</p>""",
  """<p>Với chuỗi check-in, chuỗi hiện tại sẽ đứt — nhưng <strong>chuỗi dài nhất</strong> của bạn được giữ mãi mãi, nên một lần lỡ không bao giờ xóa thành tích đáng tự hào nhất. Quên check-in hôm qua? Không phạt đâu: chạm vào bất kỳ ngày nào trong quá khứ trên lịch để điền lại. Hoạt động theo hệ thống danh dự, giống lịch giấy.</p>""")

r("<h2>What's the difference between a check-in streak and a count-up?</h2>",
  '<h2>Apa bedanya streak check-in dan count-up?</h2>',
  '<h2>¿Cuál es la diferencia entre una racha de check-in y una cuenta ascendente?</h2>',
  '<h2>Qual é a diferença entre uma sequência de check-in e uma contagem progressiva?</h2>',
  '<h2>Chuỗi check-in và chuỗi đếm lên khác nhau thế nào?</h2>')
r("""<p>A check-in streak is a daily ritual — you mark each day you showed up, and missing a day resets the current count. A count-up is automatic: set the day you started (or quit) something and it counts up forever with zero maintenance. Use check-ins for habits you build, count-ups for things you left behind.</p>""",
  """<p>Streak check-in adalah ritual harian — kamu menandai setiap hari kamu hadir, dan melewatkan sehari mengulang hitungan saat ini. Count-up otomatis: atur hari kamu mulai (atau berhenti) sesuatu dan dia menghitung terus tanpa perawatan. Pakai check-in untuk kebiasaan yang kamu bangun, count-up untuk hal yang kamu tinggalkan.</p>""",
  """<p>Una racha de check-in es un ritual diario — marcas cada día que apareciste, y faltar un día reinicia la cuenta actual. Una cuenta ascendente es automática: defines el día en que empezaste (o dejaste) algo y cuenta hacia arriba para siempre sin mantenimiento. Usa check-ins para los hábitos que construyes, cuentas ascendentes para lo que dejaste atrás.</p>""",
  """<p>Uma sequência de check-in é um ritual diário — você marca cada dia em que apareceu, e perder um dia zera a contagem atual. Uma contagem progressiva é automática: defina o dia em que você começou (ou parou) algo e ela conta para cima para sempre, sem manutenção. Use check-ins para hábitos que você constrói, contagens para o que ficou para trás.</p>""",
  """<p>Chuỗi check-in là một nghi thức hàng ngày — bạn đánh dấu mỗi ngày mình xuất hiện, và bỏ lỡ một ngày sẽ reset số đếm hiện tại. Đếm lên thì tự động: đặt ngày bạn bắt đầu (hoặc bỏ) một việc và nó cứ tăng mãi không cần chăm sóc. Dùng check-in cho thói quen bạn đang xây, đếm lên cho những thứ bạn đã bỏ lại phía sau.</p>""")

r('<h2>Is my data saved? Can I move it to another device?</h2>',
  '<h2>Apakah dataku tersimpan? Bisakah dipindah ke perangkat lain?</h2>',
  '<h2>¿Se guardan mis datos? ¿Puedo moverlos a otro dispositivo?</h2>',
  '<h2>Meus dados são salvos? Posso mover para outro dispositivo?</h2>',
  '<h2>Dữ liệu của tôi có được lưu không? Chuyển sang thiết bị khác được không?</h2>')
r("""<p>No account, ever. Your streaks are saved in this browser's local storage, so they're still here when you come back — but they live on this device only and nothing is uploaded anywhere. To move or back up your data, use <strong>Export</strong> to download a JSON file and <strong>Import</strong> to restore it anywhere; each streak can also be downloaded as a CSV of its dates.</p>""",
  """<p>Tanpa akun, selamanya. Streak-mu tersimpan di local storage browser ini, jadi tetap ada saat kamu kembali — tapi hanya hidup di perangkat ini dan tidak ada yang diunggah ke mana pun. Untuk memindahkan atau mencadangkan data, gunakan <strong>Ekspor</strong> untuk mengunduh file JSON dan <strong>Impor</strong> untuk memulihkannya di mana saja; setiap streak juga bisa diunduh sebagai CSV berisi tanggal-tanggalnya.</p>""",
  """<p>Sin cuenta, nunca. Tus rachas se guardan en el almacenamiento local de este navegador, así que siguen aquí cuando vuelves — pero viven solo en este dispositivo y nada se sube a ningún sitio. Para mover o respaldar tus datos, usa <strong>Exportar</strong> para descargar un archivo JSON e <strong>Importar</strong> para restaurarlo en cualquier lugar; cada racha también se puede descargar como un CSV con sus fechas.</p>""",
  """<p>Sem conta, nunca. Suas sequências ficam salvas no armazenamento local deste navegador, então continuam aqui quando você volta — mas vivem apenas neste dispositivo e nada é enviado para lugar nenhum. Para mover ou fazer backup dos seus dados, use <strong>Exportar</strong> para baixar um arquivo JSON e <strong>Importar</strong> para restaurá-lo em qualquer lugar; cada sequência também pode ser baixada como um CSV com suas datas.</p>""",
  """<p>Không cần tài khoản, bao giờ hết. Chuỗi của bạn được lưu trong bộ nhớ cục bộ của trình duyệt này, nên vẫn còn đây khi bạn quay lại — nhưng chúng chỉ sống trên thiết bị này và không có gì được tải lên cả. Để di chuyển hoặc sao lưu dữ liệu, dùng <strong>Xuất</strong> để tải file JSON và <strong>Nhập</strong> để khôi phục ở bất cứ đâu; mỗi chuỗi cũng có thể tải xuống dạng CSV gồm các ngày.</p>""")

r('<h2>What does pinning a streak do?</h2>', '<h2>Apa fungsi menyematkan streak?</h2>',
  '<h2>¿Qué hace fijar una racha?</h2>', '<h2>O que faz fixar uma sequência?</h2>',
  '<h2>Ghim một chuỗi có tác dụng gì?</h2>')
r("""<p>Pinning marks one streak as your current focus. Your pinned streak can then show on your TomatoTimers timer pages, so the chain you're building stays visible while you work — and on days you haven't checked in yet, it's there to remind you.</p>""",
  """<p>Menyematkan menandai satu streak sebagai fokus utamamu. Streak yang disematkan bisa tampil di halaman-halaman timer TomatoTimers, jadi rantai yang sedang kamu bangun tetap terlihat saat kamu bekerja — dan di hari-hari kamu belum check-in, dia ada di sana untuk mengingatkanmu.</p>""",
  """<p>Fijar marca una racha como tu enfoque actual. Tu racha fijada puede aparecer en tus páginas de temporizador de TomatoTimers, así la cadena que estás construyendo se mantiene visible mientras trabajas — y los días que aún no has hecho check-in, está ahí para recordártelo.</p>""",
  """<p>Fixar marca uma sequência como seu foco atual. Sua sequência fixada pode aparecer nas suas páginas de timer do TomatoTimers, então a corrente que você está construindo fica visível enquanto trabalha — e nos dias em que você ainda não fez check-in, ela está lá para lembrar você.</p>""",
  """<p>Ghim đánh dấu một chuỗi là tâm điểm hiện tại của bạn. Chuỗi đã ghim có thể hiện trên các trang hẹn giờ TomatoTimers của bạn, nên chuỗi bạn đang xây luôn hiển thị trong khi làm việc — và những ngày bạn chưa check-in, nó ở đó để nhắc bạn.</p>""")
print("part3 loaded:", len(R), "rows total")

# ── JS strings ──
r("""var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];""",
  """var MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
  'Agustus', 'September', 'Oktober', 'November', 'Desember'];""",
  """var MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
  'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];""",
  """var MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
  'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];""",
  """var MONTHS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7',
  'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];""")
r("var MON_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];",
  "var MON_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];",
  "var MON_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];",
  "var MON_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];",
  "var MON_SHORT = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];")
r("var DOWS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];",
  "var DOWS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];",
  "var DOWS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];",
  "var DOWS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];",
  "var DOWS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];")
r("name: 'Pomodoro Streak',", "name: 'Streak Pomodoro',", "name: 'Racha Pomodoro',",
  "name: 'Sequência Pomodoro',", "name: 'Chuỗi Pomodoro',")
r("b.textContent = 'Undo';", "b.textContent = 'Urungkan';", "b.textContent = 'Deshacer';",
  "b.textContent = 'Desfazer';", "b.textContent = 'Hoàn tác';")
r("""$('startLbl').textContent = selMode === 'countup' ? 'Counting from' : 'Started';""",
  """$('startLbl').textContent = selMode === 'countup' ? 'Menghitung dari' : 'Mulai';""",
  """$('startLbl').textContent = selMode === 'countup' ? 'Contando desde' : 'Comenzó';""",
  """$('startLbl').textContent = selMode === 'countup' ? 'Contando desde' : 'Começou';""",
  """$('startLbl').textContent = selMode === 'countup' ? 'Đếm từ' : 'Bắt đầu';""")
r("$('addBtn').textContent = 'Add streak';", "$('addBtn').textContent = 'Tambah streak';",
  "$('addBtn').textContent = 'Añadir racha';", "$('addBtn').textContent = 'Adicionar sequência';",
  "$('addBtn').textContent = 'Thêm chuỗi';")
r("$('addBtn').textContent = 'Save';", "$('addBtn').textContent = 'Simpan';",
  "$('addBtn').textContent = 'Guardar';", "$('addBtn').textContent = 'Salvar';",
  "$('addBtn').textContent = 'Lưu';")
r("$('addErr').textContent = 'Give your streak a name.'; return;",
  "$('addErr').textContent = 'Beri nama streak-mu dulu.'; return;",
  "$('addErr').textContent = 'Ponle un nombre a tu racha.'; return;",
  "$('addErr').textContent = 'Dê um nome à sua sequência.'; return;",
  "$('addErr').textContent = 'Hãy đặt tên cho chuỗi của bạn.'; return;")
r("$('addErr').textContent = 'Pick a valid start date.'; return;",
  "$('addErr').textContent = 'Pilih tanggal mulai yang valid.'; return;",
  "$('addErr').textContent = 'Elige una fecha de inicio válida.'; return;",
  "$('addErr').textContent = 'Escolha uma data de início válida.'; return;",
  "$('addErr').textContent = 'Chọn ngày bắt đầu hợp lệ.'; return;")
r("""$('addErr').textContent = 'Start date can\\'t be in the future.'; return;""",
  """$('addErr').textContent = 'Tanggal mulai tidak boleh di masa depan.'; return;""",
  """$('addErr').textContent = 'La fecha de inicio no puede estar en el futuro.'; return;""",
  """$('addErr').textContent = 'A data de início não pode estar no futuro.'; return;""",
  """$('addErr').textContent = 'Ngày bắt đầu không thể ở tương lai.'; return;""")
r("toast('Streak updated.');", "toast('Streak diperbarui.');", "toast('Racha actualizada.');",
  "toast('Sequência atualizada.');", "toast('Đã cập nhật chuỗi.');")
r("toast(selMode === 'countup' ? 'Count-up started — it ticks up on its own.' : 'Streak added — tap the button or the calendar to check in.');",
  "toast(selMode === 'countup' ? 'Count-up dimulai — dia bertambah sendiri.' : 'Streak ditambahkan — ketuk tombol atau kalender untuk check-in.');",
  "toast(selMode === 'countup' ? 'Cuenta ascendente iniciada — sube sola.' : 'Racha añadida — toca el botón o el calendario para hacer check-in.');",
  "toast(selMode === 'countup' ? 'Contagem iniciada — ela sobe sozinha.' : 'Sequência adicionada — toque no botão ou no calendário para fazer check-in.');",
  "toast(selMode === 'countup' ? 'Đếm lên đã bắt đầu — nó tự tăng.' : 'Đã thêm chuỗi — chạm nút hoặc lịch để check-in.');")
r("toast('Check-in removed.');", "toast('Check-in dihapus.');", "toast('Check-in eliminado.');",
  "toast('Check-in removido.');", "toast('Đã xóa check-in.');")
r("""toast('Checked in — ' + n + ' day' + (n === 1 ? '' : 's') + ' 🔥');""",
  """toast('Check-in — ' + n + ' hari 🔥');""",
  """toast('Check-in hecho — ' + n + (n === 1 ? ' día' : ' días') + ' 🔥');""",
  """toast('Check-in feito — ' + n + (n === 1 ? ' dia' : ' dias') + ' 🔥');""",
  """toast('Đã check-in — ' + n + ' ngày 🔥');""")
r("allNm.textContent = 'All streaks';", "allNm.textContent = 'Semua streak';",
  "allNm.textContent = 'Todas las rachas';", "allNm.textContent = 'Todas as sequências';",
  "allNm.textContent = 'Tất cả chuỗi';")
r("toast('This streak starts ' + humanDate(s.start) + '.');",
  "toast('Streak ini mulai ' + humanDate(s.start) + '.');",
  "toast('Esta racha empieza el ' + humanDate(s.start) + '.');",
  "toast('Esta sequência começa em ' + humanDate(s.start) + '.');",
  "toast('Chuỗi này bắt đầu ' + humanDate(s.start) + '.');")
r("more.title = 'Also active: ' + extraNames.join(', ');",
  "more.title = 'Juga aktif: ' + extraNames.join(', ');",
  "more.title = 'También activas: ' + extraNames.join(', ');",
  "more.title = 'Também ativas: ' + extraNames.join(', ');",
  "more.title = 'Cũng hoạt động: ' + extraNames.join(', ');")
r("""  $('calHint').textContent = !store.streaks.length
    ? 'Add your first streak above — it will draw its line right here.'
    : allHidden
      ? 'All streaks are hidden from this view — hit show on one to bring it back.'
      : !focusS
        ? 'Select a streak above to check in or tap-edit its days.'
        : focusS.mode === 'checkin'
          ? 'Tap any day from ' + humanDate(focusS.start) + ' onward to add or remove a check-in — past days included.'
          : 'This streak counts up automatically from ' + humanDate(focusS.start) + ' — no check-ins needed.';""",
  """  $('calHint').textContent = !store.streaks.length
    ? 'Tambahkan streak pertamamu di atas — garisnya akan langsung tergambar di sini.'
    : allHidden
      ? 'Semua streak disembunyikan dari tampilan ini — tekan tampilkan pada salah satu untuk mengembalikannya.'
      : !focusS
        ? 'Pilih streak di atas untuk check-in atau ketuk-edit harinya.'
        : focusS.mode === 'checkin'
          ? 'Ketuk hari mana pun sejak ' + humanDate(focusS.start) + ' untuk menambah atau menghapus check-in — termasuk hari yang sudah lewat.'
          : 'Streak ini menghitung maju otomatis sejak ' + humanDate(focusS.start) + ' — tanpa perlu check-in.';""",
  """  $('calHint').textContent = !store.streaks.length
    ? 'Añade tu primera racha arriba — dibujará su línea justo aquí.'
    : allHidden
      ? 'Todas las rachas están ocultas en esta vista — pulsa mostrar en una para traerla de vuelta.'
      : !focusS
        ? 'Selecciona una racha arriba para hacer check-in o editar sus días con toques.'
        : focusS.mode === 'checkin'
          ? 'Toca cualquier día desde ' + humanDate(focusS.start) + ' en adelante para añadir o quitar un check-in — incluidos los días pasados.'
          : 'Esta racha cuenta hacia arriba automáticamente desde ' + humanDate(focusS.start) + ' — no necesita check-ins.';""",
  """  $('calHint').textContent = !store.streaks.length
    ? 'Adicione sua primeira sequência acima — ela vai desenhar a linha dela bem aqui.'
    : allHidden
      ? 'Todas as sequências estão ocultas nesta visão — toque em mostrar em uma para trazê-la de volta.'
      : !focusS
        ? 'Selecione uma sequência acima para fazer check-in ou editar os dias com toques.'
        : focusS.mode === 'checkin'
          ? 'Toque em qualquer dia a partir de ' + humanDate(focusS.start) + ' para adicionar ou remover um check-in — incluindo dias passados.'
          : 'Esta sequência conta para cima automaticamente desde ' + humanDate(focusS.start) + ' — sem precisar de check-ins.';""",
  """  $('calHint').textContent = !store.streaks.length
    ? 'Thêm chuỗi đầu tiên của bạn ở trên — nó sẽ vẽ đường ngay tại đây.'
    : allHidden
      ? 'Tất cả chuỗi đang bị ẩn khỏi chế độ xem này — bấm hiện ở một chuỗi để đưa nó trở lại.'
      : !focusS
        ? 'Chọn một chuỗi ở trên để check-in hoặc chạm-sửa các ngày của nó.'
        : focusS.mode === 'checkin'
          ? 'Chạm vào bất kỳ ngày nào từ ' + humanDate(focusS.start) + ' trở đi để thêm hoặc xóa check-in — kể cả ngày trong quá khứ.'
          : 'Chuỗi này tự động đếm lên từ ' + humanDate(focusS.start) + ' — không cần check-in.';""")
print("part4 loaded:", len(R), "rows total")

# ── stats band ──
r("""    box.appendChild(statCard(cur + ' <small>' + (cur === 1 ? 'day' : 'days') + '</small>',
      focusS.mode === 'checkin' ? 'Current streak 🔥' : 'Days and counting 🔥'));""",
  """    box.appendChild(statCard(cur + ' <small>hari</small>',
      focusS.mode === 'checkin' ? 'Streak saat ini 🔥' : 'Hari dan terus bertambah 🔥'));""",
  """    box.appendChild(statCard(cur + ' <small>' + (cur === 1 ? 'día' : 'días') + '</small>',
      focusS.mode === 'checkin' ? 'Racha actual 🔥' : 'Días y contando 🔥'));""",
  """    box.appendChild(statCard(cur + ' <small>' + (cur === 1 ? 'dia' : 'dias') + '</small>',
      focusS.mode === 'checkin' ? 'Sequência atual 🔥' : 'Dias e contando 🔥'));""",
  """    box.appendChild(statCard(cur + ' <small>ngày</small>',
      focusS.mode === 'checkin' ? 'Chuỗi hiện tại 🔥' : 'Số ngày, vẫn đang đếm 🔥'));""")
r("box.appendChild(statCard(String(bestStreak(focusS)), 'Best streak'));",
  "box.appendChild(statCard(String(bestStreak(focusS)), 'Streak terbaik'));",
  "box.appendChild(statCard(String(bestStreak(focusS)), 'Mejor racha'));",
  "box.appendChild(statCard(String(bestStreak(focusS)), 'Melhor sequência'));",
  "box.appendChild(statCard(String(bestStreak(focusS)), 'Chuỗi dài nhất'));")
r("box.appendChild(statCard(String(totalCount(focusS)), focusS.mode === 'checkin' ? 'Total check-ins' : 'Total days'));",
  "box.appendChild(statCard(String(totalCount(focusS)), focusS.mode === 'checkin' ? 'Total check-in' : 'Total hari'));",
  "box.appendChild(statCard(String(totalCount(focusS)), focusS.mode === 'checkin' ? 'Total de check-ins' : 'Días totales'));",
  "box.appendChild(statCard(String(totalCount(focusS)), focusS.mode === 'checkin' ? 'Total de check-ins' : 'Dias totais'));",
  "box.appendChild(statCard(String(totalCount(focusS)), focusS.mode === 'checkin' ? 'Tổng check-in' : 'Tổng số ngày'));")
r("var monLbl = MONTHS[view.m].slice(0, 3) + ' progress';",
  "var monLbl = 'Progres ' + MON_SHORT[view.m];",
  "var monLbl = 'Progreso ' + MON_SHORT[view.m];",
  "var monLbl = 'Progresso ' + MON_SHORT[view.m];",
  "var monLbl = 'Tiến độ ' + MON_SHORT[view.m];")
r("b.textContent = done ? '✓ Checked in today' : '✓ Check in today';",
  "b.textContent = done ? '✓ Sudah check-in hari ini' : '✓ Check-in hari ini';",
  "b.textContent = done ? '✓ Check-in hecho hoy' : '✓ Haz check-in hoy';",
  "b.textContent = done ? '✓ Check-in feito hoje' : '✓ Faça check-in hoje';",
  "b.textContent = done ? '✓ Đã check-in hôm nay' : '✓ Check-in hôm nay';")
r("""b.title = done ? 'Click again to undo today\\'s check-in' : '';""",
  """b.title = done ? 'Klik lagi untuk membatalkan check-in hari ini' : '';""",
  """b.title = done ? 'Toca de nuevo para deshacer el check-in de hoy' : '';""",
  """b.title = done ? 'Toque novamente para desfazer o check-in de hoje' : '';""",
  """b.title = done ? 'Chạm lại để hoàn tác check-in hôm nay' : '';""")
r("note.textContent = 'Counting up automatically since ' + humanDate(focusS.start) + '.';",
  "note.textContent = 'Menghitung maju otomatis sejak ' + humanDate(focusS.start) + '.';",
  "note.textContent = 'Contando hacia arriba automáticamente desde ' + humanDate(focusS.start) + '.';",
  "note.textContent = 'Contando para cima automaticamente desde ' + humanDate(focusS.start) + '.';",
  "note.textContent = 'Tự động đếm lên từ ' + humanDate(focusS.start) + '.';")
r("box.appendChild(statCard(String(store.streaks.length), 'Streaks'));",
  "box.appendChild(statCard(String(store.streaks.length), 'Streak'));",
  "box.appendChild(statCard(String(store.streaks.length), 'Rachas'));",
  "box.appendChild(statCard(String(store.streaks.length), 'Sequências'));",
  "box.appendChild(statCard(String(store.streaks.length), 'Chuỗi'));")
r("box.appendChild(statCard(String(active), 'Alive right now 🔥'));",
  "box.appendChild(statCard(String(active), 'Aktif sekarang 🔥'));",
  "box.appendChild(statCard(String(active), 'Vivas ahora mismo 🔥'));",
  "box.appendChild(statCard(String(active), 'Vivas agora 🔥'));",
  "box.appendChild(statCard(String(active), 'Đang sống ngay lúc này 🔥'));")
r("box.appendChild(statCard(String(monthSum), 'Check-ins in ' + MONTHS[view.m].slice(0, 3)));",
  "box.appendChild(statCard(String(monthSum), 'Check-in di ' + MON_SHORT[view.m]));",
  "box.appendChild(statCard(String(monthSum), 'Check-ins en ' + MON_SHORT[view.m]));",
  "box.appendChild(statCard(String(monthSum), 'Check-ins em ' + MON_SHORT[view.m]));",
  "box.appendChild(statCard(String(monthSum), 'Check-in ' + MON_SHORT[view.m]));")
r("nn.textContent = 'Select a streak above to check in, backfill days, pin, edit or export it.';",
  "nn.textContent = 'Pilih streak di atas untuk check-in, mengisi hari yang lewat, pin, edit, atau ekspor.';",
  "nn.textContent = 'Selecciona una racha arriba para hacer check-in, rellenar días, fijarla, editarla o exportarla.';",
  "nn.textContent = 'Selecione uma sequência acima para fazer check-in, preencher dias, fixar, editar ou exportar.';",
  "nn.textContent = 'Chọn một chuỗi ở trên để check-in, điền bù ngày, ghim, sửa hoặc xuất.';")

# ── manage list + pin toast ──
r("toast(np ? 'Pinned — this streak can show on your timer pages.' : 'Unpinned.');",
  "toast(np ? 'Disematkan — streak ini bisa tampil di halaman timermu.' : 'Sematan dilepas.');",
  "toast(np ? 'Fijada — esta racha puede aparecer en tus páginas de temporizador.' : 'Desfijada.');",
  "toast(np ? 'Fixada — esta sequência pode aparecer nas suas páginas de timer.' : 'Desafixada.');",
  "toast(np ? 'Đã ghim — chuỗi này có thể hiện trên các trang hẹn giờ của bạn.' : 'Đã bỏ ghim.');")
r("hb.textContent = s.hideAll ? 'show' : 'hide';",
  "hb.textContent = s.hideAll ? 'tampilkan' : 'sembunyikan';",
  "hb.textContent = s.hideAll ? 'mostrar' : 'ocultar';",
  "hb.textContent = s.hideAll ? 'mostrar' : 'ocultar';",
  "hb.textContent = s.hideAll ? 'hiện' : 'ẩn';")
r("""hb.title = s.hideAll ? 'Show this streak\\'s line on the All view' : 'Hide this streak\\'s line from the All view';""",
  """hb.title = s.hideAll ? 'Tampilkan garis streak ini di tampilan Semua' : 'Sembunyikan garis streak ini dari tampilan Semua';""",
  """hb.title = s.hideAll ? 'Mostrar la línea de esta racha en la vista Todas' : 'Ocultar la línea de esta racha de la vista Todas';""",
  """hb.title = s.hideAll ? 'Mostrar a linha desta sequência na visão Todas' : 'Ocultar a linha desta sequência da visão Todas';""",
  """hb.title = s.hideAll ? 'Hiện đường của chuỗi này ở chế độ xem Tất cả' : 'Ẩn đường của chuỗi này khỏi chế độ xem Tất cả';""")
r("pin.textContent = s.pinned ? '📌 pinned' : '📌 pin';",
  "pin.textContent = s.pinned ? '📌 disematkan' : '📌 sematkan';",
  "pin.textContent = s.pinned ? '📌 fijada' : '📌 fijar';",
  "pin.textContent = s.pinned ? '📌 fixada' : '📌 fixar';",
  "pin.textContent = s.pinned ? '📌 đã ghim' : '📌 ghim';")
r("pin.setAttribute('aria-label', (s.pinned ? 'Unpin ' : 'Pin ') + s.name);",
  "pin.setAttribute('aria-label', (s.pinned ? 'Lepas sematan ' : 'Sematkan ') + s.name);",
  "pin.setAttribute('aria-label', (s.pinned ? 'Desfijar ' : 'Fijar ') + s.name);",
  "pin.setAttribute('aria-label', (s.pinned ? 'Desafixar ' : 'Fixar ') + s.name);",
  "pin.setAttribute('aria-label', (s.pinned ? 'Bỏ ghim ' : 'Ghim ') + s.name);")
r("ed.textContent = 'edit';", "ed.textContent = 'edit';", "ed.textContent = 'editar';",
  "ed.textContent = 'editar';", "ed.textContent = 'sửa';")
r("csv.setAttribute('aria-label', 'Download ' + s.name + ' as CSV');",
  "csv.setAttribute('aria-label', 'Unduh ' + s.name + ' sebagai CSV');",
  "csv.setAttribute('aria-label', 'Descargar ' + s.name + ' como CSV');",
  "csv.setAttribute('aria-label', 'Baixar ' + s.name + ' como CSV');",
  "csv.setAttribute('aria-label', 'Tải ' + s.name + ' dạng CSV');")
r("del.textContent = 'delete';", "del.textContent = 'hapus';", "del.textContent = 'eliminar';",
  "del.textContent = 'excluir';", "del.textContent = 'xóa';", count=2)
r("del.textContent = 'sure?';", "del.textContent = 'yakin?';", "del.textContent = '¿seguro?';",
  "del.textContent = 'certeza?';", "del.textContent = 'chắc?';")
r("""toast('Deleted "' + s.name + '".', function () {""",
  """toast('Streak "' + s.name + '" dihapus.', function () {""",
  """toast('"' + s.name + '" eliminada.', function () {""",
  """toast('"' + s.name + '" excluída.', function () {""",
  """toast('Đã xóa "' + s.name + '".', function () {""")
r("mc.textContent = doneToday ? '✓ done today' : '✓ check in';",
  "mc.textContent = doneToday ? '✓ sudah hari ini' : '✓ check-in';",
  "mc.textContent = doneToday ? '✓ hecho hoy' : '✓ check in';",
  "mc.textContent = doneToday ? '✓ feito hoje' : '✓ check-in';",
  "mc.textContent = doneToday ? '✓ xong hôm nay' : '✓ check-in';")
r("""mc.title = doneToday ? 'Click again to undo today\\'s check-in' : 'Check in for today';""",
  """mc.title = doneToday ? 'Klik lagi untuk membatalkan check-in hari ini' : 'Check-in untuk hari ini';""",
  """mc.title = doneToday ? 'Toca de nuevo para deshacer el check-in de hoy' : 'Check-in para hoy';""",
  """mc.title = doneToday ? 'Toque novamente para desfazer o check-in de hoje' : 'Check-in para hoje';""",
  """mc.title = doneToday ? 'Chạm lại để hoàn tác check-in hôm nay' : 'Check-in cho hôm nay';""")
r("mc.setAttribute('aria-label', 'Check in ' + s.name + ' for today');",
  "mc.setAttribute('aria-label', 'Check in ' + s.name + ' untuk hari ini');",
  "mc.setAttribute('aria-label', 'Check in ' + s.name + ' para hoy');",
  "mc.setAttribute('aria-label', 'Check in ' + s.name + ' para hoje');",
  "mc.setAttribute('aria-label', 'Check in ' + s.name + ' cho hôm nay');")

# ── export / import ──
r("toast('Backup downloaded.');", "toast('Cadangan terunduh.');", "toast('Copia descargada.');",
  "toast('Backup baixado.');", "toast('Đã tải bản sao lưu.');")
r("""      toast('Imported ' + (added + updated) + ' streak' + (added + updated === 1 ? '' : 's') +
        (updated ? ' (' + updated + ' updated)' : '') + '.');""",
  """      toast('Impor ' + (added + updated) + ' streak' +
        (updated ? ' (' + updated + ' diperbarui)' : '') + '.');""",
  """      toast('Importadas ' + (added + updated) + ' rachas' +
        (updated ? ' (' + updated + ' actualizadas)' : '') + '.');""",
  """      toast('Importadas ' + (added + updated) + ' sequências' +
        (updated ? ' (' + updated + ' atualizadas)' : '') + '.');""",
  """      toast('Đã nhập ' + (added + updated) + ' chuỗi' +
        (updated ? ' (' + updated + ' đã cập nhật)' : '') + '.');""")
r("""toast('That file doesn\\'t look like a streaks backup.');""",
  """toast('File itu sepertinya bukan cadangan streak.');""",
  """toast('Ese archivo no parece una copia de rachas.');""",
  """toast('Esse arquivo não parece um backup de sequências.');""",
  """toast('File đó có vẻ không phải bản sao lưu chuỗi.');""")

# ── presets + demo data ──
r("""var PRESETS = [
  { name: 'Morning workout', icon: '🏃', color: '#DE4B3A', mode: 'checkin' },
  { name: 'Study every day', icon: '📚', color: '#4A90D9', mode: 'checkin' },
  { name: 'No sugar', icon: '🍎', color: '#7FA653', mode: 'checkin' },
  { name: 'Days since I quit smoking', icon: '🚭', color: '#E0A458', mode: 'countup' }
];""",
  """var PRESETS = [
  { name: 'Olahraga pagi', icon: '🏃', color: '#DE4B3A', mode: 'checkin' },
  { name: 'Belajar tiap hari', icon: '📚', color: '#4A90D9', mode: 'checkin' },
  { name: 'Tanpa gula', icon: '🍎', color: '#7FA653', mode: 'checkin' },
  { name: 'Hari sejak berhenti merokok', icon: '🚭', color: '#E0A458', mode: 'countup' }
];""",
  """var PRESETS = [
  { name: 'Ejercicio por la mañana', icon: '🏃', color: '#DE4B3A', mode: 'checkin' },
  { name: 'Estudiar cada día', icon: '📚', color: '#4A90D9', mode: 'checkin' },
  { name: 'Sin azúcar', icon: '🍎', color: '#7FA653', mode: 'checkin' },
  { name: 'Días desde que dejé de fumar', icon: '🚭', color: '#E0A458', mode: 'countup' }
];""",
  """var PRESETS = [
  { name: 'Treino de manhã', icon: '🏃', color: '#DE4B3A', mode: 'checkin' },
  { name: 'Estudar todo dia', icon: '📚', color: '#4A90D9', mode: 'checkin' },
  { name: 'Sem açúcar', icon: '🍎', color: '#7FA653', mode: 'checkin' },
  { name: 'Dias desde que parei de fumar', icon: '🚭', color: '#E0A458', mode: 'countup' }
];""",
  """var PRESETS = [
  { name: 'Tập buổi sáng', icon: '🏃', color: '#DE4B3A', mode: 'checkin' },
  { name: 'Học mỗi ngày', icon: '📚', color: '#4A90D9', mode: 'checkin' },
  { name: 'Không đường', icon: '🍎', color: '#7FA653', mode: 'checkin' },
  { name: 'Số ngày bỏ thuốc', icon: '🚭', color: '#E0A458', mode: 'countup' }
];""")
r("demo.textContent = '✨ Load 3 example streaks';", "demo.textContent = '✨ Muat 3 contoh streak';",
  "demo.textContent = '✨ Cargar 3 rachas de ejemplo';", "demo.textContent = '✨ Carregar 3 sequências de exemplo';",
  "demo.textContent = '✨ Tải 3 chuỗi mẫu';")
r("name: 'Morning run',", "name: 'Lari pagi',", "name: 'Correr por la mañana',",
  "name: 'Corrida matinal',", "name: 'Chạy bộ buổi sáng',")
r("name: 'Read 20 pages',", "name: 'Baca 20 halaman',", "name: 'Leer 20 páginas',",
  "name: 'Ler 20 páginas',", "name: 'Đọc 20 trang',")
r("name: 'Days without coffee',", "name: 'Hari tanpa kopi',", "name: 'Días sin café',",
  "name: 'Dias sem café',", "name: 'Số ngày không cà phê',")
r("toast('3 example streaks added — delete them anytime from the list below.');",
  "toast('3 contoh streak ditambahkan — hapus kapan saja dari daftar di bawah.');",
  "toast('3 rachas de ejemplo añadidas — elimínalas cuando quieras desde la lista de abajo.');",
  "toast('3 sequências de exemplo adicionadas — exclua quando quiser na lista abaixo.');",
  "toast('Đã thêm 3 chuỗi mẫu — xóa bất cứ lúc nào từ danh sách bên dưới.');")
print("part5 loaded:", len(R), "rows total")

# ── whole-block replacements: Timers cards (from approved translated pages) + Tools card ──
TIMERS = {
"id": """<section id="other-rhythm" class="tt-cards" aria-label="Timer">
  <h2 class="tt-cards-title">Timer</h2>
  <div class="tt-card-row">
    <a class="tt-card" href="https://www.tomatotimers.com/">
      <img src="/assets/images/tomato-cartoon.svg" alt="Maskot tomat timer fokus Pomodoro" loading="lazy">
      <div class="tt-card-text">
        <h3>Timer Pomodoro</h3>
        <p>Ritme fokus 25 menit klasik dengan istirahat pendek dan panjang — timer utama kami untuk kerja fokus dan sesi belajar.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/52-17/">
      <img src="/assets/images/52-17-card.png" alt="Maskot chick dengan timer sprint dan istirahat 52/17" loading="lazy">
      <div class="tt-card-text">
        <h3>Timer 52/17</h3>
        <p>Kerja fokus 52 menit, lalu istirahat 17 menit untuk benar-benar lepas — ritme orang paling produktif, diukur dari data nyata.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/20-20-20-rule/">
      <img src="/assets/images/1.svg" alt="Maskot chick tomat timer istirahat mata 20-20-20" loading="lazy">
      <div class="tt-card-text">
        <h3>Timer Mata 20-20-20</h3>
        <p>Setiap 20 menit, lihat ke arah 6 meter selama 20 detik — ritme istirahat mata lembut yang melawan kelelahan mata digital.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/flowtime/">
      <img src="/assets/images/flowtime-card.png" alt="Maskot chick bekerja di laptop untuk timer teknik flowtime" loading="lazy">
      <div class="tt-card-text">
        <h3>Timer Teknik Flowtime</h3>
        <p>Kerja selama kamu masih dalam aliran sementara istirahatmu terisi secara real time — dapatkan istirahat yang sebanding dengan kerja yang benar-benar kamu lakukan.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/custom-timer/">
      <img src="/assets/images/custom-timer-card.png" alt="Maskot chick sedang merakit timer kustom" loading="lazy">
      <div class="tt-card-text">
        <h3>Bikin Timer Sendiri</h3>
        <p>Susun, beri nama, dan loop fase-fasemu sendiri — timer yang kamu rakit dari nol untuk belajar, workout, atau interval, tersimpan langsung di browser ini.</p>
      </div>
    </a>
  </div>
</section>""",
"es": """<section id="other-rhythm" class="tt-cards" aria-label="Temporizadores">
  <h2 class="tt-cards-title">Temporizadores</h2>
  <div class="tt-card-row">
    <a class="tt-card" href="https://www.tomatotimers.com/">
      <img src="/assets/images/tomato-cartoon.svg" alt="Mascota de tomate del temporizador Pomodoro" loading="lazy">
      <div class="tt-card-text">
        <h3>Temporizador Pomodoro</h3>
        <p>El clásico ritmo de enfoque de 25 minutos con descansos cortos y largos — nuestro temporizador principal para trabajo profundo y sesiones de estudio.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/52-17/">
      <img src="/assets/images/52-17-card.png" alt="Mascota de pollito con temporizador de sprint y descanso 52/17" loading="lazy">
      <div class="tt-card-text">
        <h3>Temporizador 52/17</h3>
        <p>Trabaja 52 minutos enfocado, luego tómate 17 para desconectar de verdad — el ritmo de trabajo profundo medido a partir de las personas más productivas.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/20-20-20-rule/">
      <img src="/assets/images/1.svg" alt="Mascota de pollito del temporizador de descanso visual 20-20-20" loading="lazy">
      <div class="tt-card-text">
        <h3>Temporizador Visual 20-20-20</h3>
        <p>Cada 20 minutos, mira a 20 pies de distancia durante 20 segundos — un ritmo de descanso visual suave que combate la fatiga visual digital.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/flowtime/">
      <img src="/assets/images/flowtime-card.png" alt="Mascota de pollito trabajando en un portátil para el temporizador flowtime" loading="lazy">
      <div class="tt-card-text">
        <h3>Temporizador de la Técnica Flowtime</h3>
        <p>Trabaja mientras dure tu estado de flujo mientras tu descanso se carga en tiempo real — gana descanso a la medida del trabajo que realmente hiciste.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/custom-timer/">
      <img src="/assets/images/custom-timer-card.png" alt="Mascota de pollito armando un temporizador personalizado" loading="lazy">
      <div class="tt-card-text">
        <h3>Crea Tu Propio Temporizador</h3>
        <p>Apila, nombra y repite tus propias fases — un temporizador que armas desde cero para estudiar, entrenar o hacer intervalos, guardado en este navegador.</p>
      </div>
    </a>
  </div>
</section>""",
"pt": """<section id="other-rhythm" class="tt-cards" aria-label="Timers">
  <h2 class="tt-cards-title">Timers</h2>
  <div class="tt-card-row">
    <a class="tt-card" href="https://www.tomatotimers.com/">
      <img src="/assets/images/tomato-cartoon.svg" alt="Mascote de tomate do timer Pomodoro" loading="lazy">
      <div class="tt-card-text">
        <h3>Timer Pomodoro</h3>
        <p>O clássico ritmo de foco de 25 minutos com pausas curtas e longas — nosso timer principal para trabalho profundo e sessões de estudos.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/52-17/">
      <img src="/assets/images/52-17-card.png" alt="Mascote de pintinho com timer de sprint e descanso 52/17" loading="lazy">
      <div class="tt-card-text">
        <h3>Timer 52/17</h3>
        <p>Trabalhe 52 minutos focado, depois tire 17 para desconectar de verdade — o ritmo de trabalho profundo medido a partir das pessoas mais produtivas.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/20-20-20-rule/">
      <img src="/assets/images/1.svg" alt="Mascote de pintinho do timer de pausa ocular 20-20-20" loading="lazy">
      <div class="tt-card-text">
        <h3>Timer Visual 20-20-20</h3>
        <p>A cada 20 minutos, olhe para 6 metros de distância por 20 segundos — um ritmo de pausa ocular suave que combate a fadiga visual digital.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/flowtime/">
      <img src="/assets/images/flowtime-card.png" alt="Mascote de pintinho trabalhando no notebook para o timer flowtime" loading="lazy">
      <div class="tt-card-text">
        <h3>Timer da Técnica Flowtime</h3>
        <p>Trabalhe enquanto estiver no fluxo enquanto sua pausa carrega em tempo real — ganhe descanso no tamanho do trabalho que você realmente fez.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/custom-timer/">
      <img src="/assets/images/custom-timer-card.png" alt="Mascote de pintinho montando um timer personalizado" loading="lazy">
      <div class="tt-card-text">
        <h3>Crie Seu Próprio Timer</h3>
        <p>Empilhe, nomeie e repita suas próprias fases — um timer que você monta do zero para estudos, treinos ou intervalos, salvo neste navegador.</p>
      </div>
    </a>
  </div>
</section>""",
"vi": """<section id="other-rhythm" class="tt-cards" aria-label="Hẹn Giờ">
  <h2 class="tt-cards-title">Hẹn Giờ</h2>
  <div class="tt-card-row">
    <a class="tt-card" href="https://www.tomatotimers.com/">
      <img src="/assets/images/tomato-cartoon.svg" alt="Linh vật cà chua của hẹn giờ Pomodoro" loading="lazy">
      <div class="tt-card-text">
        <h3>Hẹn Giờ Pomodoro</h3>
        <p>Nhịp tập trung 25 phút kinh điển với giờ nghỉ ngắn và dài — hẹn giờ chính của chúng tôi cho làm việc sâu và học tập.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/52-17/">
      <img src="/assets/images/52-17-card.png" alt="Linh vật gà con với hẹn giờ sprint và nghỉ 52/17" loading="lazy">
      <div class="tt-card-text">
        <h3>Hẹn Giờ 52/17</h3>
        <p>Làm việc tập trung 52 phút, sau đó nghỉ 17 phút để thật sự thư giãn — nhịp làm việc sâu được đo từ những người hiệu quả nhất.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/20-20-20-rule/">
      <img src="/assets/images/1.svg" alt="Linh vật gà con cà chua của hẹn giờ nghỉ mắt 20-20-20" loading="lazy">
      <div class="tt-card-text">
        <h3>Hẹn Giờ Mắt 20-20-20</h3>
        <p>Mỗi 20 phút, nhìn ra xa 6 mét trong 20 giây — nhịp nghỉ mắt nhẹ nhàng chống mỏi mắt do màn hình.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/flowtime/">
      <img src="/assets/images/flowtime-card.png" alt="Linh vật gà con làm việc với laptop cho hẹn giờ flowtime" loading="lazy">
      <div class="tt-card-text">
        <h3>Hẹn Giờ Kỹ Thuật Flowtime</h3>
        <p>Làm việc miễn còn hưng phấn trong khi phần nghỉ nạp dần theo thời gian thực — nhận thời gian nghỉ tương xứng với công việc bạn thật sự làm.</p>
      </div>
    </a>
    <a class="tt-card" href="https://www.tomatotimers.com/custom-timer/">
      <img src="/assets/images/custom-timer-card.png" alt="Linh vật gà con đang tạo hẹn giờ tùy chỉnh" loading="lazy">
      <div class="tt-card-text">
        <h3>Tự Tạo Hẹn Giờ</h3>
        <p>Xếp chồng, đặt tên và lặp các giai đoạn của riêng bạn — hẹn giờ tự lắp từ đầu cho học tập, tập luyện hoặc interval, lưu ngay trong trình duyệt này.</p>
      </div>
    </a>
  </div>
</section>""",
}

TOOLS_HEAD = {"id": "Alat", "es": "Herramientas", "pt": "Ferramentas", "vi": "Công Cụ"}
TOOLS_ALT = {
  "id": "Maskot chick alat hitung mundur deadline Days Until",
  "es": "Mascota de pollito de la herramienta de cuenta regresiva Days Until",
  "pt": "Mascote de pintinho da ferramenta de contagem regressiva Days Until",
  "vi": "Linh vật gà con của công cụ đếm ngược Days Until",
}
TOOLS_BLURB = {
  "id": "Hitung mundur live ke deadline yang penting — ujian, launching, liburan — dengan ikon, warna, dan pin yang ikut tampil di halaman timermu.",
  "es": "Cuenta regresiva en vivo hacia los plazos que importan — exámenes, lanzamientos, vacaciones — con iconos, colores y un pin que te acompaña en tus páginas de temporizador.",
  "pt": "Contagem regressiva ao vivo para os prazos que importam — provas, lançamentos, feriados — com ícones, cores e um pin que acompanha você nas páginas de timer.",
  "vi": "Đếm ngược trực tiếp tới những deadline quan trọng — thi cử, ra mắt, kỳ nghỉ — với biểu tượng, màu sắc và một ghim đồng hành trên các trang hẹn giờ của bạn.",
}
def tools_section(lang):
    return """<section id="tools" class="tt-cards" aria-label="%s">
  <h2 class="tt-cards-title">%s</h2>
  <div class="tt-card-row">
    <a class="tt-card" href="https://www.tomatotimers.com/%s/days-until/">
      <img src="/assets/images/days-until-card.png" alt="%s" loading="lazy">
      <div class="tt-card-text">
        <h3>Days Until</h3>
        <p>%s</p>
      </div>
    </a>
  </div>
</section>""" % (TOOLS_HEAD[lang], TOOLS_HEAD[lang], lang, TOOLS_ALT[lang], TOOLS_BLURB[lang])

# ── runner ──
NAME = {"id": "Bahasa Indonesia", "es": "Español", "pt": "Português", "vi": "Tiếng Việt"}
REDIRECT = """<script>
(function(){try{var l=localStorage.getItem('tt_lang');if(!l||l==='en')return;var p=location.pathname;if(/^\\/(id|es|pt|vi)(\\/|$)/.test(p))return;location.replace('/'+l+(p==='/'?'/':p));}catch(e){}})();
</script>
"""

def build(lang):
    h = io.open(SRC, encoding="utf-8").read()
    assert REDIRECT in h, "redirect block not found in EN master"
    h = h.replace(REDIRECT, "", 1)  # translated pages never redirect
    # whole-section swaps (before row pass so row keys stay unique to non-section spots)
    h2, n1 = re.subn(r'<section id="other-rhythm"[\s\S]*?</section>', TIMERS[lang].replace("\\", "\\\\"), h, count=1)
    assert n1 == 1, "timers section not found"
    h = h2
    h2, n2 = re.subn(r'<section id="tools"[\s\S]*?</section>', tools_section(lang).replace("\\", "\\\\"), h, count=1)
    assert n2 == 1, "tools section not found"
    h = h2
    # lang dropdown: move `selected`
    a = '<option value="/streaks/" selected>English</option>'
    b = '<option value="/%s/streaks/">%s</option>' % (lang, NAME[lang])
    assert a in h and b in h, "dropdown options not found"
    h = h.replace(a, '<option value="/streaks/">English</option>', 1)
    h = h.replace(b, '<option value="/%s/streaks/" selected>%s</option>' % (lang, NAME[lang]), 1)
    # row pass, longest-first so no partial collisions
    misses = []
    for en, tr, cnt in sorted(R, key=lambda x: -len(x[0])):
        n = h.count(en)
        if n != cnt:
            misses.append((en[:70], n, cnt))
            continue
        h = h.replace(en, tr[lang])
    if misses:
        print("!! %s MISSES:" % lang)
        for m in misses:
            print("   want=%d got=%d  %r" % (m[2], m[1], m[0]))
        sys.exit(1)
    outdir = BASE + "\\" + lang + "\\streaks"
    import os
    os.makedirs(outdir, exist_ok=True)
    io.open(outdir + "\\index.html", "w", encoding="utf-8", newline="\n").write(h)
    print("%s: %d rows applied -> %s" % (lang, len(R), outdir))

for L in LANGS:
    build(L)
print("DONE")
