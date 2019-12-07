import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chess, IChess } from '../entities/chess';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ChessInit } from '../entities/chess-init';

@Injectable()
export class ChessService {
    chessHub: SignalR.Hub.Proxy;
    connection: SignalR.Hub.Connection;

    constructor(private http: HttpClient) { }

    private gotRequestNewGameAfterFinishSource = new Subject<IChess>();
    gotRequestNewGameAfterFinish$ = this.gotRequestNewGameAfterFinishSource.asObservable();
    gotRequestNewGameAfterFinish(chess: IChess) {
        this.gotRequestNewGameAfterFinishSource.next(chess);
    }

    // tslint:disable-next-line:member-ordering
    private gotRejectNewGameAfterFinishSource = new Subject<IChess>();
    // tslint:disable-next-line:member-ordering
    gotRejectNewGameAfterFinish$ = this.gotRejectNewGameAfterFinishSource.asObservable();
    gotRejectNewGameAfterFinish(chess: IChess) {
        this.gotRejectNewGameAfterFinishSource.next(chess);
    }

    // tslint:disable-next-line:member-ordering
    private gotAcceptDrawSource = new Subject<IChess>();
    // tslint:disable-next-line:member-ordering
    gotAcceptDraw$ = this.gotAcceptDrawSource.asObservable();
    private gotAcceptDraw(chess: IChess) {
        this.gotAcceptDrawSource.next(chess);
    }

    // tslint:disable-next-line:member-ordering
    private gotRejectDrawSource = new Subject<IChess>();
    // tslint:disable-next-line:member-ordering
    gotRejectDraw$ = this.gotRejectDrawSource.asObservable();
    private gotRejectDraw(chess: IChess) {
        this.gotRejectDrawSource.next(chess);
    }

    // tslint:disable-next-line:member-ordering
    private gotResignSource = new Subject<IChess>();
    // tslint:disable-next-line:member-ordering
    gotResign$ = this.gotResignSource.asObservable();
    private gotResign(chess: IChess) {
        this.gotResignSource.next(chess);
    }

    // tslint:disable-next-line:member-ordering
    private gotOfferDrawSource = new Subject<IChess>();
    // tslint:disable-next-line:member-ordering
    gotOfferDraw$ = this.gotOfferDrawSource.asObservable();
    private gotOfferDraw(chess: IChess) {
        this.gotOfferDrawSource.next(chess);
    }

    // tslint:disable-next-line:member-ordering
    private gotNewMoveSource = new Subject<IChess>();
    // tslint:disable-next-line:member-ordering
    gotNewMove$ = this.gotNewMoveSource.asObservable();
    private gotNewMove(chess: IChess) {
        this.gotNewMoveSource.next(chess);
    }

    // tslint:disable-next-line:member-ordering
    private gotNewJoinSource = new Subject<IChess>();
    // tslint:disable-next-line:member-ordering
    gotNewJoin$ = this.gotNewJoinSource.asObservable();
    private gotNewJoin(chess: IChess) {
        this.gotNewJoinSource.next(chess);
    }

    // tslint:disable-next-line:member-ordering
    private gotReadySource = new Subject<IChess>();
    // tslint:disable-next-line:member-ordering
    gotReady$ = this.gotReadySource.asObservable();
    private gotReady(chess: IChess) {
        this.gotReadySource.next(chess);
    }

    configHub(connection: SignalR.Hub.Connection) {
        console.log('configHub');
        this.connection = connection;
        this.chessHub = this.connection.createHubProxy('ChessHub');
        this.chessHub.on('move', (move) => {
            this.gotNewMove(move);
        });

        this.chessHub.on('requestNewGameAfterFinish', chess => {
            this.gotRequestNewGameAfterFinish(chess);
        });

        this.chessHub.on('rejectNewGameAfterFinish', chess => {
            this.gotRejectNewGameAfterFinish(chess);
        });

        this.chessHub.on('join', join => {
            this.gotNewJoin(join);
        });

        this.chessHub.on('ready', ready => {
            this.gotReady(ready);
        });

        this.chessHub.on('offerDraw', chess => {
            this.gotOfferDraw(chess);
        });

        this.chessHub.on('rejectDraw', chess => {
            this.gotRejectDraw(chess);
        });

        this.chessHub.on('acceptDraw', chess => {
            this.gotAcceptDraw(chess);
        });


        this.chessHub.on('resign', chess => {
            this.gotResign(chess);
        });
    }

    get(): Observable<IChess[]> {
        return this.http.get<IChess[]>('api/chesses');
    }

    getById(id: number): Observable<IChess> {
        return this.http.get<IChess>('api/chesses/' + id);
    }

    join(id: number, connectionId: string): Observable<IChess> {
        return this.http.post<IChess>('api/chesses/join/', {
            chessId: id,
            connectionId: connectionId
        });
    }

    create(init: ChessInit): Observable<number> {
        return this.http.post<number>('api/chesses/create', init);
    }

    move(game: Chess, connectionId: string): Observable<IChess> {
        const vm = {
            ...game,
            connectionId: connectionId
        };
        return this.http.post<IChess>('api/chesses/move', vm);
    }

    ready(chessId: number, connectionId: string): Observable<IChess> {
        return this.http.post<IChess>('api/chesses/ready', {
            chessId: chessId,
            connectionId: connectionId
        });
    }

    resign(chessId: number, connectionId: string): Observable<IChess> {
        return this.http.post<IChess>('api/chesses/resign', {
            chessId: chessId,
            connectionId: connectionId
        });
    }

    offerDraw(chessId: number, connectionId: string): Observable<IChess> {
        return this.http.post<IChess>('api/chesses/offerdraw', {
            chessId: chessId,
            connectionId: connectionId
        });
    }

    rejectDraw(chessId: number, connectionId: string): Observable<IChess> {
        return this.http.post<IChess>('api/chesses/rejectdraw', {
            chessId: chessId,
            connectionId: connectionId
        });
    }

    acceptDraw(chessId: number, connectionId: string): Observable<IChess> {
        return this.http.post<IChess>('api/chesses/acceptdraw', {
            chessId: chessId,
            connectionId: connectionId
        });
    }
    requestNewGameAfterFinish(chessId: number, connectionId: string): Observable<IChess> {
        return this.http.post<IChess>('api/chesses/requestnewgameafterfinish', {
            chessId: chessId,
            connectionId: connectionId
        });
    }

    rejectNewGameAfterFinish(chessId: number, connectionId: string): Observable<IChess> {
        return this.http.post<IChess>('api/chesses/RejectNewGameAfterFinish', {
            chessId: chessId,
            connectionId: connectionId
        });
    }
}
