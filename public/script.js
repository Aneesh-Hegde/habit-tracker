let padaiBox = document.querySelector('.padai-box');
let physicalBox = document.querySelector('.physical-box');
let mentalBox = document.querySelector('.mental-box');
let homepage = document.querySelector('.home-page');
let backButton = document.querySelectorAll('.back-button');
let topPage = document.querySelector('.physical');

padaiBox.addEventListener("click", () => {
    topPage.classList.toggle('top-page'); 
    topPage = document.querySelector('.padai'); 
    topPage.classList.toggle('top-page'); 
    homepage.style.left = "-100%";
});

physicalBox.addEventListener("click", () => {
    topPage.classList.toggle('top-page'); 
    topPage = document.querySelector('.physical'); 
    topPage.classList.toggle('top-page'); 
    homepage.style.left = "-100%";
});

mentalBox.addEventListener("click", () => {
    topPage.classList.toggle('top-page'); 
    topPage = document.querySelector('.mental'); 
    topPage.classList.toggle('top-page'); 
    homepage.style.left = "-100%";
});

backButton.forEach(button => {
    button.addEventListener("click", () => {
        homepage.style.left = "0";
    });
});


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
