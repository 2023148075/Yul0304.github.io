#version 300 es
in vec4 aPosition;
uniform vec4 uBias;
void main() {
    gl_Position = aPosition + uBias;
}