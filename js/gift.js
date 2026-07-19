let gift_image = null
const gift_image_loader = load_image('gift.png')

async function start_gift_spawning() {
    try {
        gift_image = await gift_image_loader
        spawn_gift()
    } catch (error) {
        console.error('failed to load gift image', error)
    }
}
class Gift extends Particles {
    constructor() {

        let S_width = 324
        let S_height = 456
        let size = Math.random() * .08 + .16
        let x = Math.random() * (canvas.width - (S_width * size))
        let y = - (S_height * size)
        
        super(canvas, ctx, gift_image, x, y)
        
        this.width = S_width * size 
        this.height = S_height * size
        
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() + .5
        /* this.clicked = false
        this.content = this.size * 25 */
        
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
    /* click() {   
        this.clicked = true   
        for (let i = 0; i < this.content; i++) {
            Konfettis.push(new Surprise(this.x + this.width * .5, this.y + this.height * .5, this.size));
        }
    } */
}

let spawning_gifts = true
function spawn_gift() {
    new Gift()
    if (document.visibilityState == 'visible' && spawning_gifts) {
        setTimeout(spawn_gift, Math.random() * 1500 + 1500)
    } else {
        spawning_gifts = false
    }
}
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState == 'visible' && !spawning_gifts) {
        spawning_gifts = true
        spawn_gift()
    }
})

start_gift_spawning()