// ============= GLOBAL STATE =============
let currentTool = 'dashboard';
let calcExpression = '';
let timerInterval = null;
let timerTime = 1500; // 25 minutes in seconds
let isTimerRunning = false;
let storageViewMode = localStorage.getItem('storageViewMode') || 'list';
let storageSortOrder = localStorage.getItem('storageSortOrder') || 'nameAsc';
let storageSearchQuery = '';
let compactDashboard = localStorage.getItem('compactDashboard') === 'true';

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializeEventListeners();
    loadFromLocalStorage();
    updateDashboardOverview();
    updateDashboardStyle();
    initializeStorageControls();
    updateConverterUnits();
});

function initializeSidebar() {
    fetch('/api/tools/list')
        .then(res => res.json())
        .then(data => {
            const sidebarNav = document.getElementById('sidebarNav');
            const dashboardGrid = document.getElementById('dashboardGrid');

            data.tools.forEach(tool => {
                // Create nav item
                const li = document.createElement('li');
                li.className = 'nav-item';
                const button = document.createElement('button');
                button.className = tool.id === 'dashboard' ? 'nav-link active' : 'nav-link';
                button.innerHTML = `<span class="nav-icon">${tool.icon}</span> ${tool.name}`;
                button.onclick = (e) => switchTool(tool.id, e);
                li.appendChild(button);
                sidebarNav.appendChild(li);

                // Add to dashboard grid
                if (tool.id !== 'dashboard') {
                    const card = document.createElement('div');
                    card.className = 'tool-card';
                    card.onclick = () => switchTool(tool.id);
                    card.innerHTML = `
                        <div class="tool-card-icon">${tool.icon}</div>
                        <div class="tool-card-name">${tool.name}</div>
                        <div class="tool-card-desc">${tool.description}</div>
                    `;
                    dashboardGrid.appendChild(card);
                }
            });
        })
        .catch(error => console.error('Failed to load tools:', error));
}

function switchTool(toolId, event) {
    currentTool = toolId;
    document.querySelectorAll('.tool-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(toolId).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (event?.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

function initializeEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Translator
    document.getElementById('translateBtn').addEventListener('click', translateText);

    // Calculator
    document.getElementById('calcDisplay').textContent = '0';

    // Storage
    document.getElementById('uploadBtn').addEventListener('click', uploadFile);
    document.getElementById('storageSearch').addEventListener('input', e => {
        storageSearchQuery = e.target.value.trim().toLowerCase();
        loadFilesList();
    });
    document.getElementById('storageSort').addEventListener('change', e => {
        storageSortOrder = e.target.value;
        localStorage.setItem('storageSortOrder', storageSortOrder);
        loadFilesList();
    });
    document.getElementById('storageViewListBtn').addEventListener('click', () => setStorageViewMode('list'));
    document.getElementById('storageViewGridBtn').addEventListener('click', () => setStorageViewMode('grid'));
    document.getElementById('storageGridToggle').addEventListener('change', e => {
        setStorageViewMode(e.target.checked ? 'grid' : 'list');
    });
    document.getElementById('quickUploadBtn').addEventListener('click', () => switchTool('storage'));
    document.getElementById('quickTodoBtn').addEventListener('click', () => switchTool('todo'));
    document.getElementById('quickNotesBtn').addEventListener('click', () => switchTool('notes'));
    document.getElementById('quickTimerBtn').addEventListener('click', () => switchTool('pomodoro'));
    loadFilesList();

    // To-Do
    document.getElementById('addTodoBtn').addEventListener('click', addTodo);
    document.getElementById('todoInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') addTodo();
    });

    // Notes
    document.getElementById('notesEditor').addEventListener('input', autoSaveNotes);

    // Converter
    document.getElementById('converterInput').addEventListener('input', convertUnits);
    document.getElementById('fromUnit').addEventListener('change', convertUnits);
    document.getElementById('toUnit').addEventListener('change', convertUnits);

    // Pomodoro
    document.getElementById('startTimer').addEventListener('click', startTimer);
    document.getElementById('pauseTimer').addEventListener('click', pauseTimer);
    document.getElementById('resetTimer').addEventListener('click', resetTimer);
    document.getElementById('focusTime').addEventListener('change', resetTimer);

    // PDF
    document.getElementById('extractBtn').addEventListener('click', extractPDF);

    // Settings
    document.getElementById('darkModeToggle').addEventListener('change', e => {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    });
    document.getElementById('compactDashboardToggle').addEventListener('change', e => {
        compactDashboard = e.target.checked;
        localStorage.setItem('compactDashboard', compactDashboard);
        updateDashboardStyle();
    });
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.getElementById('clearDataBtn').addEventListener('click', clearAllData);
}

