import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import { BranchCoral } from "../objects/";

export default class BranchCoralParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     *
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const branchCoralParameters = BranchCoral.getParams();
        const folder = dynamicGUI.addFolder(BranchCoral.NAME);

        folder
            .add(branchCoralParameters, "iteration", 0, 8)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder.add(branchCoralParameters, "seed").name("Random Seed").listen();
        folder
            .add(
                {
                    regenerate: () => {
                        branchCoralParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        dynamicGUI.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");

        const centerSetting = dynamicGUI.addFolder("Center Orientation");
        centerSetting
            .add(branchCoralParameters, "centerOriented")
            .name("Center Oriented")
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        centerSetting
            .add(branchCoralParameters, "centerDegree", 0, 1)
            .step(0.01)
            .name("Center Degree")
            .onChange(() => {
                dynamicGUI.updateObject();
            });

        const branchSetting = dynamicGUI.addFolder("Branch Setting");
        branchSetting
            .add(branchCoralParameters, "rootThickness", 0.1, 1)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        branchSetting
            .add(branchCoralParameters, "rootLength", 1, 10)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        branchSetting
            .add(branchCoralParameters, "branchThicknessScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        branchSetting
            .add(branchCoralParameters, "branchLengthScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        branchSetting
            .add(branchCoralParameters, "branchMaxAngle", 0, Math.PI)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        branchSetting
            .addColor(branchCoralParameters, "branchColor")
            .onChange(() => {
                dynamicGUI.updateObject();
            });
    }
}
