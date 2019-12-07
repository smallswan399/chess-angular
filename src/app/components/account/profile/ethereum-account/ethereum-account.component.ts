import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../services/account.service';
import { BaseAComponent } from '../../../base/baseA.component';
import { UserReduxStoreService } from '../../../../services/redux-store-services/user-redux-store.service';
import { normalizeUser } from '../../../../services/redux-store-services/schema';
import { SavarActions } from '../../../../app.actions';
import { ReduxTable, identity } from '../../../../app.store';
import { User } from '../../../../entities/user';

@Component({
    selector: 'app-ethereum-account',
    templateUrl: './ethereum-account.component.html',
    styleUrls: ['./ethereum-account.component.css']
})
export class EthereumAccountComponent extends BaseAComponent implements OnInit {

    user: User = new User();
    constructor(private accountSerivce: AccountService,
        private userReduxStoreSerivce: UserReduxStoreService,
        private savarActions: SavarActions) {
        super();
    }

    ngOnInit() {
        this.Identity$.take(1).subscribe(i => {
            if (i.isAuthenticated === true) {
                this.userReduxStoreSerivce.getUserById(i.id).takeUntil(this.UnSub).subscribe(s => {
                    this.user = s;
                });
                this.accountSerivce.getSensitiveUserInfo().take(1).subscribe(s => {
                    const data = normalizeUser(s);
                    const users = data.entities.users;
                    if (users) {
                        this.savarActions.updateSensitiveUserInfo(new ReduxTable<string>({
                            ids: Object.keys(users),
                            list: users
                        }));
                    }
                });
            }
        });
    }

    updateAddress() {
        this.accountSerivce.updateEthereumAccountAddress(new User({
            ...this.user
        })).take(1).subscribe(s => {
            const data = normalizeUser(s);
            const users = data.entities.users;
            if (users) {
                this.savarActions.updateSensitiveUserInfo(new ReduxTable<string>({
                    ids: Object.keys(users),
                    list: users
                }));
            }
        });
    }

}