// ============= TRANSLATOR =============
async function translateText() {
    const text = document.getElementById('translatorInput').value.trim();
    const targetLang = document.getElementById('targetLang').value;
    const sourceLang = document.getElementById('sourceLang').value;

    if (!text) {
        alert('Please enter text to translate');
        return;
    }

    try {
        const response = await fetch('/api/translator/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, targetLanguage: targetLang, sourceLanguage: sourceLang })
        });
        const data = await response.json();
        document.getElementById('translatorOutput').textContent = data.translatedText || data.error || 'Translation failed';
    } catch (error) {
        document.getElementById('translatorOutput').textContent = `Error: ${error.message}`;
    }
}

// ============= CALCULATOR =============
function appendToCalc(value) {
    if (calcExpression === '0' && value !== '.') {
        calcExpression = value;
    } else {
        calcExpression += value;
    }
    document.getElementById('calcDisplay').textContent = calcExpression;
}

function calculateResult() {
    try {
        fetch('/api/calculator/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expression: calcExpression })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    document.getElementById('calcDisplay').textContent = 'Error';
                } else {
                    calcExpression = String(data.result);
                    document.getElementById('calcDisplay').textContent = data.result;
                }
            });
    } catch (error) {
        document.getElementById('calcDisplay').textContent = 'Error';
    }
}

function clearCalc() {
    calcExpression = '';
    document.getElementById('calcDisplay').textContent = '0';
}

// ============= STORAGE =============
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        showStatus('uploadStatus', 'Please select a file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/storage/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            showStatus('uploadStatus', `File "${data.fileName}" uploaded successfully!`, 'success');
            fileInput.value = '';
            loadFilesList();
            updateDashboardOverview();
        } else {
            showStatus('uploadStatus', data.error, 'error');
        }
    } catch (error) {
        showStatus('uploadStatus', `Upload failed: ${error.message}`, 'error');
    }
}

async function loadFilesList() {
    try {
        const response = await fetch('/api/storage/files');
        const data = await response.json();
        const filesList = document.getElementById('filesList');
        filesList.innerHTML = '';

        if (data.files.length === 0) {
            filesList.innerHTML = '<p>No files uploaded yet</p>';
            return;
        }

        data.files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-name">📄 ${file.name}</div>
                    <div class="file-size">${(file.size / 1024).toFixed(2)} KB</div>
                </div>
                <div class="file-actions">
                    <button class="btn btn-secondary" onclick="downloadFile('${file.name}')">Download</button>
                    <button class="btn btn-danger" onclick="deleteFile('${file.name}')">Delete</button>
                </div>
            `;
            filesList.appendChild(fileItem);
        });
    } catch (error) {
        console.error('Failed to load files:', error);
    }
}

async function downloadFile(fileName) {
    try {
        const response = await fetch(`/api/storage/download/${encodeURIComponent(fileName)}`);
        const data = await response.json();
        window.open(data.downloadUrl, '_blank');
    } catch (error) {
        alert(`Download failed: ${error.message}`);
    }
}

async function deleteFile(fileName) {
    if (!confirm(`Delete file "${fileName}"?`)) return;
    try {
        const response = await fetch(`/api/storage/files/${encodeURIComponent(fileName)}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            loadFilesList();
            updateDashboardOverview();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert(`Delete failed: ${error.message}`);
    }
}

