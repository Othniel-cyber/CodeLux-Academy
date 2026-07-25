function escapeHTML(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

async function syncUserToFirebase(email, password, name) {
    try {
        await db.collection('users').doc(email).set({ email, password, name, created_at: new Date().toISOString() });
    } catch(e) { console.warn('Firebase sync user failed:', e); }
}

async function syncAllLocalToFirebase() {
    const count = Object.keys(users).length;
    if (count === 0) { alert('Aucun utilisateur local à synchroniser.'); return; }
    let ok = 0, fail = 0;
    for (const email in users) {
        try {
            await db.collection('users').doc(email).set({ ...users[email], created_at: (users[email].created_at || new Date().toISOString()) });
            ok++;
        } catch(e) { fail++; console.warn('Sync failed for', email, e); }
    }
    alert(`${ok} utilisateur(s) synchronisé(s) avec Firestore.${fail ? ' (' + fail + ' échec(s))' : ''}`);
    loadAdminData('users');
}

async function syncProgressToFirebase(email, langId, lessons, examPassed) {
    try {
        await db.collection('progress').doc(email + '_' + langId).set({ email, lang_id: langId, lessons: lessons || [], exam_passed: examPassed || false, updated_at: new Date().toISOString() });
    } catch(e) { console.warn('Firebase sync progress failed:', e); }
}

async function syncCertToFirebase(email, langId, certId) {
    try {
        await db.collection('certificates').add({ email, lang_id: langId, cert_id: certId, created_at: new Date().toISOString() });
    } catch(e) { console.warn('Firebase sync cert failed:', e); }
}

async function loadUsersFromFirebase() {
    try {
        const snap = await db.collection('users').get();
        snap.forEach(d => {
            const u = d.data();
            users[u.email] = { email: u.email, password: u.password, name: u.name };
        });
        saveUsers();
    } catch(e) { console.warn('Firebase load failed:', e); }
}

let currentLang = null;
let currentLessonIndex = 0;
let examAnswers = {};
let currentUser = null;
let users = {};
let profileData = {};
let progress = {};
let certificates = [];

async function init() {
    loadFromStorage();
    try {
        await loadUsersFromFirebase();
    } catch(e) {
        console.warn('Firebase non accessible, mode local uniquement', e);
    }
}

function startApp() {
    document.getElementById('splash-screen').style.display = 'none';
    renderAuth();
}

function loadFromStorage() {
    try {
        const u = localStorage.getItem('codelux_users');
        if (u) users = JSON.parse(u);
    } catch(e) { users = {}; }
    try {
        const c = localStorage.getItem('codelux_current');
        if (c) currentUser = JSON.parse(c);
    } catch(e) { currentUser = null; }
    if (currentUser) {
        loadUserData();
    }
}

function loadUserData() {
    if (!currentUser) return;
    const key = 'codelux_data_' + currentUser.email;
    try {
        const d = localStorage.getItem(key);
        if (d) {
            const data = JSON.parse(d);
            profileData = data.profile || {};
            progress = data.progress || {};
            certificates = data.certificates || [];
        } else {
            profileData = {}; progress = {}; certificates = [];
        }
    } catch(e) {
        profileData = {}; progress = {}; certificates = [];
    }
}

function saveUserData() {
    if (!currentUser) return;
    const key = 'codelux_data_' + currentUser.email;
    localStorage.setItem(key, JSON.stringify({
        profile: profileData,
        progress: progress,
        certificates: certificates
    }));
    // Sync progress to Firebase
    if (progress && typeof progress === 'object') {
        Object.keys(progress).forEach(langId => {
            const p = progress[langId];
            if (p) syncProgressToFirebase(currentUser.email, langId, p.lessons || [], p.examPassed || false);
        });
    }
}

function saveUsers() {
    localStorage.setItem('codelux_users', JSON.stringify(users));
}

function saveCurrentUser() {
    localStorage.setItem('codelux_current', JSON.stringify(currentUser));
}

function renderAuth() {
    const app = document.getElementById('app');
    const auth = document.getElementById('auth-page');
    if (currentUser) {
        auth.style.display = 'none';
        app.style.display = 'block';
        updateNav();
        loadDashboard();
        return;
    }
    app.style.display = 'none';
    auth.style.display = 'flex';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('auth-title').textContent = 'Créer un compte';
    document.getElementById('auth-toggle').innerHTML = 'Déjà un compte ? <a href="#" onclick="showLogin();return false">Connecte-toi</a>';
}

function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('auth-title').textContent = 'Connexion';
    document.getElementById('auth-toggle').innerHTML = 'Pas encore de compte ? <a href="#" onclick="showRegister();return false">Inscris-toi</a>';
}

