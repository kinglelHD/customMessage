let cookie_image = null
const cookie_image_loader = load_image('cookie.png')

async function start_cookie_spawning() {
    try {
        cookie_image = await cookie_image_loader
        spawn_cookie()
    } catch (error) {
        console.error('failed to load cookie image', error)
    }
}

class Cookie extends Particles {
    constructor() {

        let size = Math.random() * 20 + 40 /* random value from 40 to 50 */
        let x = Math.random() * (canvas.width - size)
        let y = -size

        super(canvas, ctx, cookie_image, x, y) /* canvas, ctx, img, x, y */

        const random_abs_speedX = Math.random() * 1 + 1
        this.speedX = Math.random() > .5 ? -random_abs_speedX : random_abs_speedX
        this.speedY = Math.random() * 2 + 2
        this.width = size
        this.height = size

        particles.push(this)
        if (!animating) {
            animating = true
            animate()
        }
    }
    update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x <= 0 || this.x >= this.canvas.width - this.width) {
            this.speedX = - this.speedX
        }
        if (this.y > this.canvas.height || this.y < - this.height || this.x > this.canvas.width || this.x < - this.width) {
            this.delete = true
        }
    }
}

let spawning_cookies = true
function spawn_cookie() {
    new Cookie()
    if (document.visibilityState == 'visible' && spawning_cookies) {
        setTimeout(spawn_cookie, Math.random() * 1500 + 1500)
    } else {
        spawning_cookies = false
    }
}
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState == 'visible' && !spawning_cookies) {
        spawning_cookies = true
        spawn_cookie()
    }
})

start_cookie_spawning()