const head = document.querySelector('head')
const generator = document.querySelector('.generator')
const display = document.querySelector('.display')
const message_h1 = document.getElementById('message_h1')
const name_p = document.getElementById('name_p')

function load_css(filename) {
    return new Promise((resolve, reject) => {
        let link = document.createElement('link')
        link.href = `/css/${filename}.css`
        link.rel = 'stylesheet'
        link.onload = () => resolve(link)
        link.onerror = () => reject(new Error(`Failed to load CSS: ${filename}`))
        head.appendChild(link)
    })
}
function load_js(filename) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.src = `/js/${filename}.js`
        script.async = false
        script.defer = false
        script.type = 'text/javascript'
        script.onload = () => resolve(script)
        script.onerror = () => reject(new Error(`Failed to load JS: ${filename}`))
        head.appendChild(script)
    })
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

    ;(async () => {
        if (background) {
            await load_css(background)
            await load_js(background)
        }

        if (special) {
            await load_js('particles')
            await load_js(special)
        }
    })().catch((error) => {
        console.error(error)
    })

} else {
    generator.style.display = 'block'
    display.style.display = 'none'
}