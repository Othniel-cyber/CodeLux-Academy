function escapeHTML(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

const ICO = {
    lock: '<svg width="12" height="12" viewBox="0 0 448 512" fill="currentColor"><path d="M144 144v48H304V144c0-26.5-21.5-48-48-48s-48 21.5-48 48zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>',
    filePen: '<svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88l29.1-29.1c9.4-9.4 24.6-9.4 33.9 0zM205.3 76.7L162.4 119.5l98.2 98.2-42.8 42.8-98.2-98.2L77.8 271.4c-9.4 9.4-9.4 24.6 0 33.9l12.1 12.1 42.8-42.8L76.7 205.3c-9.4-9.4-9.4-24.6 0-33.9l.1.1c9.4-9.4 24.6-9.4 34 0l94.5 94.5 42.8-42.8L128.5 76.7c-9.4-9.4-24.6-9.4-33.9 0l-.1.1c-9.4 9.4-9.4 24.6-.1 33.9zM500.4 431.9l-86.1-86.1c-9.4-9.4-24.6-9.4-33.9 0l-29.1 29.1 86.1 86.1c9.4 9.4 24.6 9.4 33.9 0l29.1-29.1c9.4-9.4 9.4-24.6 0-33.9zM31.9 459.8l86.1 86.1c9.4 9.4 24.6 9.4 33.9 0l29.1-29.1-86.1-86.1c-9.4-9.4-24.6-9.4-33.9 0l-29.1 29.1c-9.4 9.4-9.4 24.6 0 33.9z"/></svg>',
    clipboard: '<svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor"><path d="M96 32H54.2C41.9 32 32.3 41.1 32.4 53.3L32 160c0 13.3 10.7 24 24 24H48c0-53 43-96 96-96h32c53 0 96 43 96 96h24c13.3 0 24-10.7 24-24v-6.7c.2-12.2-8.2-22.8-20.3-24.1L320 32h-17.8C289.2 13.3 269.7 0 247.8 0H200.2c-21.9 0-41.4 13.3-49.4 32H128zm224 96v32c0 35.3-28.7 64-64 64h-16v64H96V192h32c35.3 0 64-28.7 64-64V96h64zm-16 192H176c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V320c0-35.3-28.7-64-64-64z"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
    xmark: '<svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
    xmarkCircle: '<svg width="48" height="48" viewBox="0 0 512 512" fill="#e17055"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>',
    checkCircle: '<svg width="48" height="48" viewBox="0 0 512 512" fill="#00b894"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
    graduation: '<svg width="14" height="14" viewBox="0 0 640 512" fill="currentColor"><path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l128 46.7c32.4 11.7 68.2 11.7 100.6 0l184.3-66.3C486.3 155.7 512 134.2 512 106.9V376.3c0 18.6-11.3 35.5-28.8 42.5L258.5 503.3c-12.2 4.9-25.4 4.9-37.6 0L57.7 418.8C40.8 412 30 394.9 30 376.3V215.4L320 32z"/></svg>',
    download: '<svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-12.5 12.5-32.8 12.5-45.3 0L213.5 352H64z"/></svg>',
    certificate: '<svg width="48" height="48" viewBox="0 0 512 512" fill="#6c5ce7"><path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119.6 60.3 64 124.3 64 202.7V336c0 30.8 16.6 59.2 43.4 74.5L64 448v32h384V448l-43.4-37.3C377.4 395.2 394 366.8 394 336V202.7c0-78.4-55.6-142.4-128-151.5V32c0-17.7-14.3-32-32-32zm0 128c-17.7 0-32 14.3-32 32v16.3c37.6 7.6 64 41.4 64 81.7V336c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V202.7c0-40.3 26.4-74.1 64-81.7V160c0-17.7-14.3-32-32-32H224z"/></svg>',
    phone: '<svg width="22" height="22" viewBox="0 0 512 512" fill="currentColor"><path d="M184 0c-13.3 0-24 10.7-24 24V64H96C43 64 0 107 0 160V448c0 53 43 96 96 96H416c53 0 96-43 96-96V160c0-53-43-96-96-96H352V24c0-13.3-10.7-24-24-24H184zM288 256c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z"/></svg>',
    xmarkSmall: '<svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256l105.3-105.4z"/></svg>'
};

let currentLang = null;
let currentLessonIndex = 0;
let examAnswers = {};
let progress = {};
let certificates = [];
let studentName = '';

function init() {
    loadFromStorage();
}

function loadFromStorage() {
    try {
        const p = localStorage.getItem('codelux_progress');
        if (p) progress = JSON.parse(p);
    } catch(e) { progress = {}; }
    try {
        const c = localStorage.getItem('codelux_certificates');
        if (c) certificates = JSON.parse(c);
    } catch(e) { certificates = []; }
    try {
        const n = localStorage.getItem('codelux_student_name');
        if (n) studentName = n;
    } catch(e) { studentName = ''; }
}

function saveData() {
    localStorage.setItem('codelux_progress', JSON.stringify(progress));
    localStorage.setItem('codelux_certificates', JSON.stringify(certificates));
    if (studentName) localStorage.setItem('codelux_student_name', studentName);
}

function startApp() {
    document.getElementById('splash-screen').style.display = 'none';
    loadDashboard();
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(`page-${pageId}`);
    if (page) page.classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const links = { dashboard: 0, certificates: 1 };
    const idx = links[pageId];
    if (idx !== undefined) {
        const all = document.querySelectorAll('.nav-link');
        if (all[idx]) all[idx].classList.add('active');
    }
    if (pageId === 'dashboard') loadDashboard();
    if (pageId === 'certificates') loadCertificatesList();
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
            <div class="lang-icon" style="background:${lang.color}22;color:${lang.color}">${lang.svg}</div>
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
    const langData = LANGUAGES.find(l => l.id === langId);
    const svgIcon = langData ? langData.svg : '';
    let html = '<div class="courses-header"><h2><span class="course-header-icon">' + svgIcon + '</span> ' + course.title + '</h2><p>Complète toutes les leçons et réussis l\'examen final pour obtenir ton attestation !</p></div>';
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
                        <p>${isDone ? 'Quiz réussi !' : (canOpen ? 'Quiz à compléter' : ICO.lock + ' Complète la leçon précédente')}</p>
                    </div>
                </div>
                <span class="lesson-status ${isDone ? 'done' : (canOpen ? 'pending' : 'locked')}">${isDone ? 'Réussi' : (canOpen ? 'À faire' : ICO.lock)}</span>
            </div>
        `;
    });
    html += '</div>';
    const allDone = doneLessons.length >= course.lessons.length;
    html += `
        <div class="exam-section">
            <h3>${ICO.filePen} Examen Final</h3>
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
            <h3>${ICO.clipboard} Quiz - ${lesson.title}</h3>
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
            saveData();
        }
        const hasNext = currentLessonIndex < course.lessons.length - 1;
        fb.innerHTML = `
            <div class="quiz-feedback success">
                <div class="fb-icon">${ICO.checkCircle}</div>
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
                <div class="fb-icon">${ICO.xmarkCircle}</div>
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
    let html = `<div class="exam-header"><h2>${ICO.filePen} Examen Final - ${course.title}</h2><p>Réponds à toutes les questions (minimum ${course.exam.passingScore}/${questions.length} pour réussir)</p></div>`;
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
            <div class="exam-result-icon">${passed ? ICO.checkCircle : ICO.xmarkCircle}</div>
            <div class="exam-result-title">${passed ? 'Félicitations !' : 'Échoué'}</div>
            <div class="exam-result-score ${passed ? 'pass' : 'fail'}">${correct}/${total}</div>
            <div class="exam-result-msg">${passed ? 'Tu as réussi l\'examen final ! Tu mérites ton attestation.' : 'Tu n\'as pas atteint le score minimum (' + course.exam.passingScore + '/' + total + '). Réessaie !'}</div>
            ${passed ? `<button class="exam-btn" onclick="generateCertificate('${langId}')">${ICO.graduation} Obtenir mon attestation</button>` : `<button class="exam-btn" onclick="startExam('${langId}')">Réessayer</button>`}
            <button class="exam-nav-btn" style="margin-top:10px" onclick="showPage('dashboard')">Accueil</button>
        </div>
    `;
    if (passed) {
        if (!progress[langId]) progress[langId] = { lessons: [], examPassed: false };
        progress[langId].examPassed = true;
        saveData();
    }
    showPage('exam-result');
}

