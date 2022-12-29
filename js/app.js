const game = document.getElementById('canvas')
const menu = document.getElementById('menu')
const ctx = canvas.getContext('2d')

game.width = 1915
game.height = 970

////////// PLAYER CREATOR //////////

class Player {
    constructor(canvas, velocity) {
        this.canvas = canvas
        this.velocity = velocity

        this.x = this.canvas.width/2
        this.y  = this.canvas.height - 100
        this.width = 100
        this.height = 100
        this.image = new Image()
        this.image.src = 'img/player.png'
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

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

    move(xVelocity, yVelocity) {
        this.x += xVelocity
        this.y += yVelocity
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

    movingDirection = {
        left: 0,
        right: 1,
        downLeft: 2,
        downRight: 3
    }

    currentDirection = this.movingDirection.right
    xVelocity = 0
    yVelocity = 0
    defaultXVelocity = 1
    defaultYVelocity = 1
    moveDownTimerDefault = 45
    moveDownTimer = this.moveDownTimerDefault

    // Targeting the canvas and creating enemies on it
    constructor(canvas) {
        this.canvas = canvas
        this.createEnemies()
    }

    // this calls drawEnemies
    draw(ctx) {
        this.decrementTimer()
        this.updateVelocityAndDirection()
        this.drawEnemies(ctx)
        this.resetTimer()
    }

    resetTimer() {
        if (this.moveDownTimer <= 0) {
            this.moveDownTimer = this.moveDownTimerDefault
        }
    }

    decrementTimer() {
        if (this.currentDirection === this.movingDirection.downLeft || this.movingDirection.downRight) {
            this.moveDownTimer--
        }
    }

    updateVelocityAndDirection() {
        for (const enemyRow of this.enemyRows) {
            if (this.currentDirection === this.movingDirection.right) {
                this.xVelocity = this.defaultXVelocity
                this.yVelocity = 0
                const rightMostEnemy = enemyRow[enemyRow.length - 1]
                if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
                    this.currentDirection = this.movingDirection.downLeft
                    break
                }
            }else if (this.currentDirection === this.movingDirection.downLeft) {
                if (this.moveDown(this.movingDirection.left)) {
                    break
                }
            }else if (this.currentDirection === this.movingDirection.left) {
                this.xVelocity = -this.defaultXVelocity
                this.yVelocity = 0
                const leftMostEnemy = enemyRow[0]
                if (leftMostEnemy.x <= 0) {
                    this.currentDirection = this.movingDirection.downRight
                    break
                }
            }else if (this.currentDirection === this.movingDirection.downRight) {
                if (this.moveDown(this.movingDirection.right)) {
                    break
                }
            }
        }
    }

    moveDown(newDirection) {
        this.xVelocity = 0
        this.yVelocity = this.defaultYVelocity
        if (this.moveDownTimer <= 0) {
            this.currentDirection = newDirection
            return true
        }
        return false
    }

    // this changes the array into a latteral array, to draw the enemies easier
    drawEnemies(ctx) {
        this.enemyRows.flat().forEach((enemy) => {
            enemy.move(this.xVelocity, this.yVelocity)
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

////////// CREATOR //////////

const enemyController = new EnemyController(canvas)
const player = new Player(canvas, 3)

////////// GAMEPLAY //////////

const playGame = () => {
    menu.replaceChildren('')
    ctx.clearRect(0, 0, game.width, game.height)
    enemyController.draw(ctx)
    player.draw(ctx)
}

////////// MAIN MENU //////////

const createMenu = () => {
    menu.replaceChildren('')
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
    menu.replaceChildren('')
    // Title
    const controlsTitle = document.createElement('h1')
    controlsTitle.innerText = 'Controls'
    controlsTitle.style.webkitTextStroke = '2px #fff'
    controlsTitle.style.fontSize = '75px'
    // Controls
    const controlsText = document.createElement('h3')
    controlsText.innerText = 'You can move left and right with the A and D keys.\n\
    You can also fire with spacebar.\n\
    Try to survive as long as you can, and post your score to the leaderboard!'
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