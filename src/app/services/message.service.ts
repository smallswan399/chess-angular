import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IMessage } from '../entities/message';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessageService {
    chessHub: SignalR.Hub.Proxy;
    connection: SignalR.Hub.Connection;
    
    constructor(private http: HttpClient) { }

    private gotNewMessageSource = new Subject<IMessage>();
    gotNewMessage$ = this.gotNewMessageSource.asObservable();
    private gotNewMessage(message: IMessage){
        this.gotNewMessageSource.next(message);
    }

    configHub(connection: SignalR.Hub.Connection) {
        this.connection = connection;
        this.chessHub = this.connection.createHubProxy('ChessHub');
        this.chessHub.on('addMessage', (message) => {
            this.gotNewMessage(message);
        });
    }


    getByChessId(id: number): Observable<IMessage[]> {
        return this.http.get<IMessage[]>('api/messages/getByChessId/' + id);
    }

    create(id: number, content: string): Observable<IMessage>{
        return this.http.post<IMessage>('api/messages/create', {
            chessId: id,
            content: content,
            connectionId: this.connection.id
        });
    }
}