function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const name = document.getElementById('reg-name').value.trim();

    if (!email || !password || !confirm || !name) {
        showAuthError('Tous les champs sont obligatoires');
        return;
    }
    if (password !== confirm) {
        showAuthError('Les mots de passe ne correspondent pas');
        return;
    }
    if (password.length < 4) {
        showAuthError('Le mot de passe doit avoir au moins 4 caractères');
        return;
    }
    if (users[email]) {
        showAuthError('Cet email est déjà utilisé');
        return;
    }
    users[email] = { email, password, name };
    saveUsers();
    await syncUserToFirebase(email, password, name);
    currentUser = users[email];
    saveCurrentUser();
    loadUserData();
    renderAuth();
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showAuthError('Tous les champs sont obligatoires');
        return;
    }
    if (users[email] && users[email].password === password) {
        currentUser = users[email];
        saveCurrentUser();
        loadUserData();
        renderAuth();
        return;
    }
    // Vérifier dans Firebase si pas en local
    try {
        const snap = await db.collection('users').doc(email).get();
        if (snap.exists) {
            const data = snap.data();
            if (data.password === password) {
                users[email] = { email: data.email, password: data.password, name: data.name };
                saveUsers();
                currentUser = users[email];
                saveCurrentUser();
                loadUserData();
                renderAuth();
                return;
            }
        }
    } catch(e) {
        if (e.code === 'failed-precondition' || e.message?.includes('Firestore')) {
            showAuthError('Base de données inaccessible. Vérifie que Firestore est activé dans la console Firebase.');
            return;
        }
    }
    showAuthError('Email ou mot de passe incorrect');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('codelux_current');
    renderAuth();
}

function showAuthError(msg) {
    const el = document.getElementById('auth-error');
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 3000);
}

function updateNav() {
    if (!currentUser) return;
    document.getElementById('navUserName').textContent = currentUser.name || 'Utilisateur';
    const avatar = document.getElementById('navAvatar');
    if (profileData.photo) {
        avatar.innerHTML = `<img src="${profileData.photo}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
        avatar.style.background = 'none';
        avatar.style.border = 'none';
    } else {
        avatar.textContent = (currentUser.name || 'U').charAt(0).toUpperCase();
        avatar.style.background = 'linear-gradient(135deg, #6c5ce7, #a29bfe)';
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(`page-${pageId}`);
    if (page) page.classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const links = { dashboard: 0, profile: 1, certificates: 2, admin: 3 };
    const idx = links[pageId];
    if (idx !== undefined) {
        const all = document.querySelectorAll('.nav-link');
        if (all[idx]) all[idx].classList.add('active');
    }
    if (pageId === 'dashboard') loadDashboard();
    if (pageId === 'profile') loadProfileForm();
    if (pageId === 'certificates') loadCertificatesList();
    if (pageId === 'admin') loadAdminPage();
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        profileData.photo = e.target.result;
        saveUserData();
        loadProfileForm();
        updateNav();
    };
    reader.readAsDataURL(file);
}

function loadProfileForm() {
    if (!currentUser) return;
    document.getElementById('profile-name').value = currentUser.name || '';
    document.getElementById('profile-email').value = currentUser.email || '';
    document.getElementById('profile-dob').value = profileData.dob || '';
    const photo = document.getElementById('profilePhoto');
    if (profileData.photo) {
        photo.innerHTML = `<img src="${profileData.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        photo.style.background = 'none';
        photo.style.border = '3px solid #6c5ce7';
        document.getElementById('profilePhotoText').style.display = 'none';
    } else {
        photo.innerHTML = '<span id="profilePhotoText" style="font-size:36px;color:#6c5ce7">+</span>';
        photo.style.background = '';
        photo.style.border = '';
    }
    let totalLessons = 0, totalDone = 0, totalCerts = 0;
    const p = progress || {};
    LANGUAGES.forEach(lang => {
        totalLessons += lang.lessons;
        const lp = p[lang.id];
        if (lp) {
            totalDone += (lp.lessons || []).length;
            if (lp.examPassed) totalCerts++;
        }
    });
    document.getElementById('profileStats').innerHTML = `
        <div class="stat-item"><span class="stat-label">Langages en cours</span><span class="stat-value">${Object.keys(p).length}</span></div>
        <div class="stat-item"><span class="stat-label">Leçons complétées</span><span class="stat-value">${totalDone}/${totalLessons}</span></div>
        <div class="stat-item"><span class="stat-label">Attestations obtenues</span><span class="stat-value">${totalCerts}</span></div>
    `;
}

