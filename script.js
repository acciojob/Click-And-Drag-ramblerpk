// Your code here.
const cubes = document.querySelectorAll('.cube');
let isDragging = false;
let currentCube = null;

cubes.forEach(cube => {
    cube.addEventListener('mousedown', (e) => {
        isDragging = true;
        currentCube = cube;
        // Store initial mouse and cube positions
    });
});

document.addEventListener('mousemove', (e) => {
    if (isDragging && currentCube) {
        // Update cube position based on mouse movement
        // Ensure it stays within the defined area
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    currentCube = null;
});