import * as THREE from "three";
import { Segment, SegmentList } from "./objects/branchCoralCurve";

function main() {
    // Assuming THREE.js is loaded
    const p1 = new THREE.Vector3(0, 0, 0);
    const p2 = new THREE.Vector3(1, 0, 0);
    const p3 = new THREE.Vector3(2, 0, 0);
    const p4 = new THREE.Vector3(3, 0, 0);
    const p5 = new THREE.Vector3(4, 0, 0);

    const segment1 = new Segment(p1, p2);
    const segment2 = new Segment(p2, p3);
    const segment3 = new Segment(p3, p4);
    const segment4 = new Segment(p3, p5);

    const segmentList1 = new SegmentList([segment1, segment2]);
    const segmentList2 = new SegmentList([segment1, segment2, segment3]);
    const segmentList3 = new SegmentList([segment1, segment2, segment4]);

    const allSegmentLists = [segmentList1, segmentList2, segmentList3];
    const filteredSegmentLists =
        SegmentList.filterRedundantSegmentLists(allSegmentLists);

    console.log("Filtered Segment Lists:");
    for (const segmentList of filteredSegmentLists) {
        console.log(segmentList.getControlPoints());
    }
}

main();