// ============= TO-DO LIST =============
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    if (!text) return;

    const todoList = document.getElementById('todoList');
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" onchange="toggleTodo(this)" />
        <span class="todo-text">${text}</span>
        <button class="todo-delete" onclick="removeTodo(this)">✕</button>
    `;
    todoList.appendChild(li);
    input.value = '';
    saveTodos();
    updateDashboardOverview();
}

function toggleTodo(checkbox) {
    checkbox.closest('.todo-item').classList.toggle('completed');
    saveTodos();
    updateDashboardOverview();
}

function removeTodo(btn) {
    btn.closest('.todo-item').remove();
    saveTodos();
    updateDashboardOverview();
}

function saveTodos() {
    const todos = [];
    document.querySelectorAll('.todo-item').forEach(item => {
        todos.push({
            text: item.querySelector('.todo-text').textContent,
            completed: item.classList.contains('completed')
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(this)" />
            <span class="todo-text">${todo.text}</span>
            <button class="todo-delete" onclick="removeTodo(this)">✕</button>
        `;
        todoList.appendChild(li);
    });
}

// ============= NOTES =============
let notesSaveTimeout;
function autoSaveNotes() {
    clearTimeout(notesSaveTimeout);
    notesSaveTimeout = setTimeout(() => {
        const notes = document.getElementById('notesEditor').value;
        localStorage.setItem('notes', notes);
        showStatus('notesStatus', 'Auto-saved', 'success');
        updateDashboardOverview();
        setTimeout(() => {
            document.getElementById('notesStatus').classList.remove('show');
        }, 2000);
    }, 5000);
}

function loadNotes() {
    const notes = localStorage.getItem('notes') || '';
    document.getElementById('notesEditor').value = notes;
}

// ============= UNIT CONVERTER =============
const conversions = {
    length: {
        units: ['meter', 'kilometer', 'centimeter', 'millimeter', 'mile', 'yard', 'foot', 'inch'],
        factors: { meter: 1, kilometer: 0.001, centimeter: 100, millimeter: 1000, mile: 0.000621371, yard: 1.09361, foot: 3.28084, inch: 39.3701 }
    },
    weight: {
        units: ['kilogram', 'gram', 'milligram', 'pound', 'ounce', 'ton'],
        factors: { kilogram: 1, gram: 1000, milligram: 1000000, pound: 2.20462, ounce: 35.274, ton: 0.001 }
    },
    temperature: {
        units: ['celsius', 'fahrenheit', 'kelvin'],
        custom: true
    },
    volume: {
        units: ['liter', 'milliliter', 'gallon', 'quart', 'pint', 'cup'],
        factors: { liter: 1, milliliter: 1000, gallon: 0.264172, quart: 1.05669, pint: 2.11338, cup: 4.22675 }
    }
};

function updateConverterUnits() {
    const type = document.getElementById('converterType').value;
    const fromSelect = document.getElementById('fromUnit');
    const toSelect = document.getElementById('toUnit');

    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    conversions[type].units.forEach(unit => {
        fromSelect.appendChild(new Option(unit, unit));
        toSelect.appendChild(new Option(unit, unit));
    });

    if (toSelect.options.length > 1) {
        toSelect.selectedIndex = 1;
    }
}

