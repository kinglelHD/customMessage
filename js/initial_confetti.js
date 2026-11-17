/* function spawn_konfetti(count = 50, x = window.innerWidth * .5 - 1, y = 0) {
    for (let i = 0; i < count; i++) {
        new Konfetti(x, y, 1)
    }
} */
window.addEventListener('load', () => {
    load_js('konfetti').catch(error => {
        console.error('failed to load Konfetti', error)
    }).then(() => {
        for (let x = 0; x < window.innerWidth; x++) {
            spawn_konfetti(1, x, Math.random()*window.innerHeight)
        }
    })
})