function saveProfileForm() {
    profileData.dob = document.getElementById('profile-dob').value;
    if (currentUser) {
        currentUser.name = document.getElementById('profile-name').value || currentUser.name;
        users[currentUser.email].name = currentUser.name;
        saveUsers();
        saveCurrentUser();
    }
    saveUserData();
    updateNav();
}

function loadDashboard() {
    const grid = document.getElementById('languagesGrid');
    grid.innerHTML = '';
    LANGUAGES.forEach(lang => {
        const p = progress[lang.id] || { lessons: [], examPassed: false };
        const done = (p.lessons || []).length;
        const total = lang.lessons;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        const card = document.createElement('div');
        card.className = 'lang-card';
        card.innerHTML = `
            <div class="lang-icon" style="background:${lang.color}22;color:${lang.color}"><i class="${lang.icon}"></i></div>
            <div class="lang-name">${lang.name}</div>
            <div class="lang-lessons">${done}/${total} leçons</div>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            ${p.examPassed ? '<div class="lang-complete">Certifié</div>' : ''}
        `;
        card.onclick = () => openCourses(lang.id);
        grid.appendChild(card);
    });
}

function openCourses(langId) {
    currentLang = langId;
    const course = COURSES[langId];
    if (!course) { showPage('dashboard'); return; }
    const p = progress[langId] || { lessons: [], examPassed: false };
    const doneLessons = p.lessons || [];
    const container = document.getElementById('coursesContainer');
    let html = '<div class="courses-header"><h2><i class="' + course.icon + '"></i> ' + course.title + '</h2><p>Complète toutes les leçons et réussis l\'examen final pour obtenir ton attestation !</p></div>';
    html += '<div class="lesson-list">';
    course.lessons.forEach((lesson, i) => {
        const isDone = doneLessons.includes(lesson.id);
        const isUnlocked = i === 0 || doneLessons.includes(course.lessons[i - 1].id);
        const canOpen = isUnlocked || isDone;
        html += `
            <div class="lesson-item ${isDone ? 'done' : ''} ${!canOpen ? 'locked' : ''}" onclick="${canOpen ? "openLesson('" + langId + "'," + i + ")" : ''}">
                <div class="lesson-item-left">
                    <div class="lesson-num">${isDone ? '✓' : (i + 1)}</div>
                    <div class="lesson-info">
                        <h4>Leçon ${i + 1}: ${lesson.title}</h4>
                        <p>${isDone ? 'Quiz réussi !' : (canOpen ? 'Quiz à compléter' : '<i class="fa-solid fa-lock"></i> Complète la leçon précédente')}</p>
                    </div>
                </div>
                <span class="lesson-status ${isDone ? 'done' : (canOpen ? 'pending' : 'locked')}">${isDone ? 'Réussi' : (canOpen ? 'À faire' : '<i class="fa-solid fa-lock"></i>')}</span>
            </div>
        `;
    });
    html += '</div>';
    const allDone = doneLessons.length >= course.lessons.length;
    html += `
        <div class="exam-section">
            <h3><i class="fa-solid fa-file-pen"></i> Examen Final</h3>
            <p>${allDone ? 'Toutes les leçons sont complétées ! Tu peux passer l\'examen final.' : 'Complète toutes les leçons pour débloquer l\'examen final (' + doneLessons.length + '/' + course.lessons.length + ').'}</p>
            ${p.examPassed ? '<div style="color:#00b894;font-size:20px;font-weight:700">✓ Attestation obtenue !</div><button class="exam-btn" style="margin-top:10px;background:linear-gradient(135deg,#6c5ce7,#a29bfe)" onclick="viewCertificate(\'' + langId + '\')">Voir mon attestation</button>' : '<button class="exam-btn" ' + (allDone ? 'onclick="startExam(\'' + langId + '\')"' : 'disabled') + '>Passer l\'examen</button>'}
        </div>
    `;
    container.innerHTML = html;
    showPage('courses');
}

function openLesson(langId, index) {
    currentLang = langId;
    currentLessonIndex = index;
    const course = COURSES[langId];
    if (!course || !course.lessons[index]) return;
    const lesson = course.lessons[index];
    const container = document.getElementById('lessonContainer');
    container.innerHTML = `
        <div class="lesson-content">
            <h2>Leçon ${index + 1}: ${lesson.title}</h2>
            <div class="lesson-text">${escapeHTML(lesson.content)}</div>
            <div class="code-block">${escapeHTML(lesson.code)}</div>
        </div>
        <div class="lesson-quiz-section">
            <h3><i class="fa-solid fa-clipboard-list"></i> Quiz - ${lesson.title}</h3>
            <p style="color:#888;margin-bottom:15px">Réponds aux questions pour valider la leçon.</p>
            <div id="quizQuestions"></div>
            <div id="quizFeedback" style="margin-top:15px"></div>
            <button class="exam-btn" id="quizSubmitBtn" onclick="submitLessonQuiz()">Valider le quiz</button>
        </div>
    `;
    renderQuiz(lesson.quiz.questions);
    showPage('lesson');
}

