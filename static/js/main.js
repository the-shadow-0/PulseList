async function api(path, options = {}) {
    let url = path;
    if (options.query) {
        const qs = new URLSearchParams(options.query).toString();
        url += qs ? `?${qs}` : '';
    }
    const res = await fetch(url, {
        method: options.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: options.body ? JSON.stringify(options.body) : null
    });
    if (!res.ok) throw new Error(await res.text());
    return res.status === 204 ? null : await res.json();
}

function renderTask(t) {
    const li = document.createElement('li');
    li.className = 'list-group-item' + (t.completed ? ' completed' : '');

    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.checked = t.completed;
    cb.addEventListener('change', async () => { await api(`/api/tasks/${t.id}`, { method: 'PUT', body: { completed: cb.checked } }); loadTasks(); });

    const div = document.createElement('div'); div.className = 'task-details';
    const titleElem = document.createElement('strong'); titleElem.contentEditable = true; titleElem.textContent = t.title;
    titleElem.addEventListener('blur', async () => { const nt = titleElem.textContent.trim(); if (nt && nt !== t.title) { await api(`/api/tasks/${t.id}`, { method: 'PUT', body: { title: nt } }); loadTasks(); } });
    const meta = document.createElement('div'); meta.className = 'task-meta'; meta.textContent = `${t.description || ''} | Due: ${t.due_date ? t.due_date.split('T')[0] : '—'} | Priority: ${t.priority}`;

    const del = document.createElement('button'); del.className = 'btn btn-sm btn-outline-danger'; del.textContent = '✕';
    del.addEventListener('click', async () => { await api(`/api/tasks/${t.id}`, { method: 'DELETE' }); loadTasks(); });

    li.append(cb, div);
    div.append(titleElem, meta);
    li.append(del);
    document.getElementById('tasks').appendChild(li);
}

async function loadTasks() {
    const query = { status: document.getElementById('filter-status').value, priority: document.getElementById('filter-priority').value };
    const filterText = document.getElementById('search').value.toLowerCase();
    const tasks = await api('/api/tasks', { query });
    const list = document.getElementById('tasks'); list.innerHTML = '';
    tasks.filter(t => t.title.toLowerCase().includes(filterText)).forEach(renderTask);
}

window.addEventListener('DOMContentLoaded', () => {
    ['search', 'filter-status', 'filter-priority'].forEach(id => document.getElementById(id).addEventListener('input', loadTasks));
    document.getElementById('add-btn').addEventListener('click', async () => {
        const title = document.getElementById('new-title').value.trim(); if (!title) return alert('Title required');
        const body = { title, description: document.getElementById('new-description').value, due_date: document.getElementById('new-due').value, priority: document.getElementById('new-priority').value };
        await api('/api/tasks', { method: 'POST', body });
        ['new-title', 'new-description', 'new-due'].forEach(id => document.getElementById(id).value = '');
        loadTasks();
    });
    document.getElementById('clear-completed').addEventListener('click', async () => { const ts = await api('/api/tasks'); await Promise.all(ts.filter(t => t.completed).map(t => api(`/api/tasks/${t.id}`, { method: 'DELETE' }))); loadTasks(); });
    loadTasks();
});