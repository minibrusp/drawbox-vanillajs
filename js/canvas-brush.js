import { displayState, state } from './index.js'

const strokeWidthOutput = document.getElementById('strokeamount')
const opacityLevelOutput = document.getElementById('opacityamount')


const setBrush = (e) => {
  
  switch(e.target.id) {
    case 'strokesize': {
      state.stroke_size = e.target.value
      strokeWidthOutput.value = e.target.value
      updateBrushStyle()
      break
    }
    case 'opacity': {
      state.opacity_level = e.target.value
      opacityLevelOutput.value = e.target.value
      updateBrushStyle()
      break
    }
    case 'brushtype': {
      state.brush_type = e.target.value
      updateBrushStyle()
      break
    }
    case 'linecap': {
      state.line_cap = e.target.value
      updateBrushStyle()
      break
    }
  }
}

const updateBrushStyle = () => {

  const cursor_ctx = state.pen_canvas.getContext('2d')

  state.pen_canvas.width = state.stroke_size
  state.pen_canvas.height = state.stroke_size
  cursor_ctx.fillStyle = state.stroke_color

  state.ctx_canvas.lineWidth = state.stroke_size
  state.ctx_canvas.lineCap = state.line_cap
  state.ctx_canvas.lineJoin = state.brush_type
  state.ctx_canvas.strokeStyle = state.stroke_color
  state.ctx_canvas.globalAlpha = state.opacity_level

  if(state.line_cap === 'round') {
    cursor_ctx.arc(state.stroke_size / 2, state.stroke_size / 2, state.stroke_size / 2, 0, Math.PI * 2)
  } else {
    cursor_ctx.rect(0, 0, state.stroke_size, state.stroke_size)
  }

  cursor_ctx.fill()

  state.pen_canvas.toBlob(blob => {
    URL.revokeObjectURL(state.cursor_url)
    state.cursor_url = URL.createObjectURL(blob)
    state.canvas.style.cursor = `url(${state.cursor_url}) ${state.stroke_size / 2} ${state.stroke_size / 2}, auto`
    if(state.stroke_size < 4 ) {
      state.canvas.style.cursor = 'crosshair'
    }
  })
}


const start = (e) => {
  state.is_moving = false
  state.is_drawing = true
  state.ctx_canvas.beginPath()
  state.ctx_canvas.moveTo(getX(e), getY(e))
  e.preventDefault()
}

const draw = (e) => {
  if(!state.is_drawing) return 
  state.is_moving = true;
  state.ctx_canvas.lineTo(getX(e), getY(e))
  state.ctx_canvas.stroke()
  setPosition(e)
  e.preventDefault()
}

const stop = (e) => {
  if(!state.is_drawing) return
  if(!state.is_moving) {
    let start_draw_x = getX(e)
    let start_draw_y = getY(e)
    state.ctx_canvas.lineTo(start_draw_x + 1, start_draw_y)
  }
  state.ctx_canvas.stroke()
  state.ctx_canvas.closePath()
  state.is_drawing = false;
  state.restore_array.push(state.ctx_canvas.getImageData(0, 0, state.canvas.width, state.canvas.height))
  state.start_index++
  e.preventDefault()
}

const getX = (e) => e.pageX
  ? e.pageX - state.canvas.offsetLeft
  : e.targetTouches[0].pageX - state.canvas.offsetLeft

const getY = (e) => e.pageY
  ? e.pageY - state.canvas.offsetTop
  : e.targetTouches[0].pageY - state.canvas.offsetTop

const setPosition = (e) => {
  const rect = state.canvas.getBoundingClientRect()
  state.position.x = e.clientX - rect.left
  state.position.y = e.clientY - rect.top
}

const Undo = (e) => {
  if(state.start_index <= 0) {
    console.assert(state.restore_array)
    Clear(e)
  } else {
    state.start_index--
    state.restore_array.pop()
    state.ctx_canvas.putImageData(state.restore_array[state.start_index], 0, 0)
  }
}

const Clear = (e) => {
  console.log(e.type)
  if(e.type == 'click' && e.target.id == 'clearbutton') {
    if (confirm('are you sure you want to clear? This can not be undo.') == false) {
      return
    } 
  }

  state.ctx_canvas.fillStyle = '#ffffff'
  state.ctx_canvas.globalAlpha = 1
  state.ctx_canvas.clearRect(0, 0, state.canvas.width, state.canvas.height)
  state.ctx_canvas.fillRect(0, 0, state.canvas.width, state.canvas.height)
  state.restore_array = []
  state.start_index = -1
}






export { setBrush, updateBrushStyle, start, draw, stop, Undo, Clear }