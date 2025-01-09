import DynamicGUI from "../dynamicGUI";

export default class Parameter {
    constructor() {}

    /**
     * Update parameter into the GUI
     * @param {DynamicGUI} dynamicGUI
     */
    genParameters(dynamicGUI) {
        throw new Error("genParameters() method must be implemented");
    }
}
