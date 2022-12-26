const game = document.getElementById('canvas')
const menu = document.getElementById('menu')
const ctx = canvas.getContext('2d')

game.width = 1915
game.height = 970

////////// ENEMY CREATOR //////////

class Enemy {
    constructor(x, y, imageNumber) {
        this.x = x
        this.y = y
        this.width = 100
        this.height = 100

        this.image = new Image()
        this.image.src = `img/enemy${imageNumber}.png`
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

class EnemyController {
    enemyMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
    enemyRows = []

    // Targeting the canvas and creating enemies on it
    constructor(canvas) {
        this.canvas = canvas
        this.createEnemies()
    }

    // this calls drawEnemies
    draw(ctx) {
        this.drawEnemies(ctx)
    }

    // this changes the array into a latteral array, to draw the enemies easier
    drawEnemies(ctx) {
        this.enemyRows.flat().forEach((enemy) => {
            enemy.draw(ctx)
        })
    }

    // This creates the enemy by looking through the array and assinging a number to enemy number to be used later
    createEnemies() {
        this.enemyMap.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] = []
            row.forEach((enemyNumber, enemyIndex) => {
                if (enemyNumber > 0) {
                    this.enemyRows[rowIndex].push(
                        new Enemy(enemyIndex * 150, rowIndex * 75, enemyNumber))
                }
            })
        })
    }
}

const enemyController = new EnemyController(canvas)

////////// GAMEPLAY //////////

const playGame = () => {
    menu.replaceChildren(null)
    enemyController.draw(ctx)
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
    playButton.addEventListener('click', startGame)
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

////////// GAME LOOP //////////

const startGame = () => {
    setInterval(playGame, 1000/60)
}

////////// EVENT LISTENERS //////////

document.addEventListener('DOMContentLoaded', () => {
    createMenu()
})