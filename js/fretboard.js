// Fretboard Visualization Module

// Create SVG fretboard for a single note
export function createSVGFretboard(instrument, note) {
    const strings = instrument.strings;
    const numStrings = strings.length;
    const numFrets = 13;
    const stringSpacing = 30;
    const fretSpacing = 40;
    const nutWidth = fretSpacing / 4; // Nut is 1/4 the width of a fret
    const fretboardX = 50 + nutWidth; // Fretboard starts after nut
    const width = numFrets * fretSpacing + 60 + nutWidth;
    const height = numStrings * stringSpacing + 80;

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

    // Background
    svg += `<rect width="${width}" height="${height}" fill="#2c3e50" rx="8"/>`;

    // Fretboard background (starts after nut)
    svg += `<rect x="${fretboardX}" y="20" width="${numFrets * fretSpacing}" height="${numStrings * stringSpacing}" fill="#34495e" stroke="#ecf0f1" stroke-width="2" rx="4"/>`;

    // Nut (thin orange line at x=50)
    svg += `<line x1="50" y1="20" x2="50" y2="${20 + numStrings * stringSpacing}" stroke="#f39c12" stroke-width="4"/>`;

    // Fret lines (starting from fret 1)
    for (let fret = 1; fret <= numFrets; fret++) {
        const x = fretboardX + (fret - 1) * fretSpacing;
        svg += `<line x1="${x}" y1="20" x2="${x}" y2="${20 + numStrings * stringSpacing}" stroke="#95a5a6" stroke-width="1"/>`;
    }

    // String lines
    for (let string = 0; string < numStrings; string++) {
        const y = 20 + string * stringSpacing + stringSpacing / 2;
        const stringData = strings[string];
        const startFret = stringData.startFret || 0;
        let startX = 50;
        if (startFret > 0) {
            // Special string that starts at a higher fret (like banjo 5th string)
            startX = fretboardX + (startFret - 1) * fretSpacing;
            svg += `<line x1="${startX}" y1="${y}" x2="${fretboardX + numFrets * fretSpacing}" y2="${y}" stroke="#ecf0f1" stroke-width="2"/>`;
            // Add a visual indicator for the string start
            svg += `<circle cx="${startX - 5}" cy="${y}" r="3" fill="#f39c12"/>`;
        } else {
            svg += `<line x1="${startX}" y1="${y}" x2="${fretboardX + numFrets * fretSpacing}" y2="${y}" stroke="#ecf0f1" stroke-width="2"/>`;
        }
    }

    // Fret numbers (starting from fret 1)
    for (let fret = 1; fret < numFrets; fret++) {
        const x = fretboardX + (fret - 1) * fretSpacing + fretSpacing / 2;
        svg += `<text x="${x}" y="15" text-anchor="middle" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${fret}</text>`;
    }

    // String names
    for (let string = 0; string < numStrings; string++) {
        const y = 20 + string * stringSpacing + stringSpacing / 2;
        const stringName = strings[string].name.split(' ')[0];
        svg += `<text x="35" y="${y + 4}" text-anchor="middle" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${stringName}</text>`;
    }

    // Highlight all positions of the selected note
    const positions = findNotePositions(instrument, note);
    positions.forEach(pos => {
        const isOpen = pos.fret === 0;
        const x = isOpen
            ? 50 - nutWidth / 2 // Place open string note just to the right of the nut
            : fretboardX + (pos.fret - 1) * fretSpacing + fretSpacing / 2;
        const y = 20 + pos.stringIndex * stringSpacing + stringSpacing / 2;
        svg += `<circle cx="${x}" cy="${y}" r="12" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/>`;
        svg += `<text x="${x}" y="${y + 4}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="11" font-weight="bold">${note}</text>`;
    });

    // Show all other notes (dimmed)
    for (let string = 0; string < numStrings; string++) {
        const stringData = strings[string];
        const startFret = stringData.startFret || 0;
        for (let fret = startFret; fret < numFrets; fret++) {
            const isOpen = fret === 0;
            const x = isOpen
                ? 50 - nutWidth / 2
                : fretboardX + (fret - 1) * fretSpacing + fretSpacing / 2;
            const y = 20 + string * stringSpacing + stringSpacing / 2;
            const fretNote = strings[string].frets[fret - startFret];
            const isHighlighted = positions.some(pos => pos.stringIndex === string && pos.fret === fret);
            if (!isHighlighted) {
                const isOpenString = fret === startFret;
                const fillColor = isOpenString ? '#3498db' : '#ecf0f1';
                const textColor = isOpenString ? 'white' : '#2c3e50';
                const displayNote = fretNote.includes('/') ? fretNote.split('/')[0] : fretNote;
                svg += `<circle cx="${x}" cy="${y}" r="10" fill="${fillColor}" stroke="#bdc3c7" stroke-width="1" opacity="0.6"/>`;
                svg += `<text x="${x}" y="${y + 3}" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="10" font-weight="bold" opacity="0.6">${displayNote}</text>`;
            }
        }
    }
    svg += '</svg>';
    return svg;
}

