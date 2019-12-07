import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../../../entities/message';
import { BaseAComponent } from '../../../base/baseA.component';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../../entities/user';
import { UserReduxStoreService } from '../../../../services/redux-store-services/user-redux-store.service';

@Component({
    selector: 'app-chat-list-item',
    templateUrl: './chat-list-item.component.html',
    styleUrls: ['./chat-list-item.component.css']
})
export class ChatListItemComponent extends BaseAComponent implements OnInit {
    @Input() message: Message;
    sender$: Observable<User>;
    isSender: boolean;
    constructor(private userReduxStoreService: UserReduxStoreService) {
        super();

    }

    ngOnInit() {
        this.sender$ = this.userReduxStoreService.getUserById(this.message.userId);
        Observable.combineLatest(this.Identity$, this.sender$, (identity, sender) => {
            this.isSender = identity.id === sender.id;
        }).takeUntil(this.UnSub).subscribe();
    }

}
