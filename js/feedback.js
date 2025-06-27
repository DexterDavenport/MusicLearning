// Feedback Management Module

import {
    currentFlashcard,
    instruments,
    currentInstrument
} from './config.js';

import {
    feedback,
    feedbackTitle,
    feedbackMessage,
    fretboardDisplay,
    showElement,
    setText,
    setHTML
} from './dom.js';

import { createSVGFretboard, createChordSVG, findNotePositions } from './fretboard.js';

// Show flashcard feedback
export function showFlashcardFeedback() {
    if (!currentFlashcard) return;

    if (currentFlashcard.type === 'note') {
        showNoteFeedback(currentFlashcard.answer);
    } else {
        showChordFeedback(currentFlashcard.answer);
    }

    showElement(feedback);
}

// Show note feedback
export function showNoteFeedback(note) {
    setText(feedbackTitle, `Note: ${note.note}`);
    setText(feedbackMessage, `Position: ${note.string}, fret ${note.fret}`);

    // Create fretboard showing only the specific note position
    const svg = createSVGFretboard(instruments[currentInstrument], note.note, note.string, note.fret);
    setHTML(fretboardDisplay, svg);
}

// Show chord feedback
export function showChordFeedback(chord) {
    setText(feedbackTitle, `${chord.name} ${chord.category}`);
    setText(feedbackMessage, chord.description);

    const svg = createChordSVG(instruments[currentInstrument], chord.positions[0], `${chord.name} ${chord.category}`);
    setHTML(fretboardDisplay, svg);
}

// Reveal answer manually
export function revealAnswer() {
    showFlashcardFeedback();
} 