function renderQuiz(questions) {
    const container = document.getElementById('quizQuestions');
    if (!container) return;
    window._quizAnswers = {};
    let html = '';
    questions.forEach((q, i) => {
        html += `<div class="quiz-question"><p><strong>${i + 1}. ${q.q}</strong></p><div class="quiz-options" id="qopts_${i}">`;
        q.options.forEach((opt, j) => {
            html += `<div class="quiz-option" onclick="selectAnswer(${i}, ${j})">${opt}</div>`;
        });
        html += `</div></div>`;
    });
    container.innerHTML = html;
    document.getElementById('quizFeedback').innerHTML = '';
    document.getElementById('quizSubmitBtn').style.display = 'inline-block';
}

function selectAnswer(qIndex, optIndex) {
    window._quizAnswers[qIndex] = optIndex;
    const opts = document.getElementById(`qopts_${qIndex}`);
    if (opts) {
        opts.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        if (opts.children[optIndex]) opts.children[optIndex].classList.add('selected');
    }
}

function submitLessonQuiz() {
    const course = COURSES[currentLang];
    if (!course || !course.lessons[currentLessonIndex]) return;
    const lesson = course.lessons[currentLessonIndex];
    const answers = window._quizAnswers || {};
    const questions = lesson.quiz.questions;
    let correct = 0;
    questions.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
    });
    const total = questions.length;
    const passed = correct >= Math.ceil(total * 0.6);
    const fb = document.getElementById('quizFeedback');
    const submitBtn = document.getElementById('quizSubmitBtn');
    submitBtn.style.display = 'none';

    if (passed) {
        if (!progress[currentLang]) progress[currentLang] = { lessons: [], examPassed: false };
        if (!progress[currentLang].lessons.includes(lesson.id)) {
            progress[currentLang].lessons.push(lesson.id);
            saveUserData();
        }
        const hasNext = currentLessonIndex < course.lessons.length - 1;
        fb.innerHTML = `
            <div class="quiz-feedback success">
                <div class="fb-icon"><i class="fa-solid fa-circle-check"></i></div>
                <div class="fb-title">Quiz réussi !</div>
                <div class="fb-score">${correct}/${total}</div>
                <p style="color:#888;margin-top:5px">Bravo ! Tu as bien compris la leçon.</p>
            </div>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:15px">
                ${hasNext ? '<button class="exam-btn" onclick="goToNextLesson()">Leçon suivante →</button>' : '<button class="exam-btn" onclick="openCourses(\'' + currentLang + '\')">Voir les leçons</button>'}
                <button class="exam-nav-btn" onclick="openCourses(\'' + currentLang + '\')">Retour aux cours</button>
            </div>
        `;
        fb.style.display = 'block';
    } else {
        fb.innerHTML = `
            <div class="quiz-feedback fail">
                <div class="fb-icon"><i class="fa-solid fa-circle-xmark"></i></div>
                <div class="fb-title">Quiz échoué</div>
                <div class="fb-score">${correct}/${total}</div>
                <p style="color:#888;margin-top:5px">Relis bien la leçon et réessaie !</p>
                <button class="exam-btn" style="margin-top:15px" onclick="openLesson('${currentLang}', ${currentLessonIndex})">Réessayer</button>
            </div>
        `;
        fb.style.display = 'block';
    }
}

function goToNextLesson() {
    const next = currentLessonIndex + 1;
    const course = COURSES[currentLang];
    if (course && course.lessons[next]) {
        openLesson(currentLang, next);
    } else {
        openCourses(currentLang);
    }
}

function backToCourses() {
    if (currentLang) openCourses(currentLang);
}

