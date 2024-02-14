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
    const bestMove = generateBestMove() // Correct function name
    if (bestMove) {
      const { row, column } = bestMove // Destructure if a valid move is found
      board[row][column].textContent = botToken
    } else {
      console.log('No valid moves found!')
    }
  } else {
    console.log('Board is filled. No moves to make.')
  }
}
/** *********************************************** */
// AI Algorithm
// const generateBestMove = () => {
// if (Math.floor(Math.random() * 10) % 2 === 0) {
//   // Occupy first available space
//   for (let i = 0; i < 3; i++) {
//     for (let j = 0; j < 3; j++) {
//       if (board[i][j].textContent === '') {
//         return { row: i, column: j }
//       }
//     }
//   }
// } else {
//   // Occupy a random available space
//   const availableSpaces = []
//   for (let i = 0; i < 3; i++) {
//     for (let j = 0; j < 3; j++) {
//       if (board[i][j].textContent === '') {
//         availableSpaces.push({ row: i, column: j })
//       }
//     }
//   }
//   return availableSpaces[Math.floor(Math.random() * availableSpaces.length)]
// }
// }

// Function to calculate the best move using minimax with alpha-beta pruning
const generateBestMove = () => {
  let bestScore = -Infinity
  let bestMove = null
  // Alpha and beta values for alpha-beta pruning
  let alpha = -Infinity
  let beta = Infinity

  // Loop through each empty cell
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j].textContent === '') {
        // Make a move
        board[i][j].textContent = botToken
        // Calculate the score for this move using minimax algorithm with alpha-beta pruning
        const score = minimaxAlphaBeta(board, 0, false, alpha, beta)
        // Undo the move
        board[i][j].textContent = ''
        // Update bestScore and bestMove if necessary
        if (score > bestScore) {
          bestScore = score
          bestMove = { row: i, column: j }
        }
      }
    }
  }

  return bestMove
}

// Function to calculate the score using minimax with alpha-beta pruning
const minimaxAlphaBeta = (board, depth, isMaximizing, alpha, beta) => {
  const result = checkWinConditions()
  if (result.outcome !== null) {
    return mapping[result.token] * (10 - depth)
  }

  if (isMaximizing) {
    let bestScore = -Infinity
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j].textContent === '') {
          board[i][j].textContent = botToken
          const score = minimaxAlphaBeta(board, depth + 1, false, alpha, beta)
          board[i][j].textContent = ''
          bestScore = Math.max(score, bestScore)
          alpha = Math.max(alpha, score)
          if (beta <= alpha) {
            break // Beta cutoff
          }
        }
      }
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j].textContent === '') {
          board[i][j].textContent = selectedToken
          const score = minimaxAlphaBeta(board, depth + 1, true, alpha, beta)
          board[i][j].textContent = ''
          bestScore = Math.min(score, bestScore)
          beta = Math.min(beta, score)
          if (beta <= alpha) {
            break // Alpha cutoff
          }
        }
      }
    }
    return bestScore
  }
}

// Check if grid is filled
const isBlocksFilled = () => {
  return Array.from(blocks).every((block) => block.textContent !== '')
}

/** *********************************************** */
// Check win conditions
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
  const result = checkWinConditions()
  if (result.outcome) {
    whoWins(`${result.token} WINS`)
  } else if (result.token === 'tie') {
    whoWins('TIE')
  }
}
