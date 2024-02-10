function setLanguage(lang) {
    document.documentElement.lang = lang;

    updatePageContent(lang);
}

function updatePageContent(lang) {
    var engData = document.getElementById('eng-data');
    var faData = document.getElementById('fa-data');

    if (engData && faData) {
        if (lang === 'fa') {
            engData.style.display = 'none';
            faData.style.display = 'block';
        } else {
            engData.style.display = 'block';
            faData.style.display = 'none';
        }
    }
}
