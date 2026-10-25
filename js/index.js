import { colorPalettes, setColor, createPalette, displayPalette } from './canvas-colors.js'
import { setBrush, updateBrushStyle, start, draw, stop, Undo, Clear } from './canvas-brush.js'

// DOMS
const colorPickerInput = document.getElementById('colorpicker')
const paletteDropDown = document.getElementById('palette')
const strokeSizeSlider = document.getElementById('strokesize')
const opacityLevelSlider = document.getElementById('opacity')
const brushTypeDropDown = document.getElementById('brushtype')
const lineCapDropDown = document.getElementById('linecap')
const nametextInput = document.getElementById('name') 
const undoButton = document.getElementById('undobutton')
const clearButton = document.getElementById('clearbutton')
const downloadButton = document.getElementById('downloadbutton')

// Default States 
let stroke_color = '#000000'
let current_palette = 'Basic'
let created_palettes = new Set()
let selectedPalette = colorPalettes.get(current_palette)
let stroke_size = '2'
let opacity_level = '1'
let brush_type = 'round'
let line_cap = 'round'
let canvas = document.getElementById('drawboxcanvas')
let ctx_canvas = canvas.getContext('2d')
let pen_canvas = document.createElement('canvas')
let cursor_url = null
let is_moving = false
let is_drawing = false
const position = { x: 0, y: 0 }
let restore_array = [] 
let start_index = -1
let name = 'anonymous'


let state = {
  stroke_color: stroke_color,
  current_palette: current_palette,
  created_palettes: created_palettes,
  selectedPalette: selectedPalette,
  stroke_size: stroke_size,
  opacity_level: opacity_level,
  brush_type: brush_type,
  line_cap: line_cap,
  canvas: canvas,
  ctx_canvas: ctx_canvas,
  pen_canvas: pen_canvas,
  cursor_url: cursor_url,
  is_moving: is_moving,
  is_drawing: is_drawing,
  position: position,
  restore_array: restore_array,
  start_index: start_index,
  name: name
}



// for debugging lol
const displayState = () => {
  console.log(state)
  console.log('Stroke Color: ' + state.stroke_color)
  console.log('Current Palette: ' + state.current_palette)
  console.log('Created Palette: ' + state.created_palettes)
  console.log('Selected Palette: ' + state.selectedPalette)
  console.log('Stroke Width: ' + state.stroke_size)
  console.log('Opacity Level: ' + state.opacity_level)
  console.log('Brush Type: ' + state.brush_type)
  console.log('Line Cap: ' + state.line_cap)
  console.log("**********")
}

const canvasInit = () => {
  state.ctx_canvas.fillStyle = '#ffffff'
  state.ctx_canvas.fillRect(0, 0, state.canvas.width, state.canvas.height)  //x, y, width, height
  updateBrushStyle() 
}

const downloadCanvas = () => {
  nametextInput.value && (state.name = nametextInput.value)
  const link = document.createElement('a')
  const timestamp = Date.now()
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getUTCDate()
  const fileNameFormatted = `${state.name}-${month}-${day}-${year}.png`

  link.href = state.canvas.toDataURL('image/png')
  link.download = fileNameFormatted

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function keyPressHandler(e) {
  var eventOBJ = window.E ? window.E : e;

  if (eventOBJ.ctrlKey && eventOBJ.keyCode == 90) {
      Undo(e);
  }
}


// event listeners 
colorPickerInput.addEventListener('input', (e) => setColor(e), false)
paletteDropDown.addEventListener('change', (e) => displayPalette(e), false)
strokeSizeSlider.addEventListener('input', (e) => setBrush(e), false)
opacityLevelSlider.addEventListener('input', (e) => setBrush(e), false)
brushTypeDropDown.addEventListener('input', (e) => setBrush(e), false)
lineCapDropDown.addEventListener('input', (e) => setBrush(e), false)

canvas.addEventListener('mousedown',(e) => start(e), false)
canvas.addEventListener('mousemove',(e) => draw(e), false)
canvas.addEventListener('mouseup',(e) => stop(e), false)
canvas.addEventListener('mouseout',(e) => stop(e), false)

document.querySelector('fieldset').addEventListener('oninput', (e) => updateBrushStyle(e), false)

undoButton.addEventListener('click', (e) => Undo(e), false)
clearButton.addEventListener('click', (e) => Clear(e), false)
downloadButton.addEventListener('click', downloadCanvas, false)

window.addEventListener('keydown', (e) => keyPressHandler(e));



// ### init 
createPalette()
canvasInit()

export { displayState, state }
