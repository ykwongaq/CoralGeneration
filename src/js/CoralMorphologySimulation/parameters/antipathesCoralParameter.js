import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import { AntipathesCoral } from "../objects/";

export default class AntipathesCoralParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     *
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const SCACoralParameters = AntipathesCoral.getParams();
        const folder = dynamicGUI.addFolder(AntipathesCoral.NAME);

        folder
            .add(SCACoralParameters, "radius", 10, 50)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(SCACoralParameters, "numAttractors", 1, 5000)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder.add(SCACoralParameters, "seed").name("Random Seed").listen();
        folder
            .add(
                {
                    regenerate: () => {
                        SCACoralParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        dynamicGUI.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
        folder.add(SCACoralParameters, "maxIteration");
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
            .add(SCACoralParameters, "influenceDistance", 1, 30)
            .step(1);
        attractorSetting.add(SCACoralParameters, "killDistance", 1, 30).step(1);

        const nodeSetting = dynamicGUI.addFolder("Node Setting");
        nodeSetting.add(SCACoralParameters, "segmentLength", 1, 30).step(0.1);
        nodeSetting
            .add(SCACoralParameters, "basicThickness", 0.1, 30)
            .step(0.1);
        nodeSetting
            .add(SCACoralParameters, "canalizeThickness", 0, 2)
            .step(0.01);
        nodeSetting.add(SCACoralParameters, "maxThickness", 0.1, 30).step(0.1);

        nodeSetting.addColor(SCACoralParameters, "color");
    }
}
