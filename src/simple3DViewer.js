// version 0.1.0
export const sketch = (p) => {
    let worldBackgroundColor = '#000000'
    let modelShininess = 20 // Minimun value is 1
    let ambientLightColor = '#cccccc'
    let modelScale = 1

    let materialColor = '#DBDBDB'

    let pointLightColor

    let cameraInitialAngle = 45
    const initialRadio = 250
    const maxRadio = 1000
    const minRadio = 10
    let radio = initialRadio

    const zoomIncrement = 60

    /**
     * Render type
     * 0 - Normal material
     * 1 - Specular material
     * 2 - Ambient material
     * 3 - Emissive material
     */
    let renderMode = 2

    let showGeometry = false
    let geometryColor = '#000000'
    let showMesh = true
    let useAmbientLight = false
    // let useTexture = 

    let modelTexture

    // Camera settings
    let cameraX = 0
    let cameraY = 0
    let cameraZ = 0

    let isTransitioning = false

    let flipXAxis = true
    let flipYAxis = true

    let modelXRotation = 0
    let modelYRotation = 0
    let modelZRotation = 0

    let view

    let mesh

    function preload() {
        mesh = p.loadModel('src/assets/ModularVehicle.obj', true)
    }

    function setup() {
        // Set canvas
        let canvas = p.createCanvas(750, window.innerHeight, p.WEBGL);
        canvas.parent('canvas-container')
        p.angleMode(p.DEGREES)
        // Set camera
        view = p.createCamera()
        p.setCamera(view)
        // pointLightColor = color('#cccccc')
        p.strokeWeight(0.2)
        if (!showGeometry) p.noStroke()
        if (!showMesh) p.noFill()
        p.describe('3D model')
        centerCameraToOrigin()
    }

    function draw() {
        p.background(worldBackgroundColor);
        p.scale(modelScale);
        flipAxis()
        rotateModel()
        if (useAmbientLight) p.ambientLight(ambientLightColor)
        p.lights()
        render()
        // texture(modelTexture)
        p.model(mesh);
        animateTransition()
    }

    function rotateModel() {
        p.rotateX(modelXRotation)
        p.rotateY(modelYRotation)
        p.rotateZ(modelZRotation)
    }

    function flipAxis() {
        if (flipXAxis) p.rotateX(180)
        if (flipYAxis) p.rotateY(180)
    }

    function toggleFlipXAxis() {
        flipXAxis = !flipXAxis
    }

    function toggleFlipYAxis() {
        flipYAxis = !flipYAxis
    }

    function render() {
        switch (renderMode) {
            case 0:
                renderNormalMaterial()
                break;
            case 1:
                renderSpecularMaterial()
                break;
            case 2:
                renderAmbientMaterial()
                break;
            case 3:
                renderEmissiveMaterial()
                break;
            default:
                break;
        }
    }

    function renderSpecularMaterial() {
        p.shininess(modelShininess);
        p.specularMaterial(materialColor);
    }

    function renderNormalMaterial() {
        p.normalMaterial();
    }

    function renderAmbientMaterial() {
        p.ambientMaterial(materialColor);
    }

    function renderEmissiveMaterial() {
        p.emissiveMaterial(materialColor);
    }

    const changeBackgroundColor = (event) => {
        let { name, value } = event.target
        if (name !== 'worldBackgroundColor') return
        worldBackgroundColor = value
    }

    const scaleModel = (event) => {
        let { name, value } = event.target
        if (name !== 'modelScale') return
        modelScale = value
    }

    const changeAmbientLight = (event) => {
        let { name, value } = event.target
        if (name !== 'ambientLightColor') return
        ambientLightColor = value
    }

    const toggleShowGeometry = (event) => {
        let { name, checked } = event.target
        if (name !== 'showGeometry') return
        showGeometry = checked
        if (showGeometry) {
            p.stroke(geometryColor)
        } else {
            p.noStroke()
        }
    }

    const changeGeometryColor = (event) => {
        let { name, value } = event.target
        if (name !== 'geometryColor') return
        geometryColor = value
        if (showGeometry) p.stroke(geometryColor)
    }

    const toggleUseAmbientLight = (event) => {
        useAmbientLight = event.target.checked
    }

    const changeRenderMode = (event) => {
        let { name, value } = event.target
        if (name !== 'renderMode') return
        renderMode = parseInt(value)
    }

    const changeMaterialColor = (event) => {
        let { name, value } = event.target
        if (name !== 'materialColor') return
        materialColor = value
    }

    const setPointLightColor = (event) => {
        let { name, value } = event.target
        if (name !== 'pointLightColor') return
        pointLightColor = p.color(value)
    }

    const setShininessValue = (event) => {
        let { name, value } = event.target
        if (name !== 'shininessValue') return
        modelShininess = value
    }

    const scaleForMouseScroll = (wheelEvent) => {
        wheelEvent.stopPropagation()
        if (wheelEvent.deltaY > 0) {
            modelScale += 0.4
        } else {
            modelScale = Math.max(0, modelScale -= 0.4) // Prevent scale from going below zero
        }
    }

    const setModelXRotation = (event) => {
        let { value } = event.target
        modelXRotation = value
    }

    const setModelYRotation = (event) => {
        let { value } = event.target
        modelYRotation = value
    }

    const setModelZRotation = (event) => {
        let { value } = event.target
        modelZRotation = value
    }

    document.addEventListener('input', changeBackgroundColor)
    document.addEventListener('input', scaleModel)
    document.addEventListener('input', changeAmbientLight)

    document.addEventListener('change', toggleShowGeometry)
    document.getElementById('useAmbientLight').onchange = toggleUseAmbientLight

    document.getElementById('geometryColor').oninput = changeGeometryColor
    document.addEventListener('change', changeRenderMode)
    document.addEventListener('input', changeMaterialColor)
    document.addEventListener('input', setPointLightColor)
    document.getElementById('shininessValue').oninput = setShininessValue

    document.getElementById('flipXAxis').onchange = toggleFlipXAxis
    document.getElementById('flipYAxis').onchange = toggleFlipYAxis

    document.getElementById('modelXRotation').oninput = setModelXRotation
    document.getElementById('modelYRotation').oninput = setModelYRotation
    document.getElementById('modelZRotation').oninput = setModelZRotation

    function centerCameraToOrigin() {
        radio = initialRadio
        cameraZ = p.sin(cameraInitialAngle) * radio
        cameraX = p.cos(cameraInitialAngle) * radio
        p.camera(cameraX, -100, cameraZ, 0, 0, 0, 0, 1, 0);
    }

    function mouseWheel(wheelEvent) {
        let localName = wheelEvent.target.localName
        if (localName !== 'canvas') return true
        let center = { x: view.centerX, y: view.centerY, z: view.centerZ }
        let radioBefore = radio
        let changeAmount = p.norm(radio, minRadio, maxRadio)
        let distance
        if (wheelEvent.deltaY > 0) {
            radio = p.min(radio + zoomIncrement * changeAmount, maxRadio)
        } else {
            radio = p.max(radio - zoomIncrement * changeAmount, minRadio)
        }
        distance = radio - radioBefore
        view.move(0, 0, distance)
        view.lookAt(center.x, center.y, center.z)
        return false
    }

    function mouseDragged(event) {
        if (isTransitioning) return true
        if (event.target.localName !== 'canvas') return true
        if (event.shiftKey) {
            let panXAmout = movedX * 100 / width * -3
            let panYAmout = movedY * 100 / height * -3
            view.move(panXAmout, panYAmout, 0)
        } else if (p.mouseButton === p.RIGHT) {
            let panXAmout = movedX * 100 / width * -3
            let panYAmout = movedY * 100 / height * -3
            view.move(panXAmout, panYAmout, 0)
        } else if (p.mouseButton === p.LEFT) {
            p.orbitControl(5, 5, 0)
        }
        return false
    }

    let transitionObject = {
        cameraPos: {
            initialCameraX: 0,
            initialCameraY: 0,
            initialCameraZ: 0,
            finalCameraX: 0,
            finalCameraY: 0,
            finalCameraZ: 0,
        },
        centerPos: {
            initialCenterX: 0,
            initialCenterY: 0,
            initialCenterZ: 0,
            finalCenterX: 0,
            finalCenterY: 0,
            finalCenterZ: 0,
        }
    }

    function keyPressed() {
        if (p.keyCode === 96 || p.keyCode === 36) {
            if (!isTransitioning) {
                isTransitioning = true
                recenterCamera()
            }
        }
    }

    function recenterCamera() {
        transitionObject.cameraPos.initialCameraX = view.eyeX
        transitionObject.cameraPos.initialCameraY = view.eyeY
        transitionObject.cameraPos.initialCameraZ = view.eyeZ
        transitionObject.cameraPos.finalCameraZ = p.sin(cameraInitialAngle) * radio
        transitionObject.cameraPos.finalCameraX = p.cos(cameraInitialAngle) * radio
        transitionObject.cameraPos.finalCameraY = -100
        transitionObject.centerPos.initialCenterX = view.centerX
        transitionObject.centerPos.initialCenterY = view.centerY
        transitionObject.centerPos.initialCenterZ = view.centerZ
        transitionTime = 0
    }

    let transitionTime
    const transitionDuration = 500

    function animateTransition() {
        if (!isTransitioning) return
        transitionTime += deltaTime
        let transitionPercentage = p.norm(transitionTime, 0, transitionDuration)

        let currentCameraX = transitionObject.cameraPos.initialCameraX + (transitionObject.cameraPos.finalCameraX - transitionObject.cameraPos.initialCameraX) * transitionPercentage
        let currentCameraY = transitionObject.cameraPos.initialCameraY + (transitionObject.cameraPos.finalCameraY - transitionObject.cameraPos.initialCameraY) * transitionPercentage
        let currentCameraZ = transitionObject.cameraPos.initialCameraZ + (transitionObject.cameraPos.finalCameraZ - transitionObject.cameraPos.initialCameraZ) * transitionPercentage

        let currentCenterX = transitionObject.centerPos.initialCenterX + (transitionObject.centerPos.finalCenterX - transitionObject.centerPos.initialCenterX) * transitionPercentage
        let currentCenterY = transitionObject.centerPos.initialCenterY + (transitionObject.centerPos.finalCenterY - transitionObject.centerPos.initialCenterY) * transitionPercentage
        let currentCenterZ = transitionObject.centerPos.initialCenterZ + (transitionObject.centerPos.finalCenterZ - transitionObject.centerPos.initialCenterZ) * transitionPercentage

        view.setPosition(currentCameraX, currentCameraY, currentCameraZ)
        view.lookAt(currentCenterX, currentCenterY, currentCenterZ)

        if (transitionPercentage >= 1) isTransitioning = false
    }

    p.preload = preload
    p.setup = setup
    p.draw = draw
    p.mouseDragged = mouseDragged
    p.mouseWheel = mouseWheel
    p.keyPressed = keyPressed
}