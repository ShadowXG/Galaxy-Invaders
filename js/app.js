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
    menu.replaceChildren(null)
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
    // appending buttons and title to the menu
    menu.appendChild(title)
    menu.appendChild(playButton)
    menu.appendChild(controlsButton)
    // let the buttons listen for the click event
    playButton.addEventListener('click', playGame)
    controlsButton.addEventListener('click', controls)
}

////////// CONTROLS MENU //////////

const controls = () => {
    menu.replaceChildren(null)
    // Title
    const controlsTitle = document.createElement('h1')
    controlsTitle.innerText = 'Controls'
    controlsTitle.style.webkitTextStroke = '2px #fff'
    controlsTitle.style.fontSize = '75px'
    // Controls
    const controlsText = document.createElement('h3')
    controlsText.innerText = 'You can move left and right with the A and D keys.\n You can also fire with spacebar.\n Try to survive as long as you can, and post your score to the leaderboard!'
    controlsText.style.color = 'white'
    controlsText.style.fontSize = '50px'
    // Exit Button
    const controlsExit = document.createElement('button')
    controlsExit.innerText = 'Exit'
    controlsExit.style.fontSize = '75px'
    controlsExit.style.webkitTextStroke = '2px #fff'
    controlsExit.style.backgroundColor = 'rgba(0, 0, 0, 0)'
    // Appending
    menu.appendChild(controlsTitle)
    menu.appendChild(controlsText)
    menu.appendChild(controlsExit)
    // event listener
    controlsExit.addEventListener('click', createMenu)
}

////////// EVENT LISTENERS //////////

document.addEventListener('DOMContentLoaded', () => {
    createMenu()
})