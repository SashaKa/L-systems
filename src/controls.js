const imageContainer = document.getElementsByClassName('imageList')[0]
const stats = document.getElementById('stats')
const name = document.getElementById('name')

// controls

const axiom = document.getElementById('axiom')
const angle = document.getElementById('angle')
const rules = document.getElementById('rules')
const centerX = document.getElementById('X')
const centerY = document.getElementById('Y')
const iterations = document.getElementById('iterations')
const stepLength = document.getElementById('stepLength')
const initialAngle = document.getElementById('initialAngle')
const canvasColor = document.getElementById('canvasColor')
const colorize = document.getElementById('colorizeShape')
const toDeg = document.getElementById('toDeg')
const warning = document.getElementById('warning')

const controls = [
  axiom,
  angle,
  rules,
  centerX,
  centerY,
  iterations,
  stepLength,
  initialAngle,
  canvasColor,
  colorize
]

const shapesNamesList = Object.keys(SHAPES)
shapesNamesList.forEach((element, i) => {
  const image = document.createElement('img')
  const id = SHAPES[element].id
  image.setAttribute('src', `src/img/${id}.png`)
  image.setAttribute('class', 'shapePreview')
  image.setAttribute('data-id', id)
  imageContainer.appendChild(image)
})

const previews = document.getElementsByClassName('shapePreview')
const previewsArr = Array.from(previews)

previewsArr.forEach(preview => {
  preview.addEventListener('click', e => {
    previewsArr.forEach(el => el.classList.remove('active'))
    preview.classList.toggle('active')
    drawFromPreview(preview, state)
  })
})

controls.forEach(control =>
  control.addEventListener('input', e => {
    previewsArr.forEach(el => el.classList.remove('active'))
    const newRules = htmlToJson(rules.value)
    if (iterations.value > 15) {
      warning.innerHTML = 'too many iterations, please use < 15'
      return
    }
    warning.innerHTML = ''
    const newShapeObject = {
      id: Infinity,
      axiom: axiom.value,
      rules: newRules,
      angle: (angle.value),
      stepLength: stepLength.value,
      center: {
        x: centerX.value,
        y: centerY.value
      },
      initialAngle: initialAngle.value || 0,
      iterations: iterations.value
    }

    drawFromControls(newShapeObject)
  })
)