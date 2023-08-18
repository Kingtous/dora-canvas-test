import * as THREE from './three.module.js';
import * as Util from './utils.js';
const renderer = new THREE.WebGLRenderer();
const width = 1500;
const height = 800;
renderer.setSize(width, height);
const threejsContainer = document.getElementById("threejs-container");
const flutterContainer = document.getElementById("mock-flutter-canvaskit-container");
threejsContainer.appendChild(renderer.domElement);

const threejsGl = renderer.getContext();

const flutterCanvas = document.createElement("canvas");
flutterCanvas.id = "flutter-canvas";
const flutterGl = flutterCanvas.getContext("webgl2");
flutterGl.canvas.width = width;
flutterGl.canvas.height = height;
flutterContainer.appendChild(flutterCanvas);

// 构建一个scene
const innerGeo = new THREE.BoxGeometry(5, 5, 5);
const innerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffaa});
const cube = new THREE.Mesh(innerGeo, innerMaterial);
cube.position.z -= 1;
const camera = new THREE.PerspectiveCamera(100, 3 / 3, 0.1, 100);
camera.position.z = 5;
var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x7074FF });
var plane = new THREE.PlaneGeometry(width, height);
var planeObject = new THREE.Mesh(plane, blueMaterial);
planeObject.position.z = -15;
const scene = new THREE.Scene();
scene.add(cube);
scene.add(planeObject);



const flutterTexture = flutterGl.createTexture();
// Create shaders, compile, and link into a program
const vertexShader = Util.createShader(flutterGl, flutterGl.VERTEX_SHADER, Util.vertexShaderSourceR);
const fragmentShader = Util.createShader(flutterGl, flutterGl.FRAGMENT_SHADER, Util.fragmentShaderSource);
const program = Util.createProgram(flutterGl, vertexShader, fragmentShader);

// 设置参数
flutterGl.bindTexture(flutterGl.TEXTURE_2D, flutterTexture);
flutterGl.texParameteri(flutterGl.TEXTURE_2D, flutterGl.TEXTURE_WRAP_S, flutterGl.CLAMP_TO_EDGE);
flutterGl.texParameteri(flutterGl.TEXTURE_2D, flutterGl.TEXTURE_WRAP_T, flutterGl.CLAMP_TO_EDGE);
flutterGl.texParameteri(flutterGl.TEXTURE_2D, flutterGl.TEXTURE_MIN_FILTER, flutterGl.LINEAR);
flutterGl.texParameteri(flutterGl.TEXTURE_2D, flutterGl.TEXTURE_MAG_FILTER, flutterGl.LINEAR);
// 三角形点
const positions = [
  -1,  1,
      1, -1,
      1,  1,
  -1, -1,
      1, -1,
    -1,  1,
    
];
const buffer = flutterGl.createBuffer();
flutterGl.bindBuffer(flutterGl.ARRAY_BUFFER, buffer);
flutterGl.bufferData(flutterGl.ARRAY_BUFFER, new Float32Array(positions), flutterGl.STATIC_DRAW);
flutterGl.useProgram(program);


const animate = () => {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  // cube.rotation.z += 0.01;
  cube.rotation.y += 0.01;


  renderer.render(scene, camera);

  flutterGl.viewport(0, 0, width, height);
  flutterGl.bindTexture(flutterGl.TEXTURE_2D, flutterTexture);
  // 上传纹理
  flutterGl.texImage2D(flutterGl.TEXTURE_2D, 0, flutterGl.RGBA, flutterGl.RGBA, flutterGl.UNSIGNED_BYTE, threejsGl.canvas);
  // link
  const positionAttributelocation = flutterGl.getAttribLocation(program, 'a_position');
  flutterGl.enableVertexAttribArray(positionAttributelocation);
  flutterGl.vertexAttribPointer(positionAttributelocation, 2, flutterGl.FLOAT, true, 0, 0);

  flutterGl.uniform1i(flutterGl.getUniformLocation(program, 'u_texture'), 0);
  flutterGl.drawArrays(flutterGl.TRIANGLES, 0, 6);
};

animate();
