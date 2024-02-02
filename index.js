const blocks = document.getElementsByClassName('block')
const selectElement = document.querySelector('select')
let selectedToken = selectElement.value

selectElement.addEventListener('change', () => {
  selectedToken = selectElement.value
})

Array.from(blocks).forEach((block) => {
  block.addEventListener('click', (e) => {
    if (block.textContent === '') {
      block.textContent = selectedToken
    }
  })
})
