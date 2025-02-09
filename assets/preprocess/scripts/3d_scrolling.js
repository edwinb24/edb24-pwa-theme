// setSceneHeight emulate the Z- axis depth, since we are scrolling vertically
// the height combine how fast our scrolling is our camera perspective, etc. and
// make everything come together.

const INITIAL_CAMERA_POSITION = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--cameraZ')
)

//Get initial coordinates and stablish how much the camera will move
const PERSPECTIVE_ORIGIN = {
    x: parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
            '--scenePerspectiveOriginX'
        )
    ),
    y: parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
            '--scenePerspectiveOriginY'
        )
    ),
    max_gap_desktop: 10,
    max_gap_mobile: 20,
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('deviceorientation', GyroCameraMovement)
    window.addEventListener('scroll', moveCamera)
    window.addEventListener('mousemove', MouseCameraMovement)
    displayInstructions()
    setSceneHeight()
})

/// Keeping State
let X_GAP = 0

let Y_GAP = 0

function MouseCameraMovement(e) {
    const updatedXGap = Math.trunc(
        (((e.clientX - window.innerWidth / 2) * 100) /
            (window.innerWidth / 2)) *
            -1
    )
    const updatedYGap = Math.trunc(
        (((e.clientY - window.innerHeight / 2) * 100) /
            (window.innerHeight / 2)) *
            -1
    )
    // Refreshing the screen after movement larger than 2 pixels
    // to improve performance
    if (
        Math.abs(updatedXGap - X_GAP) > 2 ||
        Math.abs(updatedYGap - Y_GAP) > 2
    ) {
        moveCameraAngle(X_GAP, Y_GAP, PERSPECTIVE_ORIGIN.max_gap_desktop)
        X_GAP = updatedXGap
        Y_GAP = updatedYGap
    }
}
function GyroCameraMovement(e) {
    moveCameraAngle(e.gamma, e.beta, PERSPECTIVE_ORIGIN.max_gap_mobile)
}

function moveCameraAngle(X_GAP, Y_GAP, max_gap) {
    const new_perspective_x = PERSPECTIVE_ORIGIN.x + (X_GAP * max_gap) / 100
    const new_perspective_y = PERSPECTIVE_ORIGIN.y + (Y_GAP * max_gap) / 100

    document.documentElement.style.setProperty(
        '--scenePerspectiveOriginX',
        new_perspective_x
    )
    document.documentElement.style.setProperty(
        '--scenePerspectiveOriginY',
        new_perspective_y
    )
}

function setSceneHeight() {
    const list_of_items = document.getElementsByClassName('jobs')
    const number_of_items = list_of_items.length
    const item_z_index = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--itemZ')
    )
    const perspective = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
            '--scenePerspective'
        )
    )
    const camera_speed = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
            '--cameraSpeed'
        )
    )
    const height =
        window.innerHeight +
        perspective * camera_speed +
        item_z_index * camera_speed * (number_of_items - 1) +
        300
    document.documentElement.style.setProperty('--viewportHeight', height)
}

function displayInstructions() {
    if (sessionStorage.getItem('first_visit') === null) {
        const scrolling_overlay = document.getElementById('scrolling_icon')
        scrolling_overlay.style.display = 'flex'
        sessionStorage.setItem('first_visit', 'no')
    }
}

// moveCamera simulate the movement of the camera by converting the user
//scrolling onto movement on a 3D space
function moveCamera() {
    if (window.scrollY < 500) {
        const scrolling_overlay = document.getElementById('scrolling_icon')
        scrolling_overlay.style.top = '1000px'
        scrolling_overlay.style.opacity = '0'
    }
    document.documentElement.style.setProperty(
        '--cameraZ',
        window.scrollY + INITIAL_CAMERA_POSITION
    )
}
