const canvas = document.createElement('canvas')
canvas.id = 'particles_canvas'
canvas.style.position = 'fixed'
canvas.style.zIndex = '999999'
canvas.style.pointerEvents = 'none'
document.body.append(canvas)
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false;
canvas.width = window.innerWidth
canvas.height = window.innerHeight
window.addEventListener('resize', function() { 
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})
let particles = []
let animating = false

function animate() {
    particles = particles.filter(element => !element.delete)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(particle => {
        particle.update()
        particle.draw()
    });
    if(particles.length > 0 && document.visibilityState == 'visible') {
        requestAnimationFrame(animate)
    } else {
        animating = false
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState == 'visible' && !animating && particles.length > 0) {
        animating = true
        animate()
    }
})

class Particles {
    constructor(canvas, ctx, img, x, y) {
        this.canvas = canvas
        this.ctx = ctx
        this.img = img
        this.x = x
        this.y = y
        this.delete = false
    }
    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}