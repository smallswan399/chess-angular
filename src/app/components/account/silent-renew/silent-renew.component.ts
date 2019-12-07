import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'silent-renew',
    templateUrl: 'silent-renew.component.html'
})

export class SilentRenewComponent implements OnInit {
    constructor(private authService: AuthService) { }

    ngOnInit() { 
        this.authService.mgr.signinSilentCallback();
    }
}