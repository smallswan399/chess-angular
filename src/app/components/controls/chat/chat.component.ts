import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { BaseAComponent } from '../../base/baseA.component';
import { MessageService } from '../../../services/message.service';
import { MessageReduxStoreService } from '../../../services/redux-store-services/message-redux-store.service';
import { MessageCreate } from './message-create';
import { SignalrConnectionService } from '../../../services/signalr-connection.service';
import { Observable } from 'rxjs/Observable';
import { IMessage } from '../../../entities/message';
import { SavarActions } from '../../../app.actions';
import { normalizeMessages, normalizeMessage } from '../../../services/redux-store-services/schema';
import { ReduxTable, messages } from '../../../app.store';
import { CustomScrollBarDirective } from '../custom-scroll-bar.directive';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent extends BaseAComponent implements OnInit {
    @ViewChild(CustomScrollBarDirective) customScrollBar: CustomScrollBarDirective;
    @Input() chessId: number;
    isReadyToChat: boolean;
    messages: IMessage[] = [];
    messageCreate: MessageCreate = new MessageCreate({ content: '' });
    constructor(private messageService: MessageService,
        private savarActions: SavarActions,
        private signalrConnectionService: SignalrConnectionService,
        private messageReduxStoreService: MessageReduxStoreService) {
        super();
    }

    ngOnInit() {
        this.messageService.gotNewMessage$.takeUntil(this.UnSub).subscribe(m => {
            this.handleDataFromRemote([m]);
        });
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (simpleChanges['chessId'] && this.chessId) {
            this.messageReduxStoreService.getMessagesByChessId(this.chessId)
                .takeUntil(this.UnSub)
                .subscribe(s => { 
                    this.messages = s;
                });
            this.messageService.getByChessId(this.chessId).take(1).subscribe(messages => {

                this.handleDataFromRemote(messages);
                this.isReadyToChat = this.signalrConnectionService.connection.state === SignalR.ConnectionState.Connected;
                this.signalrConnectionService.signalRConnectionStateChanged$.takeUntil(this.UnSub).subscribe(s => {
                    this.isReadyToChat = this.signalrConnectionService.connection.state === SignalR.ConnectionState.Connected;
                });
            });
        }
    }
    postMessage() {
        if (this.messageCreate.content) {
            this.messageService.create(this.chessId, this.messageCreate.content).take(1).subscribe(s => {
                this.handleDataFromRemote([s]);
                this.messageCreate.content = '';
            });
        }
    }

    onTotalScrollBack() {}

    isLastItemHandler() {
		this.customScrollBar.scrollToBottom();
	}

    private handleDataFromRemote(m: IMessage[]) {
        var data = normalizeMessages(m);
        let messages = data.entities.messages;
        let users = data.entities.users;
        let chesses = data.entities.chesses;

        if (messages) {
            this.savarActions.addMessages(new ReduxTable<number>({
                ids: Object.keys(messages).map(s => +s),
                list: messages
            }));
        }
        if (users) {
            this.savarActions.addUsers(new ReduxTable<string>({
                ids: Object.keys(users),
                list: users
            }));
        }
        if (chesses) {
            this.savarActions.addChesses(new ReduxTable<number>({
                ids: Object.keys(chesses).map(s => +s),
                list: chesses
            }));
        }
    }
}