// Instrument Data - Now loaded dynamically from JSON files
let instruments = {};
let availableInstruments = [];

// Application State
let currentInstrument = 'mandolin';
let currentNote = null;
let isPracticeActive = false;
let selectedNote = null;
let selectedChordCategory = 'major';

// Flashcard Settings
let flashcardSettings = {
    practiceType: 'notes', // 'notes', 'chords', 'both'
    direction: 'note-to-position', // 'note-to-position', 'position-to-note'
    mode: 'timed', // 'timed', 'manual'
    timeLimit: 3, // seconds
    chordTypes: ['major', 'minor', 'seventh', 'major7'] // which chord types to include
};

let currentFlashcard = null;
let flashcardTimer = null;
let timerInterval = null;
let timerStartTime = null;
let timerDuration = null;

// Flashcard tracking
let usedFlashcards = new Set();
let availableFlashcards = [];

// DOM Elements
const modeButtons = document.querySelectorAll('.mode-btn');
const practiceModes = document.querySelectorAll('.practice-mode');
const instrumentButtons = document.querySelectorAll('.instrument-btn');
const startPracticeBtn = document.getElementById('start-practice-btn');
const nextBtn = document.getElementById('next-btn');
const revealBtn = document.getElementById('reveal-btn');
const closeFlashcardBtn = document.getElementById('close-flashcard-btn');
const currentNoteDisplay = document.getElementById('current-note');
const feedback = document.getElementById('feedback');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackMessage = document.getElementById('feedback-message');
const fretboardDisplay = document.getElementById('fretboard-display');
const notesGrid = document.getElementById('notes-grid');
const selectedNoteInfo = document.getElementById('selected-note-info');
const selectedNoteName = document.getElementById('selected-note-name');
const noteFretboard = document.getElementById('note-fretboard');
const chordVariationsList = document.getElementById('chord-variations-list');
const tuningDisplay = document.getElementById('tuning-display');

// Flashcard view elements
const flashcardSettingsElement = document.getElementById('flashcard-settings');
const flashcardViewElement = document.getElementById('flashcard-view');

// Timer elements
const timerDisplay = document.getElementById('timer-display');
const timerProgress = document.getElementById('timer-progress');
const timerCountdown = document.getElementById('timer-countdown');

// Completion elements
const completionBanner = document.getElementById('completion-banner');
const restartPracticeBtn = document.getElementById('restart-practice-btn');

// Flashcard option elements
const timeSlider = document.getElementById('time-slider');
const timeDisplay = document.getElementById('time-display');
const timingOptions = document.getElementById('timing-options');
const chordTypeOptions = document.getElementById('chord-type-options');

// Load instrument data from JSON files
async function loadInstruments() {
    try {
        // Get list of available instruments from the instruments folder
        const response = await fetch('./instruments/');
        if (!response.ok) {
            throw new Error('Could not access instruments folder');
        }

        // For now, we'll hardcode the known instruments since we can't list directory contents
        // In a real server environment, you'd want to implement a server-side endpoint to list files
        const instrumentFiles = ['mandolin.json', 'guitar.json', 'ukulele.json', 'banjo.json'];

        for (const fileName of instrumentFiles) {
            try {
                const instrumentResponse = await fetch(`./instruments/${fileName}`);
                if (instrumentResponse.ok) {
                    const instrumentData = await instrumentResponse.json();
                    const instrumentKey = fileName.replace('.json', '');
                    instruments[instrumentKey] = instrumentData;
                    availableInstruments.push(instrumentKey);
                }
            } catch (error) {
                console.warn(`Failed to load ${fileName}:`, error);
            }
        }

        console.log('Loaded instruments:', availableInstruments);
        return true;
    } catch (error) {
        console.error('Error loading instruments:', error);
        // Fallback to hardcoded data if JSON loading fails
        loadFallbackInstruments();
        return false;
    }
}

