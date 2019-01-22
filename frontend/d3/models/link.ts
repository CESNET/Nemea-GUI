import { Node } from './';

export class Link implements d3.SimulationLinkDatum<Node>
{
    index?: number;
    messagesPerSecond: number;

    source: Node | string | number;
    target: Node | string | number;
    sourceOutput: number;
    targetInput: number;

    constructor(source, target, sourceOutput, targetInput) {
        this.source = source;
        this.target = target;
        this.messagesPerSecond = 0;
        this.sourceOutput = sourceOutput;
        this.targetInput = targetInput;
    }
}