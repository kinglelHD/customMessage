/* 
const display = document.querySelector('.display')
(in script.js)
*/

const flower_leave = (id) => {
    return `
    <svg id="${id}" class="flower_leave" xmlns="http://www.w3.org/2000/svg" viewBox="-2.3094 -11 4.619 11">
        <path d="M0 0C-4 0-2-10 0-11 2-10 4 0 0 0" class="flower_green"/>
    </svg>
    `
}
const flower_blossom = (id) => {
    return `
    <svg id="${id}" class="flower_blossom" xmlns="http://www.w3.org/2000/svg" viewBox="-6 -12 12 12">
        <path d="M 0 -4 L 5 -6 C 5 -8 3.6667 -9.3333 3 -10 C 2.3333 -9.3333 1 -8 1 -6 L -1 -6 C -1 -8 -2.3333 -9.3333 -3 -10 C -3.6667 -9.3333 -5 -8 -5 -6 Z" class="flower_yellow"/>
        <path d="M -6 -6 A 2 2 90 0 0 6 -6 S 6 -9.3333 6 -11 C 3 -8 3 -6 3 -6 S 2 -10 0 -12 C -2 -10 -3 -6 -3 -6 S -3 -8 -6 -11 C -6 -8 -6 -6 -6 -6 Z" class="flower_white"/>
    </svg>
    `
}
const flower_stem_big = (id) => {
    return `
    <svg id="${id}" class="flower_stem_big" xmlns="http://www.w3.org/2000/svg" viewBox="0 -18.0948 6 18.09">
        <path d="M0 0C5-7-2-24 6-16H5C-1-22 6-6 1 0" class="flower_light_green"/>
    </svg>
    `
}
const flower_stem_small = (id) => {
    return `
    <svg id="${id}" class="flower_stem_small" xmlns="http://www.w3.org/2000/svg" viewBox="0 -4.68301 4 4.683">
        <path d="M 0 0 C 0 -3 2 -7 4 -3 H 3 C 2 -6 1 -3 0 0 Z" class="flower_light_green"/>
    </svg>
    `
}

function add_flower(number, leaves, blossoms) {
    const flower = document.createElement('div')
    flower.classList.add('flower')
    flower.id = `flower_${number}`
    for (let i = 1; i < leaves + 1; i++) {
        flower.innerHTML += flower_leave(`flower_${number}_leave_${i}`)
    }
    flower.innerHTML += flower_stem_big(`flower_${number}_stem_big_1`)
    for (let i = 1; i < blossoms + 1; i++) {
        if(i<blossoms) flower.innerHTML += flower_stem_small(`flower_${number}_stem_small_${i}`) // 1 less stem then blossoms
        flower.innerHTML += flower_blossom(`flower_${number}_blossom_${i}`)
    }
    display.appendChild(flower)
}

add_flower(1, 2, 3) //flower_1 | 2 leaves | 3 blossoms
add_flower(2, 2, 3) //flower_2 | 2 leaves | 3 blossoms