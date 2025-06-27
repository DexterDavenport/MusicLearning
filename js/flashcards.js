// Flashcard Management Module

import {
    instruments,
    currentInstrument,
    flashcardSettings,
    usedFlashcards,
    availableFlashcards,
    setCurrentFlashcard,
    setPracticeActive,
    clearFlashcardTracking,
    clearTimers
} from './config.js';

import {
    currentNoteDisplay,
    timerDisplay,
    nextBtn,
    revealBtn,
    feedback,
    completionBanner,
    flashcardSettingsElement,
    flashcardViewElement,
    showElement,
    hideElement,
    showFlex,
    setText
} from './dom.js';

import { startTimer } from './timer.js';

// Generate all available flashcards
export function generateAllFlashcards() {
    const instrument = instruments[currentInstrument];
    availableFlashcards.length = 0; // Clear array
    usedFlashcards.clear();

    console.log('Generating all flashcards for practice type:', flashcardSettings.practiceType);

    if (flashcardSettings.practiceType === 'notes') {
        // Generate all note flashcards with string-specific questions
        instrument.strings.forEach((string, stringIndex) => {
            const startFret = string.startFret || 0;

            string.frets.forEach((note, fretIndex) => {
                const actualFret = startFret + fretIndex;
                const flashcardId = `note-${note}-${string.name}-${actualFret}`;

                availableFlashcards.push({
                    id: flashcardId,
                    type: 'note',
                    question: `${note} on ${string.name}`,
                    answer: {
                        note: note,
                        string: string.name,
                        fret: actualFret,
                        stringIndex: stringIndex
                    },
                    position: `${string.name}, fret ${actualFret}`,
                    targetString: string.name,
                    targetNote: note
                });
            });
        });
    } else if (flashcardSettings.practiceType === 'chords') {
        // Generate all chord flashcards
        Object.keys(instrument.chords).forEach(chordName => {
            const chord = instrument.chords[chordName];
            Object.keys(chord).forEach(category => {
                if (flashcardSettings.chordTypes.includes(category)) {
                    const flashcardId = `chord-${chordName}-${category}`;

                    availableFlashcards.push({
                        id: flashcardId,
                        type: 'chord',
                        question: `${chordName} ${category}`,
                        answer: {
                            name: chordName,
                            category: category,
                            description: chord[category].description,
                            positions: chord[category].positions
                        },
                        position: `${chordName} ${category} chord`
                    });
                }
            });
        });
    } else if (flashcardSettings.practiceType === 'both') {
        // Generate both notes and chords
        // Notes with string-specific questions
        instrument.strings.forEach((string, stringIndex) => {
            const startFret = string.startFret || 0;

            string.frets.forEach((note, fretIndex) => {
                const actualFret = startFret + fretIndex;
                const flashcardId = `note-${note}-${string.name}-${actualFret}`;

                availableFlashcards.push({
                    id: flashcardId,
                    type: 'note',
                    question: `${note} on ${string.name} string`,
                    answer: {
                        note: note,
                        string: string.name,
                        fret: actualFret,
                        stringIndex: stringIndex
                    },
                    position: `${string.name}, fret ${actualFret}`,
                    targetString: string.name,
                    targetNote: note
                });
            });
        });

        // Chords
        Object.keys(instrument.chords).forEach(chordName => {
            const chord = instrument.chords[chordName];
            Object.keys(chord).forEach(category => {
                if (flashcardSettings.chordTypes.includes(category)) {
                    const flashcardId = `chord-${chordName}-${category}`;

                    availableFlashcards.push({
                        id: flashcardId,
                        type: 'chord',
                        question: `${chordName} ${category}`,
                        answer: {
                            name: chordName,
                            category: category,
                            description: chord[category].description,
                            positions: chord[category].positions
                        },
                        position: `${chordName} ${category} chord`
                    });
                }
            });
        });
    }

    console.log(`Generated ${availableFlashcards.length} flashcards`);
}

// Get a random unused flashcard
export function getRandomUnusedFlashcard() {
    const unusedFlashcards = availableFlashcards.filter(flashcard => !usedFlashcards.has(flashcard.id));

    if (unusedFlashcards.length === 0) {
        return null; // All flashcards have been used
    }

    const randomIndex = Math.floor(Math.random() * unusedFlashcards.length);
    const selectedFlashcard = unusedFlashcards[randomIndex];

    // Mark as used
    usedFlashcards.add(selectedFlashcard.id);

    return selectedFlashcard;
}

// Start practice session
export function startPractice() {
    setPracticeActive(true);

    // Generate all available flashcards
    generateAllFlashcards();

    // Switch to flashcard view
    hideElement(flashcardSettingsElement);
    showFlex(flashcardViewElement);

    showElement(nextBtn);
    hideElement(feedback);

    // Show/hide timer and reveal button based on mode
    if (flashcardSettings.mode === 'timed') {
        showElement(timerDisplay);
        hideElement(revealBtn);
    } else {
        hideElement(timerDisplay);
        showElement(revealBtn);
    }

    nextFlashcard();
}

// Get next flashcard
export function nextFlashcard() {
    // Clear any existing timer
    clearTimers();

    // Get next unused flashcard
    const flashcard = getRandomUnusedFlashcard();
    setCurrentFlashcard(flashcard);

    // Check if all flashcards have been used
    if (!flashcard) {
        showCompletionBanner();
        return;
    }

    console.log('Current flashcard:', flashcard);

    // Display the flashcard
    if (flashcardSettings.direction === 'note-to-position') {
        setText(currentNoteDisplay, flashcard.question);
    } else {
        // Position to note - show fretboard position
        if (flashcard.type === 'note') {
            setText(currentNoteDisplay, `Find the note at: ${flashcard.position}`);
        } else {
            setText(currentNoteDisplay, `Find the chord: ${flashcard.position}`);
        }
    }

    // Set up timer or manual reveal
    if (flashcardSettings.mode === 'timed') {
        startTimer();
    }

    // Hide feedback
    hideElement(feedback);
}

// Show completion banner
export function showCompletionBanner() {
    // Hide all other elements
    hideElement(timerDisplay);
    hideElement(nextBtn);
    hideElement(revealBtn);
    hideElement(feedback);

    // Show completion banner
    showFlex(completionBanner);
}

// Restart practice
export function restartPractice() {
    // Hide completion banner
    hideElement(completionBanner);

    // Reset and start new practice session
    generateAllFlashcards();
    showElement(nextBtn);

    if (flashcardSettings.mode === 'timed') {
        showElement(timerDisplay);
        hideElement(revealBtn);
    } else {
        hideElement(timerDisplay);
        showElement(revealBtn);
    }

    nextFlashcard();
}

// Close flashcard and return to settings
export function closeFlashcard() {
    setPracticeActive(false);

    // Clear timer and tracking
    clearTimers();
    clearFlashcardTracking();

    // Switch back to settings view
    showFlex(flashcardSettingsElement);
    hideElement(flashcardViewElement);

    // Reset practice state
    resetPractice();
}

// Reset practice state
export function resetPractice() {
    setPracticeActive(false);
    setCurrentFlashcard(null);

    // Clear timer and tracking
    clearTimers();
    clearFlashcardTracking();

    // Hide timer display and completion banner
    hideElement(timerDisplay);
    hideElement(completionBanner);

    hideElement(nextBtn);
    hideElement(revealBtn);
    hideElement(feedback);
    setText(currentNoteDisplay, 'Click Start to Begin');
} 