import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import { ObstacleTest } from "../objects";

export default class ObstacleTestParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const obstacleTestParameters = ObstacleTest.getParams();
        const folder = dynamicGUI.addFolder(ObstacleTest.NAME);

        folder
            .add(obstacleTestParameters, "radius", 10, 50)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(obstacleTestParameters, "numAttractors", 1, 5000)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder.add(obstacleTestParameters, "seed").name("Random Seed").listen();
        folder
            .add(
                {
                    regenerate: () => {
                        obstacleTestParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        dynamicGUI.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
        folder.add(obstacleTestParameters, "maxIteration");
        folder
            .add(
                {
                    startRender: async () => {
                        this.disable();
                        dynamicGUI.updateObject();
                        await this.objectGenerator.startRender();
                        this.enable();
                    },
                },
                "startRender"
            )
            .name("Render");

        const attractorSetting = dynamicGUI.addFolder("Attractor Setting");
        attractorSetting
            .add(obstacleTestParameters, "influenceDistance", 1, 30)
            .step(1);
        attractorSetting
            .add(obstacleTestParameters, "killDistance", 1, 30)
            .step(1);

        const nodeSetting = dynamicGUI.addFolder("Node Setting");
        nodeSetting
            .add(obstacleTestParameters, "segmentLength", 1, 30)
            .step(0.1);
        nodeSetting
            .add(obstacleTestParameters, "basicThickness", 0.1, 30)
            .step(0.1);
        nodeSetting
            .add(obstacleTestParameters, "canalizeThickness", 0, 2)
            .step(0.01);
        nodeSetting
            .add(obstacleTestParameters, "maxThickness", 0.1, 30)
            .step(0.1);

        nodeSetting.addColor(obstacleTestParameters, "color");

        const obstacleSetting = dynamicGUI.addFolder("Obstacle Setting");
        obstacleSetting
            .add(obstacleTestParameters, "showObstacle")
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        obstacleSetting
            .add(obstacleTestParameters, "obstacleHeight", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        obstacleSetting
            .add(obstacleTestParameters, "obstacleWidth", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        obstacleSetting
            .add(obstacleTestParameters, "obstacleDepth", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        obstacleSetting
            .add(obstacleTestParameters, "positionX", -30, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        obstacleSetting
            .add(obstacleTestParameters, "positionY", -30, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        obstacleSetting
            .add(obstacleTestParameters, "positionZ", -30, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
    }
}
