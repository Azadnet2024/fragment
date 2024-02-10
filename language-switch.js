function setLanguage(lang) {
    document.documentElement.lang = lang;

    updatePageContent(lang);
}

function updatePageContent(lang) {
    if (lang === 'fa') {
        document.getElementById('englishContent').style.display = 'none';
        document.getElementById('farsiContent').style.display = 'block';
    } else {
        document.getElementById('englishContent').style.display = 'block';
        document.getElementById('farsiContent').style.display = 'none';
    }
}
