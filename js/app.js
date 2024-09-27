// Global Game Constants and Variables
const zombieMovements = ["position0", "position1", "position2", "position3", "position4", "position5", "position6", "position7", "position8", "position9", "position10", "position11", "position12", "position13", "position14"]
const winCondition = [10, 20, 30, 40] // # of Zombie Words in defeatedZombieWords
let playerLevel = 2
const wordObj = wordBank.find((wordLevel) => wordLevel.level === playerLevel)
const wordList = wordObj.vocab
let defeatedZombieWords = []
let zombieWord = ""
let killCount = defeatedZombieWords.length
let timer = 30
let timeBonus = 3
let gameTimerInt

// Global Cache Element References
const titleEl = document.querySelector("#game-title")
const zombieCon = document.querySelector(".zombie-container")
const playerEl = document.querySelector("#player")
const killCountEl = document.querySelector("#kill-count")
const timerEl = document.querySelector("#timer")
const buttonEl = document.querySelectorAll(".game-buttons button")

// Select random word from wordList
const getRandomWord = () => {
    if (wordList.length === 0) {
        return null
    }
    zombieWord = wordList[Math.floor(Math.random() * wordList.length)]
    let zombieWordIndex = wordList.indexOf(zombieWord)
    wordList.splice(zombieWordIndex, 1)
    return zombieWord.toLowerCase()
    
}

// Render zombie with all visual elements and necessary attributes
const respawnZombie = () => {
    // Create HTML element
    const zombieDiv = document.createElement("div")
    zombieDiv.classList.add("zombie")

    // Set zombie animation
    zombieDiv.classList.add(zombieMovements[Math.floor(Math.random()*zombieMovements.length)])

    // Make zombie sprite
    const zombieImg = document.createElement("img")
    zombieImg.classList.add("zombie-render")
    zombieImg.src = "./assets/generic-zombie-sprite.webp"

    // Attach zombie word as attribute
    zombieWord = getRandomWord()
    zombieDiv.setAttribute('data-word', zombieWord);

    // Make zombie word visible
    const zombieText = document.createElement("div")
    zombieText.classList.add("zombie-text")
    zombieText.textContent = zombieWord

    // Attach sprite and word to HTML element
    zombieDiv.appendChild(zombieImg)
    zombieDiv.appendChild(zombieText)

    // Allow for easier manipulation of zombie path
    Object.assign(zombieDiv.style, {
        position: "absolute",
    })

    // Place in container
    zombieCon.appendChild(zombieDiv)
}


// Set number of zombies equal to game level/difficulty
const spawnZombie = () => {
    for (let i = 1; i <= playerLevel; i++) {
        respawnZombie()
    }

}

// Remove zombies at conclusion of game play
const removeAllZombies = () => {
    const zombieEls = document.querySelectorAll(".zombie") 
    zombieEls.forEach(zombie => zombie.remove())
}

// Ensures any zombie can be defeated at any time
const removeZombie = (zombieWord) => {
    const zombieEls = document.querySelectorAll(".zombie")
    zombieEls.forEach((zombie) => {
        if (zombie.getAttribute('data-word') === zombieWord) {
            zombie.remove()
            playerEl.value = ""
        }
    })
}

// When individual zombie is defeated, it is removed and kill count increases
const killZombie = () => {
    const firepower = playerEl.value.toLowerCase().trim()
    const zombieEls = document.querySelectorAll(".zombie")

    zombieEls.forEach((zombie) => {
        if (zombie.getAttribute("data-word") === firepower) {
            killCount++
            killCountEl.textContent = `Kill Count: ${killCount}`
            timer += timeBonus // reward for beating a zombie
            defeatedZombieWords.push(firepower)
            removeZombie(firepower)
            renderOutcome()
        }
    })
}

// Start game timer
const startTimer = () => {
    gameTimerInt = setInterval(() => {
        if (timer <= 0) {
            clearInterval(gameTimerInt)
            removeZombie()
            renderOutcome()
        }  else {
            timer --
        }
        timerEl.textContent = `Time: ${timer}s`
    }, 1000)
    return timer
}

// When play is clicked, start time and generate zombie. Toggle from play button to reset button.
const handlePlay = () => {
    startTimer()
    spawnZombie()
    document.querySelector(".reset").classList.remove("invisible")
    document.querySelector(".play").classList.add("invisible")

} 

// Render win outcome
const winGame = () => {
    titleEl.textContent = "You Win!"
    clearInterval(gameTimerInt)
    removeAllZombies()
}

// Render lose outcome
const loseGame = () => {
    titleEl.textContent = "You Lose"
    clearInterval(gameTimerInt)
    removeAllZombies()
}

// Determine if game is won, lost, or still ongoing
const renderOutcome = () => {
    defeatedZombieWords.length >= winCondition[playerLevel - 1] ? winGame()
    : timer <= 0 ? loseGame()
    : respawnZombie()
}

// Initial game settings for if the game is reset or progresses to level
const init = () => {
    defeatedZombieWords.push(zombieWord)
    zombieWord = ""
    defeatedZombieWords.forEach((word) => { 
        if(!wordList.includes(word)) wordList.push(word)
    })
    defeatedZombieWords = []
    clearInterval(gameTimerInt)
    timer = 30
    timerEl.textContent = `Time: ${timer}s`
    killCount = defeatedZombieWords.length
    killCountEl.textContent = `Kill Count: ${killCount}`
    playerEl.value = ""
    titleEl.textContent = "The Typing of the Dead"
    removeAllZombies()
}

// Reset to initial settings
const handleReset = () => {
    document.querySelector(".reset").classList.add("invisible")
    document.querySelector(".play").classList.remove("invisible")
    init()
}

// Show game instructions
const handleInstructions = () => {
    const modal = document.querySelector("#instructions-modal") 
    modal.style.display = "block"

    buttonEl.forEach(button => {
        button.disabled = true; 
    });

    const closeButton = document.querySelector(".close-button")
    closeButton.onclick = () => {
        modal.style.display = "none"
        
        buttonEl.forEach(button => {
            button.disabled = false; 
        });
    }

    window.onclick = (event) => { // doesn't work if I click outside the modal div
        if (event.target === modal) {
            modal.style.display = "none"
                buttonEl.forEach(button => {
                button.disabled = false; 
            });
        }
    }
}

// Event delegation for buttons
const handleButtonClicks = (event) => {
    const button = event.target
    const buttonText = button.textContent

    switch (true) {
        case button.classList.contains("play"):
            handlePlay()
            break
        case button.classList.contains("instructions"):
            handleInstructions()
            break
        case button.classList.contains("reset"):
            handleReset()
            break
        default:
            return
    } 
}

// Event Listeners
buttonEl.forEach(button => button.addEventListener('click', handleButtonClicks))
playerEl.addEventListener("input", killZombie)
