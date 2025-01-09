import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import { AntlerCoral } from "../objects";

export default class AntlerCoralParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     *
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const antlerCoarlParameters = AntlerCoral.getParams();
        const folder = dynamicGUI.addFolder(AntlerCoral.NAME);

        folder
            .add(antlerCoarlParameters, "radius", 10, 50)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(antlerCoarlParameters, "numAttractors", 1, 5000)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder.add(antlerCoarlParameters, "seed").name("Random Seed").listen();
        folder
            .add(
                {
                    regenerate: () => {
                        antlerCoarlParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        dynamicGUI.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
        folder.add(antlerCoarlParameters, "maxIteration");
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
            .add(antlerCoarlParameters, "influenceDistance", 1, 30)
            .step(1);
        attractorSetting
            .add(antlerCoarlParameters, "killDistance", 1, 30)
            .step(1);

        const nodeSetting = dynamicGUI.addFolder("Node Setting");
        nodeSetting
            .add(antlerCoarlParameters, "segmentLength", 1, 30)
            .step(0.1);
        nodeSetting
            .add(antlerCoarlParameters, "basicThickness", 0.1, 30)
            .step(0.1);
        nodeSetting
            .add(antlerCoarlParameters, "canalizeThickness", 0, 2)
            .step(0.01);
        nodeSetting
            .add(antlerCoarlParameters, "maxThickness", 0.1, 30)
            .step(0.1);

        nodeSetting.addColor(antlerCoarlParameters, "color");
    }
}
