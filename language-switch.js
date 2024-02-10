function switchLanguage(language) {
    document.documentElement.lang = language;
}

document.getElementById('englishBtn').addEventListener('click', function () {
    switchLanguage('en');
});

document.getElementById('farsiBtn').addEventListener('click', function () {
    switchLanguage('fa');
});
