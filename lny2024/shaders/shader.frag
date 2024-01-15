#ifdef GL_ES

precision highp float;

#endif

varying vec2 vTexCoord;
uniform sampler2D uTexture;

uniform vec2 uOffset;

void main() {

  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  
  vec4 magenta = texture2D(uTexture, uv + uOffset);
  vec4 cyan = texture2D(uTexture, uv);
  vec4 yellow = texture2D(uTexture, uv - uOffset);
  
  vec4 color = vec4(
    (magenta.r + yellow.r),
    (yellow.g + cyan.g),
    (cyan.b + magenta.b),
    1.0
  );
  
  // Send the color to the screen
  gl_FragColor = color;

}