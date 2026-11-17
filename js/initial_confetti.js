/* function spawn_konfetti(count = 50, x = window.innerWidth * .5 - 1, y = 0) {
    for (let i = 0; i < count; i++) {
        new Konfetti(x, y, 1)
    }
} */
window.addEventListener('load', () => {
    load_js('konfetti').catch(error => {
        console.error('failed to load Konfetti', error)
    }).then(() => {
        const maxKonfetti = Math.min(window.innerWidth*.5, 500);
        for (let i = 0; i < maxKonfetti; i++) {
            spawn_konfetti(1, Math.random() * window.innerWidth, Math.random() * window.innerHeight)
        }
    })
})
