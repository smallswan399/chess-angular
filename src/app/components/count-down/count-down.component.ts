import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import * as moment from "moment";

@Component({
    selector: '[count-down]',
    templateUrl: 'count-down.component.html'
})


export class CountDownComponent {
    @Input() units: any;
    @Input() end: any;

    private _duration: string;
    public get duration(): string {
        return this._duration;
    }
    @Input('duration')
    public set duration(v: string) {
        this._duration = v;
        this.root = new Date();
        this.durationAsMilliSecondes = moment.duration(this.duration).asMilliseconds();
    }
    displayString: string = '';
    @Input() text: any;
    @Output() reached: EventEmitter<Date> = new EventEmitter();
    root: Date = new Date();
    intervalId: any;
    private wasReached = false;
    durationAsMilliSecondes: number;
    @Input() runAtStart: boolean;
    constructor() {
    }

    ngOnInit() {
        this.displayString = this.duration;
        if (this.runAtStart === true) {
            this.start();
        }
    }

    stop(){
        if (this.intervalId) {
            clearInterval(this.intervalId);   
        }
    }
    start(){
        this.intervalId = setInterval(() => this._displayString(), 1000);
    }
    _displayString() {

        if (typeof this.units === 'string') {
            this.units = this.units.split('|');
        }

        var now: Date = new Date();

        var delta: any = +now - (+this.root);
        let timeLeft = (this.durationAsMilliSecondes - delta);
        if (timeLeft < 100 && !this.wasReached) {
            this.wasReached = true;
            this.reached.next(now);
        }

        var lastUnit = this.units[this.units.length - 1];
        let unitConstantForMillisecs = {
            weeks: (1000 * 60 * 60 * 24 * 7),
            days: (1000 * 60 * 60 * 24),
            hours: (1000 * 60 * 60),
            minutes: (1000 * 60),
            seconds: 1000,
            milliseconds: 1
        };
        let unitsLeft = {};
        let returnString = '';
        let totalMillisecsLeft = timeLeft;
        // let i;
        let unit: any;
        for (let i in this.units) {
            if (this.units.hasOwnProperty(i)) {

                unit = this.units[i].trim();
                if (unitConstantForMillisecs[unit.toLowerCase()] === false) {
                    //$interval.cancel(countDownInterval);
                    throw new Error('Cannot repeat unit: ' + unit);

                }
                if (unitConstantForMillisecs.hasOwnProperty(unit.toLowerCase()) === false) {
                    throw new Error('Unit: ' + unit + ' is not supported. Please use following units: weeks, days, hours, minutes, seconds, milliseconds');
                }

                unitsLeft[unit] = totalMillisecsLeft / unitConstantForMillisecs[unit.toLowerCase()];

                if (lastUnit === unit) {
                    unitsLeft[unit] = Math.ceil(unitsLeft[unit]);
                } else {
                    unitsLeft[unit] = Math.floor(unitsLeft[unit]);
                }
                totalMillisecsLeft -= unitsLeft[unit] * unitConstantForMillisecs[unit.toLowerCase()];
                unitConstantForMillisecs[unit.toLowerCase()] = false;


                returnString += ' ' + (unitsLeft[unit] as number < 10 ? '0' + unitsLeft[unit] as string : unitsLeft[unit] as string) + ' ' + unit;
            }
        }

        if (this.text === null || !this.text) {
            this.text = {
                "Weeks": "Tuần",
                "Days": "Ngày",
                "Hours": "Giờ",
                "Minutes": "Phút",
                "Seconds": "Giây",
                "MilliSeconds": "Mili giây"
            };
        }


        this.displayString = returnString
            .replace("Weeks", this.text.Weeks)
            .replace('Days', this.text.Days)
            .replace('Hours', this.text.Hours)
            .replace('Minutes', this.text.Minutes)
            .replace('Seconds', this.text.Seconds)
            .replace("Milliseconds", this.text.MilliSeconds).trim();

        // So confuse, dont know why have to notify changes here
        // this.cdr.detectChanges();
    }
}