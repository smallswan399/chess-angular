import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../app.store';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/add/observable/combineLatest';

@Injectable()
export class ReduxContextService {

    constructor(private ngRedux: NgRedux<IAppState>) { }

    private RawUsers$: Observable<any> = this.ngRedux.select((state: IAppState) => state.entities.users.list);
    private RawChesses$: Observable<any> = this.ngRedux.select((state: IAppState) => state.entities.chesses.list);


    get Users(): Observable<any> {
        return this.RawUsers$;
    }


    get Chesses(): Observable<any> {
        return this.RawChesses$;
    }

    get Messages(): Observable<any> {
        return this.ngRedux.select((state: IAppState) => state.entities.messages.list);
    }
}
