const game = document.getElementById('canvas')
const menu = document.getElementById('menu')
const ctx = canvas.getContext('2d')

game.width = 1915
game.height = 970

const playGame = () => {
    menu.replaceChildren(null)
}

////////// MAIN MENU //////////

const createMenu = () => {
    // creating the title of the game
    const title = document.createElement('h1')
    title.innerText = 'Galaxy Invaders'
    title.style.webkitTextStroke = '2px #fff'
    title.style.fontSize = '100px'
    // creating the play button
    const playButton = document.createElement('button')
    playButton.id = 'playButton'
    playButton.style.fontSize = '75px'
    playButton.innerText = 'Play'
    playButton.style.webkitTextStroke = '2px #fff'
    playButton.style.paddingRight = "50px"
    playButton.style.backgroundColor = 'rgba(0, 0, 0, 0)'
    // Creating the controls button
    const controlsButton = document.createElement('button')
    controlsButton.id = 'controlsButton'
    controlsButton.style.fontSize = '75px'
    controlsButton.innerText = 'Controls'
    controlsButton.style.webkitTextStroke = '2px #fff'
    controlsButton.style.backgroundColor = 'rgba(0, 0, 0, 0)'
    // appending my creations to the menu
    menu.appendChild(title)
    menu.appendChild(playButton)
    menu.appendChild(controlsButton)
    // let the buttons listen for the click event
    playButton.addEventListener('click', playGame)
    controlsButton.addEventListener('click', controls)
}

////////// CONTROLS AREA //////////

const controls = () => {
    menu.replaceChildren(null)
}

////////// EVENT LISTENERS //////////

document.addEventListener('DOMContentLoaded', () => {
    createMenu()
})