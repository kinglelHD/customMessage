const basketball_canvas = document.createElement('canvas')
body.appendChild(basketball_canvas)
const basketball_ctx = basketball_canvas.getContext('2d')

basketball_canvas.id = 'basketball_canvas'
basketball_canvas.style.position = 'fixed'
basketball_canvas.style.inset = '0'
basketball_canvas.style.pointerEvents = 'none'

basketball_canvas.width = window.innerWidth
basketball_canvas.height = window.innerHeight

window.addEventListener('resize', function() { 
    basketball_canvas.width = window.innerWidth
    basketball_canvas.height = window.innerHeight
})

let basket_image = null
let ball_image = null
const basket_image_loader = load_image('basketball/basket.png')
const ball_image_loader = load_image('basketball/ball.png')

async function start_basketball_minigame() {
    try {
        basket_image = await basket_image_loader
        ball_image = await ball_image_loader
        await load_js('sound')
        loadSFX('bounce', 'basketball/bounce.wav')
        loadSFX('net', 'basketball/net.wav')
        basketball_minigame() // start the minigame when images are loaded
    } catch (error) {
        console.error('failed to load basketball assets', error)
    }
}

const checkCollision = (p1x, p1y, r1, p2x, p2y, r2) => ((r1 + r2) ** 2 > (p1x - p2x) ** 2 + (p1y - p2y) ** 2)

class Basket {
    constructor() {
        const img_width = 1679
        const img_height = 1588
        this.scale = Math.min(window.innerWidth / img_width, .3)
        this.width = this.scale * img_width
        this.height = this.scale * img_height
        window.addEventListener('resize', () => { 
            this.scale = Math.min(window.innerWidth / img_width, .3)
            this.width = this.scale * img_width
            this.height = this.scale * img_height
            this.x = window.innerWidth * .5 - this.width * .5
        })
        this.x = window.innerWidth * .5 - this.width * .5
        this.y = 0
    }
    draw() {
        basketball_ctx.drawImage(basket_image, this.x, this.y, this.width, this.height)
    }
}
const basket = new Basket()

class Ball {
    constructor() {
        this.width = 144 * 3 * basket.scale
        this.height = 143 * 3 * basket.scale
        this.radius = this.width * .5
        this.rotation = 0
        window.addEventListener('resize', () => { 
            this.width = 144 * 3 * basket.scale
            this.height = 143 * 3 * basket.scale
            this.radius = this.width * .5
            this.x = window.innerWidth * .5 - this.width * .5
            this.y = window.innerHeight - this.height
            this.vx = 0
            this.vy = 0
        })
        this.x = window.innerWidth * .5 - this.width * .5
        this.y = window.innerHeight - this.height
        this.vx = 0
        this.vy = 0
        this.ax = 0
        this.ay = 0
        this.drag = .99
        this.friction = .25
        this.gravity = 32
        this.throwing = false
        this.pos1 = {x: undefined, y: undefined}
        this.pos2 = {x: undefined, y: undefined}

        window.addEventListener("mousedown", (e) => {
            if (checkCollision(e.clientX, e.clientY, 10, this.x + this.width * .5, this.y + this.height * .5, this.radius)) {
                this.targetX = e.clientX - this.radius
                this.targetY = e.clientY - this.radius
                this.throwing = true;
            }
        });
        
        window.addEventListener("mousemove", (e) => {
            if (this.throwing) {
                this.pos1.x = e.clientX;
                this.pos1.y = e.clientY;
                this.targetX = e.clientX - this.radius
                this.targetY = e.clientY - this.radius
            }
        });

        window.addEventListener("mouseup", (e) => {
            this.pos2.x = e.clientX
            this.pos2.y = e.clientY
            if (this.throwing) {
                this.ax = (this.pos2.x - this.pos1.x) * .25
                this.ay = (this.pos2.y - this.pos1.y) * .25
                this.throwing = false;
            }
        });
    }
    update() {
        if (this.throwing && this.targetX && this.targetY) {
            this.vx = (this.targetX - this.x) * .25
            this.vy = (this.targetY - this.y) * .25
        }
        if (this.vy < this.gravity && this.y < basketball_canvas.height - this.height - .25) {
            this.vy += .69
        }
        this.vx += this.ax
        this.vy += this.ay
        this.x += this.vx
        this.y += this.vy
        this.vx *= this.drag
        this.vy *= this.drag
        this.ax *= .5
        this.ay *= .5

        if (Math.abs(this.ay) < .25) this.ay = 0
        if (Math.abs(this.ax) < .25) this.ax = 0
        if (Math.abs(this.vy) < .25) this.vy = 0
        if (Math.abs(this.vx) < .25) this.vx = 0

        if (this.x < 0) {
            this.vx *= -.8
            this.x = 0
            if (!this.throwing) playSFX('bounce')
        }
        if (this.x + this.width > basketball_canvas.width) {
            this.vx *= -.8
            this.x = basketball_canvas.width - this.width
            if (!this.throwing) playSFX('bounce')
        }
        if (this.y < 0) {
            this.vy *= -.8
            this.y = 0
            if (!this.throwing) playSFX('bounce')
        }
        if (this.y + this.height > basketball_canvas.height) {
            if (this.vy >= 2.5) {
                this.vy *= -.8
            } else {
                this.vy = 0
                this.ay = 0
            }
            this.vx *= this.friction
            this.y = basketball_canvas.height - this.height
            if (!this.throwing) playSFX('bounce')
        }

        this.rotation += this.vx / this.radius
    }
    draw() {
        basketball_ctx.save()
        basketball_ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
        basketball_ctx.rotate(this.rotation)
        basketball_ctx.drawImage(ball_image, -this.width / 2, -this.height / 2, this.width, this.height)
        basketball_ctx.restore()
    }
}
const ball = new Ball()

function basketball_minigame() {
    basketball_ctx.clearRect(0, 0, basketball_canvas.width, basketball_canvas.height)
    basket.draw()
    ball.update()
    ball.draw()

    requestAnimationFrame(basketball_minigame)
}






start_basketball_minigame()