/* ─── ADMIN DASHBOARD LOGIC ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    // Auth Guard
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    initSidebar();
    loadMessages();
    initProjectMgt(); // New
    updateStats();

    // Listen for storage changes (e.g. when visitor sends a message in another tab)
    window.addEventListener('storage', (e) => {
        // If e.key is null, it's our custom dispatch from script.js
        if (!e.key || e.key === 'messages' || e.key === 'visitorCount') {
            loadMessages();
            updateStats();
        }
    });
});

function initSidebar() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const text = link.textContent.trim().toLowerCase();
            if (text === 'back to site') return;

            e.preventDefault();

            // Update UI
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Switch view
            switchView(text);
        });
    });
}

function switchView(viewName) {
    // Update Views
    const views = document.querySelectorAll('.view');
    views.forEach(v => v.classList.remove('section-active'));

    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('section-active');
    }

    // Update Sidebar active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        if (text === viewName) {
            link.classList.add('active');
        } else if (text !== 'back to site') {
            link.classList.remove('active');
        }
    });
}

function loadMessages() {
    const dashboardTbody = document.querySelector('#dashboard-view tbody');
    const fullTbody = document.querySelector('#full-messages-table tbody');
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');

    if (messages.length === 0) {
        const noMsg = '<tr><td colspan="5" style="text-align: center; color: #8888aa; padding: 40px;">No messages yet.</td></tr>';
        if (dashboardTbody) dashboardTbody.innerHTML = noMsg;
        if (fullTbody) fullTbody.innerHTML = noMsg;
        return;
    }

    // Populate Dashboard (limited)
    if (dashboardTbody) {
        dashboardTbody.innerHTML = '';
        messages.slice(0, 5).forEach((msg, index) => {
            const tr = document.createElement('tr');
            tr.style.animation = `fadeIn 0.5s ease both ${0.1 * index}s`;
            tr.innerHTML = `
                <td>${msg.name}</td>
                <td>${msg.message.length > 30 ? msg.message.substring(0, 30) + '...' : msg.message}</td>
                <td>${msg.date}</td>
                <td><span class="status status-${msg.status?.toLowerCase() || 'new'}">${msg.status || 'New'}</span></td>
            `;
            dashboardTbody.appendChild(tr);
        });
    }

    // Populate Full Messages View
    if (fullTbody) {
        fullTbody.innerHTML = '';
        messages.forEach((msg, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${msg.name}</td>
                <td>${msg.message}</td>
                <td>${msg.date}</td>
                <td><span class="status status-${msg.status?.toLowerCase() || 'new'}">${msg.status || 'New'}</span></td>
                <td>
                    <button class="btn-ghost" onclick="deleteMessage(${index})"><i class="fas fa-trash"></i></button>
                    <button class="btn-ghost" onclick="toggleStatus(${index})"><i class="fas fa-check"></i></button>
                </td>
            `;
            fullTbody.appendChild(tr);
        });
    }
}

function deleteMessage(index) {
    let messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.splice(index, 1);
    localStorage.setItem('messages', JSON.stringify(messages));
    loadMessages();
    updateStats();
}

function toggleStatus(index) {
    let messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages[index].status = messages[index].status === 'Read' ? 'New' : 'Read';
    localStorage.setItem('messages', JSON.stringify(messages));
    loadMessages();
    updateStats();
}

async function updateStats() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const newMsgCount = messages.filter(m => m.status === 'New').length;

    // Total Visitors (Real Global Count from API)
    const visitorsEl = document.getElementById('total-visitors');
    if (visitorsEl) {
        try {
            const resp = await fetch('https://api.counterapi.dev/v1/noorulmuhsin/portfolio');
            const data = await resp.json();
            // Adding a base offset to the real count to keep the established feel
            const offset = 2345;
            visitorsEl.textContent = (data.count + offset).toLocaleString();
        } catch (err) {
            console.error('Fetch error:', err);
            visitorsEl.textContent = '2,346'; // Fallback
        }
    }

    // New Messages
    const msgEl = document.getElementById('new-messages-count');
    if (msgEl) {
        msgEl.textContent = newMsgCount;
    }

    // Project Stats
    const projCount = document.getElementById('project-count');
    if (projCount) projCount.textContent = '2';
}

// Global helper for inline clicks
// Global helper for inline clicks
window.switchView = switchView;
window.deleteMessage = deleteMessage;
window.toggleStatus = toggleStatus;

// ─── PROJECT MANAGEMENT ─────────────────────────
function initProjectMgt() {
    const addBtn = document.getElementById('addProjectBtn');
    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('closeModal');
    const form = document.getElementById('projectForm');

    addBtn?.addEventListener('click', () => {
        form.reset();
        document.getElementById('projectId').value = '';
        document.getElementById('modalTitle').textContent = 'Add New Project';
        modal.classList.add('active');
    });

    closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProject();
        modal.classList.remove('active');
    });

    renderProjects();
}

function renderProjects() {
    const list = document.querySelector('.projects-list-admin');
    if (!list) return;

    const projects = JSON.parse(localStorage.getItem('projects') || '[]');

    // Default projects if empty
    if (projects.length === 0) {
        const defaults = [
            { id: 1, name: 'Guardian Pharmacy', desc: 'Full-stack pharmacy platform', img: 'assets/project1.webp', link: '#', tags: 'React, Tailwind' },
            { id: 2, name: 'Prescription Builder', desc: 'Digital prescription platform', img: 'assets/project2.webp', link: '#', tags: 'React, Firebase' }
        ];
        localStorage.setItem('projects', JSON.stringify(defaults));
        renderProjects();
        return;
    }

    list.innerHTML = '';
    projects.forEach((proj, index) => {
        const item = document.createElement('div');
        item.className = 'admin-project-item';
        if (index > 0) item.style.cssText = 'margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;';

        item.innerHTML = `
            <div style="display: flex; gap: 15px; align-items: center;">
                <img src="${proj.img}" style="width: 60px; height: 40px; border-radius: 8px; object-fit: cover;">
                <div>
                    <h4 style="margin: 0;">${proj.name}</h4>
                    <span style="font-size: 0.85rem; color: #8888aa;">${proj.tags}</span>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn-ghost" onclick="editProject(${index})"><i class="fas fa-edit"></i></button>
                <button class="btn-ghost" onclick="deleteProject(${index})" style="color: #ff4444;"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(item);
    });

    const countEl = document.getElementById('project-count');
    if (countEl) countEl.textContent = projects.length;
}

function saveProject() {
    const id = document.getElementById('projectId').value;
    const name = document.getElementById('projectName').value;
    const desc = document.getElementById('projectDesc').value;
    const img = document.getElementById('projectImg').value;
    const link = document.getElementById('projectLink').value;
    const tags = document.getElementById('projectTags').value;

    let projects = JSON.parse(localStorage.getItem('projects') || '[]');

    const newProj = { name, desc, img, link, tags };

    if (id !== '') {
        projects[id] = newProj;
    } else {
        projects.push(newProj);
    }

    localStorage.setItem('projects', JSON.stringify(projects));
    renderProjects();
}

function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        let projects = JSON.parse(localStorage.getItem('projects') || '[]');
        projects.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        renderProjects();
    }
}

function editProject(index) {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const proj = projects[index];

    document.getElementById('projectId').value = index;
    document.getElementById('projectName').value = proj.name;
    document.getElementById('projectDesc').value = proj.desc;
    document.getElementById('projectImg').value = proj.img;
    document.getElementById('projectLink').value = proj.link;
    document.getElementById('projectTags').value = proj.tags;

    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectModal').classList.add('active');
}

window.editProject = editProject;
window.deleteProject = deleteProject;
