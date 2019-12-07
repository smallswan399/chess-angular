import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReduxContextService } from './redux-context.service';
import { Chess, IChess } from '../../entities/chess';
import * as _ from 'lodash';

@Injectable()
export class ChessReduxStoreService {

    constructor(private reduxContext: ReduxContextService) { }


    getChesses(): Observable<IChess[]> {
        return this.reduxContext.Chesses.map(s => _.values(s));
    }

    getChessById(id: number): Observable<IChess>{
        return this.reduxContext.Chesses.map(s => s[id]);
    }
}
