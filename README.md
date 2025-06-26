# Instrument Practice App

A modular web application for practicing notes and chords on various string instruments. The app features flashcards, interactive fretboard displays, and chord variations.

## Features

- **Multiple Instruments**: Support for mandolin, guitar, ukulele, and easily extensible for more
- **Flashcard Mode**: Practice identifying notes on the fretboard
- **Notes & Chords Mode**: Interactive fretboard with note positions and chord variations
- **Responsive Design**: Works on desktop and mobile devices
- **Modular Architecture**: Easy to add new instruments and features

## Adding New Instruments

To add a new instrument, simply create a new JSON file in the `instruments/` folder. The app will automatically detect and load it.

### JSON File Structure

Create a file named `your-instrument.json` in the `instruments/` folder:

```json
{
  "name": "Your Instrument Name",
  "icon": "🎸",
  "tuning": ["G", "D", "A", "E"],
  "strings": [
    {
      "name": "String Name",
      "open": "G",
      "frets": ["G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G"]
    }
  ],
  "chords": {
    "C": {
      "major": {
        "positions": [[0, 2, 2, 3]],
        "notes": ["C", "E", "G"],
        "description": "C major chord"
      },
      "minor": {
        "positions": [[3, 3, 3, 1]],
        "notes": ["C", "D#", "G"],
        "description": "C minor chord"
      },
      "seventh": {
        "positions": [[0, 2, 2, 1]],
        "notes": ["C", "E", "G", "A#"],
        "description": "C dominant 7th"
      },
      "major7": {
        "positions": [[0, 2, 2, 2]],
        "notes": ["C", "E", "G", "B"],
        "description": "C major 7th"
      }
    }
  }
}
```

### Required Fields

- **name**: Display name of the instrument
- **icon**: Emoji or symbol for the instrument
- **tuning**: Array of open string notes from lowest to highest
- **strings**: Array of string objects with name, open note, and fret notes
- **chords**: Object containing chord data for different root notes and types

### String Structure

Each string object should include:
- **name**: Display name of the string
- **open**: The open string note
- **frets**: Array of notes for each fret position
- **startFret** (optional): Starting fret for special strings (e.g., banjo 5th string starts at fret 5)
- **isShortString** (optional): Boolean indicating if this is a short string

### Special String Support

For instruments with special strings (like the banjo's 5th string that starts at the 5th fret), you can use the `startFret` property:

```json
{
  "name": "5th String (Short)",
  "open": "G",
  "frets": ["G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G"],
  "startFret": 5,
  "isShortString": true
}
```

This will render the string starting at the specified fret with a visual indicator.

### Chord Structure

Each chord should include:
- **positions**: Array of finger positions (fret numbers for each string)
- **notes**: Array of notes that make up the chord
- **description**: Human-readable description of the chord

## File Structure

```
NotWork/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # Main JavaScript application
├── instruments/        # Instrument JSON files
│   ├── mandolin.json
│   ├── guitar.json
│   └── ukulele.json
└── README.md           # This file
```

## Usage

1. Open `index.html` in a web browser
2. Select your instrument from the dropdown
3. Choose between Flashcards or Notes & Chords mode
4. Practice identifying notes and learning chord variations

## Browser Compatibility

- Modern browsers with ES6+ support
- Requires local file serving for JSON loading (use a local server)

## Local Development

To run locally with JSON loading support:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Extending the App

The app is designed to be easily extensible:

- Add new instruments by creating JSON files
- Add new practice modes by extending the JavaScript
- Customize the UI by modifying the CSS
- Add new chord types by updating the JSON structure

## License

This project is open source and available under the MIT License. 