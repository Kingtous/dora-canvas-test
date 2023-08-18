# Three.js webgl test

A WebGL test to overcome the limitations of the maximum 16 webgl canvas.


Contents:

- `index.html` try to use a webgl2 canvas to be an external texture for the other webgl2 canvas.
- `webgl-mcanvas.html` try to use a singleton offscreen canvas to render images to multiple 2d canvas.

Both of them works but for Safari, Firefox, both of `drawImage` and `texImage2D` will transfer the texture data from GPU to CPU, which brings really bad performance.