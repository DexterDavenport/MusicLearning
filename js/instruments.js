// Instrument Management Module

import { setInstruments, setAvailableInstruments, instruments } from './config.js';
import { setText } from './dom.js';

// Load instrument data from JSON files
export async function loadInstruments() {
    try {
        // Get list of available instruments from the instruments folder
        const response = await fetch('./instruments/');
        if (!response.ok) {
            throw new Error('Could not access instruments folder');
        }

        // For now, we'll hardcode the known instruments since we can't list directory contents
        // In a real server environment, you'd want to implement a server-side endpoint to list files
        const instrumentFiles = ['mandolin.json', 'guitar.json', 'ukulele.json', 'banjo.json'];

        const newInstruments = {};
        const newAvailableInstruments = [];

        for (const fileName of instrumentFiles) {
            try {
                const instrumentResponse = await fetch(`./instruments/${fileName}`);
                if (instrumentResponse.ok) {
                    const instrumentData = await instrumentResponse.json();
                    const instrumentKey = fileName.replace('.json', '');
                    newInstruments[instrumentKey] = instrumentData;
                    newAvailableInstruments.push(instrumentKey);
                }
            } catch (error) {
                console.warn(`Failed to load ${fileName}:`, error);
            }
        }

        setInstruments(newInstruments);
        setAvailableInstruments(newAvailableInstruments);

        console.log('Loaded instruments:', newAvailableInstruments);
        return true;
    } catch (error) {
        console.error('Error loading instruments:', error);
        // Fallback to hardcoded data if JSON loading fails
        loadFallbackInstruments();
        return false;
    }
}

// Fallback instrument data if JSON loading fails
export function loadFallbackInstruments() {
    const fallbackInstruments = {
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

    setInstruments(fallbackInstruments);
    setAvailableInstruments(['mandolin']);
}

// Initialize instrument selector
export async function initializeInstrumentSelector() {
    const instrumentContainer = document.querySelector('.instrument-buttons');

    // Clear existing buttons
    instrumentContainer.innerHTML = '';

    // Create buttons for each available instrument
    const { availableInstruments, instruments } = await import('./config.js');

    availableInstruments.forEach(instrumentKey => {
        const instrument = instruments[instrumentKey];
        const button = document.createElement('button');
        button.className = 'instrument-btn';
        button.dataset.instrument = instrumentKey;
        let iconHTML = '';
        iconHTML = `<span class="instrument-icon">${instrument.icon}</span>`;
        button.innerHTML = `${iconHTML}<span class="instrument-name">${instrument.name}</span>`;

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

// Switch to a different instrument
export async function switchInstrument(instrumentName) {
    const { instruments, setCurrentInstrument } = await import('./config.js');

    if (instruments[instrumentName]) {
        // Update active button
        document.querySelectorAll('.instrument-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-instrument="${instrumentName}"]`).classList.add('active');

        // Update current instrument
        setCurrentInstrument(instrumentName);

        // Update display
        updateInstrumentDisplay();
    }
}

// Update instrument display
export async function updateInstrumentDisplay() {
    const { currentInstrument, instruments } = await import('./config.js');

    const instrument = instruments[currentInstrument];
    if (instrument) {
        setText(tuningDisplay, `${instrument.name} Tuning: ${instrument.tuning.join('-')}`);
    }
}
