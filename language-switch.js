function setLanguage(lang) {
    document.documentElement.lang = lang;
    updatePageContent(lang);
}

function updatePageContent(lang) {
    var elements = document.querySelectorAll('[data-en], [data-fa]');
    elements.forEach(function (element) {
        var isEnglish = lang === 'en';
        var text = isEnglish ? element.getAttribute('data-en') : element.getAttribute('data-fa');
        element.textContent = text;
    });
}
