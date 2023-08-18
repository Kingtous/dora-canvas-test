import * as THREE from './three.module.js';
const renderer = new THREE.WebGLRenderer();
const width = 300;
const height = 300;
const container = document.getElementById("container");
renderer.setSize(width, height);
const glContext = renderer.getContext();

const renderContextArr = [];
for (let index = 0; index < 20; index++) {
  const canvasElem = document.createElement("canvas");
  canvasElem.id = "canvas-" + index;
  canvasElem.width = width;
  canvasElem.height = height;
  canvasElem.style.padding = "16px";
  container.appendChild(canvasElem);
  const context2d = canvasElem.getContext('2d');

  const innerGeo = new THREE.BoxGeometry(5, 5, 5);
  const innerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffaa + index * 16 });
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
  
  context2d.canvas.width = width;
  context2d.canvas.height = height;
  context2d.globalCompositeOperation = "copy";
  const cxt = {
    canvas2dContext: context2d,
    cube: cube,
    camera: camera,
    scene: scene,
    // buildSceneCallback: buildSceneCallback,
    // renderTarget: bufferTexture
  };
  renderContextArr.push(cxt);
}
// const premultiplyAlphaTrueProgram = createProgram(glContext, [vs, fs]);
//   const premultiplyAlphaFalseProgram = createProgram(glContext, [vs, fs2]);

const animate = () => {
  requestAnimationFrame(animate);
  // read要过CPU，不行
  // renderer.readRenderTargetPixels(bufferTexture, 0, 0, 300, 300, data);
  // let imageData = new ImageData(data, 300, 300);
  // copiedContext.putImageData(imageData, 0, 0);
  // Util.transferPixelsToCanvas2d(Util.gl2D, copiedContext);
  for(const key in renderContextArr) {
    if (Object.hasOwnProperty.call(renderContextArr, key)) {
      const context = renderContextArr[key];
      const cube = context.cube;
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      // renderer.setRenderTarget(null);
      renderer.render(context.scene, context.camera);
      context.canvas2dContext.drawImage(glContext.canvas, 0, 0, width, height, 0, 0, width, height);
    }
  }
};

animate();
