export class SquarePyramid {
    constructor(gl) {
        this.gl = gl;

        // (x, y, z, r, g, b) 순으로 각 면 구성
        this.vertices = new Float32Array([
            // 바닥 1 (빨강)
            -0.5, 0.0, -0.5, 1, 0, 0,
            0.5, 0.0, -0.5, 1, 0, 0,
            0.5, 0.0, 0.5, 1, 0, 0,

            // 바닥 2 (빨강)
            -0.5, 0.0, -0.5, 1, 0, 0,
            0.5, 0.0, 0.5, 1, 0, 0,
            -0.5, 0.0, 0.5, 1, 0, 0,

            // 옆면 1 (yellow)
            -0.5, 0.0, -0.5, 1, 0, 0,
            0.5, 0.0, -0.5, 1, 0, 0,
            0.0, 1.0, 0.0, 1, 0, 0,

            // 옆면 2 (red))
            0.5, 0.0, -0.5, 0, 1, 1,
            0.5, 0.0, 0.5, 0, 1, 1,
            0.0, 1.0, 0.0, 0, 1, 1,

            // 옆면 3 (노랑)
            0.5, 0.0, 0.5, 1, 0, 1,
            -0.5, 0.0, 0.5, 1, 0, 1,
            0.0, 1.0, 0.0, 1, 0, 1,

            // 옆면 4 (보라)
            -0.5, 0.0, 0.5, 1, 1, 0,
            -0.5, 0.0, -0.5, 1, 1, 0,
            0.0, 1.0, 0.0, 1, 1, 0,
        ]);

        this.vao = gl.createVertexArray();
        this.vbo = gl.createBuffer();

        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        // 위치 attribute
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * 4, 0);

        // 색상 attribute
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

        gl.bindVertexArray(null);
    }

    draw(shader) {
        this.gl.bindVertexArray(this.vao);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 6);
        this.gl.bindVertexArray(null);
    }
}
