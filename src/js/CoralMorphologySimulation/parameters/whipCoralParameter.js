import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import { WhipCoral } from "../objects";

export default class WhipCoralParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     *
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const whipCoralParameters = WhipCoral.getParams();
        const folder = dynamicGUI.addFolder(WhipCoral.NAME);

        folder
            .add(whipCoralParameters, "iteration", 0, 8)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder.add(whipCoralParameters, "seed").name("Random Seed").listen();
        folder
            .add(
                {
                    regenerate: () => {
                        whipCoralParameters.seed = Math.floor(
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
            .add(whipCoralParameters, "centerOriented")
            .name("Center Oriented")
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        centerSetting
            .add(whipCoralParameters, "centerDegree", 0, 1)
            .step(0.01)
            .name("Center Degree")
            .onChange(() => {
                dynamicGUI.updateObject();
            });

        const branchSetting = dynamicGUI.addFolder("Branch Setting");
        branchSetting
            .add(whipCoralParameters, "rootThickness", 4, 30)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        branchSetting
            .add(whipCoralParameters, "rootLength", 1, 10)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        branchSetting
            .add(whipCoralParameters, "branchThicknessScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        branchSetting
            .add(whipCoralParameters, "branchLengthScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        branchSetting
            .add(whipCoralParameters, "branchMaxAngle", 0, Math.PI)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
    }
}
