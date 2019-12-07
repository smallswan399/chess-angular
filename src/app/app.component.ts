import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from './components/base/base.component';
import { IdentityReduxStoreService } from './services/identity-redux-store.service';
import { SignalrConnectionService } from './services/signalr-connection.service';
import { ConnectionService } from './services/connection.service';
import { Router, NavigationEnd } from '@angular/router';
import { BaseAComponent } from './components/base/baseA.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseAComponent implements OnInit, OnDestroy {
    constructor(private signalrConnectionSerivce: SignalrConnectionService,
        private router: Router,
        private signalrConnectionService: SignalrConnectionService,
        private connectionService: ConnectionService) {
        super();

    }
    ngOnDestroy(): void {
        throw new Error("Method not implemented.");
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.signalrConnectionSerivce.start().then(() => {
            let connectionId = this.signalrConnectionSerivce.connection.id;
            this.connectionService.updateUserConnectionMapper(connectionId).take(1).subscribe();
            this.signalrConnectionSerivce.signalRConnectionStateChanged$.takeUntil(this.UnSub).subscribe(s => {
                if (s.newState === SignalR.ConnectionState.Connected) {
                    let connectionId = this.signalrConnectionSerivce.connection.id;
                    this.connectionService.updateUserConnectionMapper(connectionId).take(1).subscribe();
                }
            });
        });
    }
}
