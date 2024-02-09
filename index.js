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
const mapping = {
  X: 1,
  O: -1,
  tie: 0,
}
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
  if (isBlocksFilled() || checkWinConditions().outcome) {
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
      displayWinMessage()
      aiBotResponse()
      displayWinMessage()
    }
  })
})

// AI Bot Response
const aiBotResponse = () => {
  if (!isBlocksFilled()) {
    const { row, column } = generateBestSpot()
    // console.log(row, column)
    board[row][column].textContent = botToken
  }
}
/** *********************************************** */
// AI Algorithm
const generateBestSpot = () => {
  if (Math.floor(Math.random() * 10) % 2 === 0) {
    // Occupy first available space
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j].textContent === '') {
          return { row: i, column: j }
        }
      }
    }
  } else {
    /* *********** */
    // Occupy a random available space
    const availableSpaces = []
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j].textContent === '') {
          availableSpaces.push({ row: i, column: j })
        }
      }
    }
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)]
  }

  // let bestScore = -Infinity
  // let bestMove
  // for (let i = 0; i < 3; i++) {
  //   for (let j = 0; j < 3; j++) {
  //     const block = board[i][j]
  //     if (block.textContent === '') {
  //       block.textContent = botToken
  //       const score = minmax(board, 0, false)
  //       console.log(score)
  //       block.textContent = ''
  //       if (score > bestScore) {
  //         bestScore = score
  //         bestMove = { row: i, column: j }
  //       }
  //     }
  //   }
  // }
  // return bestMove
}

// Check if grid is filled
const isBlocksFilled = () => {
  return Array.from(blocks).every((block) => block.textContent !== '')
}

// Check simulate future plays
const minmax = (board, depth, isMaximizing) => {
  const result = checkWinConditions().token
  if (result !== null) {
    return mapping[result]
  }

  if (isMaximizing) {
    let bestScore = -Infinity
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const block = board[i][j]
        if (block.textContent === '') {
          block.textContent = botToken
          const score = minmax(board, depth + 1, false)
          block.textContent = ''
          bestScore = Math.max(score, bestScore)
        }
      }
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const block = board[i][j]
        if (block.textContent === '') {
          block.textContent = selectedToken
          const score = minmax(board, depth + 1, true)
          block.textContent = ''
          bestScore = Math.min(score, bestScore)
        }
      }
    }
    return bestScore
  }
}
/** *********************************************** */
// Check win conditions
const checkWinConditions = () => {
  if (horizontalAndVerticalChecks().outcome) {
    return { outcome: true, token: horizontalAndVerticalChecks().token }
  } else if (diagonalChecks().outcome) {
    return { outcome: true, token: diagonalChecks().token }
  } else if (isBlocksFilled()) {
    return { outcome: false, token: 'tie' }
  } else {
    return { outcome: null, token: null }
  }
}

const horizontalAndVerticalChecks = () => {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0].textContent !== '' &&
      board[i][0].textContent === board[i][1].textContent &&
      board[i][0].textContent === board[i][2].textContent
    ) {
      return { outcome: true, token: board[i][0].textContent }
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

const diagonalChecks = () => {
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

const whoWins = (msg) => {
  winMessage.classList.add('show-win-message')
  winMessage.textContent = msg
  main.appendChild(winMessage)
}

const displayWinMessage = () => {
  if (checkWinConditions().outcome) {
    whoWins(`${checkWinConditions().token} WINS`)
  }
  if (checkWinConditions().token === 'tie') {
    whoWins('TIE')
  }
}