// Create SVG fretboard for multiple positions
export function createMultiPositionFretboard(instrument, positions, note) {
    const strings = instrument.strings;
    const numStrings = strings.length;
    const numFrets = 13;
    const stringSpacing = 30;
    const fretSpacing = 40;
    const nutWidth = fretSpacing / 4;
    const fretboardX = 50 + nutWidth;
    const width = numFrets * fretSpacing + 60 + nutWidth;
    const height = numStrings * stringSpacing + 80;

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

    // Background
    svg += `<rect width="${width}" height="${height}" fill="#2c3e50" rx="8"/>`;

    // Fretboard background (starts after nut)
    svg += `<rect x="${fretboardX}" y="20" width="${(numFrets - 1) * fretSpacing}" height="${numStrings * stringSpacing}" fill="#34495e" stroke="#ecf0f1" stroke-width="2" rx="4"/>`;

    // Nut (thin orange line at x=50)
    svg += `<line x1="50" y1="20" x2="50" y2="${20 + numStrings * stringSpacing}" stroke="#f39c12" stroke-width="4"/>`;

    // Fret lines (starting from fret 1)
    for (let fret = 1; fret <= numFrets; fret++) {
        const x = fretboardX + (fret - 1) * fretSpacing;
        svg += `<line x1="${x}" y1="20" x2="${x}" y2="${20 + numStrings * stringSpacing}" stroke="#95a5a6" stroke-width="1"/>`;
    }

    // String lines
    for (let string = 0; string < numStrings; string++) {
        const y = 20 + string * stringSpacing + stringSpacing / 2;
        const stringData = strings[string];
        const startFret = stringData.startFret || 0;
        let startX = 50;
        if (startFret > 0) {
            startX = fretboardX + (startFret - 1) * fretSpacing;
            svg += `<line x1="${startX}" y1="${y}" x2="${fretboardX + (numFrets - 1) * fretSpacing}" y2="${y}" stroke="#ecf0f1" stroke-width="2"/>`;
            svg += `<circle cx="${startX - 5}" cy="${y}" r="3" fill="#f39c12"/>`;
        } else {
            svg += `<line x1="${startX}" y1="${y}" x2="${fretboardX + (numFrets - 1) * fretSpacing}" y2="${y}" stroke="#ecf0f1" stroke-width="2"/>`;
        }
    }

    // Fret numbers (starting from fret 1)
    for (let fret = 1; fret < numFrets; fret++) {
        const x = fretboardX + (fret - 1) * fretSpacing + fretSpacing / 2;
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
        const isOpen = pos.fret === 0;
        const x = isOpen
            ? 50 - nutWidth / 2
            : fretboardX + (pos.fret - 1) * fretSpacing + fretSpacing / 2;
        const y = 20 + pos.stringIndex * stringSpacing + stringSpacing / 2;
        svg += `<circle cx="${x}" cy="${y}" r="12" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/>`;
        svg += `<text x="${x}" y="${y + 4}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="11" font-weight="bold">${note}</text>`;
    });

    // Show all other notes (dimmed)
    for (let string = 0; string < numStrings; string++) {
        const stringData = strings[string];
        const startFret = stringData.startFret || 0;
        for (let fret = startFret; fret < numFrets; fret++) {
            const isOpen = fret === 0;
            const x = isOpen
                ? 50 - nutWidth / 2
                : fretboardX + (fret - 1) * fretSpacing + fretSpacing / 2;
            const y = 20 + string * stringSpacing + stringSpacing / 2;
            const fretNote = strings[string].frets[fret - startFret];
            const isHighlighted = positions.some(pos => pos.stringIndex === string && pos.fret === fret);
            if (!isHighlighted) {
                const isOpenString = fret === startFret;
                const fillColor = isOpenString ? '#3498db' : '#ecf0f1';
                const textColor = isOpenString ? 'white' : '#2c3e50';
                const displayNote = fretNote.includes('/') ? fretNote.split('/')[0] : fretNote;
                svg += `<circle cx="${x}" cy="${y}" r="10" fill="${fillColor}" stroke="#bdc3c7" stroke-width="1" opacity="0.6"/>`;
                svg += `<text x="${x}" y="${y + 3}" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="10" font-weight="bold" opacity="0.6">${displayNote}</text>`;
            }
        }
    }
    svg += '</svg>';
    return svg;
}

