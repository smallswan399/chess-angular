import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[custom-scroll-bar]'
})
export class CustomScrollBarDirective {

    constructor(private elementRef: ElementRef) {
    }
    @Output('onTotalScrollBack') onTotalScrollBack: EventEmitter<any> = new EventEmitter();

    ngOnInit(): void {
        $(this.elementRef.nativeElement).mCustomScrollbar({
            theme: "minimal-dark",
            callbacks: {
                onTotalScrollBack: () => {
                    this.onTotalScrollBack.emit();
                }
            }
        });

    }
    scrollToBottom(){
        $(this.elementRef.nativeElement).mCustomScrollbar('scrollTo','bottom');
    }

}