function convertUnits() {
    const type = document.getElementById('converterType').value;
    const value = parseFloat(document.getElementById('converterInput').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    if (!value || isNaN(value)) {
        document.getElementById('converterOutput').textContent = '';
        return;
    }

    let result;

    if (type === 'temperature') {
        if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
            result = (value * 9/5) + 32;
        } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
            result = (value - 32) * 5/9;
        } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
            result = value + 273.15;
        } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
            result = value - 273.15;
        } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
            result = (value - 32) * 5/9 + 273.15;
        } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
            result = (value - 273.15) * 9/5 + 32;
        } else {
            result = value;
        }
    } else {
        const factors = conversions[type].factors;
        const valueInBaseUnit = value * factors[fromUnit];
        result = valueInBaseUnit / factors[toUnit];
    }

    document.getElementById('converterOutput').textContent = `${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`;
}

// ============= POMODORO TIMER =============
function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    timerInterval = setInterval(() => {
        timerTime--;
        updateTimerDisplay();
        if (timerTime === 0) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            alert('Time\'s up!');
            resetTimer();
        }
    }, 1000);
}

function pauseTimer() {
    if (!isTimerRunning) return;
    clearInterval(timerInterval);
    isTimerRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    const focusTime = parseInt(document.getElementById('focusTime').value) || 25;
    timerTime = focusTime * 60;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerTime / 60);
    const seconds = timerTime % 60;
    document.getElementById('timerDisplay').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// ============= WORD COUNTER =============
function updateWordCount() {
    const text = document.getElementById('wordCounterInput').value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim()).length;

    document.getElementById('wordCount').textContent = words;
    document.getElementById('charCount').textContent = chars;
    document.getElementById('sentenceCount').textContent = sentences;
    document.getElementById('paragraphCount').textContent = paragraphs;
}

// ============= PDF EXTRACTOR =============
async function extractPDF() {
    const fileInput = document.getElementById('pdfInput');
    const file = fileInput.files[0];
    if (!file) {
        showStatus('pdfStatus', 'Please select a PDF file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
        const response = await fetch('/api/pdf/extract', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.text) {
            showStatus('pdfStatus', `Extracted from ${data.pages} page(s)`, 'success');
            document.getElementById('pdfOutput').textContent = data.text;
            fileInput.value = '';
        } else {
            showStatus('pdfStatus', data.error, 'error');
        }
    } catch (error) {
        showStatus('pdfStatus', `Extraction failed: ${error.message}`, 'error');
    }
}

// ============= SETTINGS =============
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    document.getElementById('themeToggle').textContent = isDarkMode ? '☀️' : '🌙';
    document.getElementById('darkModeToggle').checked = isDarkMode;
}