// Create SVG for chord visualization
export function createChordSVG(instrument, positions, chordName) {
    const strings = instrument.strings;
    const numStrings = strings.length;
    const numFrets = 5;
    const stringSpacing = 30;
    const fretSpacing = 40;
    const nutWidth = fretSpacing / 4;
    const fretboardX = 50 + nutWidth;
    const width = numFrets * fretSpacing + 60 + nutWidth;
    const height = numStrings * stringSpacing + 80;

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

    // Background
    svg += `<rect width="${width}" height="${height}" fill="#2c3e50" rx="8"/>`;

    // Fretboard background (starts after nut)
    svg += `<rect x="${fretboardX}" y="20" width="${numFrets * fretSpacing}" height="${numStrings * stringSpacing}" fill="#34495e" stroke="#ecf0f1" stroke-width="2" rx="4"/>`;

    // Nut (thin orange line at x=50)
    svg += `<line x1="50" y1="20" x2="50" y2="${20 + numStrings * stringSpacing}" stroke="#f39c12" stroke-width="4"/>`;

    // Fret lines (starting from fret 1)
    for (let fret = 1; fret <= numFrets; fret++) {
        const x = fretboardX + (fret - 1) * fretSpacing;
        svg += `<line x1="${x}" y1="20" x2="${x}" y2="${20 + numStrings * stringSpacing}" stroke="#95a5a6" stroke-width="1"/>`;
    }

    // String lines
    for (let string = 0; string < numStrings; string++) {
        const y = 20 + string * stringSpacing + stringSpacing / 2;
        const stringData = strings[string];
        const startFret = stringData.startFret || 0;
        let startX = 50;
        if (startFret > 0 && startFret < numFrets) {
            startX = fretboardX + (startFret - 1) * fretSpacing;
            svg += `<line x1="${startX}" y1="${y}" x2="${fretboardX + numFrets * fretSpacing}" y2="${y}" stroke="#ecf0f1" stroke-width="2"/>`;
            svg += `<circle cx="${startX - 5}" cy="${y}" r="3" fill="#f39c12"/>`;
        } else {
            svg += `<line x1="${startX}" y1="${y}" x2="${fretboardX + numFrets * fretSpacing}" y2="${y}" stroke="#ecf0f1" stroke-width="2"/>`;
        }
    }

    // Fret numbers (starting from fret 1)
    for (let fret = 1; fret < numFrets; fret++) {
        const x = fretboardX + (fret - 1) * fretSpacing + fretSpacing / 2;
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
        const x = (fret === 0)
            ? 50 - nutWidth / 2 + fretSpacing / 2
            : fretboardX + (fret - 1) * fretSpacing + fretSpacing / 2;
        const y = 20 + stringIndex * stringSpacing + stringSpacing / 2;
        const stringData = strings[stringIndex];
        const startFret = stringData.startFret || 0;
        if (fret === 0) {
            svg += `<circle cx="${x}" cy="${y}" r="8" fill="#3498db" stroke="#2980b9" stroke-width="2"/>`;
            svg += `<text x="${x}" y="${y + 3}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" font-weight="bold">O</text>`;
        } else if (fret === -1) {
            svg += `<text x="${x}" y="${y + 3}" text-anchor="middle" fill="#e74c3c" font-family="Arial, sans-serif" font-size="14" font-weight="bold">✕</text>`;
        } else {
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