function startExam(langId) {
    currentLang = langId;
    examAnswers = {};
    const course = COURSES[langId];
    if (!course || !course.exam) return;
    const questions = course.exam.questions;
    showPage('exam');
    const container = document.getElementById('examContainer');
    let html = `<div class="exam-header"><h2><i class="fa-solid fa-file-pen"></i> Examen Final - ${course.title}</h2><p>Réponds à toutes les questions (minimum ${course.exam.passingScore}/${questions.length} pour réussir)</p></div>`;
    html += `<div class="exam-progress"><div class="exam-progress-fill" id="examProgress" style="width:0%"></div></div>`;
    questions.forEach((q, i) => {
        html += `<div class="exam-question"><h3>Question ${i + 1}/${questions.length}</h3><p style="margin-bottom:15px;font-size:16px">${q.q}</p><div class="quiz-options" id="examOpts_${i}">`;
        q.options.forEach((opt, j) => {
            html += `<div class="quiz-option" onclick="selectExamOption(${i}, ${j})">${opt}</div>`;
        });
        html += `</div></div>`;
    });
    html += `<div class="exam-nav"><button class="exam-nav-btn" onclick="backToCourses()">Retour</button><button class="exam-nav-btn submit" onclick="submitExam('${langId}')">Soumettre</button></div>`;
    container.innerHTML = html;
}

function selectExamOption(qIndex, optIndex) {
    examAnswers[qIndex] = optIndex;
    const opts = document.getElementById(`examOpts_${qIndex}`);
    if (opts) {
        opts.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        if (opts.children[optIndex]) opts.children[optIndex].classList.add('selected');
    }
    const course = COURSES[currentLang];
    if (course && course.exam) {
        const total = course.exam.questions.length;
        const answered = Object.keys(examAnswers).length;
        const bar = document.getElementById('examProgress');
        if (bar) bar.style.width = Math.round((answered / total) * 100) + '%';
    }
}

function submitExam(langId) {
    const course = COURSES[langId];
    if (!course || !course.exam) return;
    const questions = course.exam.questions;
    let correct = 0;
    questions.forEach((q, i) => {
        if (examAnswers[i] === q.answer) correct++;
    });
    const total = questions.length;
    const passed = correct >= course.exam.passingScore;
    const container = document.getElementById('examResultContainer');
    container.innerHTML = `
        <div class="exam-result-card">
            <div class="exam-result-icon">${passed ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-xmark"></i>'}</div>
            <div class="exam-result-title">${passed ? 'Félicitations !' : 'Échoué'}</div>
            <div class="exam-result-score ${passed ? 'pass' : 'fail'}">${correct}/${total}</div>
            <div class="exam-result-msg">${passed ? 'Tu as réussi l\'examen final ! Tu mérites ton attestation.' : 'Tu n\'as pas atteint le score minimum (' + course.exam.passingScore + '/' + total + '). Réessaie !'}</div>
            ${passed ? `<button class="exam-btn" onclick="generateCertificate('${langId}')"><i class="fa-solid fa-graduation-cap"></i> Obtenir mon attestation</button>` : `<button class="exam-btn" onclick="startExam('${langId}')">Réessayer</button>`}
            <button class="exam-nav-btn" style="margin-top:10px" onclick="showPage('dashboard')">Accueil</button>
        </div>
    `;
    if (passed) {
        if (!progress[langId]) progress[langId] = { lessons: [], examPassed: false };
        progress[langId].examPassed = true;
        saveUserData();
        syncProgressToFirebase(currentUser.email, langId, progress[langId].lessons || [], true);
    }
    showPage('exam-result');
}

function generateCertificate(langId) {
    const course = COURSES[langId];
    if (!course) return;
    showPage('certificate');
    const container = document.getElementById('certificateContainer');
    const certId = Date.now().toString(36).toUpperCase() + langId.toUpperCase();
    container.innerHTML = `
        <div style="text-align:center;margin-bottom:20px">
            <h2 style="font-size:28px;font-weight:800;color:#6c5ce7">Génération de l'attestation</h2>
            <p style="color:#888">Préparation de ton certificat...</p>
        </div>
        <div class="certificate-wrapper" id="certPreview"></div>
        <div class="cert-actions">
            <button class="download-btn" onclick="downloadCertificate()"><i class="fa-solid fa-download"></i> Télécharger l'attestation</button>
            <button class="exam-nav-btn" style="margin-left:10px" onclick="showPage('dashboard')">Accueil</button>
        </div>
    `;
    renderCertificate(certId, langId);
}

