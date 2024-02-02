const blocks = document.getElementsByClassName('block')
const selectElement = document.querySelector('select')
const restartButton = document.getElementById('restart')

let selectedToken = selectElement.value

selectElement.addEventListener('change', () => {
  selectedToken = selectElement.value
})

restartButton.addEventListener('click', () => {
  const allBlocksFilled = Array.from(blocks).every(
    (block) => block.textContent !== ''
  )
  if (allBlocksFilled) {
    Array.from(blocks).forEach((block) => {
      block.textContent = ''
    })
  }
})

Array.from(blocks).forEach((block) => {
  block.addEventListener('click', (e) => {
    if (block.textContent === '') {
      block.textContent = selectedToken
    }
  })
})
