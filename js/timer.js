// Timer Management Module

import {
    flashcardSettings,
    setFlashcardTimer,
    setTimerInterval,
    setTimerStartTime,
    setTimerDuration
} from './config.js';

import {
    timerProgress,
    timerCountdown,
    setText
} from './dom.js';

import { showFlashcardFeedback } from './feedback.js';

// Start the timer for timed mode
export function startTimer() {
    const duration = flashcardSettings.timeLimit * 1000; // Convert to milliseconds
    const startTime = Date.now();

    setTimerDuration(duration);
    setTimerStartTime(startTime);

    // Initialize timer display
    timerProgress.style.width = '100%';
    setText(timerCountdown, flashcardSettings.timeLimit.toFixed(1));

    // Update timer every 100ms for smooth animation
    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        const remainingSeconds = remaining / 1000;

        // Update progress bar
        const progressPercent = (remaining / duration) * 100;
        timerProgress.style.width = `${progressPercent}%`;

        // Update countdown text
        setText(timerCountdown, remainingSeconds.toFixed(1));

        // Check if time is up
        if (remaining <= 0) {
            clearInterval(interval);
            setTimerInterval(null);
            showFlashcardFeedback();
        }
    }, 100);

    setTimerInterval(interval);

    // Set the main timer for the actual timeout
    const timer = setTimeout(() => {
        if (interval) {
            clearInterval(interval);
            setTimerInterval(null);
        }
        showFlashcardFeedback();
    }, duration);

    setFlashcardTimer(timer);
} 