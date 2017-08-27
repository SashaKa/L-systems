// initial settings

cx.strokeStyle = 'blue'
cx.globalAlpha = 1

const state = {
  canvasColor: 'white',
  shapeColor: false
}

// Lshape container object

function Lshape(
  {
    axiom,
    rules,
    angle,
    stepLength,
    center,
    iterations,
    initialAngle,
    closePath
  },
  name
) {
  this.name = name
  this.axiom = axiom
  this.rules = rules
  this.angle = angle
  this.stepLength = stepLength
  this.center = center
  this.iterations = iterations
  this.initialAngle = initialAngle
  this.closePath = closePath
  this.currentState = axiom
}

Lshape.prototype.step = function() {
  const arrState = this.currentState.split('')
  const nextStepArr = arrState.map(el => {
    let res = el
    this.rules.forEach(rule => {
      if (rule[el]) {
        return (res = rule[el])
      }
    })
    return res
  })
  this.currentState = nextStepArr.join('')
}

Lshape.prototype.iterate = function() {
  for (let i = 0; i < this.iterations; i++) {
    this.step()
  }
}

const shapeNames = Object.keys(SHAPES)
const randomShape = Math.ceil(Math.random() * shapeNames.length)
const shape = new Lshape(
  SHAPES[shapeNames[randomShape - 1]],
  shapeNames[randomShape - 1]
)
shape.iterate()
previewsArr.forEach(el => {
  if (el.getAttribute('data-id') == SHAPES[shapeNames[randomShape - 1]].id) {
    el.classList.add('active')
  }
})
//
// DRAW
//

const setInitialState = () => cx.resetTransform()
const clearCanvas = color => {
  cx.beginPath()
  cx.rect(0, 0, cx.canvas.width, cx.canvas.height)
  cx.fillStyle = color
  cx.fill()
}

const draw = (shape, state) => {
  const now = Date.now()
  setInitialState()
  clearCanvas(state.canvasColor)
  const angle = shape.angle
  const center = shape.center
  const stepLength = shape.stepLength
  const stepsArr = shape.currentState.split('')
  cx.translate(center.x, center.y)
  if (shape.initialAngle) {
    cx.rotate(shape.initialAngle)
  }
  cx.moveTo(stepLength, 0)
  stepsArr.forEach((step, i) => {
    switch (step) {
      case '+':
        cx.rotate(-angle)
        break
      case '-':
        cx.rotate(angle)
        break
      case '[':
        cx.save()
        break
      case ']':
        cx.restore()
        break
      case 'F':
        cx.beginPath()
        state.shapeColor
          ? (cx.strokeStyle = `hsl(${i / 30}, 100%, 50%)`)
          : ''
        cx.moveTo(0, 0)
        cx.lineTo(stepLength, 0)
        cx.translate(stepLength, 0)
        cx.stroke()
        break
      case 'f':
        cx.moveTo(stepLength, 0)
        cx.translate(stepLength, 0)
        break
      case 'b':
        cx.moveTo(stepLength, 0)
        cx.translate(stepLength, 0)
        break
    }
  })
  if (typeof shape.closePath === 'undefined') {
    cx.closePath()
  }
  cx.stroke()
  stats.innerHTML = `The ${shape.name} rendered in ${Date.now() - now}ms`
}

// initial draw

draw(shape, state)

const updateDraw = elem => {
  const id = elem.getAttribute('data-id')
  let shapeToDraw
  for (let shape in SHAPES) {
    if (SHAPES[shape].id == id) {
      shapeToDraw = new Lshape(SHAPES[shape], shape)
    }
  }
  shapeToDraw.iterate()
  draw(shapeToDraw, state)
}
