import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import MODEL_LOADER from "../graphics/model.loader";
import {Group, Object3D} from "three";
import {Vector3} from "three/src/math/Vector3";
import {ThreeObj} from "./3d-interfaces";

export class IslandObj implements ThreeObj {
  private gltfObj: GLTF;
  private _model: Group;

  private constructor() {
  }

  public get model(): Group {
    return this._model;
  }

  public get position(): Vector3 {
    return this._model.position;
  }

  public setPosition(x: number, y: number, z: number) {
    this._model.position.set(x, y, z);
  }

  public setScale(x: number, y: number, z: number): void {
    this._model.scale.set(x, y, z);
  }

  public add(...object: Object3D[]): void {
    this._model.add(...object);
  }

  public lookAt(vector: Vector3): void {
    this._model.lookAt(vector);
  }

  public static async create(): Promise<IslandObj> {
    let obj: IslandObj = new IslandObj();

    obj.gltfObj = await MODEL_LOADER.loadGLTF('/assets/foxs_islands.glb');
    obj._model = obj.gltfObj.scene;

    return obj;
  }
}
