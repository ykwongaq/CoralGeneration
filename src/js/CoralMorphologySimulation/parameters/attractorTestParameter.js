import DynamicGUI from "../dynamicGUI";
import Parameter from "./parameter";
import { AttractorTest } from "../objects";

export default class AttractorTestParameter extends Parameter {
    constructor() {
        super();
    }

    /**
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        const attractorTestParameters = AttractorTest.getParams();
        const folder = dynamicGUI.addFolder(AttractorTest.NAME);

        folder
            .add(attractorTestParameters, "radius", 5, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(attractorTestParameters, "numPoints", 500, 5000)
            .step(100)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(attractorTestParameters, "influenceDistance", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
        folder
            .add(attractorTestParameters, "killDistance", 1, 30)
            .step(1)
            .onChange(() => {
                dynamicGUI.updateObject();
            });
    }
}
