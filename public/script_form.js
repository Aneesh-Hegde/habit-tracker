// Select the button and body elements
const modeToggle = document.getElementById('mode-toggle');
const body = document.body;

// Add event listener for the mode toggle button
modeToggle.addEventListener('click', function() {
    // Toggle dark mode class on the body
    body.classList.toggle('dark-mode');

    // Save the current mode preference in localStorage
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Check if dark mode preference is saved in localStorage
const darkModeSaved = localStorage.getItem('darkMode');

// If dark mode preference is true, enable dark mode
if (darkModeSaved === 'true') {
    body.classList.add('dark-mode');
}
