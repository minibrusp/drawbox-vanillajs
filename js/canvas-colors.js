import { state, displayState } from "./index.js"
import { updateBrushStyle } from "./canvas-brush.js"

// set of palettes 
// to easily add new set of palettes then add option element in the background with the corresponding value
const colorPalettes = new Map()
colorPalettes.set('Basic', ['#ff0000', '#0000ff', '#ffff00', '#008000', '#00ffff', '#FF00FF', '#000000'])
colorPalettes.set('FieryOcean', ['#780000', '#C1121F', '#FDF0D5', '#003049', '#669BBC'])
colorPalettes.set('PastelDreamlandAdventure', ['#CDB4DB', '#FFC8DD', '#FFAFCC', '#BDE0FE', '#A2D2FF'])
colorPalettes.set('LightSteel', ['#F8F9FA', 'E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#6C757D', '#495057', '#343A40', '#212529'])




// ########################################## 

const setColor = (e) => {
  const colorChoiceOutput = document.getElementById('colorchoice')
  const colorPickerInput = document.getElementById('colorpicker')
  switch (e.target.name) {
    case 'colorpicker': {
      state.stroke_color = e.target.value
      colorChoiceOutput.value = e.target.value
      updateBrushStyle()
      break
    }
    case 'colorbutton': {
      colorChoiceOutput.value = e.target.value
      colorPickerInput.value = e.target.value
      state.stroke_color = e.target.value
      updateBrushStyle()
      break
    }
  }
}


const createPalette = () => {
  let rootDiv = document.getElementById('paletteswrapper')
  let wrapperElement = document.createElement('div')
  wrapperElement.className = 'colorPalette'
  wrapperElement.id = state.current_palette
  wrapperElement.style.display = 'flex'

  state.selectedPalette.forEach(color => {
    let colorButton = document.createElement('div')
    colorButton.name = 'colorbutton'
    colorButton.className = 'stroke_color'
    colorButton.style.backgroundColor = color
    colorButton.value = color
    state.created_palettes.add(state.current_palette)
    rootDiv.appendChild(wrapperElement)
    wrapperElement.appendChild(colorButton)
    colorButton.addEventListener('click', (e) => setColor(e), false)
  })
}

const displayPalette = (e) => {
  document.querySelectorAll('.colorPalette').forEach(element => {
    element.style.display = 'none'
  })
  state.current_palette = e.target.value
  state.selectedPalette = colorPalettes.get(state.current_palette)

  state.created_palettes.has(state.current_palette) 
    ? document.getElementById(`${state.current_palette}`).style.display = 'flex'
    : createPalette() 
}



export { colorPalettes, setColor, createPalette, displayPalette }