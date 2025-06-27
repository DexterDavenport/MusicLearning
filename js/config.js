// Application Configuration and State Management

// Instrument Data - Loaded dynamically from JSON files
export let instruments = {};
export let availableInstruments = [];

// Application State
export let currentInstrument = 'mandolin';
export let currentNote = null;
export let isPracticeActive = false;
export let selectedNote = null;
export let selectedChordCategory = 'major';

// Flashcard Settings
export let flashcardSettings = {
    practiceType: 'notes', // 'notes', 'chords', 'both'
    direction: 'note-to-position', // 'note-to-position', 'position-to-note'
    mode: 'timed', // 'timed', 'manual'
    timeLimit: 3, // seconds
    chordTypes: ['major', 'minor', 'seventh', 'major7'] // which chord types to include
};

// Flashcard tracking
export let currentFlashcard = null;
export let flashcardTimer = null;
export let timerInterval = null;
export let timerStartTime = null;
export let timerDuration = null;
export let usedFlashcards = new Set();
export let availableFlashcards = [];

// State setters
export function setCurrentInstrument(instrument) {
    currentInstrument = instrument;
}

export function setCurrentNote(note) {
    currentNote = note;
}

export function setSelectedNote(note) {
    selectedNote = note;
}

export function setSelectedChordCategory(category) {
    selectedChordCategory = category;
}

export function setFlashcardSettings(settings) {
    Object.assign(flashcardSettings, settings);
}

export function setInstruments(newInstruments) {
    instruments = newInstruments;
}

export function setAvailableInstruments(newAvailable) {
    availableInstruments = newAvailable;
}

export function setCurrentFlashcard(flashcard) {
    currentFlashcard = flashcard;
}

export function setPracticeActive(active) {
    isPracticeActive = active;
}

// Timer setters
export function setFlashcardTimer(timer) {
    flashcardTimer = timer;
}

export function setTimerInterval(interval) {
    timerInterval = interval;
}

export function setTimerStartTime(time) {
    timerStartTime = time;
}

export function setTimerDuration(duration) {
    timerDuration = duration;
}

export function clearFlashcardTracking() {
    usedFlashcards.clear();
    availableFlashcards = [];
    currentFlashcard = null;
}

export function clearTimers() {
    if (flashcardTimer) {
        clearTimeout(flashcardTimer);
        flashcardTimer = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
} 