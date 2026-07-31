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
    loadCloudinarySettingsUI();

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
            const href = link.getAttribute('href');
            if (href && href !== '#' && href !== '') return;

            e.preventDefault();
            const viewTarget = link.getAttribute('data-view') || link.textContent.trim().toLowerCase();
            if (viewTarget.includes('back to site')) return;

            switchView(viewTarget);
        });
    });
}

function switchView(viewName) {
    const cleanView = (viewName || '').trim().toLowerCase();
    // Update Views
    const views = document.querySelectorAll('.view');
    views.forEach(v => v.classList.remove('section-active'));

    const targetView = document.getElementById(`${cleanView}-view`);
    if (targetView) {
        targetView.classList.add('section-active');
    }

    if (cleanView === 'settings') {
        loadCloudinarySettingsUI();
    }

    // Update Sidebar active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkView = link.getAttribute('data-view') || link.textContent.trim().toLowerCase();
        if (linkView === cleanView) {
            link.classList.add('active');
        } else if (!linkView.includes('back to site')) {
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

/* ─── CLOUDINARY CONFIGURATION & UPLOAD LOGIC ─────────────────────── */
const DEFAULT_CLOUDINARY = {
    cloudName: "ekjftinw",
    apiKey: "127915584446356",
    apiSecret: "kp4gfa8aiNQS1fFu_LbVp-q7pco"
};

function getCloudinaryConfig() {
    try {
        const stored = localStorage.getItem('cloudinary_config');
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                cloudName: parsed.cloudName || DEFAULT_CLOUDINARY.cloudName,
                apiKey: parsed.apiKey || DEFAULT_CLOUDINARY.apiKey,
                apiSecret: parsed.apiSecret || DEFAULT_CLOUDINARY.apiSecret
            };
        }
    } catch (e) {
        console.error('Error loading stored Cloudinary config', e);
    }
    return DEFAULT_CLOUDINARY;
}

function saveCloudinaryConfig(config) {
    localStorage.setItem('cloudinary_config', JSON.stringify(config));
}

async function generateCloudinarySignature(params, apiSecret) {
    const sortedKeys = Object.keys(params).sort();
    const toSign = sortedKeys.map(k => `${k}=${params[k]}`).join('&') + apiSecret;
    const encoder = new TextEncoder();
    const data = encoder.encode(toSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function uploadFileToCloudinary(file) {
    const config = getCloudinaryConfig();
    if (!config.cloudName || !config.apiKey || !config.apiSecret) {
        throw new Error("Missing Cloudinary configuration keys.");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const params = { timestamp };
    const signature = await generateCloudinarySignature(params, config.apiSecret);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', config.apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Cloudinary upload failed (Status ${response.status})`);
    }

    const data = await response.json();
    return data.secure_url || data.url;
}

function loadCloudinarySettingsUI() {
    const config = getCloudinaryConfig();
    const nameEl = document.getElementById('cldCloudName');
    const keyEl = document.getElementById('cldApiKey');
    const secretEl = document.getElementById('cldApiSecret');

    if (nameEl) nameEl.value = config.cloudName || '';
    if (keyEl) keyEl.value = config.apiKey || '';
    if (secretEl) secretEl.value = config.apiSecret || '';
}

function saveCloudinarySettings(e) {
    if (e) e.preventDefault();
    const cloudName = document.getElementById('cldCloudName')?.value.trim();
    const apiKey = document.getElementById('cldApiKey')?.value.trim();
    const apiSecret = document.getElementById('cldApiSecret')?.value.trim();

    if (!cloudName || !apiKey || !apiSecret) {
        alert('Please fill in all Cloudinary fields.');
        return;
    }

    saveCloudinaryConfig({ cloudName, apiKey, apiSecret });
    alert('Cloudinary settings saved successfully!');
    const badge = document.getElementById('cldStatusBadge');
    if (badge) {
        badge.className = 'status status-read';
        badge.innerHTML = '<i class="fas fa-check-circle"></i> Connected';
    }
}

async function testCloudinaryConnection() {
    const badge = document.getElementById('cldStatusBadge');
    if (badge) {
        badge.className = 'status status-new';
        badge.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
    }

    try {
        const testPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        const res = await fetch(testPixel);
        const blob = await res.blob();
        const testFile = new File([blob], 'test.png', { type: 'image/png' });

        const url = await uploadFileToCloudinary(testFile);
        if (url && url.includes('cloudinary.com')) {
            alert('Cloudinary Connection Successful! Test image uploaded to your account.');
            if (badge) {
                badge.className = 'status status-read';
                badge.innerHTML = '<i class="fas fa-check-circle"></i> Connected';
            }
        } else {
            throw new Error('Invalid URL returned');
        }
    } catch (err) {
        alert('Cloudinary Connection Failed: ' + err.message);
        if (badge) {
            badge.className = 'status status-rejected';
            badge.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        }
    }
}

async function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const statusEl = document.getElementById('uploadProgressStatus');
    if (statusEl) {
        statusEl.style.display = 'flex';
        statusEl.style.background = 'rgba(124, 58, 237, 0.15)';
        statusEl.style.borderColor = 'rgba(124, 58, 237, 0.4)';
        statusEl.style.color = '#a78bfa';
        statusEl.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Uploading ${files.length} image(s) to Cloudinary...`;
    }

    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 15 * 1024 * 1024) {
            alert(`File "${file.name}" is over 15MB. Please choose smaller files.`);
            continue;
        }

        if (statusEl) {
            statusEl.innerHTML = `<i class="fas fa-cloud-upload-alt fa-spin"></i> Uploading image ${i + 1} of ${files.length} to Cloudinary...`;
        }

        try {
            const uploadedUrl = await uploadFileToCloudinary(file);
            currentImages.push(uploadedUrl);
            successCount++;
            renderImageGrid();
        } catch (err) {
            console.error('Cloudinary upload error:', err);
            alert(`Failed to upload "${file.name}" to Cloudinary: ${err.message}\nFalling back to local preview.`);

            // Local fallback
            await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function (evt) {
                    currentImages.push(evt.target.result);
                    renderImageGrid();
                    resolve();
                };
                reader.readAsDataURL(file);
            });
        }
    }

    if (statusEl) {
        statusEl.style.display = 'flex';
        statusEl.style.background = 'rgba(34, 197, 94, 0.15)';
        statusEl.style.borderColor = 'rgba(34, 197, 94, 0.4)';
        statusEl.style.color = '#4ade80';
        statusEl.innerHTML = `<i class="fas fa-check-circle"></i> ${successCount} image(s) uploaded to Cloudinary successfully!`;
        setTimeout(() => {
            if (statusEl) statusEl.style.display = 'none';
        }, 3500);
    }

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
window.saveCloudinarySettings = saveCloudinarySettings;
window.testCloudinaryConnection = testCloudinaryConnection;


