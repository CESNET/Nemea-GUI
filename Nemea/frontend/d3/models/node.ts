

export class Node implements d3.SimulationNodeDatum {
    index?: number;

    // d3.js simulation values
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;

    // Static module data (change only once)
    id: string; //internal ID
    name: string; // Module name, displayed in graph
    path: string; // Path to module executable
    inputs: number; // Module input count
    outputs: number; // Module output count


    // Variable module data (change on each refresh)
    cpu?: number; // CPU usage in percents
    ram?: number; // RAM usage in MB
    running?: boolean = true; // Is the module running or not



    constructor(id, name, path, inputs, outputs) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.inputs = inputs;
        this.outputs = outputs;
    }
}