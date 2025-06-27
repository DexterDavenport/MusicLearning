// Notes Mode Management Module

import {
    instruments,
    currentInstrument,
    selectedNote,
    selectedChordCategory
} from './config.js';

import {
    notesGrid,
    selectedNoteInfo,
    selectedNoteName,
    noteFretboard,
    chordVariationsList,
    setText,
    setHTML,
    showElement,
    hideElement,
    addClass,
    removeClass
} from './dom.js';

import { createMultiPositionFretboard, createChordSVG } from './fretboard.js';

// Add at the top (after imports)
let lastSelectedNote = null;
let lastSelectedChordCategory = 'major';

// Update setSelectedNote and setSelectedChordCategory to also update these
import { setSelectedNote as _setSelectedNote, setSelectedChordCategory as _setSelectedChordCategory } from './config.js';
export function setSelectedNote(note) {
    lastSelectedNote = note;
    _setSelectedNote(note);
}
export function setSelectedChordCategory(category) {
    lastSelectedChordCategory = category;
    _setSelectedChordCategory(category);
}

// Initialize notes mode
export function initializeNotesMode() {
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
    setSelectedChordCategory('major');
    document.querySelector('[data-chord-cat="major"]').classList.add('active');

    renderNotesGrid();
    // Select the first note in the grid by default
    setTimeout(() => {
        if (!lastSelectedNote) {
            const firstNoteBtn = document.querySelector('.note-item');
            if (firstNoteBtn) firstNoteBtn.click();
        } else {
            selectNote(lastSelectedNote);
        }
    }, 0);
}

// Switch note category
export function switchNoteCategory(category) {
    document.querySelectorAll('.note-category-btn').forEach(btn => {
        removeClass(btn, 'active');
        if (btn.dataset.category === category) {
            addClass(btn, 'active');
        }
    });

    renderNotesGrid(category);
}

// Switch chord category
export function switchChordCategory(category) {
    setSelectedChordCategory(category);

    // Update chord category button states
    document.querySelectorAll('.chord-cat-btn').forEach(btn => {
        removeClass(btn, 'active');
        if (btn.dataset.chordCat === category) {
            addClass(btn, 'active');
        }
    });

    // Re-display chord variations for the currently selected note
    if (selectedNote) {
        displayChordVariations(selectedNote);
    }
}

// Render notes grid
export function renderNotesGrid(category = 'natural') {
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
            addClass(noteItem, 'sharp');
        } else if (note.includes('b')) {
            addClass(noteItem, 'flat');
        } else {
            addClass(noteItem, 'natural');
        }

        noteItem.addEventListener('click', () => {
            selectNote(note);
        });

        notesGrid.appendChild(noteItem);
    });
}

// Select a note
export function selectNote(note) {
    setSelectedNote(note);

    // Update note item states
    document.querySelectorAll('.note-item').forEach(item => {
        removeClass(item, 'active');
        if (item.textContent === note) {
            addClass(item, 'active');
        }
    });

    // Display note information
    displayNote(note);
}

// Display note information
export function displayNote(note) {
    setText(selectedNoteName, note);

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
    setHTML(noteFretboard, svg);

    // Display chord variations
    displayChordVariations(note);

    // Show the note info
    showElement(selectedNoteInfo);
}

// Display chord variations for a note
export function displayChordVariations(note) {
    const instrument = instruments[currentInstrument];
    const chordVariations = [];
    const availableCategories = new Set();

    // Extract the root note (just the letter, no sharps/flats)
    const noteRoot = note.replace(/[#b]/g, '');

    // Find all chords that start with this note and collect available categories
    Object.keys(instrument.chords).forEach(chordName => {
        const chordRoot = chordName.replace(/[^A-G]/g, '');
        if (chordRoot === noteRoot) {
            const chord = instrument.chords[chordName];
            Object.keys(chord).forEach(cat => availableCategories.add(cat));
            // Check if the selected category exists for this chord
            if (chord[selectedChordCategory]) {
                chordVariations.push({
                    name: chordName,
                    category: selectedChordCategory,
                    description: chord[selectedChordCategory].description,
                    positions: chord[selectedChordCategory].positions
                });
            }
        }
    });

    // Show/hide chord category buttons based on availableCategories
    const catBtns = document.querySelectorAll('.chord-cat-btn');
    let anyCatVisible = false;
    catBtns.forEach(btn => {
        if (availableCategories.has(btn.dataset.chordCat)) {
            btn.style.display = '';
            anyCatVisible = true;
        } else {
            btn.style.display = 'none';
        }
    });
    // Hide the whole category bar if none are available
    const catBar = document.querySelector('.chord-categories');
    if (catBar) catBar.style.display = anyCatVisible ? '' : 'none';

    // Display chord variations
    chordVariationsList.innerHTML = '';
    if (chordVariations.length > 0) {
        chordVariations.forEach(chord => {
            const chordItem = document.createElement('div');
            chordItem.className = 'chord-variation-item';
            chordItem.innerHTML = `
                <div class="chord-variation-name">${chord.name} ${chord.category}</div>
                <div class="chord-variation-description">${chord.description}</div>
            `;
            chordItem.addEventListener('click', () => {
                displayChordFretboard(chord);
            });
            chordVariationsList.appendChild(chordItem);
        });
        // Automatically show the first chord diagram inline
        displayChordFretboard(chordVariations[0]);
    } else {
        chordVariationsList.innerHTML = '<p>No chord variations found for this note.</p>';
        // Clear chord diagram area
        setHTML(document.getElementById('chord-fretboard-inline'), '');
    }
}

// Display chord fretboard inline (not as a modal)
export function displayChordFretboard(chord) {
    const instrument = instruments[currentInstrument];
    let inlineDiv = document.getElementById('chord-fretboard-inline');
    if (!inlineDiv) {
        inlineDiv = document.createElement('div');
        inlineDiv.id = 'chord-fretboard-inline';
        // Insert after chordVariationsList
        chordVariationsList.parentNode.appendChild(inlineDiv);
    }
    const svg = createChordSVG(instrument, chord.positions[0], `${chord.name} ${chord.category}`);
    inlineDiv.innerHTML = `
        <div class="chord-inline-diagram">
            <h3>${chord.name} ${chord.category}</h3>
            <p>${chord.description}</p>
            <div class="chord-fretboard-display">${svg}</div>
        </div>
    `;
}

// When switching instruments, re-select last selected note/chord if possible
import { setCurrentInstrument } from './config.js';
export function handleInstrumentSwitch() {
    // Wait for grid to render, then select last note if possible
    setTimeout(() => {
        if (lastSelectedNote) {
            // Check if note exists for this instrument
            const noteBtn = Array.from(document.querySelectorAll('.note-item')).find(btn => btn.textContent === lastSelectedNote);
            if (noteBtn) {
                selectNote(lastSelectedNote);
                setSelectedChordCategory(lastSelectedChordCategory);
            } else {
                // Fallback: select first note
                const firstNoteBtn = document.querySelector('.note-item');
                if (firstNoteBtn) firstNoteBtn.click();
            }
        } else {
            // Fallback: select first note
            const firstNoteBtn = document.querySelector('.note-item');
            if (firstNoteBtn) firstNoteBtn.click();
        }
    }, 0);
} 