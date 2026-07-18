const head = document.querySelector('head')
const generator = document.querySelector('.generator')
const display = document.querySelector('.display')
const message_h1 = document.getElementById('message_h1')
const name_p = document.getElementById('name_p')

function load_css(filename) {
    let link = document.createElement('link')
    link.href = `/css/${filename}.css`
    link.rel = 'stylesheet'
    head.appendChild(link)
}
function load_js(filename) {
    let script = document.createElement('script')
    script.src = `/js/${filename}.js`
    script.defer = true
    script.type = 'text/javascript'
    head.appendChild(script)
}
function load_image(filename_with_extension) {
    const image = new Image()
    image.src = `/assets/${filename_with_extension}`
    return image
}

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.size > 0) {
    
    const message = urlParams.get('message');
    const name = urlParams.get('name');
    const background = urlParams.get('background');
    const special = urlParams.get('special');
    
    if (!message && !name && !background && !special) {
        window.location.search = ''
    }

    generator.style.display = 'none'
    display.style.display = 'block'

    message_h1.innerText = message
    name_p.innerText = name

    if (background) {
        load_css(background)
        load_js(background)
    }
    if (special) {
        load_js('particles')
        load_js(special)
    }


} else {
    generator.style.display = 'block'
    display.style.display = 'none'
}