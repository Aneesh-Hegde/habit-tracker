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
