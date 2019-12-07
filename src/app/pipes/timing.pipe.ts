import { Pipe, PipeTransform } from '@angular/core';
import { Timing } from '../entities/enums';

@Pipe({
    name: 'timing'
})
export class TimingPipe implements PipeTransform {

    transform(value: Timing, args?: any): string {
        switch (value) {
            case Timing.Game5Minutes:
                return '5 minutes';
            case Timing.Game10Minutes:
                return '10 minutes';
            case Timing.Game15Minutes:
                return '15 minutes';
            default:
                break;
        }
    }

}
