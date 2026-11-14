export enum Directions {
    up, right, down, left
}
export default class Pipe {
    pipeType: string;
    initRotation: number;
    isBlue: boolean;
    startblue: boolean | undefined
    

    constructor(pipeType: string, startBlue?: boolean) {
        this.pipeType = pipeType;
        this.initRotation = Math.floor(Math.random() * 4);
        this.isBlue = startBlue ?? false;
        this.startblue = startBlue;
    }
    
}