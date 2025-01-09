import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import { EnchinogorgiaCoral } from "../objects/";

export default class EnchinogorgiaCoralParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     *
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const enchinogorgiaCoralParameters = EnchinogorgiaCoral.getParams();
        const folder = dynamicGUI.addFolder(EnchinogorgiaCoral.NAME);

        folder
            .add(enchinogorgiaCoralParameters, "radius", 10, 50)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(enchinogorgiaCoralParameters, "numAttractors", 1, 5000)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(enchinogorgiaCoralParameters, "seed")
            .name("Random Seed")
            .listen();
        folder
            .add(
                {
                    regenerate: () => {
                        enchinogorgiaCoralParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        dynamicGUI.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
        folder.add(enchinogorgiaCoralParameters, "maxIteration");
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
            .add(enchinogorgiaCoralParameters, "influenceDistance", 1, 30)
            .step(1);
        attractorSetting
            .add(enchinogorgiaCoralParameters, "killDistance", 1, 30)
            .step(1);

        const nodeSetting = dynamicGUI.addFolder("Node Setting");
        nodeSetting
            .add(enchinogorgiaCoralParameters, "segmentLength", 1, 30)
            .step(0.1);
        nodeSetting
            .add(enchinogorgiaCoralParameters, "basicThickness", 0.1, 30)
            .step(0.1);
        nodeSetting
            .add(enchinogorgiaCoralParameters, "canalizeThickness", 0, 2)
            .step(0.01);
        nodeSetting
            .add(enchinogorgiaCoralParameters, "maxThickness", 0.1, 30)
            .step(0.1);

        nodeSetting.addColor(enchinogorgiaCoralParameters, "color");
    }
}
