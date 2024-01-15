#ifdef GL_ES

precision highp float;

#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    vTexCoord = aTexCoord;
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0; // scale for P5.js
    gl_Position = positionVec4;
}
