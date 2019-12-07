import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Identity } from '../../entities/identity';
import { Subject } from 'rxjs/Subject';
import { IdentityReduxStoreService } from '../../services/identity-redux-store.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit, OnDestroy {
    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.UnSub.next();
        this.UnSub.complete();
    }

    Identity$: Observable<Identity>;

    UnSub: Subject<void> = new Subject<void>();
    
    constructor(protected IdentityReduxStoreService: IdentityReduxStoreService) {
        this.Identity$ = this.IdentityReduxStoreService.Identity$;
    }
}
