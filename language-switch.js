"use strict";
function setLanguage(lang) {
    document.documentElement.lang = lang;
    updatePageContent(lang);
}

function updatePageContent(lang) {
    var engData = document.getElementById('eng-data');
    var faData = document.getElementById('fa-data');

    if (engData && faData) {
        if (lang === 'fa') {
            toggleContentVisibility(engData, false);
            toggleContentVisibility(faData, true);
        } else {
            toggleContentVisibility(engData, true);
            toggleContentVisibility(faData, false);
        }
    }
}

function toggleContentVisibility(element, isVisible) {
    // You can use CSS classes for better separation of styles and behavior
    // Add/Remove the appropriate class based on the visibility status
    if (isVisible) {
        element.classList.add('visible');
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
        element.classList.remove('visible');
    }
}
