import { Timing, Color } from './enums';

export class ChessInit {
    constructor(parameters?: Partial<ChessInit>) {
        Object.assign(this, parameters);
    }
    timing: Timing;
    threeSecondAllegro: boolean;
    color: Color;
    ratedGame: boolean;
    title: string;
    isSpecial: boolean;
}