function renderCertificate(certId, langId) {
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');
    const w = 800, h = 580;
    canvas.width = w; canvas.height = h;

    // Fond blanc
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, w, h);

    // Bordure principale double
    ctx.strokeStyle = '#6c5ce7';
    ctx.lineWidth = 10;
    ctx.strokeRect(6, 6, w - 12, h - 12);
    ctx.strokeStyle = '#d4c4ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // Coins décoratifs
    const corners = [
        [26, 26], [w - 26, 26], [26, h - 26], [w - 26, h - 26]
    ];
    ctx.fillStyle = '#6c5ce7';
    corners.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    });

    // Bandeau doré en haut
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#6c5ce7');
    grad.addColorStop(0.5, '#a29bfe');
    grad.addColorStop(1, '#6c5ce7');
    ctx.fillStyle = grad;
    ctx.fillRect(22, 22, w - 44, 12);

    // Filigrane - emails en diagonale (watermark)
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.5);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(108, 92, 231, 0.06)';
    ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
    ctx.fillText('angelmahuenan@gmail.com', 0, -30);
    ctx.fillText('tohounkpinothniel@gmail.com', 0, 5);
    ctx.restore();

    // Deuxième filigrane plus petit en bas
    ctx.save();
    ctx.translate(w / 2, h / 2 + 80);
    ctx.rotate(-0.5);
    ctx.fillStyle = 'rgba(108, 92, 231, 0.04)';
    ctx.font = '16px "Segoe UI", Arial, sans-serif';
    ctx.fillText('angelmahuenan@gmail.com  |  tohounkpinothniel@gmail.com', 0, 0);
    ctx.restore();

    // Logo / Titre
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 40px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CodeLux Academy', w / 2, 100);

    // Sous-titre avec icône dorée
    ctx.fillStyle = '#6c5ce7';
    ctx.font = '20px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Attestation de Réussite', w / 2, 132);

    // Ligne de séparation
    ctx.strokeStyle = '#6c5ce7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 148);
    ctx.lineTo(550, 148);
    ctx.stroke();

    // Petit losange décoratif
    ctx.fillStyle = '#fdcb6e';
    ctx.save();
    ctx.translate(w / 2, 148);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();

    // "Ceci certifie que"
    ctx.fillStyle = '#555';
    ctx.font = '16px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Ceci certifie que', w / 2, 190);

    // Nom de l'étudiant
    const fullName = currentUser ? currentUser.name : 'Étudiant';
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 34px "Segoe UI", Arial, sans-serif';
    ctx.fillText(fullName, w / 2, 235);

    // Date de naissance
    let dobY = 260;
    if (profileData.dob) {
        const parts = profileData.dob.split('-');
        if (parts.length === 3) {
            const dobStr = `Né(e) le ${parts[2]}/${parts[1]}/${parts[0]}`;
            ctx.fillStyle = '#666';
            ctx.font = '14px "Segoe UI", Arial, sans-serif';
            ctx.fillText(dobStr, w / 2, 260);
            dobY = 260;
        }
    }

    // Texte du cours
    const lang = COURSES[langId];
    ctx.fillStyle = '#444';
    ctx.font = '17px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`a complété avec succès le cours complet`, w / 2, 295);

    ctx.fillStyle = '#6c5ce7';
    ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`${lang.title}`, w / 2, 325);

    ctx.fillStyle = '#6c5ce7';
    ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
    ctx.fillText('et réussi l\'examen final de certification', w / 2, 350);

    // Date de délivrance
    const today = new Date();
    const dateStr = `Délivré le ${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    ctx.fillStyle = '#999';
    ctx.font = '13px "Segoe UI", Arial, sans-serif';
    ctx.fillText(dateStr, w / 2, 385);

    // Badge CodeLux en bas à gauche
    ctx.fillStyle = '#6c5ce7';
    ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('CodeLux', 45, h - 75);
    ctx.fillStyle = '#888';
    ctx.font = '13px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Academy', 45, h - 55);

    // ID du certificat
    ctx.textAlign = 'center';
    ctx.fillStyle = '#bbb';
    ctx.font = '10px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`Certificat #${certId}`, w / 2, h - 22);

    // Signatures à droite
    ctx.textAlign = 'right';
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';

    // Ligne signature Othniel
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w - 250, h - 110);
    ctx.lineTo(w - 45, h - 110);
    ctx.stroke();
    ctx.fillText('Othniel T.', w - 45, h - 90);
    ctx.fillStyle = '#888';
    ctx.font = '12px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Co-Fondateur', w - 45, h - 74);

    // Ligne signature Ange-Aurel
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
    ctx.beginPath();
    ctx.moveTo(w - 250, h - 58);
    ctx.lineTo(w - 45, h - 58);
    ctx.stroke();
    ctx.fillText('Ange-Aurel A.', w - 45, h - 38);
    ctx.fillStyle = '#888';
    ctx.font = '12px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Co-Fondateur', w - 45, h - 22);

    // Sceau / Timbre doré
    ctx.save();
    const sealX = 95, sealY = h - 85;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 28, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(253, 203, 110, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#fdcb6e';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fdcb6e';
    ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CL', sealX, sealY);
    ctx.restore();

    function finalizeCert() {
        updateCertPreview(canvas, certId, langId);
        const imgData = canvas.toDataURL('image/png');
        const cert = {
            id: certId, langId, langName: lang.title,
            date: today.toISOString(), image: imgData,
            studentName: fullName
        };
        const existingIdx = certificates.findIndex(c => c.langId === langId);
        if (existingIdx >= 0) certificates[existingIdx] = cert;
        else certificates.push(cert);
        saveUserData();
        syncCertToFirebase(currentUser.email, langId, certId);
        window._lastCertData = imgData;
    }

    if (profileData.photo) {
        const img = new Image();
        img.onload = function() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(90, 235, 40, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, 50, 195, 80, 80);
            ctx.restore();
            ctx.strokeStyle = '#6c5ce7';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(90, 235, 40, 0, Math.PI * 2);
            ctx.stroke();
            finalizeCert();
        };
        img.onerror = function() { drawPlaceholderPhoto(); finalizeCert(); };
        img.src = profileData.photo;
    } else {
        drawPlaceholderPhoto();
        finalizeCert();
    }

    function drawPlaceholderPhoto() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(90, 235, 40, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = '#e8e0ff';
        ctx.fill();
        ctx.strokeStyle = '#6c5ce7';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#6c5ce7';
        ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((currentUser ? currentUser.name.charAt(0).toUpperCase() : '?'), 90, 235);
        ctx.restore();
    }
}

