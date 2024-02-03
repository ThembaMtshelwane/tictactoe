const blocks = document.getElementsByClassName('block')
const selectElement = document.querySelector('select')
const restartButton = document.getElementById('restart')
let selectedToken = selectElement.value
const winMessage = document.getElementById('win-message')
const main = document.querySelector('main')

// Select Token
selectElement.addEventListener('change', () => {
  selectedToken = selectElement.value
})

// Restart Game
restartButton.addEventListener('click', () => {
  if (isBlocksFilled() || checkWinConditions()) {
    main.removeChild(winMessage)
    Array.from(blocks).forEach((block) => {
      block.textContent = ''
    })
  }
})

// Add Token
Array.from(blocks).forEach((block) => {
  block.addEventListener('click', (e) => {
    if (block.textContent === '') {
      block.textContent = selectedToken
      if (checkWinConditions()) {
        whoWins(selectedToken)
      }
    }
  })
})

// Check if grid is filled
const isBlocksFilled = () => {
  return Array.from(blocks).every((block) => block.textContent !== '')
}

const board = [
  [blocks[0], blocks[1], blocks[2]],
  [blocks[3], blocks[4], blocks[5]],
  [blocks[6], blocks[7], blocks[8]],
]

// Check win conditions
const checkWinConditions = () => {
  if (horizontalAndVerticalChecks()) {
    return true
  } else if (verticalChecks()) {
    return true
  } else {
    return false // No win
  }
}

const horizontalAndVerticalChecks = () => {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0].textContent !== '' &&
      board[i][0].textContent === board[i][1].textContent &&
      board[i][0].textContent === board[i][2].textContent
    ) {
      return true // Horizontal win
    } else if (
      board[0][i].textContent !== '' &&
      board[0][i].textContent === board[1][i].textContent &&
      board[0][i].textContent === board[2][i].textContent
    ) {
      return true // Vertical win
    }
  }
}

const verticalChecks = () => {
  if (
    board[0][0].textContent !== '' &&
    board[0][0].textContent === board[1][1].textContent &&
    board[0][0].textContent === board[2][2].textContent
  ) {
    return true // Diagonal 1
  }
  if (
    board[0][2].textContent !== '' &&
    board[0][2].textContent === board[1][1].textContent &&
    board[0][2].textContent === board[2][0].textContent
  ) {
    return true // Diagonal 2
  }
}

const whoWins = (token) => {
  winMessage.classList.add('show-win-message')
  winMessage.textContent = `${token} Wins`
  main.appendChild(winMessage)
}
