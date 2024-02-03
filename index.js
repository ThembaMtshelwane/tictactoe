const blocks = document.getElementsByClassName('block')
const selectElement = document.querySelector('select')
const restartButton = document.getElementById('restart')
let selectedToken = selectElement.value
let botToken = 'O'
const winMessage = document.getElementById('win-message')
const main = document.querySelector('main')
const board = [
  [blocks[0], blocks[1], blocks[2]],
  [blocks[3], blocks[4], blocks[5]],
  [blocks[6], blocks[7], blocks[8]],
]

// Select Token
selectElement.addEventListener('change', () => {
  selectedToken = selectElement.value
  botToken = getBotToken(selectedToken)
})

const getBotToken = (userToken) => {
  let aiToken = ''
  if (userToken === 'X') {
    aiToken = 'O'
  } else {
    aiToken = 'X'
  }
  return aiToken
}

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
      aiBotResponse(botToken)
      if (checkWinConditions().outcome) {
        whoWins(checkWinConditions().token)
      }
    }
  })
})

// AI Bot Response
const aiBotResponse = (botToken) => {
  // find an empty spot on board to add token
  const { row, col } = findEmptyElementPosition(board)
  // Which spot is the best one
  // add token
  board[row][col].textContent = botToken
}

const findEmptyElementPosition = (board) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const block = board[i][j]
      if (block.textContent.trim() === '') {
        return { row: i, col: j }
      }
    }
  }
  return null // Return null if no non-empty element is found
}

// Check if grid is filled
const isBlocksFilled = () => {
  return Array.from(blocks).every((block) => block.textContent !== '')
}

// Check win conditions
const checkWinConditions = () => {
  if (horizontalAndVerticalChecks().outcome) {
    return { outcome: true, token: horizontalAndVerticalChecks().token }
  } else if (verticalChecks().outcome) {
    return { outcome: true, token: verticalChecks().token }
  } else {
    return { outcome: false, token: '' }
  }
}

const horizontalAndVerticalChecks = () => {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0].textContent !== '' &&
      board[i][0].textContent === board[i][1].textContent &&
      board[i][0].textContent === board[i][2].textContent
    ) {
      return { outcome: true, token: board[i][0].textContent } // Horizontal win
    } else if (
      board[0][i].textContent !== '' &&
      board[0][i].textContent === board[1][i].textContent &&
      board[0][i].textContent === board[2][i].textContent
    ) {
      return { outcome: true, token: board[0][i].textContent }
    }
  }
  return { outcome: false, token: '' }
}

const verticalChecks = () => {
  if (
    board[0][0].textContent !== '' &&
    board[0][0].textContent === board[1][1].textContent &&
    board[0][0].textContent === board[2][2].textContent
  ) {
    return { outcome: true, token: board[0][0].textContent } // Diagonal 1
  }
  if (
    board[0][2].textContent !== '' &&
    board[0][2].textContent === board[1][1].textContent &&
    board[0][2].textContent === board[2][0].textContent
  ) {
    return { outcome: true, token: board[0][2].textContent } // Diagonal 2
  }
  return { outcome: false, token: '' }
}

const whoWins = (token) => {
  winMessage.classList.add('show-win-message')
  winMessage.textContent = `${token} Wins`
  main.appendChild(winMessage)
}
