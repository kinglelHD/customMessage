class Konfetti {
    constructor(x, y, size) {
        this.delete = false
        this.x = x
        this.y = y
        this.speedX = Math.random() * 10 - 5
        this.speedY = Math.random() * 10 - 5
        this.friction = .995
        this.size = size
        this.angel = Math.random()
        this.width = 20
        this.height = 40
        this.color = 'hsl(' + Math.floor(Math.random() * 360) + ', 100%, 50%)'

        particles.push(this)
        if (!animating) {
            animating = true
            animate()
        }
    }
    update() {
        this.size -= 0.01
        this.speedX *= this.friction
        this.speedY *= this.friction
        this.x += this.speedX
        this.y += this.speedY
        if (this.size <= 0.01 || this.y > canvas.height || this.y < - this.height || this.x > canvas.width || this.x < - this.width) {
            this.delete = true
        }
    }
    draw() {
        ctx.save()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width * this.size, this.height * this.size)
        ctx.fill()
        ctx.restore()
    }
}

function konfetti_corners() {
    spawn_konfetti(50, 0, 0)
    spawn_konfetti(50, 0, window.innerHeight)
    spawn_konfetti(50, window.innerWidth, 0)
    spawn_konfetti(50, window.innerWidth, window.innerHeight)
}

function spawn_konfetti(count = 50, x = window.innerWidth * .5 - 1, y = 0) {
    for (let i = 0; i < count; i++) {
        new Konfetti(x, y, 1)
    }
}