// Import the kdTree class
import { kdTree } from "kd-tree-javascript";

class Point {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }
}
// Example dataset: an array of points in 2D space
const points = [
    { x: 2, y: 3, point: new Point("A") },
    { x: 5, y: 4, point: new Point("B") },
    { x: 9, y: 6, point: new Point("C") },
    { x: 4, y: 7, point: new Point("D") },
    { x: 8, y: 1, point: new Point("E") },
    { x: 7, y: 2, point: new Point("F") },
];

// Create a distance function for 2D points
// This calculates the Euclidean distance between two points
function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

// Define the dimensions for the kdTree (keys of the points)
const dimensions = ["x", "y"];

// Create the kdTree instance
const tree = new kdTree(points, distance, dimensions);

// Query: Find the nearest neighbor to the point { x: 5, y: 5 }
const nearest = tree.nearest({ x: 5, y: 5 }, 1); // Find 1 nearest neighbor

console.log("Nearest neighbor:", nearest);

// Query: Find the 3 nearest neighbors to the point { x: 5, y: 5 }
const threeNearest = tree.nearest({ x: 5, y: 5 }, 3); // Find 3 nearest neighbors

console.log("Three nearest neighbors:", threeNearest);