// Fallback instrument data if JSON loading fails
function loadFallbackInstruments() {
    instruments = {
        mandolin: {
            name: "Mandolin",
            icon: "🎸",
            tuning: ["G", "D", "A", "E"],
            strings: [
                {
                    name: "G String",
                    open: "G",
                    frets: ["G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G"]
                },
                {
                    name: "D String",
                    open: "D",
                    frets: ["D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db", "D"]
                },
                {
                    name: "A String",
                    open: "A",
                    frets: ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A"]
                },
                {
                    name: "E String",
                    open: "E",
                    frets: ["E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E"]
                }
            ],
            chords: {
                "C": {
                    "major": { positions: [[0, 2, 2, 3]], notes: ["C", "E", "G"], description: "Open C major chord" },
                    "minor": { positions: [[3, 3, 3, 1]], notes: ["C", "D#", "G"], description: "C minor chord" },
                    "seventh": { positions: [[0, 2, 2, 1]], notes: ["C", "E", "G", "A#"], description: "C dominant 7th" },
                    "major7": { positions: [[0, 2, 2, 2]], notes: ["C", "E", "G", "B"], description: "C major 7th" }
                },
                "G": {
                    "major": { positions: [[0, 0, 2, 3]], notes: ["G", "D", "A", "E"], description: "Open G major chord" },
                    "minor": { positions: [[3, 3, 3, 1]], notes: ["G#", "D", "A#", "F"], description: "G minor chord" },
                    "seventh": { positions: [[0, 0, 2, 1]], notes: ["G", "D", "A", "D"], description: "G dominant 7th" },
                    "major7": { positions: [[0, 0, 2, 2]], notes: ["G", "D", "A", "F#"], description: "G major 7th" }
                },
                "D": {
                    "major": { positions: [[2, 0, 0, 2]], notes: ["A", "D", "A", "F#"], description: "Open D major chord" },
                    "minor": { positions: [[2, 0, 0, 1]], notes: ["A", "D", "A", "F"], description: "D minor chord" },
                    "seventh": { positions: [[2, 0, 0, 0]], notes: ["A", "D", "A", "C"], description: "D dominant 7th" },
                    "major7": { positions: [[2, 0, 0, 1]], notes: ["A", "D", "A", "F"], description: "D major 7th" }
                },
                "A": {
                    "major": { positions: [[2, 2, 2, 0]], notes: ["A", "F#", "C#", "A"], description: "Open A major chord" },
                    "minor": { positions: [[2, 2, 2, 0]], notes: ["A", "F", "C", "A"], description: "A minor chord" },
                    "seventh": { positions: [[2, 2, 2, 0]], notes: ["A", "F#", "C", "A"], description: "A dominant 7th" },
                    "major7": { positions: [[2, 2, 2, 0]], notes: ["A", "F#", "C#", "G#"], description: "A major 7th" }
                },
                "E": {
                    "major": { positions: [[0, 2, 2, 0]], notes: ["E", "F#", "C#", "E"], description: "Open E major chord" },
                    "minor": { positions: [[0, 2, 2, 0]], notes: ["E", "F", "C", "E"], description: "E minor chord" },
                    "seventh": { positions: [[0, 2, 0, 0]], notes: ["E", "F#", "B", "E"], description: "E dominant 7th" },
                    "major7": { positions: [[0, 2, 1, 0]], notes: ["E", "F#", "B", "D#"], description: "E major 7th" }
                }
            }
        }
    };
    availableInstruments = ['mandolin'];
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async function () {
    await loadInstruments();
    initializeInstrumentSelector();
    initializeModeSwitching();
    initializeFlashcards();
    initializeNotesMode();
    updateInstrumentDisplay();

    // Initialize timing options visibility
    timingOptions.style.display = 'block'; // Default to timed mode

    // Initialize chord type options visibility
    chordTypeOptions.style.display = 'none'; // Default to notes mode
});

// Instrument Management
function initializeInstrumentSelector() {
    const instrumentContainer = document.querySelector('.instrument-buttons');

    // Clear existing buttons
    instrumentContainer.innerHTML = '';

    // Create buttons for each available instrument
    availableInstruments.forEach(instrumentKey => {
        const instrument = instruments[instrumentKey];
        const button = document.createElement('button');
        button.className = 'instrument-btn';
        button.dataset.instrument = instrumentKey;
        button.innerHTML = `<span class="instrument-icon">${instrument.icon}</span><span class="instrument-name">${instrument.name}</span>`;

        button.addEventListener('click', () => {
            switchInstrument(instrumentKey);
        });

        instrumentContainer.appendChild(button);
    });

    // Set the first instrument as active by default
    if (availableInstruments.length > 0) {
        const firstButton = instrumentContainer.querySelector(`[data-instrument="${availableInstruments[0]}"]`);
        if (firstButton) {
            firstButton.classList.add('active');
        }
    }
}

