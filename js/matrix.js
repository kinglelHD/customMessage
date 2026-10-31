const SYMBOLS = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const CONTENT_TEXT = (message_h1.innerText + name_p.innerText).replaceAll(' ', '')
const ACTUAL_TEXTS = [
    CONTENT_TEXT,
    '101010', // 42
    String(window.location.host)
]

const matrix_canvas = document.createElement('canvas')
body.appendChild(matrix_canvas)
const matrix_ctx = matrix_canvas.getContext('2d')

matrix_canvas.id = 'matrix_canvas'
matrix_canvas.style.position = 'fixed'
matrix_canvas.style.inset = '0'
matrix_canvas.style.zIndex = '-1'
matrix_canvas.style.pointerEvents = 'none'

matrix_canvas.width = window.innerWidth
matrix_canvas.height = window.innerHeight

class Symbol {
    constructor(canvasHeight, fontSize, x, y) {
        this.canvasHeight = canvasHeight
        this.fontSize = fontSize
        this.active = false
        this.x = x
        this.y = y
        this.actual_text = ACTUAL_TEXTS[Math.floor(Math.random() * ACTUAL_TEXTS.length)]
        this.show_actual_text = false
        this.text_index = 0
        this.content = '#'
    }
    animate(matrix_ctx) {
        if (!this.active) {
            if (Math.random() < 0.1) { // 10%
                this.active = true
                this.y = 0
            } else {
                return
            }
        }
        if (!this.show_actual_text) {
            this.show_actual_text = Math.random() < .01 // 1%
        }
        if (this.show_actual_text && this.text_index < this.actual_text.length) {
            this.text_index ++
        } else {
            this.show_actual_text = false
            this.text_index = 0
        }
        if (this.show_actual_text) {
            this.content = this.actual_text.charAt(this.text_index - 1)
        } else {
            this.content = SYMBOLS.charAt(Math.floor(Math.random() * SYMBOLS.length))
        }
        if (this.show_actual_text) {
            matrix_ctx.save()
            matrix_ctx.fillStyle = 'red'
        }
        matrix_ctx.fillText(this.content, this.x * this.fontSize, this.y * this.fontSize)
        if (this.show_actual_text) {
            matrix_ctx.restore()
        }
        if (this.y * this.fontSize > this.canvasHeight) {
            this.active = false
        } else {
            this.y ++
        }
    }
}

let fontSize = window.innerWidth / 50
let columns = matrix_canvas.width / fontSize
let symbols

function setup() {
    symbols = []
    for (let i = 0; i < columns; i++) {
        symbols.push(new Symbol(matrix_canvas.height, fontSize, i, 0))
    }
}
setup()

let lastTime = 0
const FPS = 20
const NEXT_FRAME = 1000/FPS
let timer = 0

function animate(timeStamp) {
    const dt = timeStamp - lastTime
    lastTime = timeStamp

    if (timer > NEXT_FRAME) {
        matrix_ctx.fillStyle = 'rgba(0,0,0,0.2)'
        matrix_ctx.fillRect(0, 0, matrix_canvas.width, matrix_canvas.height)

        matrix_ctx.fillStyle = '#0aff0a'
        matrix_ctx.textAlign = 'center'
        matrix_ctx.font = fontSize + 'px monospace'
        symbols.forEach(s => {
            s.animate(matrix_ctx)
        });
        timer -= NEXT_FRAME
    } else {
        timer += dt
    }

    requestAnimationFrame(animate)
}
animate(0)

window.addEventListener('resize', function() { 
    matrix_canvas.width = window.innerWidth
    matrix_canvas.height = window.innerHeight

    fontSize = window.innerWidth / 50
    columns = matrix_canvas.width / fontSize

    setup()
})