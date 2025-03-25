/*-------------------------------------------------------------------------
03_HelloTriangleIndexed
    1) Draws a triangle using indexed vertices.
    2) Resize viewport while maintaining aspect ratio.
    3) By the keyboard input 'k', toggle the fill and stroke rendering mode
    for the triangle
---------------------------------------------------------------------------*/

import { resizeAspectRatio, setupText } from "../util/util.js";
import { Shader, readShaderFile } from "../util/shader.js";
let shader = null;
let vao = null;
// Get the canvas and WebGL 2 context
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');

function initWebGL() {
    if (!gl) {
        console.error('WebGL 2 is not supported by your browser');
        return false;
    }

    canvas.width = 600;
    canvas.height = 600;

    // resize handler
    resizeAspectRatio(gl, canvas);

    // Initialize WebGL settings
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1.0);
    return true;
}

// Loading the shader source files
async function initShader() {
    const vertexShaderSource = await readShaderFile('shVert.glsl');
    const fragmentShaderSource = await readShaderFile('shFrag.glsl');
    return new Shader(gl, vertexShaderSource, fragmentShaderSource);
}



// Render loop
function render(vao) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Fill the two triangles using shader program1
    shader.use();
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    requestAnimationFrame(() => render(vao));
}

function setupBuffers(shader) {
    // Rectangle vertices
    const vertices = new Float32Array([
        -0.1, -0.1, 0.0,  // Bottom left
        0.1, -0.1, 0.0,  // Bottom right
        0.1, 0.1, 0.0,  // Top right
        -0.1, 0.1, 0.0   // Top left
    ]);

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    return vao;
}
const program1 = gl.createProgram();
async function main() {
    try {

        if (!initWebGL()) {
            throw new Error('WebGL 초기화 실패');
        }

        shader = await initShader();


        // text object
        setupText(canvas, "Use Arrow keys to move the rectangle", 1);

        vao = setupBuffers(shader);
        shader.use();

        setupKeyboardEvents();

        render(vao);

        return true;
    } catch (error) {
        console.error('Failed to initialize program:', error);
        alert('프로그램 초기화에 실패했습니디.');
        return false;
    }

}

// call main function
main().then(success => {
    if (!success) {
        console.log('프로그램을 종료합니다.');
        return;
    }
}).catch(error => {
    console.error('프로그램 실행 중 오류 발생:', error);
});

function setupKeyboardEvents() {
    let offset = new Float32Array([0.00, 0.00, 0.00, 0.00]);

    const uBiasLocation = gl.getUniformLocation(shader.program, 'uBias');
    // Event listener for key press
    document.addEventListener('keydown', (event) => {
        console.log(`Key pressed: ${event.key}`);
        if (event.key === 'ArrowUp') {
            if (offset[1] < 0.9) {
                offset[1] += 0.01;
            }
        }
        else if (event.key === 'ArrowDown') {
            if (offset[1] > -0.9) {
                offset[1] -= 0.01;
            }
        }
        else if (event.key === 'ArrowLeft') {
            if (offset[0] > -0.9) {
                offset[0] -= 0.01;
            }
        }
        else if (event.key === 'ArrowRight') {
            if (offset[0] < 0.9) {
                offset[0] += 0.01;
            }
        }
        gl.uniform4fv(uBiasLocation, offset);
        render(vao);
    });
}