function switchInstrument(instrumentName) {
    if (instruments[instrumentName]) {
        currentInstrument = instrumentName;

        // Update active button state
        const instrumentContainer = document.querySelector('.instrument-buttons');
        const allButtons = instrumentContainer.querySelectorAll('.instrument-btn');
        allButtons.forEach(btn => btn.classList.remove('active'));

        const activeButton = instrumentContainer.querySelector(`[data-instrument="${instrumentName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Update page title and header
        document.title = `${instruments[instrumentName].name} Practice - Notes & Lessons`;
        document.querySelector('header h1').textContent = `🎵 ${instruments[instrumentName].name} Practice`;

        // Update displays
        updateInstrumentDisplay();

        // Reset practice if active
        if (isPracticeActive) {
            resetPractice();
        }

        // Refresh notes display if in notes mode
        if (document.querySelector('.practice-mode.active').id === 'notes-mode') {
            renderNotesGrid();
        }

        console.log(`Switched to ${instruments[instrumentName].name}`);
    }
}

function updateInstrumentDisplay() {
    const instrument = instruments[currentInstrument];
    const tuning = instrument.tuning.join('-');
    tuningDisplay.textContent = `Standard Tuning: ${tuning}`;

    // Check if instrument has chords and update chord practice option
    const hasChords = Object.keys(instrument.chords).length > 0;
    const chordButtons = document.querySelectorAll('[data-option="chords"], [data-option="both"]');

    chordButtons.forEach(btn => {
        if (hasChords) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.title = '';
        } else {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.title = 'No chords available for this instrument';
        }
    });

    // If current practice type is chords but no chords available, switch to notes
    if (!hasChords && (flashcardSettings.practiceType === 'chords' || flashcardSettings.practiceType === 'both')) {
        flashcardSettings.practiceType = 'notes';
        document.querySelector('[data-option="notes"]').classList.add('active');
        document.querySelector('[data-option="chords"]').classList.remove('active');
        document.querySelector('[data-option="both"]').classList.remove('active');
    }
}

// Mode Switching
function initializeModeSwitching() {
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.mode;
            switchMode(mode);
        });
    });
}

function switchMode(mode) {
    // Update button states
    modeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

    // Update practice mode visibility
    practiceModes.forEach(pm => pm.classList.remove('active'));
    document.getElementById(`${mode}-mode`).classList.add('active');

    // Reset practice state when switching modes
    if (mode === 'notes') {
        resetPractice();
        renderNotesGrid();
    }
}

// Flashcards Functionality
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
                btn.classList.toggle('active');

                // Update chord types array
                const activeChordTypes = Array.from(document.querySelectorAll('[data-type="chordType"].active'))
                    .map(b => b.dataset.option);

                // Ensure at least one chord type is selected
                if (activeChordTypes.length === 0) {
                    btn.classList.add('active');
                    activeChordTypes.push(option);
                }

                flashcardSettings.chordTypes = activeChordTypes;

                console.log('Flashcard settings updated:', flashcardSettings);
                return;
            }

            // Update active state for this option type (single selection)
            document.querySelectorAll(`[data-type="${type}"]`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update settings - map the data-type to the correct property name
            if (type === 'practice') {
                flashcardSettings.practiceType = option;
            } else {
                flashcardSettings[type] = option;
            }

            // Handle special cases
            if (type === 'mode') {
                timingOptions.style.display = option === 'timed' ? 'block' : 'none';
            } else if (type === 'practice') {
                // Show/hide chord type options based on practice type
                chordTypeOptions.style.display = (option === 'chords' || option === 'both') ? 'block' : 'none';
            }

            console.log('Flashcard settings updated:', flashcardSettings);
        });
    });

    // Initialize time slider
    timeSlider.addEventListener('input', (e) => {
        const time = parseInt(e.target.value);
        flashcardSettings.timeLimit = time;
        timeDisplay.textContent = `${time} second${time !== 1 ? 's' : ''}`;
    });

    // Initialize control buttons
    startPracticeBtn.addEventListener('click', startPractice);
    nextBtn.addEventListener('click', nextFlashcard);
    revealBtn.addEventListener('click', revealAnswer);
    closeFlashcardBtn.addEventListener('click', closeFlashcard);
    restartPracticeBtn.addEventListener('click', restartPractice);
}

function startPractice() {
    isPracticeActive = true;

    // Generate all available flashcards
    generateAllFlashcards();

    // Switch to flashcard view
    flashcardSettingsElement.style.display = 'none';
    flashcardViewElement.style.display = 'flex';

    nextBtn.style.display = 'inline-block';
    feedback.style.display = 'none';

    // Show/hide timer and reveal button based on mode
    if (flashcardSettings.mode === 'timed') {
        timerDisplay.style.display = 'block';
        revealBtn.style.display = 'none';
    } else {
        timerDisplay.style.display = 'none';
        revealBtn.style.display = 'inline-block';
    }

    nextFlashcard();
}

function generateAllFlashcards() {
    const instrument = instruments[currentInstrument];
    availableFlashcards = [];
    usedFlashcards.clear();

    console.log('Generating all flashcards for practice type:', flashcardSettings.practiceType);

    if (flashcardSettings.practiceType === 'notes') {
        // Generate all note flashcards
        instrument.strings.forEach((string, stringIndex) => {
            const startFret = string.startFret || 0;

            string.frets.forEach((note, fretIndex) => {
                const actualFret = startFret + fretIndex;
                const flashcardId = `note-${note}-${string.name}-${actualFret}`;

                availableFlashcards.push({
                    id: flashcardId,
                    type: 'note',
                    question: note,
                    answer: {
                        note: note,
                        string: string.name,
                        fret: actualFret,
                        stringIndex: stringIndex
                    },
                    position: `${string.name}, fret ${actualFret}`
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
        // Notes
        instrument.strings.forEach((string, stringIndex) => {
            const startFret = string.startFret || 0;

            string.frets.forEach((note, fretIndex) => {
                const actualFret = startFret + fretIndex;
                const flashcardId = `note-${note}-${string.name}-${actualFret}`;

                availableFlashcards.push({
                    id: flashcardId,
                    type: 'note',
                    question: note,
                    answer: {
                        note: note,
                        string: string.name,
                        fret: actualFret,
                        stringIndex: stringIndex
                    },
                    position: `${string.name}, fret ${actualFret}`
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

function getRandomUnusedFlashcard() {
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

function nextFlashcard() {
    // Clear any existing timer
    if (flashcardTimer) {
        clearTimeout(flashcardTimer);
        flashcardTimer = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Get next unused flashcard
    currentFlashcard = getRandomUnusedFlashcard();

    // Check if all flashcards have been used
    if (!currentFlashcard) {
        showCompletionBanner();
        return;
    }

    console.log('Current flashcard:', currentFlashcard);

    // Display the flashcard
    if (flashcardSettings.direction === 'note-to-position') {
        currentNoteDisplay.textContent = currentFlashcard.question;
    } else {
        // Position to note - show fretboard position
        if (currentFlashcard.type === 'note') {
            currentNoteDisplay.textContent = `Find the note at: ${currentFlashcard.position}`;
        } else {
            currentNoteDisplay.textContent = `Find the chord: ${currentFlashcard.position}`;
        }
    }

    // Set up timer or manual reveal
    if (flashcardSettings.mode === 'timed') {
        startTimer();
    }

    // Hide feedback
    feedback.style.display = 'none';
}

function showCompletionBanner() {
    // Hide all other elements
    timerDisplay.style.display = 'none';
    nextBtn.style.display = 'none';
    revealBtn.style.display = 'none';
    feedback.style.display = 'none';

    // Show completion banner
    completionBanner.style.display = 'flex';
}

function restartPractice() {
    // Hide completion banner
    completionBanner.style.display = 'none';

    // Reset and start new practice session
    generateAllFlashcards();
    nextBtn.style.display = 'inline-block';

    if (flashcardSettings.mode === 'timed') {
        timerDisplay.style.display = 'block';
        revealBtn.style.display = 'none';
    } else {
        timerDisplay.style.display = 'none';
        revealBtn.style.display = 'inline-block';
    }

    nextFlashcard();
}

function startTimer() {
    timerDuration = flashcardSettings.timeLimit * 1000; // Convert to milliseconds
    timerStartTime = Date.now();

    // Initialize timer display
    timerProgress.style.width = '100%';
    timerCountdown.textContent = flashcardSettings.timeLimit.toFixed(1);

    // Update timer every 100ms for smooth animation
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - timerStartTime;
        const remaining = Math.max(0, timerDuration - elapsed);
        const remainingSeconds = remaining / 1000;

        // Update progress bar
        const progressPercent = (remaining / timerDuration) * 100;
        timerProgress.style.width = `${progressPercent}%`;

        // Update countdown text
        timerCountdown.textContent = remainingSeconds.toFixed(1);

        // Check if time is up
        if (remaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            showFlashcardFeedback();
        }
    }, 100);

    // Set the main timer for the actual timeout
    flashcardTimer = setTimeout(() => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        showFlashcardFeedback();
    }, timerDuration);
}

function generateNoteFlashcard(instrument) {
    const allNotes = [];

    // Collect all possible notes from all strings
    instrument.strings.forEach((string, stringIndex) => {
        const startFret = string.startFret || 0;

        string.frets.forEach((note, fretIndex) => {
            const actualFret = startFret + fretIndex;
            allNotes.push({
                type: 'note',
                question: note,
                answer: {
                    note: note,
                    string: string.name,
                    fret: actualFret,
                    stringIndex: stringIndex
                },
                position: `${string.name}, fret ${actualFret}`
            });
        });
    });

    return allNotes[Math.floor(Math.random() * allNotes.length)];
}

function generateChordFlashcard(instrument) {
    const allChords = [];

    // Collect all possible chords, filtered by selected chord types
    Object.keys(instrument.chords).forEach(chordName => {
        const chord = instrument.chords[chordName];
        Object.keys(chord).forEach(category => {
            // Only include chords of the selected types
            if (flashcardSettings.chordTypes.includes(category)) {
                allChords.push({
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

    console.log('Generated chord list (filtered):', allChords);
    console.log('Selected chord types:', flashcardSettings.chordTypes);

    // Return null if no chords available
    if (allChords.length === 0) {
        return null;
    }

    return allChords[Math.floor(Math.random() * allChords.length)];
}

function revealAnswer() {
    if (currentFlashcard) {
        showFlashcardFeedback();
    }
}

function showFlashcardFeedback() {
    if (!currentFlashcard) return;

    if (currentFlashcard.type === 'note') {
        showNoteFeedback(currentFlashcard.answer);
    } else if (currentFlashcard.type === 'chord') {
        showChordFeedback(currentFlashcard.answer);
    }

    feedback.style.display = 'block';
}

function showNoteFeedback(note) {
    const instrument = instruments[currentInstrument];
    const string = instrument.strings[note.stringIndex];

    if (flashcardSettings.direction === 'note-to-position') {
        feedbackTitle.textContent = `Note: ${note.note}`;
        feedbackMessage.textContent = `This note can be found on the ${string.name} at fret ${note.fret}.`;
    } else {
        feedbackTitle.textContent = `Position: ${string.name}, fret ${note.fret}`;
        feedbackMessage.textContent = `The note at this position is: ${note.note}`;
    }

    // Create visual fretboard representation
    createFretboardDisplay(note);
}

function showChordFeedback(chord) {
    if (flashcardSettings.direction === 'note-to-position') {
        feedbackTitle.textContent = `${chord.name} ${chord.category}`;
        feedbackMessage.textContent = chord.description;
    } else {
        feedbackTitle.textContent = `Chord: ${chord.name} ${chord.category}`;
        feedbackMessage.textContent = `This chord contains the notes: ${chord.notes?.join(', ') || 'Various notes'}`;
    }

    // Create chord diagram
    const instrument = instruments[currentInstrument];
    const svg = createChordSVG(instrument, chord.positions[0], `${chord.name} ${chord.category}`);
    fretboardDisplay.innerHTML = svg;
}

function createFretboardDisplay(note) {
    const instrument = instruments[currentInstrument];
    const svg = createSVGFretboard(instrument, note);
    fretboardDisplay.innerHTML = svg;
}

function resetPractice() {
    isPracticeActive = false;
    currentFlashcard = null;

    // Clear timer
    if (flashcardTimer) {
        clearTimeout(flashcardTimer);
        flashcardTimer = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Clear flashcard tracking
    usedFlashcards.clear();
    availableFlashcards = [];

    // Hide timer display and completion banner
    timerDisplay.style.display = 'none';
    completionBanner.style.display = 'none';

    nextBtn.style.display = 'none';
    revealBtn.style.display = 'none';
    feedback.style.display = 'none';
    currentNoteDisplay.textContent = 'Click Start to Begin';
}

// Notes Mode Functionality
function initializeNotesMode() {
    // Initialize note category buttons
    document.querySelectorAll('.note-category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            switchNoteCategory(category);
        });
    });

    // Initialize chord category buttons
    document.querySelectorAll('.chord-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.chordCat;
            switchChordCategory(category);
        });
    });

    // Set initial active state for chord categories
    selectedChordCategory = 'major';
    document.querySelector('[data-chord-cat="major"]').classList.add('active');

    renderNotesGrid();
}

function switchNoteCategory(category) {
    document.querySelectorAll('.note-category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    renderNotesGrid(category);
}

function switchChordCategory(category) {
    selectedChordCategory = category;

    // Update chord category button states
    document.querySelectorAll('.chord-cat-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.chordCat === category) {
            btn.classList.add('active');
        }
    });

    // Re-display chord variations for the currently selected note
    if (selectedNote) {
        displayChordVariations(selectedNote);
    }
}

function renderNotesGrid(category = 'natural') {
    const instrument = instruments[currentInstrument];
    const allNotes = new Set();

    // Collect all unique notes and split sharps/flats
    instrument.strings.forEach(string => {
        string.frets.forEach(note => {
            if (note.includes('/')) {
                // Split sharps and flats into separate notes
                const [sharp, flat] = note.split('/');
                allNotes.add(sharp);
                allNotes.add(flat);
            } else {
                allNotes.add(note);
            }
        });
    });

    // Filter notes by category
    let filteredNotes = Array.from(allNotes);
    if (category === 'natural') {
        filteredNotes = filteredNotes.filter(note => !note.includes('#') && !note.includes('b'));
    } else if (category === 'sharp') {
        filteredNotes = filteredNotes.filter(note => note.includes('#'));
    } else if (category === 'flat') {
        filteredNotes = filteredNotes.filter(note => note.includes('b'));
    }

    // Sort notes
    filteredNotes.sort();

    notesGrid.innerHTML = '';

    filteredNotes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.textContent = note;

        // Add category classes for styling
        if (note.includes('#')) {
            noteItem.classList.add('sharp');
        } else if (note.includes('b')) {
            noteItem.classList.add('flat');
        } else {
            noteItem.classList.add('natural');
        }

        noteItem.addEventListener('click', () => {
            selectNote(note);
        });

        notesGrid.appendChild(noteItem);
    });
}

function selectNote(note) {
    selectedNote = note;

    // Update note item states
    document.querySelectorAll('.note-item').forEach(item => {
        item.classList.remove('active');
        if (item.textContent === note) {
            item.classList.add('active');
        }
    });

    // Display note information
    displayNote(note);
}

function displayNote(note) {
    selectedNoteName.textContent = note;

    // Show all positions of this note on the fretboard
    const instrument = instruments[currentInstrument];
    const positions = [];

    instrument.strings.forEach((string, stringIndex) => {
        const startFret = string.startFret || 0;

        string.frets.forEach((fretNote, fretIndex) => {
            // Handle both single notes and sharp/flat combinations
            if (fretNote === note || (fretNote.includes('/') && fretNote.split('/').includes(note))) {
                const actualFret = startFret + fretIndex;
                positions.push({
                    note: note,
                    string: string.name,
                    fret: actualFret,
                    stringIndex: stringIndex
                });
            }
        });
    });

    // Create fretboard showing all positions
    const svg = createMultiPositionFretboard(instrument, positions, note);
    noteFretboard.innerHTML = svg;

    // Display chord variations
    displayChordVariations(note);

    // Show the note info
    selectedNoteInfo.style.display = 'block';
}

function displayChordVariations(note) {
    const instrument = instruments[currentInstrument];
    const chordVariations = [];

    // Extract the root note (just the letter, no sharps/flats)
    const noteRoot = note.replace(/[#b]/g, '');

    console.log('Looking for chords with root:', noteRoot);
    console.log('Available chords:', Object.keys(instrument.chords));
    console.log('Selected category:', selectedChordCategory);

    // Find all chords that start with this note
    Object.keys(instrument.chords).forEach(chordName => {
        // Extract the chord root (just the letter, no sharps/flats)
        const chordRoot = chordName.replace(/[^A-G]/g, '');

        console.log(`Checking chord ${chordName}, root: ${chordRoot}`);

        if (chordRoot === noteRoot) {
            const chord = instrument.chords[chordName];
            console.log(`Found matching chord: ${chordName}`, chord);

            if (chord[selectedChordCategory]) {
                chordVariations.push({
                    name: chordName,
                    category: selectedChordCategory,
                    description: chord[selectedChordCategory].description,
                    positions: chord[selectedChordCategory].positions
                });
                console.log(`Added chord variation: ${chordName} ${selectedChordCategory}`);
            } else {
                console.log(`Chord ${chordName} doesn't have category ${selectedChordCategory}`);
            }
        }
    });

    chordVariationsList.innerHTML = '';

    console.log('Total chord variations found:', chordVariations.length);

    if (chordVariations.length === 0) {
        chordVariationsList.innerHTML = '<p style="text-align: center; color: #666;">No chord variations found for this note.</p>';
        return;
    }

    chordVariations.forEach(chord => {
        const chordItem = document.createElement('div');
        chordItem.className = 'chord-variation-item';

        chordItem.innerHTML = `
            <span class="chord-variation-name">${chord.name} ${selectedChordCategory}</span>
            <span class="chord-variation-description">${chord.description}</span>
        `;

        chordItem.addEventListener('click', () => {
            displayChordFretboard(chord);
        });

        chordVariationsList.appendChild(chordItem);
    });
}

