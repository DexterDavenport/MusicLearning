// Example: How to add Guitar support to the practice website
// This file demonstrates the extensibility of the application

// Add this code to script.js or create a separate module

// Guitar configuration
const guitarConfig = {
    name: 'Guitar',
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    strings: [
        {
            name: 'E String (Lowest)',
            open: 'E',
            frets: ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E']
        },
        {
            name: 'A String',
            open: 'A',
            frets: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A']
        },
        {
            name: 'D String',
            open: 'D',
            frets: ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D']
        },
        {
            name: 'G String',
            open: 'G',
            frets: ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G']
        },
        {
            name: 'B String',
            open: 'B',
            frets: ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        },
        {
            name: 'E String (Highest)',
            open: 'E',
            frets: ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E']
        }
    ]
};

// How to add the guitar to the existing application:

// 1. Add to INSTRUMENTS object
// INSTRUMENTS.guitar = guitarConfig;

// 2. Add instrument selector to HTML (example):
/*
<div class="instrument-selector">
    <button class="instrument-btn active" data-instrument="mandolin">Mandolin</button>
    <button class="instrument-btn" data-instrument="guitar">Guitar</button>
</div>
*/

// 3. Add JavaScript to handle instrument switching:
/*
document.querySelectorAll('.instrument-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const instrument = btn.dataset.instrument;
        switchInstrument(instrument);
        
        // Update UI
        document.querySelectorAll('.instrument-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update page title and header
        document.title = `${INSTRUMENTS[instrument].name} Practice - Notes & Lessons`;
        document.querySelector('header h1').textContent = `🎵 ${INSTRUMENTS[instrument].name} Practice`;
    });
});
*/

// 4. Example of adding a new practice mode (Chord Practice):
/*
const chordPracticeConfig = {
    name: 'Chord Practice',
    chords: {
        'C Major': ['C', 'E', 'G'],
        'G Major': ['G', 'B', 'D'],
        'D Major': ['D', 'F#', 'A'],
        'A Major': ['A', 'C#', 'E'],
        'E Major': ['E', 'G#', 'B']
    }
};

// Add to HTML:
// <button class="mode-btn" data-mode="chords">Chord Practice</button>

// Add mode container:
// <div id="chords-mode" class="practice-mode">
//     <div class="chord-practice-container">
//         <!-- Chord practice content -->
//     </div>
// </div>
*/

// 5. Example of adding lesson content:
/*
const lessons = {
    mandolin: {
        beginner: [
            {
                title: 'Open String Notes',
                description: 'Learn the four open strings of the mandolin',
                notes: ['G', 'D', 'A', 'E'],
                type: 'open_strings'
            },
            {
                title: 'First Position Notes',
                description: 'Practice notes in the first position',
                notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F', 'F#'],
                type: 'first_position'
            }
        ]
    },
    guitar: {
        beginner: [
            {
                title: 'Open String Notes',
                description: 'Learn the six open strings of the guitar',
                notes: ['E', 'A', 'D', 'G', 'B', 'E'],
                type: 'open_strings'
            }
        ]
    }
};
*/

console.log('Guitar extension example loaded. See comments for implementation details.'); 