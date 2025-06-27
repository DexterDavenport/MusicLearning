# CSS Structure Documentation

This directory contains the modular CSS structure for the Instrument Practice application, optimized for both desktop and mobile devices.

## File Organization

### `main.css`

The main entry point that imports all other CSS files in the correct order. This is the only CSS file that should be linked in the HTML.

### `base.css`

Contains global styles, CSS reset, and basic layout components:

- CSS reset and global styles
- Body and container styles
- Header and footer styles
- Mode selector styles
- Mobile-first responsive design
- Touch target optimizations
- Landscape orientation support

### `components.css`

Reusable UI components used across the application:

- Button styles (primary, secondary, reveal)
- Modal styles (chord modal)
- Close button styles
- Screen reader utilities
- Mobile-optimized touch interactions
- Responsive modal handling

### `instruments.css`

Instrument selector and related styles:

- Instrument selector container
- Instrument button styles
- Mobile-friendly touch targets
- Responsive design for instrument selection
- Landscape orientation support

### `flashcards.css`

All flashcard-related styles:

- Flashcard settings and options
- Flashcard display and animations
- Timer and progress indicators
- Completion banner
- Feedback display
- Mobile-optimized controls
- Touch-friendly sliders
- Responsive design for flashcards

### `cheatsheet.css`

Cheat sheet mode styles:

- Cheat sheet container
- Note grid layouts
- String section styles
- Note item interactions
- Mobile-optimized grids
- Touch-friendly note items
- Responsive design for cheatsheet

### `chords.css`

Chord mode styles:

- Chord container and layout
- Chord selector and categories
- Chord display and fretboard
- Chord notes and badges
- Mobile-friendly layouts
- Touch-optimized interactions
- Responsive design for chords

### `notes.css`

Notes & Chords mode styles:

- Notes container and layout
- Note selector and categories
- Note item styles (natural, sharp, flat)
- Chord variations display
- Mobile-optimized grids
- Touch-friendly interactions
- Responsive design for notes

## Mobile Optimizations

### Touch Targets

- All interactive elements have minimum 44px touch targets
- Larger touch targets (48px) on mobile devices
- Proper spacing between touch elements

### Touch Interactions

- `-webkit-tap-highlight-color: transparent` for better touch feedback
- `touch-action: manipulation` for improved touch responsiveness
- `-webkit-user-select: none` to prevent text selection on mobile
- Active states for better touch feedback

### Responsive Design

- Mobile-first approach with progressive enhancement
- Breakpoints: 768px (tablet), 480px (mobile), 360px (small mobile)
- Landscape orientation support for mobile devices
- Flexible grids that adapt to screen size

### Performance Optimizations

- `-webkit-overflow-scrolling: touch` for smooth scrolling
- `-webkit-font-smoothing: antialiased` for better text rendering
- Optimized animations and transitions
- Efficient CSS selectors

### Accessibility

- Screen reader support with `.sr-only` class
- Proper focus states
- Semantic HTML structure
- Color contrast compliance

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
- **Mobile-First**: Optimized for mobile devices with progressive enhancement
- **Touch-Friendly**: All interactions optimized for touch devices
- **Responsive**: Works seamlessly across all device sizes

## Adding New Styles

When adding new styles:

1. Determine which existing file they belong to, or create a new one
2. If creating a new file, add an import statement to `main.css`
3. Follow the existing naming conventions and structure
4. Include responsive design considerations
5. Ensure touch targets meet minimum size requirements
6. Add appropriate touch interaction properties
7. Test on mobile devices
8. Update this README if adding new files

## Browser Compatibility

All CSS files use modern CSS features with appropriate fallbacks:

- CSS Grid and Flexbox for layouts
- CSS custom properties for theming
- Modern selectors and pseudo-classes
- Backdrop filters with fallbacks
- Mobile-first responsive design
- Touch-friendly interactions
- Progressive enhancement approach

## Mobile Testing Checklist

When testing on mobile devices, ensure:

- [ ] All buttons are easily tappable (44px minimum)
- [ ] Text is readable without zooming
- [ ] Layout adapts to different screen sizes
- [ ] Touch interactions feel responsive
- [ ] No horizontal scrolling issues
- [ ] Landscape orientation works properly
- [ ] Performance is smooth on mobile devices
