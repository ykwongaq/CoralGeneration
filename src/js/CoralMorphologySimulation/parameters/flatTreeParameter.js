import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import { FlatTree } from "../objects";

export default class FlatTreeParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const flatTreeParameters = FlatTree.getParams();
        const folder = dynamicGUI.addFolder(FlatTree.NAME);

        folder
            .add(flatTreeParameters, "iteration", 0, 10)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(flatTreeParameters, "rootThickness", 0.1, 1)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(flatTreeParameters, "rootLength", 1, 10)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(flatTreeParameters, "branchThicknessScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(flatTreeParameters, "branchLengthScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(flatTreeParameters, "branchAngle", 0, Math.PI)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .addColor(flatTreeParameters, "branchRadioSegments", 0, 30)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(flatTreeParameters, "branchHeightSegments", 1, 30)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder.add(flatTreeParameters, "branchOpenEnded").onChange(() => {
            dynamicGUI.updateObject();
        });
        folder
            .add(flatTreeParameters, "branchThetaStart", 0, Math.PI * 2)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(flatTreeParameters, "branchThetaLength", 0, Math.PI * 2)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder.addColor(flatTreeParameters, "branchColor").onChange(() => {
            dynamicGUI.updateObject();
        });
    }
}
