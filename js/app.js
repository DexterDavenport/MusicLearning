// Main Application Module

import {
    setFlashcardSettings,
    flashcardSettings
} from './config.js';

import {
    modeButtons,
    practiceModes,
    startPracticeBtn,
    nextBtn,
    revealBtn,
    closeFlashcardBtn,
    restartPracticeBtn,
    timeSlider,
    timeDisplay,
    timingOptions,
    chordTypeOptions,
    showElement,
    hideElement,
    addClass,
    removeClass,
    setText
} from './dom.js';

import {
    loadInstruments,
    initializeInstrumentSelector,
    updateInstrumentDisplay,
    switchInstrument as _switchInstrument
} from './instruments.js';

import {
    startPractice,
    nextFlashcard,
    restartPractice,
    closeFlashcard
} from './flashcards.js';

import { revealAnswer } from './feedback.js';

import { initializeNotesMode, handleInstrumentSwitch } from './notes.js';

// Initialize the application
export async function initializeApp() {
    await loadInstruments();
    await initializeInstrumentSelector();
    // Patch instrument button click handlers to use the correct switchInstrument
    document.querySelectorAll('.instrument-btn').forEach(btn => {
        btn.onclick = () => switchInstrument(btn.dataset.instrument);
    });
    initializeModeSwitching();
    initializeFlashcards();
    initializeNotesMode();
    await updateInstrumentDisplay();

    // Initialize timing options visibility
    showElement(timingOptions); // Default to timed mode

    // Initialize chord type options visibility
    hideElement(chordTypeOptions); // Default to notes mode
}

// Initialize mode switching
function initializeModeSwitching() {
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            switchMode(mode);
        });
    });
}

// Switch between practice modes
function switchMode(mode) {
    // Update active button
    modeButtons.forEach(btn => {
        removeClass(btn, 'active');
        if (btn.dataset.mode === mode) {
            addClass(btn, 'active');
        }
    });

    // Update active practice mode
    practiceModes.forEach(practiceMode => {
        removeClass(practiceMode, 'active');
        if (practiceMode.id === `${mode}-mode`) {
            addClass(practiceMode, 'active');
        }
    });

    // If switching to notes mode, select first note or restore last
    if (mode === 'notes') {
        handleInstrumentSwitch();
    }
}

// Initialize flashcard functionality
function initializeFlashcards() {
    // Initialize option buttons
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Don't allow clicking disabled buttons
            if (btn.disabled) {
                return;
            }

            const type = btn.dataset.type;
            const option = btn.dataset.option;

            // Handle chord type selection (toggle active state)
            if (type === 'chordType') {
                // Toggle the active state
                if (btn.classList.contains('active')) {
                    removeClass(btn, 'active');
                } else {
                    addClass(btn, 'active');
                }

                // Update chord types array
                const activeChordTypes = Array.from(document.querySelectorAll('[data-type="chordType"].active'))
                    .map(b => b.dataset.option);

                // Ensure at least one chord type is selected
                if (activeChordTypes.length === 0) {
                    addClass(btn, 'active');
                    activeChordTypes.push(option);
                }

                setFlashcardSettings({ chordTypes: activeChordTypes });

                console.log('Flashcard settings updated:', flashcardSettings);
                return;
            }

            // Update active state for this option type (single selection)
            document.querySelectorAll(`[data-type="${type}"]`).forEach(b => removeClass(b, 'active'));
            addClass(btn, 'active');

            // Update settings - map the data-type to the correct property name
            if (type === 'practice') {
                setFlashcardSettings({ practiceType: option });
            } else {
                setFlashcardSettings({ [type]: option });
            }

            // Handle special cases
            if (type === 'mode') {
                if (option === 'timed') {
                    showElement(timingOptions);
                } else {
                    hideElement(timingOptions);
                }
            } else if (type === 'practice') {
                // Show/hide chord type options based on practice type
                if (option === 'chords' || option === 'both') {
                    showElement(chordTypeOptions);
                } else {
                    hideElement(chordTypeOptions);
                }
            }

            console.log('Flashcard settings updated:', flashcardSettings);
        });
    });

    // Initialize time slider
    timeSlider.addEventListener('input', (e) => {
        const time = parseInt(e.target.value);
        setFlashcardSettings({ timeLimit: time });
        setText(timeDisplay, `${time} second${time !== 1 ? 's' : ''}`);
    });

    // Initialize control buttons
    startPracticeBtn.addEventListener('click', startPractice);
    nextBtn.addEventListener('click', nextFlashcard);
    revealBtn.addEventListener('click', revealAnswer);
    closeFlashcardBtn.addEventListener('click', closeFlashcard);
    restartPracticeBtn.addEventListener('click', restartPractice);
}

// Patch instrument switch to restore last note/chord
import { handleInstrumentSwitch as _handleInstrumentSwitch } from './notes.js';
export async function switchInstrument(instrumentName) {
    await _switchInstrument(instrumentName);
    _handleInstrumentSwitch();
} 