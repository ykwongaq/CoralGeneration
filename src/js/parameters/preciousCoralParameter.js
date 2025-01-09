import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import { PreciousCoral } from "../objects/";

export default class PreciousCoralParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     *
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const preciousCoralParameters = PreciousCoral.getParams();
        const folder = dynamicGUI.addFolder(PreciousCoral.NAME);

        folder.add(preciousCoralParameters, "seed").listen();
        folder
            .add(
                {
                    regenerate: () => {
                        preciousCoralParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        dynamicGUI.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
        folder
            .add(
                {
                    startRender: async () => {
                        dynamicGUI.disable();
                        await dynamicGUI.objectGenerator.startRender();
                        dynamicGUI.enable();
                    },
                },
                "startRender"
            )
            .name("Render");
        const stemSettings = dynamicGUI.addFolder("Stem Settings");
        stemSettings
            .add(preciousCoralParameters, "iterations", 1, 10)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        stemSettings
            .add(preciousCoralParameters, "stemLength", 1, 30)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        stemSettings
            .add(preciousCoralParameters, "segmentLength", 0.1, 10)
            .step(0.1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        stemSettings
            .add(preciousCoralParameters, "stemThickness", 1, 10)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        stemSettings
            .add(preciousCoralParameters, "canalizeThickness", 0, 1)
            .step(0.01)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        stemSettings
            .add(preciousCoralParameters, "maxThickness", 10, 40)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        stemSettings
            .add(preciousCoralParameters, "branchAngle", 0, Math.PI)
            .step(0.01)
            .onChange(() => {
                dynamicGUI.updateObject();
            });

        const attractorSettings = dynamicGUI.addFolder("Attractor Settings");
        attractorSettings
            .add(preciousCoralParameters, "height", 0, 10)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        attractorSettings
            .add(preciousCoralParameters, "radius", 0, 50)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        attractorSettings
            .add(preciousCoralParameters, "numAttractors")
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        attractorSettings
            .add(preciousCoralParameters, "influenceDistance", 1, 30)
            .step(1);
        attractorSettings
            .add(preciousCoralParameters, "killDistance", 1, 30)
            .step(1);
    }
}
