document.addEventListener('DOMContentLoaded', function() {
    setLanguage('en');
});

function setLanguage(lang) {
    document.documentElement.lang = lang;
    updatePageContent(lang);
}

function updatePageContent(lang) {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

    var elements = document.querySelectorAll('[data-en], [data-fa]');

    elements.forEach(function(element) {
        var isEnglish = lang === 'en';
        var content = isEnglish ? element.getAttribute('data-en') : element.getAttribute('data-fa');
        element.textContent = content;
    });
}
