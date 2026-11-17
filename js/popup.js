//display <- from script.js
display.removeAttribute('style') // remove stantard display style from script.js
display.setAttribute('data-popup', true)
display.classList.add('active')

document.addEventListener('click', e => {
    if (!display.contains(e.target)) {
        display.classList.remove('active')
    }
})