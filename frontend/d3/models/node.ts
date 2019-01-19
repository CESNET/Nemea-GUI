

export class Node implements d3.SimulationNodeDatum {
    index?: number;

    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;

    id: string;
    name: string;
    path: string;
    cpu: number;
    ram: number;

    constructor(id, name, path) {
        this.id = id;
        this.name = name;
        this.path = path;
    }
}