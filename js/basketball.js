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
let basket_net_image = null
let ball_image = null
const basket_image_loader = load_image('basketball/basket.png')
const basket_net_image_loader = load_image('basketball/basket_net.png')
const ball_image_loader = load_image('basketball/ball.png')
const basket_reference_scale = .3
const basket_horizontal_padding = 32

async function start_basketball_minigame() {
    try {
        basket_image = await basket_image_loader
        basket_net_image = await basket_net_image_loader
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
const net_collision_circles = [
    { x: 155, y: 282, radius: 18 },
    { x: 364, y: 282, radius: 18 }
]

class Basket {
    constructor() {
        const img_width = 1679
        const img_height = 1588
        this.scale = Math.min(Math.max(0, window.innerWidth - basket_horizontal_padding * 2) / img_width, window.innerHeight / img_height, basket_reference_scale)
        this.width = this.scale * img_width
        this.height = this.scale * img_height
        window.addEventListener('resize', () => { 
            this.scale = Math.min(Math.max(0, window.innerWidth - basket_horizontal_padding * 2) / img_width, window.innerHeight / img_height, basket_reference_scale)
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
            this.y = Math.max(0, window.innerHeight - this.height * 4)
            this.vx = 0
            this.vy = 0
        })
        this.x = window.innerWidth * .5 - this.width * .5
        this.y = Math.max(0, window.innerHeight - this.height * 4)
        this.vx = 0
        this.vy = 0
        /* this.ax = 0 */
        this.ay = 0
        this.drag = .99
        this.ground_friction = .5
        this.gravity = 32
        this.throwing = false
        /* this.pos1 = {x: undefined, y: undefined}
        this.pos2 = {x: undefined, y: undefined} */

        this.mousedown_f = (e) => {
            const point = e.touches ? e.touches[0] : e
            if (checkCollision(point.clientX, point.clientY, 10, this.x + this.width * .5, this.y + this.height * .5, this.radius)) {
                if (e.type === 'touchstart' && e.cancelable) e.preventDefault()
                this.targetX = point.clientX - this.radius
                this.targetY = point.clientY - this.radius
                this.throwing = true;
            }
        }
        window.addEventListener("mousedown", this.mousedown_f)
        window.addEventListener("touchstart", this.mousedown_f, { passive: false })
        
        this.mousemove_f = (e) => {
            const point = e.touches ? e.touches[0] : e
            if (this.throwing) {
                if (e.type === 'touchmove' && e.cancelable) e.preventDefault()
                this.targetX = point.clientX - this.radius
                this.targetY = point.clientY - this.radius
            }
        }
        window.addEventListener("mousemove", this.mousemove_f)
        window.addEventListener("touchmove", this.mousemove_f, { passive: false })

        this.mouseup_f = () => {
            if (this.throwing) {
                this.throwing = false;
            }
        } 
        window.addEventListener("mouseup", this.mouseup_f)
        window.addEventListener("touchend", this.mouseup_f)
        window.addEventListener("touchcancel", this.mouseup_f)
    }
    update() {
        if (this.throwing && this.targetX && this.targetY) {
            this.vx = (this.targetX - this.x) * .25
            this.vy = (this.targetY - this.y) * .25
        }
        if (this.vy < this.gravity && this.y < basketball_canvas.height - this.height - .25) {
            this.ay = 1 // gravity
        }
        /* this.vx += this.ax */
        const previousX = this.x
        const previousCenterX = this.x + this.width * .5
        const previousCenterY = this.y + this.height * .5
        this.vy += this.ay
        this.x += this.vx
        this.y += this.vy
        const scale = basket.scale / basket_reference_scale
        const left = net_collision_circles[0]
        const right = net_collision_circles[1]
        const hoopY = basket.y + left.y * scale
        const previousY = previousCenterY
        const currentX = this.x + this.width * .5
        const currentY = this.y + this.height * .5

        if (previousY < hoopY && currentY >= hoopY && this.vy > 0) {
            const t = (hoopY - previousY) / (currentY - previousY)
            const crossingX = previousCenterX + (currentX - previousCenterX) * t
            const leftEdge = basket.x + left.x * scale + left.radius * scale + this.radius
            const rightEdge = basket.x + right.x * scale - right.radius * scale - this.radius

            if (crossingX > leftEdge && crossingX < rightEdge && !this.throwing) {
                playSFX('net')
                // Count or otherwise handle the basket here.
            }
        }
        this.resolveNetCollisions(previousCenterX, previousCenterY)
        this.vx *= this.drag
        this.vy *= this.drag
        this.ax *= .5
        this.ay *= .5

        if (Math.abs(this.ay) < .25) this.ay = 0
        /* if (Math.abs(this.ax) < .25) this.ax = 0 */
        if (Math.abs(this.vy) < .25) this.vy = 0
        if (Math.abs(this.vx) < .25) this.vx = 0

        if (this.x < 0) { // left wall
            this.vx *= -.85
            this.x = 0
            if (!this.throwing) playSFX('bounce')
        }
        if (this.x + this.width > basketball_canvas.width) { // right wall
            this.vx *= -.85
            this.x = basketball_canvas.width - this.width
            if (!this.throwing) playSFX('bounce')
        }
        if (this.y < 0) { // top wall
            this.vy *= -.85
            this.y = 0
            if (!this.throwing) playSFX('bounce')
        }
        if (this.y + this.height > basketball_canvas.height) { // ground
            if (Math.abs(this.vy) >= 2.5) {
                this.vy *= -.85
            } else {
                this.vy = 0
                this.ay = 0
            }
            this.vx *= this.ground_friction
            this.y = basketball_canvas.height - this.height
            if (!this.throwing) playSFX('bounce')
        }

        if (!this.throwing) this.rotation += (this.x - previousX) / this.radius
    }
    resolveNetCollisions(startX, startY) { // implemented with AI
        let endX = this.x + this.width * .5
        let endY = this.y + this.height * .5
        const net_scale = basket.scale / basket_reference_scale

        for (const circle of net_collision_circles) {
            const circleX = basket.x + circle.x * net_scale
            const circleY = basket.y + circle.y * net_scale
            const collisionRadius = this.radius + circle.radius * net_scale
            const startOffsetX = startX - circleX
            const startOffsetY = startY - circleY
            const startDistanceSquared = startOffsetX ** 2 + startOffsetY ** 2
            const movementX = endX - startX
            const movementY = endY - startY
            let remainingX = movementX
            let remainingY = movementY
            let normalX
            let normalY

            if (startDistanceSquared < collisionRadius ** 2) {
                const startDistance = Math.sqrt(startDistanceSquared)
                if (startDistance > 0) {
                    normalX = startOffsetX / startDistance
                    normalY = startOffsetY / startDistance
                } else {
                    const speed = Math.hypot(this.vx, this.vy)
                    if (speed > 0) {
                        normalX = -this.vx / speed
                        normalY = -this.vy / speed
                    } else {
                        normalX = 0
                        normalY = -1
                    }
                }
                endX = circleX + normalX * (collisionRadius + .01)
                endY = circleY + normalY * (collisionRadius + .01)
            } else {
                const offsetMovement = startOffsetX * movementX + startOffsetY * movementY
                const movementLengthSquared = movementX ** 2 + movementY ** 2
                const discriminant = offsetMovement ** 2 - movementLengthSquared * (startDistanceSquared - collisionRadius ** 2)

                if (movementLengthSquared === 0 || discriminant < 0) continue

                const impactTime = (-offsetMovement - Math.sqrt(discriminant)) / movementLengthSquared
                if (impactTime < 0 || impactTime > 1) continue

                remainingX = movementX * (1 - impactTime)
                remainingY = movementY * (1 - impactTime)
                endX = startX + movementX * impactTime
                endY = startY + movementY * impactTime
                normalX = (endX - circleX) / collisionRadius
                normalY = (endY - circleY) / collisionRadius
                endX += normalX * .01
                endY += normalY * .01
            }

            const velocityAlongNormal = this.vx * normalX + this.vy * normalY
            const shouldSlide = this.throwing || velocityAlongNormal > -2.5
            if (shouldSlide) {
                const movementIntoSurface = remainingX * normalX + remainingY * normalY
                if (movementIntoSurface < 0) {
                    remainingX -= movementIntoSurface * normalX
                    remainingY -= movementIntoSurface * normalY
                }
                endX += remainingX
                endY += remainingY
            }
            if (velocityAlongNormal < 0) {
                if (!this.throwing && velocityAlongNormal <= -2.5) {
                    this.vx -= 1.85 * velocityAlongNormal * normalX
                    this.vy -= 1.85 * velocityAlongNormal * normalY
                    playSFX('bounce')
                } else {
                    this.vx -= velocityAlongNormal * normalX
                    this.vy -= velocityAlongNormal * normalY
                }
            }
        }

        this.x = endX - this.width * .5
        this.y = endY - this.height * .5
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

    /* MAGIC NUMBERS */
    basketball_ctx.drawImage(basket_net_image, basket.x, basket.y, basket.width, basket.height)
    requestAnimationFrame(basketball_minigame)
}






start_basketball_minigame()