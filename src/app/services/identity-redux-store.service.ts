import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../app.store';
import { Identity } from '../entities/identity';


@Injectable()
export class IdentityReduxStoreService {

    constructor(private ngRedux: NgRedux<IAppState>) { }

    get Identity$(): Observable<Identity>{
        return this.ngRedux.select((state: IAppState) => state.identity);
    }
}