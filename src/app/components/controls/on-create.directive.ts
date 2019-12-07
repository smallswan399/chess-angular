import { Directive, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[onCreate]'
})
export class OnCreateDirective {
    @Input() data: boolean;
    @Output() onCreateRun: EventEmitter<any> = new EventEmitter<any>();
    constructor() { }
    ngOnInit() {
        if (this.data === true) {
            this.onCreateRun.emit(this.data);   
        }
    }
}
