import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Materials

const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color(0xff0000);

const speed = 0.1;

// COLLIDER
const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const mat = new THREE.MeshBasicMaterial({
  color: new THREE.Color("rgb(255,0,0)"),
});
const collider = new THREE.Mesh(geo, mat);
collider.position.x = 1;
scene.add(collider);

// player
const geo2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const mat2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(geo2, mat2);
player.position.x = -1;
scene.add(player);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const checkCollision = (dir) => {
  const futurePosition = new THREE.Vector3().copy(player.position);
  futurePosition.x += dir;

  const colliderBOX = new THREE.Box3().setFromObject(collider);

  //OPÇÂO 1 - usar bounding box
  //   if (!colliderBOX.containsPoint(futurePosition)) {
  //     player.position.x = futurePosition.x;
  //   }

  //OPÇÂO 2 - usar posições predefinidas
  if (futurePosition.x < colliderBOX.min.x) {
    player.position.x = futurePosition.x;
  }
};

// Keyboard controls
window.addEventListener("keydown", (event) => {
  if (event.code == "KeyA") {
    checkCollision(-speed);
  } else if (event.code == "KeyD") {
    checkCollision(speed);
  }
});

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
