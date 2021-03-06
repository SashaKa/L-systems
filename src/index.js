// initial settings

cx.strokeStyle = 'blue'
cx.globalAlpha = 1

const state = {
  canvasColor: 'white',
  shapeColor: false
}

let tempObject

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
    if (this.rules[el]) {
      return (res = this.rules[el])
    }
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

const jsonToHTML = rules => {
  let res = ''
  const keys = Object.keys(rules)
  keys.forEach(key => (res += `${key} => ${rules[key]}\n`))
  return res
}

const htmlToJson = html => {
  let res = {}
  let stringsArr = html.trim().split('\n')
  stringsArr.forEach(str => {
    let rule = str.split('=>')
    res[rule[0].trim()] = rule[1].trim()
  })
  return res
}

const degToRad = deg => Math.round(deg * Math.PI / 18) / 10
const radToDeg = (rad = 0) => 180 * rad / Math.PI

const updateControls = (shape, now) => {
  stats.innerHTML = `The ${shape.name} rendered in ${Date.now() - now}ms`
  download.setAttribute('download', `${shape.name.replace(/ /g, '_')}.png`)
  name.innerHTML = shape.name
  axiom.value = shape.axiom
  angle.value = shape.angle
  rules.value = jsonToHTML(shape.rules)
  centerX.value = shape.center.x
  centerY.value = shape.center.y
  iterations.value = shape.iterations
  initialAngle.value = shape.initialAngle || ''
  stepLength.value = Math.round(shape.stepLength * 10) / 10
  toDeg.innerHTML = `in deg: ${Math.round(radToDeg(shape.angle))}`
}

//
// DRAW
//

const setInitialState = () => cx.resetTransform()
const clearCanvas = () => cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height)

const draw = (shape, state, dragState) => {
  const now = Date.now()
  const center = shape.center
  const stepLength = shape.stepLength
  setInitialState()
  clearCanvas(state.canvasColor)
  canvas.style.backgroundColor = state.canvasColor
  cx.translate(center.x, center.y)
  if (typeof dragState === 'undefined') {
    cx.moveTo(stepLength, 0)
  } else {
    cx.translate(stepLength - dragState.x, -dragState.y)
  }
  const angle = shape.angle
  const stepsArr = shape.currentState.split('')

  if (shape.initialAngle) {
    cx.rotate(shape.initialAngle)
  }
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
          : (cx.strokeStyle = 'blue')
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
  updateControls(shape, now)
}

// initial draw
tempObject = shape
draw(shape, state)

const drawFromPreview = elem => {
  const id = elem.getAttribute('data-id')
  let shapeToDraw
  for (let shape in SHAPES) {
    if (SHAPES[shape].id == id) {
      shapeToDraw = new Lshape(SHAPES[shape], shape)
    }
  }
  shapeToDraw.iterate()
  tempObject = shapeToDraw
  draw(shapeToDraw, state)
}

const drawFromControls = obj => {
  const shapeToDraw = new Lshape(obj, 'My shape')
  shapeToDraw.iterate()
  tempObject = shapeToDraw
  draw(shapeToDraw, state)
}
