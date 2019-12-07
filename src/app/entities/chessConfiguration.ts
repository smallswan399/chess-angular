import { Timing } from './enums';

export class ChessConfiguration {
    constructor(parameters?: Partial<ChessConfiguration>) {
        Object.assign(this, parameters);
    }

    timing?: Timing;
    threeSecondAllegro?: boolean;
    ratedGame?: boolean;
}
