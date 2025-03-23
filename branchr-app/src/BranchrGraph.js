import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

const BrancherGraph = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // === Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Append only once
    const container = mountRef.current;
    if (container) {
      container.innerHTML = ''; // 🔧 Clear out previous contents
      container.appendChild(renderer.domElement);
      container.appendChild(labelRenderer.domElement);
    }

    // === Nodes
    const nodes = [
      { id: 1, name: 'Root', x: 0, y: 0, z: 0 },
      { id: 2, name: 'Concept A', x: 5, y: 2, z: -3 },
      { id: 3, name: 'Concept B', x: -4, y: 3, z: 4 },
      { id: 4, name: 'Concept C', x: 3, y: -3, z: 2 }
    ];

    const links = [
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 2, target: 4 }
    ];

    // === Create nodes as CSS2D cards
    nodes.forEach((node) => {
      const div = document.createElement('div');
      div.className = 'node-card';
      div.textContent = node.name;

      const label = new CSS2DObject(div);
      label.position.set(0, -0.02, 0); // Slight tweak for better connection


      const group = new THREE.Object3D();
      group.position.set(node.x, node.y, node.z);
      group.add(label);

      scene.add(group);
    });

    // === Create lines between nodes
    links.forEach((link) => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);

      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const points = [
        new THREE.Vector3(source.x, source.y, source.z),
        new THREE.Vector3(target.x, target.y, target.z)
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    });

    // === Animate
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    // === Cleanup
    return () => {
      if (container) container.innerHTML = '';
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default BrancherGraph;