function displayChordFretboard(chord) {
    const instrument = instruments[currentInstrument];
    const svg = createChordSVG(instrument, chord.positions[0], chord.name);

    // Create a modal or update the display area
    const modal = document.createElement('div');
    modal.className = 'chord-modal';
    modal.innerHTML = `
        <div class="chord-modal-content">
            <h3>${chord.name} ${chord.category}</h3>
            <p>${chord.description}</p>
            <div class="chord-fretboard-display">${svg}</div>
            <button class="close-btn">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// SVG Generation Functions
function createSVGFretboard(instrument, note) {
    const strings = instrument.strings;
    const numStrings = strings.length;
    const numFrets = 13;
    const stringSpacing = 30;
    const fretSpacing = 40;
    const width = numFrets * fretSpacing + 60;
    const height = numStrings * stringSpacing + 80;

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

    // Background
    svg += `<rect width="${width}" height="${height}" fill="#2c3e50" rx="8"/>`;

    // Fretboard background
    svg += `<rect x="50" y="20" width="${numFrets * fretSpacing}" height="${numStrings * stringSpacing}" fill="#34495e" stroke="#ecf0f1" stroke-width="2" rx="4"/>`;

    // Fret lines
    for (let fret = 0; fret <= numFrets; fret++) {
        const x = 50 + fret * fretSpacing;
        const strokeWidth = fret === 0 ? 3 : 1;
        const strokeColor = fret === 0 ? '#ecf0f1' : '#95a5a6';
        svg += `<line x1="${x}" y1="20" x2="${x}" y2="${20 + numStrings * stringSpacing}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
    }

    // String lines - handle special strings like banjo 5th string
    for (let string = 0; string < numStrings; string++) {
        const y = 20 + string * stringSpacing + stringSpacing / 2;
        const stringData = strings[string];
        const startFret = stringData.startFret || 0;

        if (startFret > 0) {
            // Special string that starts at a higher fret (like banjo 5th string)
            const startX = 50 + startFret * fretSpacing;
            svg += `<line x1="${startX}" y1="${y}" x2="${50 + numFrets * fretSpacing}" y2="${y}" stroke="#ecf0f1" stroke-width="2"/>`;

            // Add a visual indicator for the string start
            svg += `<circle cx="${startX - 5}" cy="${y}" r="3" fill="#f39c12"/>`;
        } else {
            // Regular string from nut
            svg += `<line x1="50" y1="${y}" x2="${50 + numFrets * fretSpacing}" y2="${y}" stroke="#ecf0f1" stroke-width="2"/>`;
        }
    }

    // Fret numbers
    for (let fret = 0; fret < numFrets; fret++) {
        const x = 50 + fret * fretSpacing + fretSpacing / 2;
        svg += `<text x="${x}" y="15" text-anchor="middle" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${fret}</text>`;
    }

    // String names
    for (let string = 0; string < numStrings; string++) {
        const y = 20 + string * stringSpacing + stringSpacing / 2;
        const stringName = strings[string].name.split(' ')[0];
        svg += `<text x="35" y="${y + 4}" text-anchor="middle" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${stringName}</text>`;
    }

    // Notes on fretboard
    for (let string = 0; string < numStrings; string++) {
        const stringData = strings[string];
        const startFret = stringData.startFret || 0;

        for (let fret = startFret; fret < numFrets; fret++) {
            const x = 50 + fret * fretSpacing + fretSpacing / 2;
            const y = 20 + string * stringSpacing + stringSpacing / 2;
            const fretNote = strings[string].frets[fret - startFret]; // Adjust for startFret

            // Check if this is the target note
            const isTarget = note && string === note.stringIndex && fret === note.fret;

            if (isTarget) {
                // Target note with highlight
                svg += `<circle cx="${x}" cy="${y}" r="12" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/>`;
                svg += `<text x="${x}" y="${y + 4}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="11" font-weight="bold">${note.note}</text>`;
            } else {
                // Regular note - display the first part if it's a sharp/flat combination
                const displayNote = fretNote.includes('/') ? fretNote.split('/')[0] : fretNote;
                const isOpenString = fret === startFret;
                const fillColor = isOpenString ? '#3498db' : '#ecf0f1';
                const textColor = isOpenString ? 'white' : '#2c3e50';

                svg += `<circle cx="${x}" cy="${y}" r="10" fill="${fillColor}" stroke="#bdc3c7" stroke-width="1"/>`;
                svg += `<text x="${x}" y="${y + 3}" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="10" font-weight="bold">${displayNote}</text>`;
            }
        }
    }

    // Legend
    const legendY = height - 20;
    svg += `<text x="10" y="${legendY - 10}" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="12">Legend:</text>`;
    svg += `<circle cx="70" cy="${legendY - 15}" r="8" fill="#e74c3c"/>`;
    svg += `<text x="85" y="${legendY - 10}" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="11">Target Note</text>`;
    svg += `<circle cx="170" cy="${legendY - 15}" r="8" fill="#3498db"/>`;
    svg += `<text x="185" y="${legendY - 10}" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="11">Open String</text>`;
    svg += `<circle cx="250" cy="${legendY - 15}" r="8" fill="#ecf0f1"/>`;
    svg += `<text x="265" y="${legendY - 10}" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="11">Fretted Note</text>`;

    // Add legend for special strings if any exist
    const hasSpecialStrings = strings.some(s => s.startFret && s.startFret > 0);
    if (hasSpecialStrings) {
        svg += `<circle cx="340" cy="${legendY - 15}" r="8" fill="#f39c12"/>`;
        svg += `<text x="355" y="${legendY - 10}" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="11">Special String</text>`;
    }

    svg += '</svg>';
    return svg;
}

