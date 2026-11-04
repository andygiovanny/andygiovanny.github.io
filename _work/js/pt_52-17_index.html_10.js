
// ============================================================
// Task Manager v1 (52/17 edition) — card to-do list wired into the
// eye-timer engine. Same storage key as the main page ('tt_tasks_v1'),
// so the list follows the user across both pages. Drain: each completed
// WORK second on the active task reduces its estimate; breaks/snoozes
// never drain. Pause stops the drain; play resumes it.
// ============================================================
(function TaskManager() {
    'use strict';

    var STORE_KEY = 'tt_tasks_v1';

    // ---------- state ----------
    var state = { tasks: [], activeId: null };
    var zeroPromptFor = null;   // task id currently showing the "estimate hit 0" prompt
    var undoBuffer = null;      // { task, index, wasActive }
    var undoTimer = null;

    function load() {
        try {
            var raw = localStorage.getItem(STORE_KEY);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.tasks)) {
                    state.tasks = parsed.tasks;
                    state.activeId = parsed.activeId || null;
                }
            }
        } catch (e) {}
    }
    function save() {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(state));
        } catch (e) {}
    }

    function uid() {
        return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // ---------- time parsing / formatting ----------
    // Accepts: "90" (minutes), "45m", "1h", "1h 30m", "1:30", "1.5h"
    function parseTime(str) {
        if (!str) return null;
        str = String(str).trim().toLowerCase();
        if (!str) return null;
        var m;
        m = str.match(/^(\d+)\s*:\s*(\d{1,2})$/);            // h:mm
        if (m) return (parseInt(m[1], 10) * 60 + parseInt(m[2], 10)) * 60000;
        var hours = 0, mins = 0, matched = false;
        m = str.match(/([\d.]+)\s*h/);
        if (m) { hours = parseFloat(m[1]); matched = true; }
        m = str.match(/(\d+)\s*m(?:in)?/);
        if (m) { mins = parseInt(m[1], 10); matched = true; }
        if (matched) return Math.round((hours * 60 + mins) * 60000);
        m = str.match(/^(\d+)$/);                             // bare number = minutes
        if (m) return parseInt(m[1], 10) * 60000;
        return null;
    }
    function fmtMs(ms) {
        var totalMin = Math.max(1, Math.ceil(ms / 60000));
        var h = Math.floor(totalMin / 60), m = totalMin % 60;
        if (h && m) return h + 'h ' + (m < 10 ? '0' + m : m) + 'm';
        if (h) return h + 'h';
        return m + 'm';
    }

    function getTask(id) {
        for (var i = 0; i < state.tasks.length; i++) {
            if (state.tasks[i].id === id) return state.tasks[i];
        }
        return null;
    }

    // ---------- DOM ----------
    var cardsEl, doneWrapEl, doneCardsEl, doneCountEl, activeLineEl;

    function render() {
        var queued = state.tasks.filter(function (t) { return !t.done; });
        var done = state.tasks.filter(function (t) { return t.done; });

        cardsEl.innerHTML = '';
        if (!queued.length && !done.length) {
            cardsEl.innerHTML = '<div style="color:rgba(140,90,62,0.55);font-size:0.88rem;padding:14px 4px;">No tasks yet — add one above. Your list is saved on this device until you clear it.</div>';
        }
        queued.forEach(function (t) { cardsEl.appendChild(renderCard(t)); });

        doneWrapEl.classList.toggle('d-none', !done.length);
        doneCountEl.textContent = done.length ? '(' + done.length + ')' : '';
        doneCardsEl.innerHTML = '';
        done.forEach(function (t) { doneCardsEl.appendChild(renderCard(t)); });

        renderActiveLine();
    }

    function renderCard(task) {
        var isActive = task.id === state.activeId && !task.done;
        var card = document.createElement('div');
        card.className = 'tm-card' + (isActive ? ' tm-active' : '') + (task.done ? ' tm-done' : '');
        if (task.color && !isActive && !task.done) card.style.borderLeftColor = task.color;
        card.dataset.id = task.id;

        // Clickable color edge: cycles the palette, works after creation too
        var edge = document.createElement('div');
        edge.className = 'tm-color-edge';
        edge.title = 'Clique para mudar a cor';
        edge.addEventListener('click', function (e) {
            e.stopPropagation();
            var PALETTE = [null, '#DE4B3A', '#FFA900', '#5FA46A', '#4A90D9', '#9B59B6'];
            var i = PALETTE.indexOf(task.color || null);
            task.color = PALETTE[(i + 1) % PALETTE.length];
            save();
            if (!isActive && !task.done) {
                card.style.borderLeftColor = task.color || '#E8D5C0';
            }
        });
        card.appendChild(edge);
        if (!task.done) card.draggable = true;

        // --- top row ---
        var top = document.createElement('div');
        top.className = 'tm-card-top';

        var title = document.createElement('span');
        title.className = 'tm-title';
        title.textContent = task.title;
        title.title = 'Clique para editar';
        title.addEventListener('click', function () { editTitle(card, task); });

        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'tm-est-chip' + (task.estMs ? '' : ' tm-est-empty');
        chip.textContent = task.estMs ? fmtMs(task.estMs) + ' left' : '+ est';
        chip.title = 'Clique para editar a estimativa';
        chip.addEventListener('click', function () { editEstimate(card, task); });

        top.appendChild(title);
        if (!task.done) top.appendChild(chip);  // estimates are irrelevant once done

        if (!task.done) {
            var startBtn = document.createElement('button');
            startBtn.type = 'button';
            startBtn.className = 'tm-start-btn' + (isActive ? ' tm-focusing' : '');
            startBtn.textContent = isActive ? '● Focusing' : '▶ Start';
            startBtn.addEventListener('click', function () { startTask(task.id); });
            top.appendChild(startBtn);
        } else {
            var restoreBtn = document.createElement('button');
            restoreBtn.type = 'button';
            restoreBtn.className = 'tm-icon-btn';
            restoreBtn.textContent = '↩';
            restoreBtn.title = 'Voltar para a lista';
            restoreBtn.addEventListener('click', function () {
                task.done = false;
                save(); render();
            });
            top.appendChild(restoreBtn);
        }

        var doneBtn = document.createElement('button');
        doneBtn.type = 'button';
        doneBtn.className = 'tm-icon-btn';
        doneBtn.textContent = task.done ? '☑' : '☐';
        doneBtn.title = task.done ? 'Marcar como não concluída' : 'Marcar como concluída';
        doneBtn.addEventListener('click', function () { toggleDone(task.id); });

        var delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'tm-icon-btn';
        delBtn.textContent = '🗑';
        delBtn.title = 'Delete';
        delBtn.addEventListener('click', function () { deleteTask(task.id); });

        top.appendChild(doneBtn);
        top.appendChild(delBtn);
        card.appendChild(top);

        // --- detail (notes + subtasks) ---
        var hasDetail = (task.notes && task.notes.trim()) || (task.subs && task.subs.length);
        var detail = document.createElement('div');
        detail.className = 'tm-card-detail';
        detail.style.display = hasDetail ? 'block' : 'none';
        buildDetail(detail, task);
        card.appendChild(detail);

        var toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'tm-detail-toggle';
        toggle.textContent = hasDetail ? '▾ notes / subtasks' : '▸ notes / subtasks';
        toggle.addEventListener('click', function () {
            var open = detail.style.display !== 'none';
            detail.style.display = open ? 'none' : 'block';
            toggle.textContent = open ? '▸ notes / subtasks' : '▾ notes / subtasks';
        });
        card.appendChild(toggle);

        // --- drag to reorder (queued cards only) ---
        if (!task.done) {
            card.addEventListener('dragstart', function (e) {
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', task.id);
            });
            card.addEventListener('dragend', function () {
                card.classList.remove('dragging');
                cardsEl.querySelectorAll('.tm-card').forEach(function (c) { c.classList.remove('dragover'); });
                commitDomOrder();
            });
            card.addEventListener('dragover', function (e) {
                e.preventDefault();
                var dragging = cardsEl.querySelector('.tm-card.dragging');
                if (!dragging || dragging === card) return;
                var rect = card.getBoundingClientRect();
                var before = (e.clientY - rect.top) < rect.height / 2;
                cardsEl.insertBefore(dragging, before ? card : card.nextSibling);
            });
            card.addEventListener('drop', function (e) { e.preventDefault(); });
        }

        return card;
    }

    function buildDetail(container, task) {
        container.innerHTML = '';

        var notes = document.createElement('textarea');
        notes.className = 'tm-notes';
        notes.rows = 4;
        notes.placeholder = 'Notes…';
        notes.value = task.notes || '';
        notes.addEventListener('input', function () {
            task.notes = notes.value;
            save();
        });
        container.appendChild(notes);

        var ul = document.createElement('ul');
        ul.className = 'tm-subtasks';
        (task.subs || []).forEach(function (sub) {
            ul.appendChild(renderSubtask(task, sub));
        });
        container.appendChild(ul);

        var addRow = document.createElement('div');
        addRow.className = 'tm-sub-add';
        var input = document.createElement('input');
        input.className = 'tm-input';
        input.placeholder = 'Adicionar subtarefa…';
        input.maxLength = 80;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tm-icon-btn';
        btn.textContent = '＋';
        btn.title = 'Adicionar subtarefa';
        function addSub() {
            var v = input.value.trim();
            if (!v) return;
            task.subs = task.subs || [];
            task.subs.push({ id: uid(), text: v, done: false });
            save();
            input.value = '';
            buildDetail(container, task);
            // Keep focus in the fresh subtask input for rapid entry
            var newInput = container.querySelector('.tm-sub-add input');
            if (newInput) newInput.focus();
        }
        btn.addEventListener('click', addSub);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); addSub(); }
        });
        addRow.appendChild(input);
        addRow.appendChild(btn);
        container.appendChild(addRow);
    }

    function renderSubtask(task, sub) {
        var li = document.createElement('li');
        li.className = 'tm-subtask' + (sub.done ? ' tm-sub-done' : '');

        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !!sub.done;
        cb.addEventListener('change', function () {
            sub.done = cb.checked;
            li.classList.toggle('tm-sub-done', sub.done);
            save();
        });

        var text = document.createElement('span');
        text.className = 'tm-sub-text';
        text.textContent = sub.text;

        var del = document.createElement('button');
        del.type = 'button';
        del.className = 'tm-icon-btn';
        del.textContent = '✕';
        del.title = 'Excluir subtarefa';
        del.addEventListener('click', function () {
            task.subs = task.subs.filter(function (s) { return s.id !== sub.id; });
            save();
            li.remove();
        });

        li.appendChild(cb);
        li.appendChild(text);
        li.appendChild(del);
        return li;
    }

    // ---------- inline editing ----------
    function editTitle(card, task) {
        var titleEl = card.querySelector('.tm-title');
        if (!titleEl) return;
        var input = document.createElement('input');
        input.className = 'tm-title-input';
        input.value = task.title;
        input.maxLength = 120;
        titleEl.replaceWith(input);
        input.focus();
        input.select();
        var committed = false;
        function commit(saveIt) {
            if (committed) return;
            committed = true;
            var v = input.value.trim();
            if (saveIt && v) { task.title = v; save(); }
            render();
        }
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); commit(true); }
            else if (e.key === 'Escape') { commit(false); }
        });
        input.addEventListener('blur', function () { commit(true); });
    }

    function editEstimate(card, task) {
        var chip = card.querySelector('.tm-est-chip');
        if (!chip) return;
        var input = document.createElement('input');
        input.className = 'tm-est-input';
        input.value = task.estMs ? fmtMs(task.estMs) : '';
        input.placeholder = '45m';
        chip.replaceWith(input);
        input.focus();
        input.select();
        var committed = false;
        function commit(saveIt) {
            if (committed) return;
            committed = true;
            if (saveIt) {
                var v = input.value.trim();
                if (!v) { task.estMs = null; }
                else {
                    var ms = parseTime(v);
                    if (ms && ms > 0) task.estMs = ms;
                }
                task._zeroPrompted = false;
                save();
            }
            render();
        }
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); commit(true); }
            else if (e.key === 'Escape') { commit(false); }
        });
        input.addEventListener('blur', function () { commit(true); });
    }

    // ---------- actions ----------
    function addTask(title, estMs, color) {
        state.tasks.push({
            id: uid(),
            title: title,
            notes: '',
            subs: [],
            estMs: estMs || null,
            color: color || null,
            done: false,
            created: Date.now()
        });
        save(); render();
    }

    function toggleDone(id) {
        var t = getTask(id);
        if (!t) return;
        t.done = !t.done;
        if (t.done && state.activeId === id) {
            state.activeId = null;   // drain stops; timer itself keeps running
        }
        if (!t.done) t._zeroPrompted = false;
        if (zeroPromptFor === id) { zeroPromptFor = null; hideZeroOverlay(); }
        save(); render();
    }

    function deleteTask(id) {
        var idx = state.tasks.findIndex(function (t) { return t.id === id; });
        if (idx === -1) return;
        var task = state.tasks[idx];
        var wasActive = state.activeId === id;
        state.tasks.splice(idx, 1);
        if (wasActive) state.activeId = null;
        if (zeroPromptFor === id) { zeroPromptFor = null; hideZeroOverlay(); }
        save(); render();

        undoBuffer = { task: task, index: idx, wasActive: wasActive };
        showToast('Tarefa excluída', 'Undo', function () {
            if (!undoBuffer) return;
            var at = Math.min(undoBuffer.index, state.tasks.length);
            state.tasks.splice(at, 0, undoBuffer.task);
            if (undoBuffer.wasActive) state.activeId = undoBuffer.task.id;
            undoBuffer = null;
            save(); render();
        });
    }

    function startTask(id) {
        var t = getTask(id);
        if (!t || t.done) return;
        state.activeId = id;
        zeroPromptFor = null;
        save(); render();
        // Begin (or resume) a 20-minute work session for this task.
        if (typeof window.startWork === 'function') window.startWork();
    }

    // ---------- estimate-hit-zero overlay (over the countdown) ----------
    var zeroOverlayEl, zeroTextEl, zeroInputEl;

    function showZeroOverlay(task) {
        zeroTextEl.textContent = '⏱ Estimativa atingida para "' + task.title + '". O timer está pausado — adicione mais tempo ou marque a tarefa como concluída.';
        zeroInputEl.value = '';
        zeroOverlayEl.classList.remove('d-none');
        setTimeout(function () { zeroInputEl.focus(); }, 50);
    }
    function hideZeroOverlay() {
        if (zeroOverlayEl) zeroOverlayEl.classList.add('d-none');
    }

    function wireZeroOverlay() {
        zeroOverlayEl = document.getElementById('tm_zero_overlay');
        zeroTextEl = document.getElementById('tm_zero_text');
        zeroInputEl = document.getElementById('tm_zero_input');
        if (!zeroOverlayEl) return;

        document.getElementById('tm_zero_add').addEventListener('click', function () {
            var task = zeroPromptFor ? getTask(zeroPromptFor) : null;
            if (!task) { hideZeroOverlay(); return; }
            var ms = parseTime(zeroInputEl.value);
            if (!ms || ms <= 0) { zeroInputEl.focus(); zeroInputEl.style.borderColor = '#DE4B3A'; return; }
            task.estMs = ms;
            task._zeroPrompted = false;
            zeroPromptFor = null;
            hideZeroOverlay();
            save(); render();
            resumeIfPaused();
        });

        document.getElementById('tm_zero_done').addEventListener('click', function () {
            var task = zeroPromptFor ? getTask(zeroPromptFor) : null;
            if (task) task.done = true;
            state.activeId = null;
            zeroPromptFor = null;
            hideZeroOverlay();
            save(); render();
            // Timer stays paused (it was stopped at estimate-zero) so the user
            // can readjust before pressing play again.
        });

        zeroInputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); document.getElementById('tm_zero_add').click(); }
        });
    }

    function resumeIfPaused() {
        // The work timer was paused at estimate-zero; continue the session.
        if (window.mode === 'work' && (window.left || 0) > 0 && !window.timer && typeof window.runTimer === 'function') {
            window.runTimer();
        }
    }

    // ---------- active-task line under the timer ----------
    function renderActiveLine() {
        var t = state.activeId ? getTask(state.activeId) : null;
        if (!t || t.done) {
            activeLineEl.innerHTML = '';
            return;
        }
        var html = 'Working on: <strong>' + esc(t.title) + '</strong>';
        if (t.estMs) html += ' — <span class="tm-est-left">' + fmtMs(t.estMs) + ' left</span>';
        activeLineEl.innerHTML = html;
    }

    // ---------- drain: rides the page engine's own 1-second ticks ----------
    // tick() only fires while the countdown interval is alive, so pause
    // automatically stops the drain and play resumes it.
    function tmTick() {
        var t = state.activeId ? getTask(state.activeId) : null;
        if (!t || t.done || !t.estMs) return;
        if (window.mode !== 'work') return;   // breaks/snoozes never drain

        t.estMs = Math.max(0, t.estMs - 1000);

        // light-touch UI update without full re-render
        var chip = cardsEl.querySelector('.tm-card[data-id="' + t.id + '"] .tm-est-chip');
        if (chip) chip.textContent = fmtMs(t.estMs) + ' left';
        renderActiveLine();

        if (t.estMs <= 0 && !t._zeroPrompted) {
            t._zeroPrompted = true;
            zeroPromptFor = t.id;
            save();
            // Pause the work session so the user can decide. If the 20
            // minutes also completed this same tick (window already open),
            // there is nothing to pause — just show the overlay.
            if (window.mode === 'work' && (window.left || 0) > 0 && typeof window.stopTimer === 'function') {
                window.stopTimer();
            }
            render();
            showZeroOverlay(t);
            return;
        }
        // persist roughly every 15s of drain, not every second
        if (Math.round(t.estMs / 1000) % 15 === 0) save();
    }

    // Wrap the engine's global tick(). runTimer() resolves the name at
    // call time (setInterval(tick, 1000)), so the wrap takes effect
    // everywhere, including sessions started after this script ran.
    if (typeof window.tick === 'function') {
        var _origTick = window.tick;
        window.tick = function () {
            _origTick();
            tmTick();
        };
    }

    // ---------- toast (undo) ----------
    var toastEl = null;
    function showToast(msg, actionLabel, actionFn) {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'tm-toast';
            document.body.appendChild(toastEl);
        }
        toastEl.innerHTML = '<span>' + esc(msg) + '</span>';
        if (actionLabel && actionFn) {
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = actionLabel;
            b.addEventListener('click', function () {
                actionFn();
                hideToast();
            });
            toastEl.appendChild(b);
        }
        toastEl.classList.add('show');
        clearTimeout(undoTimer);
        undoTimer = setTimeout(function () {
            hideToast();
            undoBuffer = null;
        }, 6000);
    }
    function hideToast() {
        if (toastEl) toastEl.classList.remove('show');
    }

    // ---------- drag order commit ----------
    function commitDomOrder() {
        var ids = Array.prototype.map.call(
            cardsEl.querySelectorAll('.tm-card'),
            function (c) { return c.dataset.id; }
        );
        if (!ids.length) return;
        var queued = [], done = [];
        state.tasks.forEach(function (t) { (t.done ? done : queued).push(t); });
        queued.sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); });
        state.tasks = queued.concat(done);
        save(); render();
    }

    // ---------- wire up ----------
    function init() {
        cardsEl = document.getElementById('tm_cards');
        doneWrapEl = document.getElementById('tm_done_wrap');
        doneCardsEl = document.getElementById('tm_done_cards');
        doneCountEl = document.getElementById('tm_done_count');
        activeLineEl = document.getElementById('tm_active_line');
        if (!cardsEl) return;

        load();
        wireZeroOverlay();
        render();

        var form = document.getElementById('tm_add_form');
        var titleInput = document.getElementById('tm_add_title');
        var estInput = document.getElementById('tm_add_estimate');

        // Color picker: selected swatch colors the next task's left edge.
        var selectedColor = null;
        var picker = document.getElementById('tm_color_picker');
        picker.addEventListener('click', function (e) {
            var sw = e.target.closest('.tm-swatch');
            if (!sw) return;
            selectedColor = sw.getAttribute('data-color') || null;
            picker.querySelectorAll('.tm-swatch').forEach(function (s) {
                s.classList.toggle('tm-swatch-selected', s === sw);
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var title = titleInput.value.trim();
            if (!title) { titleInput.focus(); return; }
            var est = parseTime(estInput.value);
            addTask(title, est, selectedColor);
            titleInput.value = '';
            estInput.value = '';
            titleInput.focus();
        });

        document.getElementById('tm_clear_done').addEventListener('click', function () {
            var had = state.tasks.some(function (t) { return t.done; });
            if (!had) return;
            state.tasks = state.tasks.filter(function (t) { return !t.done; });
            save(); render();
        });

        // Two-step reset: first click arms, second confirms.
        var resetBtn = document.getElementById('tm_reset');
        var armed = false, armTimer = null;
        resetBtn.addEventListener('click', function () {
            if (!armed) {
                armed = true;
                resetBtn.textContent = 'Clique de novo para confirmar a redefinição';
                resetBtn.style.color = '#DE4B3A';
                armTimer = setTimeout(function () {
                    armed = false;
                    resetBtn.textContent = 'Redefinir lista';
                    resetBtn.style.color = '';
                }, 3000);
                return;
            }
            clearTimeout(armTimer);
            armed = false;
            resetBtn.textContent = 'Redefinir lista';
            resetBtn.style.color = '';
            state.tasks = [];
            state.activeId = null;
            zeroPromptFor = null;
            hideZeroOverlay();
            save(); render();
            showToast('Lista apagada', null, null);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
