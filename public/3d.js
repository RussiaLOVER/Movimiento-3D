// Inicializar las variables
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear una pista (ejemplo: un plano)
const geometry = new THREE.PlaneGeometry(100, 100, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const track = new THREE.Mesh(geometry, material);
track.rotation.x = -Math.PI / 2; // Rotar para que sea horizontal
scene.add(track);

// Posición inicial de la cámara
const initialPosition = new THREE.Vector3(0, 5, 0); // Colocar la cámara en una posición elevada
camera.position.copy(initialPosition);
camera.lookAt(new THREE.Vector3(0, 5, -1)); // Apuntar la cámara hacia adelante

// Variables para el movimiento
const moveSpeed = 0.1;
const moveDirection = new THREE.Vector3();

// Variables para el control de la cámara con el mouse
const mouseSensitivity = 0.001; // Ajusta este valor para cambiar la sensibilidad del mouse
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;
let maxCameraRotationX = Math.PI / 3; // Límite de inclinación hacia abajo

// Capturar las teclas presionadas
const keys = {
  W: false,
  A: false,
  S: false,
  D: false,
};

document.addEventListener('keydown', (event) => {
  const key = event.key.toUpperCase();
  if (keys.hasOwnProperty(key)) {
    keys[key] = true;
  }
});

document.addEventListener('keyup', (event) => {
  const key = event.key.toUpperCase();
  if (keys.hasOwnProperty(key)) {
    keys[key] = false;
  }
});

// Capturar eventos de mouse para el control de la cámara
document.addEventListener('mousedown', (event) => {
  isDragging = true;
  previousMouseX = event.clientX;
  previousMouseY = event.clientY;
});

document.addEventListener('mousemove', (event) => {
  if (!isDragging) return;

  const deltaX = event.clientX - previousMouseX;
  const deltaY = event.clientY - previousMouseY;

  camera.rotation.y -= deltaX * mouseSensitivity;

  // Aplicar el límite de inclinación hacia abajo
  if (
    camera.rotation.x - deltaY * mouseSensitivity >= -maxCameraRotationX &&
    camera.rotation.x - deltaY * mouseSensitivity <= maxCameraRotationX
  ) {
    camera.rotation.x -= deltaY * mouseSensitivity;
  } else if (camera.rotation.x - deltaY * mouseSensitivity < -maxCameraRotationX) {
    camera.rotation.x = -maxCameraRotationX;
  } else {
    camera.rotation.x = maxCameraRotationX;
  }

  previousMouseX = event.clientX;
  previousMouseY = event.clientY;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

// Animación
const animate = () => {
  requestAnimationFrame(animate);

  // Obtener la dirección de la cámara
  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);

  // Actualizar la posición de la cámara según las teclas presionadas
  moveDirection.set(0, 0, 0);

  if (keys.S) {
    moveDirection.add(cameraDirection.clone().multiplyScalar(-moveSpeed)); // Mover hacia adelante
  }
  if (keys.W) {
    moveDirection.add(cameraDirection.clone().multiplyScalar(moveSpeed)); // Mover hacia atrás
  }
  if (keys.A) {
    const strafeDirection = new THREE.Vector3();
    strafeDirection.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
    moveDirection.add(strafeDirection.multiplyScalar(-moveSpeed)); // Mover a la izquierda
  }
  if (keys.D) {
    const strafeDirection = new THREE.Vector3();
    strafeDirection.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
    moveDirection.add(strafeDirection.multiplyScalar(moveSpeed)); // Mover a la derecha
  }

  // Mover la cámara
  camera.position.add(moveDirection);

  renderer.render(scene, camera);
};

animate();
