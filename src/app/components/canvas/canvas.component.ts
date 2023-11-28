import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import MODEL_LOADER from '../../graphics/model.loader';
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {Cache} from "three";
import enabled = Cache.enabled;

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas id="canvasBox" #canvasBox></canvas>
  `
})
export class CanvasComponent implements OnInit {
  private scene = new THREE.Scene();
  private ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  private light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  private pointLight = new THREE.PointLight(0xffffff, 0.5);
  private canvasSizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  private camera = new THREE.PerspectiveCamera(
    75,
    this.canvasSizes.width / this.canvasSizes.height,
    0.001,
    1000
  );

  async ngOnInit() {
    this.initThreeJsObjects();
    await this.createThreeJsBox();
  }

  private initThreeJsObjects() {
    this.pointLight.position.x = 2;
    this.pointLight.position.y = 2;
    this.pointLight.position.z = 2;

    this.scene.background = new THREE.Color();

    this.camera.position.z = 50;
    this.camera.position.y = 30;

  }

  private async createThreeJsBox() {
    const canvasBox = document.getElementById("canvasBox");

    if (!canvasBox) {
      return;
    }

    this.scene.add(this.ambientLight);
    this.scene.add(this.pointLight);
    this.scene.add(this.light);

    const islandGLTF: GLTF = await MODEL_LOADER.loadGLTF('/assets/foxs_islands.glb');
    let droneGLTF: GLTF = await MODEL_LOADER.loadGLTF('/assets/drone.glb');

    let islandModel = islandGLTF.scene;
    let droneModel = droneGLTF.scene;


    this.scene.add(islandModel, droneModel);
    this.scene.add(this.camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasBox,
    });

    const controls = new OrbitControls(this.camera, renderer.domElement);
    controls.update();

    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(this.canvasSizes.width, this.canvasSizes.height);

    window.addEventListener('resize', () => {
      this.canvasSizes.width = window.innerWidth;
      this.canvasSizes.height = window.innerHeight;

      this.camera.aspect = this.canvasSizes.width / this.canvasSizes.height;
      this.camera.updateProjectionMatrix();

      renderer.setSize(this.canvasSizes.width, this.canvasSizes.height);
      renderer.render(this.scene, this.camera);
    });

    let moveDirection: 'left' | 'right' | undefined = undefined;
    window.addEventListener('keydown', (event) => {
      if (event.key === 'a') {
        moveDirection = 'left';
      } else if (event.key === 'd') {
        moveDirection = 'right';
      } else {
        moveDirection = undefined;
      }
    });
    window.addEventListener('keyup', () => {
      moveDirection = undefined;
    });

    const clock = new THREE.Clock();
    this.camera.lookAt(islandModel.position);
    let lastAngle = Math.PI * 0.2;
    droneModel.position.x = Math.cos(lastAngle) * 30;
    droneModel.position.y = islandModel.position.y + 20;
    droneModel.position.z = Math.sin(lastAngle) * 30;
    droneModel.scale.set(0.5, 0.5, 0.5)
    droneModel.lookAt(islandModel.position);

    const animateGeometry = () => {

      if (droneModel && moveDirection === 'left' || moveDirection === 'right') {
        if (moveDirection === 'left') {
          lastAngle += 0.05;
        } else if (moveDirection === 'right') {
          lastAngle -= 0.05;
        }
        droneModel.position.x = Math.cos(lastAngle) * 30;
        droneModel.position.z = Math.sin(lastAngle) * 30;
        droneModel.lookAt(islandModel.position);
      }

      // Render
      renderer.render(this.scene, this.camera);
      controls.update();

      // Call animateGeometry again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };

    animateGeometry();
  }
}