function createMultiPositionFretboard(instrument, positions, note) {
    const strings = instrument.strings;
    const numStrings = strings.length;
    const numFrets = 13;
    const stringSpacing = 30;
    const fretSpacing = 40;
    const width = numFrets * fretSpacing + 60;
    const height = numStrings * stringSpacing + 80;

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

    // Background
    svg += `<rect width="${width}" height="${height}" fill="#2c3e50" rx="8"/>`;

    // Fretboard background
    svg += `<rect x="50" y="20" width="${numFrets * fretSpacing}" height="${numStrings * stringSpacing}" fill="#34495e" stroke="#ecf0f1" stroke-width="2" rx="4"/>`;

    // Fret lines
    for (let fret = 0; fret <= numFrets; fret++) {
        const x = 50 + fret * fretSpacing;
        const strokeWidth = fret === 0 ? 3 : 1;
        const strokeColor = fret === 0 ? '#ecf0f1' : '#95a5a6';
        svg += `<line x1="${x}" y1="20" x2="${x}" y2="${20 + numStrings * stringSpacing}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
    }

    // String lines - handle special strings like banjo 5th string
    for (let string = 0; string < numStrings; string++) {
        const y = 20 + string * stringSpacing + stringSpacing / 2;
        const stringData = strings[string];
        const startFret = stringData.startFret || 0;

        if (startFret > 0) {
            // Special string that starts at a higher fret (like banjo 5th string)
            const startX = 50 + startFret * fretSpacing;
            svg += `<line x1="${startX}" y1="${y}" x2="${50 + numFrets * fretSpacing}" y2="${y}" stroke="#ecf0f1" stroke-width="2"/>`;

            // Add a visual indicator for the string start
            svg += `<circle cx="${startX - 5}" cy="${y}" r="3" fill="#f39c12"/>`;
        } else {
            // Regular string from nut
            svg += `<line x1="50" y1="${y}" x2="${50 + numFrets * fretSpacing}" y2="${y}" stroke="#ecf0f1" stroke-width="2"/>`;
        }
    }

    // Fret numbers
    for (let fret = 0; fret < numFrets; fret++) {
        const x = 50 + fret * fretSpacing + fretSpacing / 2;
        svg += `<text x="${x}" y="15" text-anchor="middle" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${fret}</text>`;
    }

    // String names
    for (let string = 0; string < numStrings; string++) {
        const y = 20 + string * stringSpacing + stringSpacing / 2;
        const stringName = strings[string].name.split(' ')[0];
        svg += `<text x="35" y="${y + 4}" text-anchor="middle" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${stringName}</text>`;
    }

    // Highlight all positions of the selected note
    positions.forEach(pos => {
        const x = 50 + pos.fret * fretSpacing + fretSpacing / 2;
        const y = 20 + pos.stringIndex * stringSpacing + stringSpacing / 2;

        svg += `<circle cx="${x}" cy="${y}" r="12" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/>`;
        svg += `<text x="${x}" y="${y + 4}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="11" font-weight="bold">${note}</text>`;
    });

    // Show all other notes (dimmed)
    for (let string = 0; string < numStrings; string++) {
        const stringData = strings[string];
        const startFret = stringData.startFret || 0;

        for (let fret = startFret; fret < numFrets; fret++) {
            const x = 50 + fret * fretSpacing + fretSpacing / 2;
            const y = 20 + string * stringSpacing + stringSpacing / 2;
            const fretNote = strings[string].frets[fret - startFret]; // Adjust for startFret

            // Only show if it's not one of the highlighted positions
            const isHighlighted = positions.some(pos => pos.stringIndex === string && pos.fret === fret);

            if (!isHighlighted) {
                const isOpenString = fret === startFret;
                const fillColor = isOpenString ? '#3498db' : '#ecf0f1';
                const textColor = isOpenString ? 'white' : '#2c3e50';

                // Display the first part if it's a sharp/flat combination
                const displayNote = fretNote.includes('/') ? fretNote.split('/')[0] : fretNote;

                svg += `<circle cx="${x}" cy="${y}" r="10" fill="${fillColor}" stroke="#bdc3c7" stroke-width="1" opacity="0.6"/>`;
                svg += `<text x="${x}" y="${y + 3}" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="10" font-weight="bold" opacity="0.6">${displayNote}</text>`;
            }
        }
    }

    svg += '</svg>';
    return svg;
}

