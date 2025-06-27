# CSS Structure Documentation

This directory contains the modular CSS structure for the Instrument Practice application.

## File Organization

### `main.css`
The main entry point that imports all other CSS files in the correct order. This is the only CSS file that should be linked in the HTML.

### `base.css`
Contains global styles, CSS reset, and basic layout components:
- CSS reset and global styles
- Body and container styles
- Header and footer styles
- Mode selector styles
- Responsive design for base elements

### `components.css`
Reusable UI components used across the application:
- Button styles (primary, secondary, reveal)
- Modal styles (chord modal)
- Close button styles
- Screen reader utilities

### `instruments.css`
Instrument selector and related styles:
- Instrument selector container
- Instrument button styles
- Responsive design for instrument selection

### `flashcards.css`
All flashcard-related styles:
- Flashcard settings and options
- Flashcard display and animations
- Timer and progress indicators
- Completion banner
- Feedback display
- Responsive design for flashcards

### `cheatsheet.css`
Cheat sheet mode styles:
- Cheat sheet container
- Note grid layouts
- String section styles
- Note item interactions
- Responsive design for cheatsheet

### `chords.css`
Chord mode styles:
- Chord container and layout
- Chord selector and categories
- Chord display and fretboard
- Chord notes and badges
- Responsive design for chords

### `notes.css`
Notes & Chords mode styles:
- Notes container and layout
- Note selector and categories
- Note item styles (natural, sharp, flat)
- Chord variations display
- Responsive design for notes

## Usage

To use this CSS structure:

1. Link only `css/main.css` in your HTML file
2. The main.css file will automatically import all other CSS files
3. To modify styles, edit the appropriate component file
4. To add new features, create a new CSS file and import it in main.css

## Benefits

- **Modularity**: Each feature has its own CSS file
- **Maintainability**: Easier to find and modify specific styles
- **Scalability**: Easy to add new features without cluttering existing code
- **Organization**: Clear separation of concerns
- **Performance**: CSS imports are handled efficiently by modern browsers

## Adding New Styles

When adding new styles:

1. Determine which existing file they belong to, or create a new one
2. If creating a new file, add an import statement to `main.css`
3. Follow the existing naming conventions and structure
4. Include responsive design considerations
5. Update this README if adding new files

## Browser Compatibility

All CSS files use modern CSS features with appropriate fallbacks:
- CSS Grid and Flexbox for layouts
- CSS custom properties for theming
- Modern selectors and pseudo-classes
- Backdrop filters with fallbacks
- Responsive design with mobile-first approach 