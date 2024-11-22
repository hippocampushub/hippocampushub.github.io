import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

class ObjViewer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(20, 1, 0.1, 3000);
        this.renderer = null; // Will be initialized with the canvas
        this.object = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.isDragging = false;
        this.rotationSpeed = 0;
        this.constantRotationSpeed = 0.0025;
        this.inertiaFactor = 0.95;

        this.init();
    }

    init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        this.loadModel();
        this.setupEventListeners();
        this.animate();
    }

    setupRenderer() {
        const canvas = document.getElementById('3d-canvas'); // Use the existing canvas
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
    }

    setupCamera() {
        this.camera.position.z = 1500;
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    loadModel() {
        const loader = new OBJLoader();
        loader.load(
            './asset/model.obj', // Ensure the correct path to your OBJ file
            (loadedObject) => {
                this.object = loadedObject;
                this.object.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshBasicMaterial({
                            color: 0xE65100,
                            wireframe: true
                        });
                    }
                });

                const box = new THREE.Box3().setFromObject(this.object);
                const center = box.getCenter(new THREE.Vector3());
                this.object.position.sub(center);

                this.scene.add(this.object);
            },
            (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
            (error) => console.error('An error occurred while loading the model', error)
        );
    }

    setupEventListeners() {
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.renderer.domElement.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }

    onMouseMove(event) {
        event.preventDefault();

        this.mouse.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;

        if (this.isDragging && this.object) {
            const deltaMove = event.offsetX - this.previousMousePosition.x;
            this.rotationSpeed = deltaMove * 0.01;
            this.object.rotation.y += this.rotationSpeed;

            if (Math.abs(this.rotationSpeed) > Math.abs(this.constantRotationSpeed)) {
                this.constantRotationSpeed = Math.sign(this.rotationSpeed) * Math.abs(this.constantRotationSpeed);
            }
        }

        this.previousMousePosition = {
            x: event.offsetX,
            y: event.offsetY
        };
    }

    onMouseDown(event) {
        this.isDragging = true;
    }

    onMouseUp(event) {
        this.isDragging = false;
    }

    onMouseLeave(event) {
        this.isDragging = false;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        if (this.object) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.object.children, true);

            this.renderer.domElement.style.cursor = intersects.length > 0
                ? (this.isDragging ? 'grabbing' : 'grab')
                : 'default';

            if (!this.isDragging) {
                this.object.rotation.y += this.rotationSpeed;
                this.rotationSpeed *= this.inertiaFactor;

                if (Math.abs(this.rotationSpeed) < 0.00001) this.rotationSpeed = 0;

                this.object.rotation.y += this.constantRotationSpeed;
            }
        }

        this.renderer.render(this.scene, this.camera);
    }
}

export default ObjViewer;

// Initialize the viewer when the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    new ObjViewer();
});