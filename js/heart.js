let heart_image = null
const heart_image_loader = load_image('heart.svg')

async function start_heart_spawning() {
    try {
        heart_image = await heart_image_loader
        spawn_heart()
    } catch (error) {
        console.error('failed to load heart image', error)
    }
}

class Heart extends Particles {
    constructor() {

        let size = Math.random() * 20 + 40 /* random value from 40 to 50 */
        let x = Math.random() * (canvas.width - size)
        let y = -size

        super(canvas, ctx, heart_image, x, y) /* canvas, ctx, img, x, y */

        this.speedX = Math.random() * 1 + 1
        this.speedY = Math.random() * 1 + 1
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

let spawning_hearts = true
function spawn_heart() {
    new Heart()
    if (document.visibilityState == 'visible' && spawning_hearts) {
        setTimeout(spawn_heart, Math.random() * 1500 + 1500)
    } else {
        spawning_hearts = false
    }
}
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState == 'visible' && !spawning_hearts) {
        spawning_hearts = true
        spawn_heart()
    }
})

start_heart_spawning()