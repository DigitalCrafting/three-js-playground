import {Color, Group, Object3D} from "three";
import {Vector3} from "three/src/math/Vector3";

interface ViewportConfig {
  left: number,
  bottom: number,
  width: number,
  height: number,
  background: Color
}

interface ThreeObj {
  get model(): Group;
  get position(): Vector3;
  setPosition(x: number, y: number, z: number): void;
  setScale(x: number, y: number, z: number): void;
  add(...object: Object3D[]): void;
  lookAt(vector: Vector3): void;
}

export { ViewportConfig, ThreeObj }
