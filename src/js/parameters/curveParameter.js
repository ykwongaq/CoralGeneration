import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import Curve from "../objects/curve";

export default class CurveParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const curveParameters = Curve.getParams();
        const folder = dynamicGUI.addFolder(Curve.NAME);

        const curveTypes = [Curve.CATNULL_ROM, Curve.BSPLINE];
        folder
            .add(curveParameters, "curveType", curveTypes)
            .name("Curve Type")
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder.addColor(curveParameters, "startColor").onChange(() => {
            dynamicGUI.updateObject();
        });
        folder.addColor(curveParameters, "endColor").onChange(() => {
            dynamicGUI.updateObject();
        });

        const controlPoint1Folder = dynamicGUI.addFolder("Control Point 1");
        controlPoint1Folder
            .add(curveParameters, "controlPoint1X", -10, 10)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        controlPoint1Folder
            .add(curveParameters, "controlPoint1Y", -10, 10)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        controlPoint1Folder
            .add(curveParameters, "controlPoint1Z", -10, 10)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });

        const controlPoint2Folder = dynamicGUI.addFolder("Control Point 2");
        controlPoint2Folder
            .add(curveParameters, "controlPoint2X", -10, 10)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        controlPoint2Folder
            .add(curveParameters, "controlPoint2Y", -10, 10)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        controlPoint2Folder
            .add(curveParameters, "controlPoint2Z", -10, 10)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });

        const widthFolder = dynamicGUI.addFolder("Width");
        widthFolder
            .add(curveParameters, "startWidth", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        widthFolder
            .add(curveParameters, "endWidth", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
    }
}
