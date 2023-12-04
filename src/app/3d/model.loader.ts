import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

class ModelLoader {
  private loader = new GLTFLoader();

  public loadGLTF(modelPath: string): Promise<GLTF> {
    return new Promise<GLTF>((resolve, reject) => {
      this.loader.load(
        modelPath,
        (model) => {
          resolve(model);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // called when loading has errors
        (error) => {
          console.log('An error happened ' + error);
          reject(error);
        }
      )
    });
  }
}

export default new ModelLoader();
