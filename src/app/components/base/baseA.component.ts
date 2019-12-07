import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Identity } from '../../entities/identity';
import { Subject } from 'rxjs/Subject';
import { IdentityReduxStoreService } from '../../services/identity-redux-store.service';
import { select } from '@angular-redux/store';

@Component({
  selector: 'app-base-a',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseAComponent implements OnInit, OnDestroy {
    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.UnSub.next();
        this.UnSub.complete();
    }

    @select('identity') Identity$: Observable<Identity>;

    UnSub: Subject<void> = new Subject<void>();
}
