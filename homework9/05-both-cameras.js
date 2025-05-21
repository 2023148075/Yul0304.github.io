import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// 씬 생성
const scene = new THREE.Scene();

// 카메라 설정
let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 100, 200);
camera.lookAt(scene.position);

// 렌더러 설정
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

// OrbitControls 설정
let orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

// Stats 설정
const stats = new Stats();
document.body.appendChild(stats.dom);

// 광원 추가
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, 100, 100);
scene.add(directionalLight);

// 텍스처 로더
const textureLoader = new THREE.TextureLoader();

// 태양 생성
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // 노란색
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// 행성 정보
const planetData = [
    {
        name: 'Mercury',
        radius: 1.5,
        distance: 20,
        color: '#a6a6a6',
        rotationSpeed: 0.02,
        orbitSpeed: 0.02,
        texture: 'assets/textures/Mercury.jpg',
    },
    {
        name: 'Venus',
        radius: 3,
        distance: 35,
        color: '#e39e1c',
        rotationSpeed: 0.015,
        orbitSpeed: 0.015,
        texture: 'assets/textures/Venus.jpg',
    },
    {
        name: 'Earth',
        radius: 3.5,
        distance: 50,
        color: '#3498db',
        rotationSpeed: 0.01,
        orbitSpeed: 0.01,
        texture: 'assets/textures/Earth.jpg',
    },
    {
        name: 'Mars',
        radius: 2.5,
        distance: 65,
        color: '#c0392b',
        rotationSpeed: 0.008,
        orbitSpeed: 0.008,
        texture: 'assets/textures/Mars.jpg',
    },
];

// 행성 생성 및 GUI 설정
const planets = [];
const gui = new GUI();
const planetFolder = gui.addFolder('Planets');

planetData.forEach((data) => {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const texture = textureLoader.load(data.texture);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);

    // 공전 중심을 위한 그룹
    const orbitGroup = new THREE.Object3D();
    orbitGroup.add(mesh);
    scene.add(orbitGroup);

    mesh.position.x = data.distance;

    // 행성 객체에 정보 추가
    const planet = {
        name: data.name,
        mesh,
        orbitGroup,
        rotationSpeed: data.rotationSpeed,
        orbitSpeed: data.orbitSpeed,
        angle: Math.random() * Math.PI * 2,
    };

    // GUI 폴더 추가
    const folder = planetFolder.addFolder(data.name);
    folder
        .add(planet, 'rotationSpeed', 0, 0.05)
        .name('Rotation Speed')
        .listen();
    folder.add(planet, 'orbitSpeed', 0, 0.05).name('Orbit Speed').listen();

    planets.push(planet);
});

// 카메라 모드 전환 GUI
const cameraFolder = gui.addFolder('Camera');
const cameraSettings = {
    mode: 'Perspective',
    switchCamera: () => {
        if (camera instanceof THREE.PerspectiveCamera) {
            const aspect = window.innerWidth / window.innerHeight;
            camera = new THREE.OrthographicCamera(
                -100 * aspect,
                100 * aspect,
                100,
                -100,
                0.1,
                1000
            );
            camera.position.set(0, 100, 200);
            camera.lookAt(scene.position);
            orbitControls.dispose();
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            cameraSettings.mode = 'Orthographic';
        } else {
            camera = new THREE.PerspectiveCamera(
                45,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            camera.position.set(0, 100, 200);
            camera.lookAt(scene.position);
            orbitControls.dispose();
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            cameraSettings.mode = 'Perspective';
        }
    },
};
cameraFolder.add(cameraSettings, 'switchCamera').name('Switch Camera');
cameraFolder.add(cameraSettings, 'mode').name('Mode').listen();

// 애니메이션 루프
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    planets.forEach((planet) => {
        // 자전
        planet.mesh.rotation.y += planet.rotationSpeed * delta * 60;

        // 공전
        planet.angle += planet.orbitSpeed * delta * 60;
        planet.orbitGroup.rotation.y = planet.angle;
    });

    orbitControls.update();
    stats.update();
    renderer.render(scene, camera);
}

animate();

// 창 크기 변경 대응
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;

    if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    } else if (camera instanceof THREE.OrthographicCamera) {
        camera.left = -100 * aspect;
        camera.right = 100 * aspect;
        camera.top = 100;
        camera.bottom = -100;
        camera.updateProjectionMatrix();
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
});