function exportData() {
    const data = {
        todos: localStorage.getItem('todos'),
        notes: localStorage.getItem('notes'),
        darkMode: localStorage.getItem('darkMode')
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'myunimate-data.json';
    link.click();
}

function clearAllData() {
    if (!confirm('Are you sure? This will delete all local data (todos, notes).')) return;
    localStorage.clear();
    alert('All data cleared!');
    location.reload();
}

// ============= UTILITIES =============
function showStatus(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `status-message show ${type}`;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 MB';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

function setStorageViewMode(mode) {
    storageViewMode = mode;
    localStorage.setItem('storageViewMode', storageViewMode);
    document.getElementById('storageViewListBtn').classList.toggle('active', mode === 'list');
    document.getElementById('storageViewGridBtn').classList.toggle('active', mode === 'grid');
    document.getElementById('storageGridToggle').checked = mode === 'grid';
    loadFilesList();
}

function initializeStorageControls() {
    document.getElementById('storageSort').value = storageSortOrder;
    document.getElementById('storageSearch').value = storageSearchQuery;
    setStorageViewMode(storageViewMode);
}

function updateDashboardStyle() {
    const dashboardSummary = document.getElementById('dashboardSummary');
    if (!dashboardSummary) return;
    dashboardSummary.classList.toggle('compact', compactDashboard);
    document.getElementById('compactDashboardToggle').checked = compactDashboard;
}

async function getStorageSummary() {
    try {
        const response = await fetch('/api/storage/summary');
        if (!response.ok) return { totalFiles: 0, totalSize: 0 };
        return await response.json();
    } catch (error) {
        return { totalFiles: 0, totalSize: 0 };
    }
}

function getFileTypeBadge(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const fileTypes = {
        pdf: 'PDF',
        doc: 'DOC',
        docx: 'DOCX',
        txt: 'TXT',
        xls: 'XLS',
        xlsx: 'XLSX',
        ppt: 'PPT',
        pptx: 'PPTX',
        jpg: 'IMG',
        jpeg: 'IMG',
        png: 'IMG',
        gif: 'IMG',
        mp4: 'VID',
        mp3: 'AUD',
        zip: 'ZIP',
        rar: 'ZIP'
    };
    return fileTypes[ext] || ext.toUpperCase() || 'FILE';
}

function sortFiles(files) {
    return files.sort((a, b) => {
        switch (storageSortOrder) {
            case 'nameAsc':
                return a.name.localeCompare(b.name);
            case 'nameDesc':
                return b.name.localeCompare(a.name);
            case 'sizeAsc':
                return a.size - b.size;
            case 'sizeDesc':
                return b.size - a.size;
            case 'dateAsc':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'dateDesc':
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
}

async function updateDashboardOverview() {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const notesText = localStorage.getItem('notes') || '';
    const storageSummary = await getStorageSummary();

    document.getElementById('dashboardFilesCount').textContent = `${storageSummary.totalFiles} files`;
    document.getElementById('dashboardStorageUsed').textContent = `${formatBytes(storageSummary.totalSize)} used`;
    document.getElementById('dashboardTasksCount').textContent = `${todos.filter(todo => !todo.completed).length} pending`;
    document.getElementById('dashboardNotesLength').textContent = `${notesText.length} characters`;
    document.getElementById('dashboardFocusLabel').textContent = 'Ready to work';

    document.getElementById('storageSummaryCount').textContent = `${storageSummary.totalFiles} files`;
    document.getElementById('storageSummarySize').textContent = formatBytes(storageSummary.totalSize);
}

async function loadFilesList() {
    try {
        const response = await fetch('/api/storage/files');
        const data = await response.json();
        const filesList = document.getElementById('filesList');
        filesList.innerHTML = '';
        filesList.className = `files-container ${storageViewMode}-view`;

        let files = data.files || [];
        if (storageSearchQuery) {
            files = files.filter(file => file.name.toLowerCase().includes(storageSearchQuery));
        }
        files = sortFiles(files);

        if (files.length === 0) {
            filesList.innerHTML = '<p>No files uploaded yet</p>';
            return;
        }

        files.forEach(file => {
            const typeBadge = getFileTypeBadge(file.name);
            const fileItem = document.createElement('div');
            fileItem.className = storageViewMode === 'grid' ? 'file-card' : 'file-row';
            fileItem.innerHTML = `
                <div class="file-card-top">
                    <div class="file-badge">${typeBadge}</div>
                    <div class="file-name">${file.name}</div>
                </div>
                <div class="file-row-meta">
                    <span>${formatBytes(file.size)}</span>
                    <span>${new Date(file.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="file-actions">
                    <button class="btn btn-secondary" onclick="downloadFile('${file.name}')">Download</button>
                    <button class="btn btn-danger" onclick="deleteFile('${file.name}')">Delete</button>
                </div>
            `;
            filesList.appendChild(fileItem);
        });
    } catch (error) {
        console.error('Failed to load files:', error);
    }
}

function loadFromLocalStorage() {
    loadTodos();
    loadNotes();
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').textContent = '☀️';
        document.getElementById('darkModeToggle').checked = true;
    }
    setStorageViewMode(storageViewMode);
    document.getElementById('storageSort').value = storageSortOrder;
    document.getElementById('storageSearch').value = storageSearchQuery;
    document.getElementById('compactDashboardToggle').checked = compactDashboard;
}
