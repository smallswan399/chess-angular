import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../../entities/user';
import { ReduxContextService } from './redux-context.service';
import * as _ from 'lodash';

@Injectable()
export class UserReduxStoreService {

    constructor(private reduxContext: ReduxContextService) { }


    getUsers(): Observable<User[]> {
        return this.reduxContext.Users.map(s => _.values(s).map(u => new User(u)));
    }

    getUserById(id: number): Observable<User> {
        return this.reduxContext.Users.map(s => new User(s[id]));
    }
}
