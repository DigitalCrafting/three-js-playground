import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as THREE from 'three';
import {Group} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-canvas-box',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas id="canvasBox" #canvasBox></canvas>
  `
})
export class CanvasBoxComponent implements OnInit {

  ngOnInit() {
    this.createThreeJsBox();
  }

  private createThreeJsBox() {
    const canvasBox = document.getElementById("canvasBox");
    const scene = new THREE.Scene();

    scene.background = new THREE.Color();

    const material = new THREE.MeshToonMaterial();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    scene.add(pointLight);

    const loader = new GLTFLoader();

    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );
    let islandModel: Group;

    loader.load(
      '/assets/foxs_islands.glb',
      (model) => {
        islandModel = model.scene;
        scene.add(model.scene);
        model.animations;
        model.scene;
        model.scenes;
        model.cameras;
        model.asset;
      },
      (xhr) => {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

      },
      // called when loading has errors
      (error) => {

        console.log('An error happened');

      }
    )

    // const box = new THREE.Mesh(
    //   new THREE.BoxGeometry(1.5, 1.5, 1.5),
    //   material
    // );
    //
    // const torus = new THREE.Mesh(
    //   new THREE.TorusGeometry(5, 1.5, 16, 100),
    //   material
    // );

    // scene.add(torus, box);

    const canvasSizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasSizes.width / canvasSizes.height,
      0.001,
      1000
    );
    camera.position.z = 50;
    scene.add(camera);


    if (!canvasBox) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasBox,
    });

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();

    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(canvasSizes.width, canvasSizes.height);

    window.addEventListener('resize', () => {
      canvasSizes.width = window.innerWidth;
      canvasSizes.height = window.innerHeight;

      camera.aspect = canvasSizes.width / canvasSizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(canvasSizes.width, canvasSizes.height);
      renderer.render(scene, camera);
    });

    const clock = new THREE.Clock();

    const animateGeometry = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update animation objects
      // box.rotation.x = elapsedTime;
      // box.rotation.y = elapsedTime;
      // box.rotation.z = elapsedTime;
      //
      // torus.rotation.x = -elapsedTime;
      // torus.rotation.y = -elapsedTime;
      // torus.rotation.z = -elapsedTime;

      if (islandModel) {
        islandModel.rotation.y += 0.01;
      }

      // Render
      renderer.render(scene, camera);
      controls.update();

      // Call animateGeometry again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };

    animateGeometry();
  }
}
