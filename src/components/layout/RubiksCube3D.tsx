
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RubiksCube3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    cube?: THREE.Group;
    cubeRows?: THREE.Mesh[][];
    cubeCols?: THREE.Mesh[][];
    cubeSlices?: THREE.Mesh[][];
    rotationQueue?: any[];
    isAnimating?: boolean;
    animationId?: number;
  }>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { current: refs } = sceneRef;

    // Initialize arrays
    refs.cubeRows = [[], [], []];
    refs.cubeCols = [[], [], []];
    refs.cubeSlices = [[], [], []];
    refs.rotationQueue = [];
    refs.isAnimating = false;

    // Scene setup
    refs.scene = new THREE.Scene();
    
    // Camera setup - adjusted for bigger cube
    refs.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    refs.camera.position.set(7, 7, 10);
    refs.camera.lookAt(0, 0, 0);

    // Renderer setup
    refs.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: "high-performance" 
    });
    refs.renderer.setSize(container.clientWidth, container.clientHeight);
    refs.renderer.setClearColor(0x000000, 0);
    refs.renderer.shadowMap.enabled = false;
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(refs.renderer.domElement);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    refs.scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight1.position.set(10, 10, 5);
    refs.scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-10, -5, -5);
    refs.scene.add(directionalLight2);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 15, 10);
    refs.scene.add(keyLight);

    // Create environment texture
    const createEnvironmentTexture = () => {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d')!;
      
      const gradient = context.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.5, '#888888');
      gradient.addColorStop(1, '#333333');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.mapping = THREE.CubeReflectionMapping;
      return texture;
    };

    // Premium cube material
    const envTexture = createEnvironmentTexture();
    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a1a1a,
      shininess: 100,
      specular: 0xffffff,
      transparent: true,
      opacity: 0.95,
      reflectivity: 0.8,
      envMap: envTexture
    });

    // Create Rubik's cube - SCALED UP
    refs.cube = new THREE.Group();
    const cubeSize = 1.4; // Increased from 0.95
    const gap = 0.08; // Slightly increased gap

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
          
          const edges = new THREE.EdgesGeometry(geometry);
          const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x888888, 
            transparent: true,
            opacity: 0.9
          });
          const wireframe = new THREE.LineSegments(edges, lineMaterial);

          const smallCube = new THREE.Mesh(geometry, cubeMaterial.clone());
          
          smallCube.position.set(
            (x - 1) * (cubeSize + gap),
            (y - 1) * (cubeSize + gap),
            (z - 1) * (cubeSize + gap)
          );
          smallCube.userData = { x, y, z };

          wireframe.position.copy(smallCube.position);
          
          refs.cube.add(smallCube);
          refs.cube.add(wireframe);
          
          refs.cubeRows![y].push(smallCube);
          refs.cubeCols![x].push(smallCube);
          refs.cubeSlices![z].push(smallCube);
        }
      }
    }

    refs.scene.add(refs.cube);

    // Animation functions
    const startRotationSequence = () => {
      const rotations = [
        { type: 'row', index: 0, direction: 1 },
        { type: 'row', index: 1, direction: -1 },
        { type: 'row', index: 2, direction: 1 },
        { type: 'col', index: 0, direction: -1 },
        { type: 'col', index: 1, direction: 1 },
        { type: 'col', index: 2, direction: -1 },
        { type: 'slice', index: 0, direction: 1 },
        { type: 'slice', index: 1, direction: -1 },
        { type: 'slice', index: 2, direction: 1 }
      ];
      
      for (let i = 0; i < 5; i++) {
        const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
        refs.rotationQueue!.push(randomRotation);
      }
      
      setTimeout(executeNextRotation, 2000);
    };

    const executeNextRotation = () => {
      if (refs.rotationQueue!.length === 0 || refs.isAnimating) {
        if (refs.rotationQueue!.length === 0) {
          startRotationSequence();
        }
        return;
      }

      refs.isAnimating = true;
      const rotation = refs.rotationQueue!.shift();
      
      let cubesToRotate: THREE.Mesh[] = [];
      let axis = new THREE.Vector3();
      
      switch (rotation.type) {
        case 'row':
          cubesToRotate = refs.cubeRows![rotation.index];
          axis.set(1, 0, 0);
          break;
        case 'col':
          cubesToRotate = refs.cubeCols![rotation.index];
          axis.set(0, 0, 1);
          break;
        case 'slice':
          cubesToRotate = refs.cubeSlices![rotation.index];
          axis.set(0, 1, 0);
          break;
      }

      animateRotation(cubesToRotate, axis, rotation.direction);
    };

    const animateRotation = (cubes: THREE.Mesh[], axis: THREE.Vector3, direction: number) => {
      const duration = 800;
      const startTime = Date.now();
      const totalRotation = (Math.PI / 2) * direction;

      const updateRotation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentRotation = totalRotation * easeProgress;

        cubes.forEach(cube => {
          if (cube.geometry) {
            const rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationAxis(axis, currentRotation);
            
            cube.position.applyMatrix4(rotationMatrix);
            cube.rotateOnAxis(axis, currentRotation - (cube.userData.lastRotation || 0));
            cube.userData.lastRotation = currentRotation;
          }
        });

        if (progress < 1) {
          requestAnimationFrame(updateRotation);
        } else {
          cubes.forEach(cube => {
            if (cube.geometry) {
              cube.userData.lastRotation = 0;
            }
          });
          
          refs.isAnimating = false;
          setTimeout(executeNextRotation, 1500 + Math.random() * 2000);
        }
      };

      updateRotation();
    };

    // Main animation loop
    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      if (refs.cube) {
        refs.cube.rotation.y += 0.008;
        refs.cube.rotation.x += 0.003;
      }

      // Dynamic lighting
      const lights = refs.scene!.children.filter(child => child.type === 'DirectionalLight');
      const keyLightObj = lights.find(light => (light as THREE.DirectionalLight).position.x === 5);
      if (keyLightObj) {
        keyLightObj.position.x = 5 + Math.sin(time * 0.5) * 3;
        keyLightObj.position.z = 10 + Math.cos(time * 0.3) * 2;
      }

      // Material animation
      if (refs.cube) {
        refs.cube.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
            child.material.shininess = 100 + Math.sin(time * 2 + index * 0.1) * 20;
            child.material.opacity = 0.95 + Math.sin(time * 1.5 + index * 0.2) * 0.03;
          }
        });
      }

      // Subtle camera movement
      if (refs.camera) {
        refs.camera.position.x = Math.sin(time * 0.3) * 0.3;
        refs.camera.position.y = 5 + Math.cos(time * 0.2) * 0.2;
        refs.camera.lookAt(0, 0, 0);
      }

      refs.renderer!.render(refs.scene!, refs.camera!);
    };

    // Handle resize
    const handleResize = () => {
      if (refs.camera && refs.renderer && containerRef.current) {
        refs.camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();
    startRotationSequence();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }
      if (refs.renderer) {
        refs.renderer.dispose();
        if (containerRef.current && refs.renderer.domElement) {
          containerRef.current.removeChild(refs.renderer.domElement);
        }
      }
      if (refs.scene) {
        refs.scene.clear();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ minHeight: '500px' }}
    />
  );
};

export default RubiksCube3D;
