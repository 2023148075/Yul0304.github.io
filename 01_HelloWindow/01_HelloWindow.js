// Global constants
const canvas = document.getElementById('glCanvas'); // Get the canvas element 
const gl = canvas.getContext('webgl2'); // Get the WebGL2 context

if (!gl) {
    console.error('WebGL 2 is not supported by your browser.');
}

// Set canvas size: 현재 window 전체를 canvas로 사용
canvas.width = 500;
canvas.height = 500;

// Initialize WebGL settings: viewport and clear color
// gl.viewport(0, 0, canvas.width, canvas.height);
// gl.clearColor(0.1, 0.2, 0.3, 1.0);

gl.enable(gl.SCISSOR_TEST);
// Start rendering

// Render loop
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw something here
    const w = canvas.width / 2;
    const h = canvas.height / 2;

    // Viewport 1 (0,0)
    gl.viewport(0, 0, w, h);
    gl.scissor(0, 0, w, h);
    gl.clearColor(0, 0, 1, 1.0); // Blue (불투명)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Viewport 2 (0,h)
    gl.viewport(0, h, w, h);
    gl.scissor(0, h, w, h);
    gl.clearColor(1, 0, 0, 1.0); // Red (불투명)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Viewport 3 (w,0)
    gl.viewport(w, 0, w, h);
    gl.scissor(w, 0, w, h);
    gl.clearColor(1, 1, 0, 1.0); // Yellow (불투명)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Viewport 4 (w,h)
    gl.viewport(w, h, w, h);
    gl.scissor(w, h, w, h);
    gl.clearColor(0, 1, 0, 1.0); // Green (불투명)
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// Resize viewport when window size changes
window.addEventListener('resize', () => {
    let size = Math.min(window.innerWidth, window.innerHeight);

    canvas.width = size;
    canvas.height = size;

    render();
});

render();