function generateCertificate(langId) {
    const course = COURSES[langId];
    if (!course) return;
    if (!studentName) {
        const name = prompt('Entrez votre nom pour l\'attestation :');
        if (!name) return;
        studentName = name;
        saveData();
    }
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
            <button class="download-btn" onclick="downloadCertificate()">${ICO.download} Télécharger l'attestation</button>
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

    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#6c5ce7';
    ctx.lineWidth = 10;
    ctx.strokeRect(6, 6, w - 12, h - 12);
    ctx.strokeStyle = '#d4c4ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    const corners = [
        [26, 26], [w - 26, 26], [26, h - 26], [w - 26, h - 26]
    ];
    ctx.fillStyle = '#6c5ce7';
    corners.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    });

    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#6c5ce7');
    grad.addColorStop(0.5, '#a29bfe');
    grad.addColorStop(1, '#6c5ce7');
    ctx.fillStyle = grad;
    ctx.fillRect(22, 22, w - 44, 12);

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.5);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(108, 92, 231, 0.06)';
    ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
    ctx.fillText('angelmahuenan@gmail.com', 0, -30);
    ctx.fillText('tohounkpinothniel@gmail.com', 0, 5);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2, h / 2 + 80);
    ctx.rotate(-0.5);
    ctx.fillStyle = 'rgba(108, 92, 231, 0.04)';
    ctx.font = '16px "Segoe UI", Arial, sans-serif';
    ctx.fillText('angelmahuenan@gmail.com  |  tohounkpinothniel@gmail.com', 0, 0);
    ctx.restore();

    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 40px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CodeLux Academy', w / 2, 100);

    ctx.fillStyle = '#6c5ce7';
    ctx.font = '20px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Attestation de Réussite', w / 2, 132);

    ctx.strokeStyle = '#6c5ce7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 148);
    ctx.lineTo(550, 148);
    ctx.stroke();

    ctx.fillStyle = '#fdcb6e';
    ctx.save();
    ctx.translate(w / 2, 148);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();

    ctx.fillStyle = '#555';
    ctx.font = '16px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Ceci certifie que', w / 2, 190);

    const fullName = studentName || 'Étudiant';
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 34px "Segoe UI", Arial, sans-serif';
    ctx.fillText(fullName, w / 2, 235);

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

    const today = new Date();
    const dateStr = `Délivré le ${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    ctx.fillStyle = '#999';
    ctx.font = '13px "Segoe UI", Arial, sans-serif';
    ctx.fillText(dateStr, w / 2, 385);

    ctx.fillStyle = '#6c5ce7';
    ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('CodeLux', 45, h - 75);
    ctx.fillStyle = '#888';
    ctx.font = '13px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Academy', 45, h - 55);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#bbb';
    ctx.font = '10px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`Certificat #${certId}`, w / 2, h - 22);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';

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
        saveData();
        window._lastCertData = imgData;
    }

    finalizeCert();
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
            <button class="download-btn" onclick="downloadExistingCert('${langId}')">${ICO.download} Télécharger</button>
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
        container.innerHTML = `<div style="text-align:center;padding:60px;color:#888"><div style="font-size:64px;margin-bottom:20px">${ICO.certificate}</div><h3 style="color:#fff;margin-bottom:10px">Aucune attestation pour l'instant</h3><p>Complète un cours et réussis l'examen pour obtenir ton attestation !</p></div>`;
        return;
    }
    let html = '';
    certificates.forEach(cert => {
        html += `<div class="cert-card" onclick="viewCertificate('${cert.langId}')"><div class="cert-card-left"><div class="cert-card-icon">${ICO.certificate}</div><div class="cert-card-info"><h4>${cert.langName}</h4><p>${cert.studentName} - ${new Date(cert.date).toLocaleDateString('fr-FR')}</p></div></div><button class="cert-card-btn" onclick="event.stopPropagation();downloadExistingCert('${cert.langId}')">Télécharger</button></div>`;
    });
    container.innerHTML = html;
}

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installBtn').style.display = 'inline-flex';
    const dismissed = localStorage.getItem('codelux_install_dismissed');
    if (!dismissed) {
        document.getElementById('install-banner').style.display = 'block';
    }
});

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    document.getElementById('installBtn').style.display = 'none';
    document.getElementById('install-banner').style.display = 'none';
    localStorage.removeItem('codelux_install_dismissed');
});

function installApp() {
    if (!deferredPrompt) {
        alert("Pour installer l'app :\n\nChrome/Edge : Menu > Installer l'application\nSafari (iPhone) : Partager > Ajouter a l'ecran d'acceil\nFirefox : Menu > Installer");
        return;
    }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((result) => {
        if (result.outcome === 'accepted') {
            document.getElementById('installBtn').style.display = 'none';
            document.getElementById('install-banner').style.display = 'none';
        }
        deferredPrompt = null;
    });
}

function dismissInstallBanner() {
    document.getElementById('install-banner').style.display = 'none';
    localStorage.setItem('codelux_install_dismissed', '1');
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
}
