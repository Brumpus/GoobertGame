export enum Directions {
    up, right, down, left
}
export default class Pipe {
    pipeType: string;
    initRotation: number;
    isBlue: boolean;
    startblue: boolean | undefined
    

    constructor(pipeType: string, initRotation: number, startBlue?: boolean) {
        this.pipeType = pipeType;
        this.initRotation = initRotation;
        this.isBlue = startBlue ?? false;
        this.startblue = startBlue;
    }
    
}