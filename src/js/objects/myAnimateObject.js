import MyObject from "./myObject";

export default class MyAnimateObject extends MyObject {
    constructor(scene, debugMode = false) {
        super(scene, debugMode);

        this.centerSphere = this.genCenterSphere();
        this.arrowHelper = this.genMeshDirectionArrow();
    }

    startRender() {
        throw new Error("startRender() must be implemented by subclass");
    }
}
