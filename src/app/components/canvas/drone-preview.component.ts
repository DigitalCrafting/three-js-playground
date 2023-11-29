import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ViewportConfig} from "../../3d/3d-interfaces";
import {DroneMoveDirection, DroneObj} from "../../3d/drone.obj";
import {IslandObj} from "../../3d/island.obj";
import {DRONE_VIEW, MAIN_VIEW} from "./view-ports.config";

@Component({
  selector: 'drone-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas id="canvasBox" #canvasBox></canvas>
  `
})
export class DronePreview implements OnInit, AfterViewInit {
  @ViewChild('canvasBox') private canvasRef: ElementRef;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private ambientLight: THREE.AmbientLight;
  private light: THREE.HemisphereLight;
  private pointLight: THREE.PointLight;
  private canvasSizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  private mainCamera: THREE.PerspectiveCamera;
  private droneCamera: THREE.PerspectiveCamera;
  private islandObj: IslandObj;
  private droneObj: DroneObj;

  ngOnInit() {
    this.initThreeJsObjects();
  }

  async ngAfterViewInit() {
    this.droneObj = await DroneObj.create();
    this.islandObj = await IslandObj.create()
    this.setEventHandlers()
    this.createThreeJsView();
  }

  private initThreeJsObjects() {
    this.scene = new THREE.Scene();
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);

    this.pointLight = new THREE.PointLight(0xffffff, 0.5);
    this.pointLight.position.x = 2;
    this.pointLight.position.y = 2;
    this.pointLight.position.z = 2;

    this.scene.add(this.ambientLight);
    this.scene.add(this.light);
    this.scene.add(this.pointLight);

    this.scene.background = new THREE.Color();

    this.mainCamera = new THREE.PerspectiveCamera(
      75,
      this.canvasSizes.width / this.canvasSizes.height,
      0.001,
      1000
    );
    this.droneCamera = new THREE.PerspectiveCamera(
      75,
      this.canvasSizes.width / this.canvasSizes.height,
      0.001,
      1000
    );

    this.mainCamera.position.z = 50;
    this.mainCamera.position.y = 30;
  }

  private createThreeJsView() {
    const canvasBox = this.canvasRef.nativeElement;

    if (!canvasBox) {
      return;
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvasBox,
    });

    const controls = new OrbitControls(this.mainCamera, this.renderer.domElement);
    controls.update();

    this.renderer.setClearColor('white', 1);
    this.renderer.setSize(this.canvasSizes.width, this.canvasSizes.height);

    this.scene.add(this.islandObj.model, this.droneObj.model);
    this.scene.add(this.mainCamera);

    this.mainCamera.lookAt(this.islandObj.position);

    this.droneObj.lookAt(this.islandObj.position);
    this.droneObj.add(this.droneCamera);

    this.droneCamera.position.set(0, 0, 5);
    this.droneCamera.lookAt(this.islandObj.position);

    /* ==== Main loop ==== */
    const animateGeometry = () => {
      controls.update();

      this.moveDrone();
      this.renderViewPorts();

      // Call animateGeometry again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };

    animateGeometry();
  }

  private setEventHandlers(): void {
    window.addEventListener('resize', () => {
      this.canvasSizes.width = window.innerWidth;
      this.canvasSizes.height = window.innerHeight;

      this.mainCamera.aspect = this.canvasSizes.width / this.canvasSizes.height;
      this.mainCamera.updateProjectionMatrix();
      this.droneCamera.aspect = this.mainCamera.aspect;
      this.droneCamera.updateProjectionMatrix();

      this.renderer.setSize(this.canvasSizes.width, this.canvasSizes.height);
      this.renderViewPorts();
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'a') {
        this.droneObj.moveDirection = DroneMoveDirection.LEFT;
      } else if (event.key === 'd') {
        this.droneObj.moveDirection = DroneMoveDirection.RIGHT;
      } else {
        this.droneObj.moveDirection = DroneMoveDirection.NONE;
      }
    });
    window.addEventListener('keyup', () => {
      this.droneObj.moveDirection = DroneMoveDirection.NONE;
    });
  }

  private setViewport(view: ViewportConfig) {
    const left = Math.floor( this.canvasSizes.width * view.left );
    const bottom = Math.floor( this.canvasSizes.height * view.bottom );
    const width = Math.floor( this.canvasSizes.width * view.width );
    const height = Math.floor( this.canvasSizes.height * view.height );

    this.renderer.setViewport( left, bottom, width, height );
    this.renderer.setScissor( left, bottom, width, height);
    this.renderer.setScissorTest( true );
    this.renderer.setClearColor( view.background );

    // Render viewport
    this.scene.background = view.background;
  }

  private moveDrone(): void {
    if (this.droneObj) {
      this.droneObj.move()
      this.droneObj.lookAt(this.islandObj.position);

      this.droneCamera.updateProjectionMatrix();
      this.droneCamera.position.set(0, 0, 5);
      this.droneCamera.lookAt(this.islandObj.position);
    }
  }

  private renderViewPorts(): void {
    // Main
    this.setViewport(MAIN_VIEW);
    this.renderer.render(this.scene, this.mainCamera);

    // Drone
    this.setViewport(DRONE_VIEW);
    this.renderer.render(this.scene, this.droneCamera);
  }
}
