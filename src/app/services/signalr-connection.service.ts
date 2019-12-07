import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { NgRedux, select } from "@angular-redux/store";
import { IAppState } from '../app.store';
import { Identity } from '../entities/identity';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ChessService } from './chess.service';
import { MessageService } from './message.service';

@Injectable()
export class SignalrConnectionService implements OnDestroy {
	ngOnDestroy(): void {
		this.unSub.next();
		this.unSub.complete();
	}

	private unSub: Subject<void> = new Subject<void>();
	connection: SignalR.Hub.Connection;
	@select((state: IAppState) => state.identity) identity$: Observable<Identity>;


	private signalRConnectionStateChangedSource = new Subject<SignalR.StateChanged>();
	signalRConnectionStateChanged$ = this.signalRConnectionStateChangedSource.asObservable();
	private signalRConnectionStateChanged(state: SignalR.StateChanged) {
		this.signalRConnectionStateChangedSource.next(state);
	}

    constructor(private chessService: ChessService,
        private messageService: MessageService,
		private authService: AuthService) {
		this.connection = $.hubConnection(environment.serviceUrl + "/signalr");
		this.identity$.takeUntil(this.unSub).subscribe(s => {
			if (s.isAuthenticated) {
				this.connection.qs = { 'access_token' : s.getAccessToken() };
			}else{
				this.connection.qs = { 'access_token' : '' };
			}
		});
		this.connection.stateChanged(state => {
			this.signalRConnectionStateChanged(state);
		});
        this.chessService.configHub(this.connection);
        this.messageService.configHub(this.connection);
	}

	start(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.connection.start().done(() => {
				console.log('Successfully open signalr connection ' + this.connection.id);
				console.log('This make call UpdateUserConnectionMapper twice or more. Need to fix this in the future');
				resolve();
			});
		});
	}
}