function updateCertPreview(canvas, certId, langId) {
    const preview = document.getElementById('certPreview');
    if (preview) {
        preview.innerHTML = `<img src="${canvas.toDataURL('image/png')}" alt="Attestation CodeLux Academy" style="width:100%;border-radius:14px;display:block">`;
    }
}

function downloadCertificate() {
    if (window._lastCertData) {
        const link = document.createElement('a');
        link.download = `Attestation-CodeLux-${(currentLang || '').toUpperCase()}.png`;
        link.href = window._lastCertData;
        link.click();
    }
}

function viewCertificate(langId) {
    const cert = certificates.find(c => c.langId === langId);
    if (!cert) return;
    showPage('certificate');
    const container = document.getElementById('certificateContainer');
    container.innerHTML = `
        <div style="text-align:center;margin-bottom:20px">
            <h2 style="font-size:28px;font-weight:800;color:#6c5ce7">${cert.langName} - Attestation</h2>
            <p style="color:#888">Délivrée le ${new Date(cert.date).toLocaleDateString('fr-FR')}</p>
        </div>
        <div class="certificate-wrapper"><img src="${cert.image}" alt="Attestation" style="width:100%;border-radius:14px;display:block"></div>
        <div class="cert-actions">
            <button class="download-btn" onclick="downloadExistingCert('${langId}')"><i class="fa-solid fa-download"></i> Télécharger</button>
            <button class="exam-nav-btn" style="margin-left:10px" onclick="showPage('dashboard')">Accueil</button>
        </div>
    `;
    window._lastCertData = cert.image;
}

function downloadExistingCert(langId) {
    const cert = certificates.find(c => c.langId === langId);
    if (!cert) return;
    const link = document.createElement('a');
    link.download = `Attestation-CodeLux-${langId.toUpperCase()}.png`;
    link.href = cert.image;
    link.click();
}

function loadCertificatesList() {
    const container = document.getElementById('certificatesList');
    if (!certificates || certificates.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:60px;color:#888"><div style="font-size:64px;margin-bottom:20px"><i class="fa-solid fa-certificate"></i></div><h3 style="color:#fff;margin-bottom:10px">Aucune attestation pour l'instant</h3><p>Complète un cours et réussis l'examen pour obtenir ton attestation !</p></div>`;
        return;
    }
    let html = '';
    certificates.forEach(cert => {
        html += `<div class="cert-card" onclick="viewCertificate('${cert.langId}')"><div class="cert-card-left"><div class="cert-card-icon"><i class="fa-solid fa-certificate"></i></div><div class="cert-card-info"><h4>${cert.langName}</h4><p>${cert.studentName} - ${new Date(cert.date).toLocaleDateString('fr-FR')}</p></div></div><button class="cert-card-btn" onclick="event.stopPropagation();downloadExistingCert('${cert.langId}')">Télécharger</button></div>`;
    });
    container.innerHTML = html;
}

const ADMIN_PASS = 'admin123';

function loadAdminPage() {
    document.getElementById('adminLoginBox').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminError').style.display = 'none';
    window._adminTab = 'users';
}

function checkAdminPass() {
    const pass = document.getElementById('adminPassword').value;
    if (pass === ADMIN_PASS) {
        document.getElementById('adminLoginBox').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        document.getElementById('adminError').style.display = 'none';
        loadAdminData(window._adminTab || 'users');
    } else {
        document.getElementById('adminError').style.display = 'block';
    }
}

