// language-switch.js

function setLanguage(lang) {
    document.documentElement.lang = lang; // Set the HTML lang attribute

    // Call functions to update content based on the selected language
    updatePageContent(lang);
}

function updatePageContent(lang) {
    // Get the elements by ID
    var engData = document.getElementById('eng-data');
    var faData = document.getElementById('fa-data');

    // Check if the elements exist before accessing their style properties
    if (engData && faData) {
        // Implement logic to update specific elements based on the language
        // For example, you can toggle visibility or change text content
        if (lang === 'fa') {
            // Update elements for Farsi
            engData.style.display = 'none';
            faData.style.display = 'block';
        } else {
            // Update elements for English
            engData.style.display = 'block';
            faData.style.display = 'none';
        }
    }
}

// You can add more functions or customize the behavior based on your needs
