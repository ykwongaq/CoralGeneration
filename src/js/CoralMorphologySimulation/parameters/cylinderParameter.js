import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import Cylinder from "../objects/cylinder";

export default class CylinderParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     *
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const cylinderParameters = Cylinder.getParams();
        const folder = dynamicGUI.addFolder(Cylinder.NAME);

        folder
            .add(cylinderParameters, "radiusTop", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(cylinderParameters, "radiusBottom", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(cylinderParameters, "height", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(cylinderParameters, "radialSegments", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(cylinderParameters, "heightSegments", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder.add(cylinderParameters, "openEnded").onChange(() => {
            dynamicGUI.updateObject();
        });
        folder
            .add(cylinderParameters, "thetaStart", 0, Math.PI * 2)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(cylinderParameters, "thetaLength", 0, Math.PI * 2)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder.addColor(cylinderParameters, "color").onChange(() => {
            dynamicGUI.updateObject();
        });
    }
}
