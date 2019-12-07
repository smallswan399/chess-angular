import { Component, OnInit } from '@angular/core';
import { Chess, IChess } from '../../entities/chess';
import { WindowRef } from '../../services/window-ref.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ChessService } from '../../services/chess.service';
import { ChessInit } from '../../entities/chess-init';
import { Color, Timing } from '../../entities/enums';
import { normalizeChesses } from '../../services/redux-store-services/schema';
import { ReduxTable } from '../../app.store';
import { SavarActions } from '../../app.actions';
import { ChessReduxStoreService } from '../../services/redux-store-services/chess-redux-store.service';
import { BaseComponent } from '../base/base.component';
import { IdentityReduxStoreService } from '../../services/identity-redux-store.service';
import { BaseAComponent } from '../base/baseA.component';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-chesses',
    templateUrl: './chesses.component.html',
    styleUrls: ['./chesses.component.css']
})
export class ChessesComponent extends BaseAComponent implements OnInit {
    loading: boolean;
    createChessLoading: boolean;
    Timing: any = Timing;
    Color: any = Color;
    gameInit: ChessInit = new ChessInit({
        color: Color.White,
        timing: Timing.Game5Minutes,
        title: 'lets rock n roll',
        threeSecondAllegro: true,
        ratedGame: false
    });
    chesses$: Observable<IChess[]>;

    constructor(private windowRef: WindowRef,
        private authService: AuthService,
        private savarActions: SavarActions,
        private chessService: ChessService,
        private chessReduxService: ChessReduxStoreService,
        private router: Router) {
        super();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit() {
        this.chesses$ = this.chessReduxService.getChesses().map(s => s.map(t => new Chess({ ...t })));
        this.loading = true;
        this.chessService.get().take(1).subscribe(chess => {
            this.loading = false;
            const data = normalizeChesses(chess);
            const chesses = data.entities.chesses;
            const users = data.entities.users;

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
        });
    }

    // join(id: number) {
    //     this.chessService.join(id, null).take(1).subscribe(s => {
    //         this.router.navigate(['/chesses/details', id]);
    //     });
    // }

    formSubmit() {
        this.Identity$.take(1).subscribe(i => {
            if (!i || !i.isAuthenticated) {
                this.authService.beginLogin();
            } else {
                this.createChessLoading = true;
                this.gameInit.isSpecial = false;
                this.chessService.create(this.gameInit).take(1).subscribe(s => {
                    this.createChessLoading = false;
                    this.router.navigate(['/chesses/details', s]);
                });
            }
        });
    }
}
