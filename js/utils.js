const canvas2D = document.getElementById('singleton-canvas'); // Your new canvas element
const gl2D = canvas2D.getContext('webgl');

const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_position * 0.5 + 0.5; // Normalize to [0, 1]
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;

    void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program:", gl.getProgramInfoLog(program));
        return null;
    }

    return program;
}

const vertexShader = createShader(gl2D, gl2D.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl2D, gl2D.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl2D, vertexShader, fragmentShader);

function transferPixelsToCanvas2d(gl, canvas2dcontext) {
    gl.useProgram(program);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0,  1.0,
        1.0,  1.0,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl2D.FLOAT, false, 0, 0);

    const textureUniform = gl.getUniformLocation(program, 'u_texture');
    gl.uniform1i(textureUniform, 0); // Use texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.drawArrays(gl.TRIANGLE, 0, 6);
    canvas2dcontext.drawImage(gl.canvas, 0, 0);
}


export {vertexShaderSource, fragmentShaderSource, gl2D, program, transferPixelsToCanvas2d};



