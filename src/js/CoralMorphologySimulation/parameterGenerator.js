import { CurvePath } from "three";
import DynamicGUI from "./dynamicGUI";
import {
    Cube,
    Cylinder,
    Curve,
    AttractorTest,
    ObstacleTest,
    LSystemTree,
    FlatTree,
    BranchCoral,
    WhipCoral,
    AntipathesCoral,
    StaghornCoral,
    EnchinogorgiaCoral,
    PreciousCoral,
    AntlerCoral,
} from "./objects";
import {
    CubeParameter,
    CylinderParameter,
    CurveParameter,
    AttractorTestParameter,
    ObstacleTestParameter,
    LSystemTreeParameter,
    FlatTreeParameter,
    BranchCoralParameter,
    WhipCoralParameter,
    AntipathesCoralParameter,
    StaghornCoralParameter,
    EnchinogorgiaCoralParameter,
    PreciousCoralParameter,
    AntlerCoralParameter,
} from "./parameters";

export default class ParameterGenerator {
    /**
     *
     * @param {DynamicGUI} dynamicGUI
     */
    constructor(dynamicGUI) {
        this.dynamicGUI = dynamicGUI;
    }

    updateParameters(objectName) {
        switch (objectName) {
            case Cube.NAME:
                new CubeParameter().genParameters(this.dynamicGUI);
                break;
            case Cylinder.NAME:
                new CylinderParameter().genParameters(this.dynamicGUI);
                break;
            case Curve.NAME:
                new CurveParameter().genParameters(this.dynamicGUI);
                break;
            case AttractorTest.NAME:
                new AttractorTestParameter().genParameters(this.dynamicGUI);
                break;
            case ObstacleTest.NAME:
                new ObstacleTestParameter().genParameters(this.dynamicGUI);
                break;
            case LSystemTree.NAME:
                new LSystemTreeParameter().genParameters(this.dynamicGUI);
                break;
            case FlatTree.NAME:
                new FlatTreeParameter().genParameters(this.dynamicGUI);
                break;
            case BranchCoral.NAME:
                new BranchCoralParameter().genParameters(this.dynamicGUI);
                break;
            case WhipCoral.NAME:
                new WhipCoralParameter().genParameters(this.dynamicGUI);
                break;
            case AntipathesCoral.NAME:
                new AntipathesCoralParameter().genParameters(this.dynamicGUI);
                break;
            case StaghornCoral.NAME:
                new StaghornCoralParameter().genParameters(this.dynamicGUI);
                break;
            case EnchinogorgiaCoral.NAME:
                new EnchinogorgiaCoralParameter().genParameters(
                    this.dynamicGUI
                );
                break;
            case PreciousCoral.NAME:
                new PreciousCoralParameter().genParameters(this.dynamicGUI);
                break;
            case AntlerCoral.NAME:
                new AntlerCoralParameter().genParameters(this.dynamicGUI);
                break;
            default:
                throw new Error("Invalid object name");
                break;
        }
    }
}
