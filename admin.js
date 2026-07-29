/* ─── ADMIN DASHBOARD LOGIC ────────────────────────────────────────── */
const DEFAULT_PROJECTS = [
    {
        title: "Guardian Pharmacy",
        description: "A full-stack pharmacy platform with real-time ordering, prescription management, and doctor booking.",
        link: "https://guardian-pharmacy.vercel.app/",
        image: "assets/project1.webp",
        tags: ["React", "Tailwind", "Node.js"]
    },
    {
        title: "Doctor Prescription Builder",
        description: "A digital prescription platform for doctors — create, save, share and print prescriptions with live preview and patient management.",
        link: "https://guardian-doctor-prescription.vercel.app/",
        image: "assets/project2.webp",
        tags: ["React", "Firebase", "JavaScript"]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Auth Guard
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    initSidebar();
    loadMessages();
    loadProjects();
    updateStats();

    // Close modal on click outside
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProjectModal();
        });
    }
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

/* ─── PROJECT MANAGEMENT ────────────────────────────────────────────── */
function getStoredProjects() {
    const data = localStorage.getItem('portfolio_projects');
    if (!data) {
        localStorage.setItem('portfolio_projects', JSON.stringify(DEFAULT_PROJECTS));
        return DEFAULT_PROJECTS;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return DEFAULT_PROJECTS;
    }
}

function saveStoredProjects(projects) {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
}

function loadProjects() {
    const projectsList = document.getElementById('adminProjectsList');
    const projects = getStoredProjects();
    const projCount = document.getElementById('project-count');

    if (projCount) {
        projCount.textContent = projects.length;
    }

    // Dashboard Project Live count stat card
    const statsGrid = document.querySelectorAll('.stats-grid .stat-val');
    if (statsGrid && statsGrid[2]) {
        statsGrid[2].textContent = projects.length;
    }

    if (!projectsList) return;

    if (projects.length === 0) {
        projectsList.innerHTML = '<div style="text-align: center; padding: 30px; color: #8888aa;">No projects published yet. Click "+ Add New Project" to add one!</div>';
        return;
    }

    projectsList.innerHTML = projects.map((p, index) => `
        <div class="admin-project-item">
            <div style="display: flex; gap: 15px; align-items: center; flex: 1; min-width: 0;">
                <img src="${p.image}" alt="${p.title}" style="width: 60px; height: 40px; border-radius: 8px; object-fit: cover; flex-shrink: 0;" onerror="this.src='assets/project1.webp'">
                <div style="min-width: 0;">
                    <h4 style="margin: 0; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</h4>
                    <span style="font-size: 0.85rem; color: #8888aa; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.description}</span>
                </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: center; flex-shrink: 0;">
                <button class="btn-ghost" style="padding: 8px 12px;" onclick="openProjectModal(${index})" title="Edit Project"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn-ghost" style="padding: 8px 12px; color: #ff4444;" onclick="deleteProject(${index})" title="Delete Project"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

let currentImages = [];

function renderImageGrid() {
    const grid = document.getElementById('multiImagePreviewGrid');
    if (!grid) return;

    if (!currentImages || currentImages.length === 0) {
        grid.style.display = 'none';
        grid.innerHTML = '';
        return;
    }

    grid.style.display = 'grid';
    grid.innerHTML = currentImages.map((src, idx) => `
        <div class="multi-image-thumb ${idx === 0 ? 'is-cover' : ''}">
            <img src="${src}" alt="Project image ${idx + 1}" onerror="this.src='assets/project1.webp'">
            ${idx === 0 ? '<span class="cover-badge">Cover</span>' : ''}
            <button type="button" class="thumb-remove-btn" onclick="removeImageAt(${idx})" title="Remove image">&times;</button>
        </div>
    `).join('');
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let loadedCount = 0;
    files.forEach(file => {
        if (file.size > 8 * 1024 * 1024) {
            alert(`File "${file.name}" is over 8MB. Please select smaller images.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = function (evt) {
            currentImages.push(evt.target.result);
            loadedCount++;
            if (loadedCount === files.length) {
                renderImageGrid();
            }
        };
        reader.readAsDataURL(file);
    });

    e.target.value = '';
}

function addUrlImage() {
    const input = document.getElementById('projectImgUrlInput');
    if (!input) return;
    const url = input.value.trim();
    if (url) {
        currentImages.push(url);
        input.value = '';
        renderImageGrid();
    }
}

function handleUrlKeydown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addUrlImage();
    }
}

function removeImageAt(idx) {
    currentImages.splice(idx, 1);
    renderImageGrid();
}

function openProjectModal(index = -1) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const editIndex = document.getElementById('projectEditIndex');
    const titleInput = document.getElementById('projectTitleInput');
    const descInput = document.getElementById('projectDescInput');
    const linkInput = document.getElementById('projectLinkInput');
    const tagsInput = document.getElementById('projectTagsInput');

    if (!modal) return;

    if (index >= 0) {
        const projects = getStoredProjects();
        const p = projects[index];
        if (p) {
            modalTitle.textContent = 'Edit Project';
            editIndex.value = index;
            titleInput.value = p.title || '';
            descInput.value = p.description || '';
            linkInput.value = p.link || '';
            tagsInput.value = Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '');

            if (Array.isArray(p.images) && p.images.length > 0) {
                currentImages = [...p.images];
            } else if (p.image) {
                currentImages = [p.image];
            } else {
                currentImages = [];
            }
        }
    } else {
        modalTitle.textContent = 'Add New Project';
        editIndex.value = -1;
        document.getElementById('projectForm')?.reset();
        currentImages = [];
    }

    renderImageGrid();
    modal.classList.add('active');
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function saveProject(e) {
    e.preventDefault();
    const editIndex = parseInt(document.getElementById('projectEditIndex').value, 10);
    const title = document.getElementById('projectTitleInput').value.trim();
    const description = document.getElementById('projectDescInput').value.trim();
    const link = document.getElementById('projectLinkInput').value.trim() || '#';
    const tagsRaw = document.getElementById('projectTagsInput').value.trim();

    if (currentImages.length === 0) {
        alert('Please upload or add at least 1 image for the project!');
        return;
    }

    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : ['React', 'Web Dev'];

    const newProject = {
        title,
        description,
        link,
        image: currentImages[0],
        images: [...currentImages],
        tags
    };

    let projects = getStoredProjects();
    if (editIndex >= 0 && editIndex < projects.length) {
        projects[editIndex] = newProject;
    } else {
        projects.unshift(newProject);
    }

    saveStoredProjects(projects);
    closeProjectModal();
    loadProjects();
    updateStats();
}

function deleteProject(index) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    let projects = getStoredProjects();
    projects.splice(index, 1);
    saveStoredProjects(projects);
    loadProjects();
    updateStats();
}

function updateStats() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const newMsgCount = messages.filter(m => m.status === 'New').length;

    const statsVals = document.querySelectorAll('.stat-val');
    if (statsVals.length > 1) {
        // Dashboard Stats: Messages
        statsVals[1].textContent = newMsgCount;
    }

    // Refresh project counts
    loadProjects();
}

// Global helpers for inline clicks
window.switchView = switchView;
window.deleteMessage = deleteMessage;
window.toggleStatus = toggleStatus;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.saveProject = saveProject;
window.deleteProject = deleteProject;
window.handleFileSelect = handleFileSelect;
window.addUrlImage = addUrlImage;
window.handleUrlKeydown = handleUrlKeydown;
window.removeImageAt = removeImageAt;


