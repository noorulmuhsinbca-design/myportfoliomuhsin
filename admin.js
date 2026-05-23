/* ─── ADMIN DASHBOARD LOGIC ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    // Auth Guard
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    initSidebar();
    loadMessages();
    updateStats();
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

function updateStats() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const newMsgCount = messages.filter(m => m.status === 'New').length;

    const statsVals = document.querySelectorAll('.stat-val');
    if (statsVals.length > 1) {
        // Dashboard Stats
        statsVals[1].textContent = newMsgCount;

        // Project Stats
        const projCount = document.getElementById('project-count');
        if (projCount) projCount.textContent = '2';
    }
}

// Global helper for inline clicks
window.switchView = switchView;
window.deleteMessage = deleteMessage;
window.toggleStatus = toggleStatus;
