import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import { StaghornCoral } from "../objects/";

export default class StaghornCoralParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     *
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const staghornCoralParameters = StaghornCoral.getParams();
        const folder = dynamicGUI.addFolder(StaghornCoral.NAME);

        folder
            .add(staghornCoralParameters, "radius", 10, 50)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(staghornCoralParameters, "numAttractors", 1, 5000)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(staghornCoralParameters, "seed")
            .name("Random Seed")
            .listen();
        folder
            .add(
                {
                    regenerate: () => {
                        staghornCoralParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        dynamicGUI.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
        folder.add(staghornCoralParameters, "maxIteration");
        folder
            .add(
                {
                    startRender: async () => {
                        dynamicGUI.disable();
                        dynamicGUI.updateObject();
                        await dynamicGUI.objectGenerator.startRender();
                        dynamicGUI.enable();
                    },
                },
                "startRender"
            )
            .name("Render");

        const attractorSetting = dynamicGUI.addFolder("Attractor Setting");
        attractorSetting
            .add(staghornCoralParameters, "influenceDistance", 1, 30)
            .step(1);
        attractorSetting
            .add(staghornCoralParameters, "killDistance", 1, 30)
            .step(1);

        const nodeSetting = dynamicGUI.addFolder("Node Setting");
        nodeSetting
            .add(staghornCoralParameters, "segmentLength", 1, 30)
            .step(0.1);
        nodeSetting
            .add(staghornCoralParameters, "basicThickness", 0.1, 30)
            .step(0.1);
        nodeSetting
            .add(staghornCoralParameters, "canalizeThickness", 0, 2)
            .step(0.01);
        nodeSetting
            .add(staghornCoralParameters, "maxThickness", 0.1, 30)
            .step(0.1);

        nodeSetting.addColor(staghornCoralParameters, "color");
    }
}
