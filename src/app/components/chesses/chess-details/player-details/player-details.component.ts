import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';
import { IdentityReduxStoreService } from '../../../../services/identity-redux-store.service';
import { User } from '../../../../entities/user';
import { TurnMove, Color } from '../../../../entities/enums';
import { Chess } from '../../../../entities/chess';
import { ChessService } from '../../../../services/chess.service';
import { SignalrConnectionService } from '../../../../services/signalr-connection.service';
import { Observable } from 'rxjs/Observable';
import { UserReduxStoreService } from '../../../../services/redux-store-services/user-redux-store.service';
import { ChessReduxStoreService } from '../../../../services/redux-store-services/chess-redux-store.service';
// import { CountDownComponent } from '../../../count-down/count-down.component';
import * as moment from 'moment';
import { CountdownComponent, Config } from 'ngx-countdown';
import { BaseAComponent } from '../../../base/baseA.component';

@Component({
    selector: 'app-player-details',
    templateUrl: './player-details.component.html',
    styleUrls: ['./player-details.component.css']
})
export class PlayerDetailsComponent extends BaseAComponent implements OnInit {
    TurnMove: any = TurnMove;
    Color: any = Color;
    // @Input() userId: string;
    @Input() color: Color;
    @Input() chessId: number;
    timeLeft?: string;

    user$: Observable<User>;

    bothPlayerAlready: boolean;
    isMyTurn: boolean;

    countDownConfig: Config;
    @ViewChild(CountdownComponent) counter: CountdownComponent;
    constructor(private chessReduxStoreService: ChessReduxStoreService,
        private userReduxStoreService: UserReduxStoreService,
        private chessService: ChessService,
        private signalrConnectionSerivce: SignalrConnectionService) {
        super();
    }

    ngOnInit() {
        this.chessReduxStoreService.getChessById(this.chessId).takeUntil(this.UnSub).subscribe(aa => {
            const chess = new Chess({...aa});
            this.bothPlayerAlready = chess.whitePlayerReady === true && chess.blackPlayerReady === true;
            this.isMyTurn = (this.color === Color.White && chess.turnMove === TurnMove.WhiteMove && this.bothPlayerAlready === true) ||
                (this.color === Color.Black && chess.turnMove === TurnMove.BlackMove && this.bothPlayerAlready === true);
            this.isMyTurn = this.isMyTurn === true && chess.finished === false;

            if (this.color === Color.Black) {
                this.timeLeft = chess.blackPlayerTimeLeft;
                this.user$ = this.userReduxStoreService.getUserById(chess.blackPlayerId);
            } else {
                this.timeLeft = chess.whitePlayerTimeLeft;
                this.user$ = this.userReduxStoreService.getUserById(chess.whitePlayerId);
            }
            let demand = false;
            if (this.color === Color.Black) {
                demand = chess.blackStopwatchPause;
            } else {
                demand = chess.whiteStopwatchPause;
            }
            this.countDownConfig = {
                leftTime: moment.duration(this.timeLeft).asSeconds(),
                demand: demand
            };
        });

    }
}
