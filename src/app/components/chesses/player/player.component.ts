import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { IdentityReduxStoreService } from '../../../services/identity-redux-store.service';
import { UserReduxStoreService } from '../../../services/redux-store-services/user-redux-store.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../entities/user';
import { BaseAComponent } from '../../base/baseA.component';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent extends BaseAComponent implements OnInit {
    @Input() userId: number;
    user$: Observable<User>;
    constructor(private userReduxStoreService: UserReduxStoreService) {
        super();

    }

    ngOnInit() {
        this.user$ = this.userReduxStoreService.getUserById(this.userId);
    }

}
