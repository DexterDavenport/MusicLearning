// DOM Element References and Utilities

// Mode and navigation elements
export const modeButtons = document.querySelectorAll('.mode-btn');
export const practiceModes = document.querySelectorAll('.practice-mode');
export const instrumentButtons = document.querySelectorAll('.instrument-btn');

// Flashcard elements
export const startPracticeBtn = document.getElementById('start-practice-btn');
export const nextBtn = document.getElementById('next-btn');
export const revealBtn = document.getElementById('reveal-btn');
export const closeFlashcardBtn = document.getElementById('close-flashcard-btn');
export const restartPracticeBtn = document.getElementById('restart-practice-btn');
export const currentNoteDisplay = document.getElementById('current-note');

// Timer elements
export const timerDisplay = document.getElementById('timer-display');
export const timerProgress = document.getElementById('timer-progress');
export const timerCountdown = document.getElementById('timer-countdown');

// Completion elements
export const completionBanner = document.getElementById('completion-banner');

// Feedback elements
export const feedback = document.getElementById('feedback');
export const feedbackTitle = document.getElementById('feedback-title');
export const feedbackMessage = document.getElementById('feedback-message');
export const fretboardDisplay = document.getElementById('fretboard-display');

// Notes mode elements
export const notesGrid = document.getElementById('notes-grid');
export const selectedNoteInfo = document.getElementById('selected-note-info');
export const selectedNoteName = document.getElementById('selected-note-name');
export const noteFretboard = document.getElementById('note-fretboard');
export const chordVariationsList = document.getElementById('chord-variations-list');
export const tuningDisplay = document.getElementById('tuning-display');

// Flashcard view elements
export const flashcardSettingsElement = document.getElementById('flashcard-settings');
export const flashcardViewElement = document.getElementById('flashcard-view');

// Flashcard option elements
export const timeSlider = document.getElementById('time-slider');
export const timeDisplay = document.getElementById('time-display');
export const timingOptions = document.getElementById('timing-options');
export const chordTypeOptions = document.getElementById('chord-type-options');

// DOM Utility Functions
export function showElement(element) {
    if (element) element.style.display = 'block';
}

export function hideElement(element) {
    if (element) element.style.display = 'none';
}

export function showFlex(element) {
    if (element) element.style.display = 'flex';
}

export function addClass(element, className) {
    if (element) element.classList.add(className);
}

export function removeClass(element, className) {
    if (element) element.classList.remove(className);
}

export function setText(element, text) {
    if (element) element.textContent = text;
}

export function setHTML(element, html) {
    if (element) element.innerHTML = html;
}

export function getElement(selector) {
    return document.querySelector(selector);
}

export function getAllElements(selector) {
    return document.querySelectorAll(selector);
} 