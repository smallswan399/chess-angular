import { Pipe, PipeTransform } from '@angular/core';
import { GameResult } from '../entities/enums';

@Pipe({
    name: 'gameResultEnum'
})
export class GameResultEnumPipe implements PipeTransform {

    transform(value: GameResult, args?: any): any {
        switch (value) {
            case GameResult.Draw:
                return 'Draw';
            case GameResult.WhiteWin:
                return 'White win';
            case GameResult.BlackWin:
                return 'Black win';
            default:
                break;
        }
    }

}
