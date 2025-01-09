import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import Cube from "../objects/cube";

export default class CubeParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const cubeParameters = Cube.getParams();
        const folder = dynamicGUI.addFolder(Cube.NAME);

        folder
            .add(cubeParameters, "width", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(cubeParameters, "height", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(cubeParameters, "depth", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(cubeParameters, "widthSegments", 1, 10)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(cubeParameters, "heightSegments", 1, 10)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(cubeParameters, "depthSegments", 1, 10)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder.addColor(cubeParameters, "color").onChange(() => {
            dynamicGUI.updateObject();
        });
    }
}
