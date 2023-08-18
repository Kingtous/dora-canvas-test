import * as THREE from './three.module.js';
// import * as Util from './utils.js';
// Set up the scene, camera, and renderer
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(100, 3 / 3, 0.1, 100);
const renderer = new THREE.WebGLRenderer();
const width = 300;
const height = 300;
const container = document.getElementById("container");
// document.getElementById("container").appendChild(renderer.domElement);
renderer.setSize(width, height);
// ========离屏渲染=======
// const bufferScene = new THREE.Scene();
// const bufferTexture = new THREE.WebGLRenderTarget(300, 300, {
//   minFilter: THREE.LinearFilter,
//   magFilter: THREE.NearestFilter
// });
// const innerGeo = new THREE.BoxGeometry(5, 5, 5);
// const innerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffaa });
// const cube2 = new THREE.Mesh(innerGeo, innerMaterial);
// cube2.position.z -= 1;
// bufferScene.add(cube2);
// /// 蓝色背景
// var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x7074FF });
// var plane = new THREE.PlaneGeometry(width, height);
// var planeObject = new THREE.Mesh(plane, blueMaterial);
// planeObject.position.z = -15;
// bufferScene.add(planeObject);
// //=====================================

// // 要渲染的绿色物体，然后在每个面上加上上面的texture材质
// const geometry = new THREE.BoxGeometry(5, 5, 5);
// // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const material = new THREE.MeshBasicMaterial({ map: bufferTexture.texture, color: 0xff00 });
// // Create a mesh and add it to the scene
// const cube = new THREE.Mesh(geometry, material);
// cube.position.z -= 5;
// scene.add(cube);
// // Position the camera
// // camera.position.z = 5;

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
  scene.add(blueMaterial);
  
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