function adminLogout() {
    loadAdminPage();
}

function switchAdminTab(tab, btn) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    window._adminTab = tab;
    loadAdminData(tab);
}

async function loadAdminData(tab) {
    const activeTab = tab || window._adminTab || 'users';
    const container = document.getElementById('adminContent');
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#888"><i class="fa-solid fa-spinner fa-spin" style="font-size:32px"></i><p style="margin-top:10px">Chargement...</p></div>';

    try {
        if (activeTab === 'users') {
            const snap = await db.collection('users').get();
            const data = [];
            snap.forEach(d => data.push(d.data()));
            document.getElementById('adminUsersCount').textContent = data.length;
            if (data.length === 0) {
                container.innerHTML = '<div style="text-align:center;padding:60px;color:#888"><i class="fa-solid fa-users" style="font-size:48px;margin-bottom:15px"></i><h3>Aucun utilisateur</h3><p style="margin-top:10px;font-size:14px;color:#666">Clique sur <strong style="color:#00b894">Sync</strong> pour importer les utilisateurs locaux vers le cloud.</p></div>';
                return;
            }
            let html = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>#</th><th>Nom</th><th>Email</th><th>Date d\'inscription</th></tr></thead><tbody>';
            data.reverse().forEach((u, i) => {
                const date = u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : 'N/A';
                html += `<tr><td>${i + 1}</td><td><strong>${u.name || 'N/A'}</strong></td><td>${u.email}</td><td>${date}</td></tr>`;
            });
            html += '</tbody></table></div>';
            container.innerHTML = html;
        } else if (activeTab === 'progress') {
            const userSnap = await db.collection('users').get();
            const userMap = {};
            userSnap.forEach(d => { const u = d.data(); userMap[u.email] = u.name; });

            const progSnap = await db.collection('progress').get();
            const progressData = [];
            progSnap.forEach(d => progressData.push(d.data()));
            if (progressData.length === 0) {
                container.innerHTML = '<div style="text-align:center;padding:60px;color:#888"><i class="fa-solid fa-chart-line" style="font-size:48px;margin-bottom:15px"></i><h3>Aucune progression</h3></div>';
                return;
            }
            let html = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>#</th><th>Utilisateur</th><th>Langage</th><th>Leçons</th><th>Examen</th><th>Dernière MAJ</th></tr></thead><tbody>';
            progressData.forEach((p, i) => {
                const lessons = p.lessons || [];
                const date = p.updated_at ? new Date(p.updated_at).toLocaleDateString('fr-FR') : 'N/A';
                const langCourse = COURSES[p.lang_id];
                html += `<tr><td>${i + 1}</td><td>${userMap[p.email] || p.email}</td><td>${langCourse ? langCourse.title : p.lang_id}</td><td>${lessons.length}</td><td>${p.exam_passed ? '<span class="badge-ok">Réussi</span>' : '<span class="badge-no">Non</span>'}</td><td>${date}</td></tr>`;
            });
            html += '</tbody></table></div>';
            container.innerHTML = html;
        } else if (activeTab === 'certificates') {
            const certSnap = await db.collection('certificates').get();
            const certs = [];
            certSnap.forEach(d => certs.push(d.data()));
            const userSnap = await db.collection('users').get();
            const userMap = {};
            userSnap.forEach(d => { const u = d.data(); userMap[u.email] = u.name; });
            if (certs.length === 0) {
                return;
            }
            certs.reverse();
            let html = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>#</th><th>Utilisateur</th><th>Langage</th><th>Certificat #</th><th>Date</th></tr></thead><tbody>';
            certs.forEach((c, i) => {
                const date = c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR') : 'N/A';
                const langCourse = COURSES[c.lang_id];
                html += `<tr><td>${i + 1}</td><td>${userMap[c.email] || c.email}</td><td>${langCourse ? langCourse.title : c.lang_id}</td><td style="font-size:11px">${c.cert_id || 'N/A'}</td><td>${date}</td></tr>`;
            });
            html += '</tbody></table></div>';
            container.innerHTML = html;
        }
    } catch(e) {
        container.innerHTML = `<div style="text-align:center;padding:40px;color:#e17055"><i class="fa-solid fa-triangle-exclamation" style="font-size:48px;margin-bottom:15px"></i><h3>Erreur de chargement</h3><p style="color:#bbb">Firestore est-il activé dans la console Firebase ?</p><p style="font-size:12px;color:#888">${e.message}</p></div>`;
    }
}

init();