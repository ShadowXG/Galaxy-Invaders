const game = document.getElementById('canvas')
const menu = document.getElementById('menu')
const ctx = canvas.getContext('2d')

game.width = 1915
game.height = 970

////////// PLAYER CREATOR //////////

class Player {
    rightPressed = false
    leftPressed = false
    shootPressed = false

    constructor(canvas, velocity, bulletController) {
        this.canvas = canvas
        this.velocity = velocity
        this.bulletController = bulletController

        this.x = this.canvas.width/2
        this.y  = this.canvas.height - 100
        this.width = 100
        this.height = 100
        this.image = new Image()
        this.image.src = 'img/player.png'

        document.addEventListener('keydown', this.keydown)
        document.addEventListener('keyup', this.keyup)
    }

    draw(ctx) {
        if (this.shootPressed) {
            // Controls the bullet spawn and how fast and spaced out they are
            this.bulletController.shoot(this.x + this.width/2 - 5, this.y, 7, 20)
        }
        this.move()
        this.collideWithWalls()
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }

    collideWithWalls() {
        // Left check
        if (this.x < 0) {
            this.x = 0
        }else if (this.x > this.canvas.width - this.width) {
            // Right check
            this.x = this.canvas.width - this.width
        }
    }

    // Player movement
    move() {
        if (this.rightPressed) {
            this.x += this.velocity
        }else if (this.leftPressed) {
            this.x += -this.velocity
        }
    }

    // Key events
    keydown = event => {
        if(event.code == 'KeyD') {
            this.rightPressed = true
        }else if(event.code == 'KeyA') {
            this.leftPressed = true
        }
        if (event.code == 'Space') {
            this.shootPressed = true
        }
    }

    keyup = event => {
        if(event.code == 'KeyD') {
            this.rightPressed = false
        }else if(event.code == 'KeyA') {
            this.leftPressed = false
        }
        if (event.code == 'Space') {
            this.shootPressed = false
        }
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
    fireBulletTimerDefault = 100
    fireBulletTimer = this.fireBulletTimerDefault

    // Targeting the canvas and creating enemies on it
    constructor(canvas, enemyBulletController, playerBulletController) {
        this.canvas = canvas
        this.enemyBulletController = enemyBulletController
        this.playerBulletController = playerBulletController

        this.enemyDeathSound = new Audio('sounds/enemy-death.wav')
        this.enemyDeathSound.volume = 0.1

        this.createEnemies()
    }

    // this calls drawEnemies
    draw(ctx) {
        this.decrementTimer()
        this.updateVelocityAndDirection()
        this.collisionDetection()
        this.drawEnemies(ctx)
        this.resetTimer()
        this.fireBullet()
    }

    collisionDetection() {
        this.enemyRows.forEach(enemyRow => {
            enemyRow.forEach((enemy, enemyIndex) => {
                if (this.playerBulletController.collideWith(enemy)) {
                    this.enemyDeathSound.currentTime = 0
                    this.enemyDeathSound.play()
                    enemyRow.splice(enemyIndex, 1)
                }
            })
        })
        this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0)
    }

    // Enemy firing bullets
    fireBullet() {
        this.fireBulletTimer--
        if (this.fireBulletTimer <= 0) {
            this.fireBulletTimer = this.fireBulletTimerDefault
            const allEnemies = this.enemyRows.flat()
            const enemyIndex = Math.floor(Math.random() * allEnemies.length)
            const enemy = allEnemies[enemyIndex]
            this.enemyBulletController.shoot(enemy.x, enemy.y, -3)
        }
    }

    // Movement timer
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

    // Enemy movement and collision detection
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

////////// BULLET CREATOR //////////

class Bullet {
    constructor(canvas, x, y, velocity, bulletColor) {
        this.canvas = canvas
        this.x = x
        this.y = y
        this.velocity = velocity
        this.bulletColor = bulletColor

        this.width = 10
        this.height = 30
    }

    // Makes the bullet
    draw(ctx) {
        this.y -= this.velocity
        ctx.fillStyle = this.bulletColor
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    collideWith(sprite) {
        if (this.x + this.width > sprite.x &&
            this.x < sprite.x + sprite.width &&
            this.y + this.height > sprite.y &&
            this.y < sprite.y + sprite.height) {
                return true
            }else {
                return false
            }
    }
}

class BulletController {
    bullets = []
    timeTillNextBullet = 0

    constructor(canvas, maxBulletsAtATime, bulletColor, soundEnabled) {
        this.canvas = canvas
        this.maxBulletsAtATime = maxBulletsAtATime
        this.bulletColor = bulletColor
        this.soundEnabled = soundEnabled

        this.shootSound = new Audio('sounds/shoot.wav')
        this.shootSound.volume = 0.10
    }

    // Checks for bullets off screen removes them so the player can fire more also checks enemy bullets
    draw(ctx) {
        this.bullets = this.bullets.filter(bullet => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height)
        this.bullets.forEach((bullet) => bullet.draw(ctx))
        if (this.timeTillNextBullet > 0) {
            this.timeTillNextBullet--
        }
    }

    collideWith(sprite) {
        const hitSpriteIndex = this.bullets.findIndex(bullet => bullet.collideWith(sprite))
        if (hitSpriteIndex >= 0) {
            this.bullets.splice(hitSpriteIndex, 1)
            return true
        }
        return false
    }

    // Creates the bullets
    shoot(x, y, velocity, timeTillNextBullet = 0) {
        if (this.timeTillNextBullet <= 0 && this.bullets.length < this.maxBulletsAtATime) {
            const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor)
            this.bullets.push(bullet)
            if (this.soundEnabled) {
                this.shootSound.currentTime = 0
                this.shootSound.play()
            }
            this.timeTillNextBullet = timeTillNextBullet
        }
    }
}

////////// CREATOR //////////

const playerBulletController = new BulletController(canvas, 5, 'red', true)
const enemyBulletController = new BulletController(canvas, 4, 'white', false)
const enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController)
const player = new Player(canvas, 3, playerBulletController)

////////// GAMEPLAY //////////

const playGame = () => {
    menu.replaceChildren('')
    ctx.clearRect(0, 0, game.width, game.height)
    enemyController.draw(ctx)
    player.draw(ctx)
    playerBulletController.draw(ctx)
    enemyBulletController.draw(ctx)
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