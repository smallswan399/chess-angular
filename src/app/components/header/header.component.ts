import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IdentityReduxStoreService } from '../../services/identity-redux-store.service';
import { Identity } from '../../entities/identity';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';
import { SignalrConnectionService } from '../../services/signalr-connection.service';
import { BaseAComponent } from '../base/baseA.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseAComponent implements OnInit, OnDestroy {
    connection: SignalR.Hub.Connection;
    constructor(private authService: AuthService,
        private signalrConnectionService: SignalrConnectionService,
        private router: Router) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.connection = this.signalrConnectionService.connection;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    login() {
        this.authService.beginLogin();
    }

    async logOut() {
        const result = await this.authService.signOut();
        this.router.navigateByUrl('/');
    }
}
