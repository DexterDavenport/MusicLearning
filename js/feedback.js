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

import { createSVGFretboard, createChordSVG } from './fretboard.js';

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

    const svg = createSVGFretboard(instruments[currentInstrument], note.note);
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