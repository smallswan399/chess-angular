import { Injectable } from '@angular/core';
import { ReduxContextService } from './redux-context.service';
import { IChess } from '../../entities/chess';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { IMessage } from '../../entities/message';

@Injectable()
export class MessageReduxStoreService {
    constructor(private reduxContext: ReduxContextService) { }


    getMessages(): Observable<IMessage[]> {
        return this.reduxContext.Messages.map(s => _.values(s));
    }

    getMessageById(id: number): Observable<IMessage>{
        return this.reduxContext.Messages.map(s => s[id]);
    }

    getMessagesByChessId(id: number): Observable<IMessage[]>{
        return this.getMessages().map(s => s.filter(t => t.chessId === id));
    }
}