function createChordSVG(instrument, positions, chordName) {
    const strings = instrument.strings;
    const numStrings = strings.length;
    const numFrets = 5;
    const stringSpacing = 30;
    const fretSpacing = 40;
    const width = numFrets * fretSpacing + 60;
    const height = numStrings * stringSpacing + 80;

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

    // Background
    svg += `<rect width="${width}" height="${height}" fill="#2c3e50" rx="8"/>`;

    // Fretboard background
    svg += `<rect x="50" y="20" width="${numFrets * fretSpacing}" height="${numStrings * stringSpacing}" fill="#34495e" stroke="#ecf0f1" stroke-width="2" rx="4"/>`;

    // Fret lines
    for (let fret = 0; fret <= numFrets; fret++) {
        const x = 50 + fret * fretSpacing;
        const strokeWidth = fret === 0 ? 3 : 1;
        const strokeColor = fret === 0 ? '#ecf0f1' : '#95a5a6';
        svg += `<line x1="${x}" y1="20" x2="${x}" y2="${20 + numStrings * stringSpacing}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
    }

    // String lines - handle special strings like banjo 5th string
    for (let string = 0; string < numStrings; string++) {
        const y = 20 + string * stringSpacing + stringSpacing / 2;
        const stringData = strings[string];
        const startFret = stringData.startFret || 0;

        if (startFret > 0 && startFret < numFrets) {
            // Special string that starts at a higher fret (like banjo 5th string)
            const startX = 50 + startFret * fretSpacing;
            svg += `<line x1="${startX}" y1="${y}" x2="${50 + numFrets * fretSpacing}" y2="${y}" stroke="#ecf0f1" stroke-width="2"/>`;

            // Add a visual indicator for the string start
            svg += `<circle cx="${startX - 5}" cy="${y}" r="3" fill="#f39c12"/>`;
        } else {
            // Regular string from nut
            svg += `<line x1="50" y1="${y}" x2="${50 + numFrets * fretSpacing}" y2="${y}" stroke="#ecf0f1" stroke-width="2"/>`;
        }
    }

    // Fret numbers
    for (let fret = 0; fret < numFrets; fret++) {
        const x = 50 + fret * fretSpacing + fretSpacing / 2;
        svg += `<text x="${x}" y="15" text-anchor="middle" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${fret}</text>`;
    }

    // String names
    for (let string = 0; string < numStrings; string++) {
        const y = 20 + string * stringSpacing + stringSpacing / 2;
        const stringName = strings[string].name.split(' ')[0];
        svg += `<text x="35" y="${y + 4}" text-anchor="middle" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${stringName}</text>`;
    }

    // Chord positions
    positions.forEach((fret, stringIndex) => {
        const x = 50 + fret * fretSpacing + fretSpacing / 2;
        const y = 20 + stringIndex * stringSpacing + stringSpacing / 2;
        const stringData = strings[stringIndex];
        const startFret = stringData.startFret || 0;

        if (fret === 0) {
            // Open string
            svg += `<circle cx="${x}" cy="${y}" r="8" fill="#3498db" stroke="#2980b9" stroke-width="2"/>`;
            svg += `<text x="${x}" y="${y + 3}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" font-weight="bold">O</text>`;
        } else if (fret === -1) {
            // Muted string
            svg += `<text x="${x}" y="${y + 3}" text-anchor="middle" fill="#e74c3c" font-family="Arial, sans-serif" font-size="14" font-weight="bold">✕</text>`;
        } else {
            // Fingered note
            svg += `<circle cx="${x}" cy="${y}" r="12" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/>`;
            svg += `<text x="${x}" y="${y + 4}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" font-weight="bold">${fret}</text>`;
        }
    });

    // Chord name at the bottom
    const chordNameY = height - 10;
    svg += `<text x="${width / 2}" y="${chordNameY}" text-anchor="middle" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${chordName}</text>`;

    svg += '</svg>';
    return svg;
}

function closeFlashcard() {
    isPracticeActive = false;

    // Clear timer
    if (flashcardTimer) {
        clearTimeout(flashcardTimer);
        flashcardTimer = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Clear flashcard tracking
    usedFlashcards.clear();
    availableFlashcards = [];

    // Switch back to settings view
    flashcardSettingsElement.style.display = 'flex';
    flashcardViewElement.style.display = 'none';

    // Reset practice state
    resetPractice();
}

// Export for future use
window.InstrumentPractice = {
    instruments,
    switchInstrument,
    addInstrument: (name, config) => { instruments[name] = config; }
}; 