import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import { LSystemTree } from "../objects";

export default class LSystemTreeParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const lSystemCoralParameters = LSystemTree.getParams();
        const folder = dynamicGUI.addFolder(LSystemTree.NAME);

        folder
            .add(lSystemCoralParameters, "iteration", 0, 10)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(lSystemCoralParameters, "rootThickness", 0.1, 1)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(lSystemCoralParameters, "rootLength", 1, 10)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(lSystemCoralParameters, "branchThicknessScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(lSystemCoralParameters, "branchLengthScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(lSystemCoralParameters, "branchMaxAngle", 0, Math.PI)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder.addColor(lSystemCoralParameters, "branchColor").onChange(() => {
            dynamicGUI.updateObject();
        });
        folder.add(lSystemCoralParameters, "seed").name("Random Seed").listen();
        folder
            .add(
                {
                    regenerate: () => {
                        lSystemCoralParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        dynamicGUI.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
    }
}
