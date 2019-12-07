import { Component, OnInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Chess as ChessGame, IChess } from '../../../entities/chess';
import { WindowRef } from '../../../services/window-ref.service';
import { ActivatedRoute } from '@angular/router';
import { ChessService } from '../../../services/chess.service';
import * as Chess from 'chess.js';
import 'rxjs/add/operator/takeUntil';
import { TurnMove, Color } from '../../../entities/enums';
import { SignalrConnectionService } from '../../../services/signalr-connection.service';
import { ConnectionService } from '../../../services/connection.service';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { BaseComponent } from '../../base/base.component';
import { IdentityReduxStoreService } from '../../../services/identity-redux-store.service';
import { Identity } from '../../../entities/identity';
import { normalizeChesses, normalizeChess } from '../../../services/redux-store-services/schema';
import { SavarActions } from '../../../app.actions';
import { ReduxTable, IAppState } from '../../../app.store';
import { ChessReduxStoreService } from '../../../services/redux-store-services/chess-redux-store.service';
import { NgRedux } from '@angular-redux/store';
import { Router } from '@angular/router';
import { BaseAComponent } from '../../base/baseA.component';

@Component({
    selector: 'app-chess-details',
    templateUrl: './chess-details.component.html',
    styleUrls: ['./chess-details.component.css']
})
export class ChessDetailsComponent extends BaseAComponent implements OnInit {
    @HostListener('window:resize', ['$event']) onResize(event) {
        if (this.board) {
            this.board.resize();
        }
    }
    @ViewChild('gameFinishModal') private gameFinishModal: ModalDirective;
    @ViewChild('drawReplyModal') private drawReplyModal: ModalDirective;

    TurnMove: any = TurnMove;
    Color: any = Color;
    game: ChessGame;
    board: any;
    engine: ChessInstance = new Chess();
    historyMoves: any[] = [];
    showOverlay: boolean = false;
    imReady: boolean = false;
    theOppositeReady: boolean = false;
    notPlayer: boolean = false;
    fullPlayers: boolean = false;
    disableRequestNewGameAfterFinishButton: boolean = false;
    constructor(private router: Router,
        private ngRedux: NgRedux<IAppState>,
        private chessReduxStoreService: ChessReduxStoreService,
        private savarActions: SavarActions,
        private windowRef: WindowRef,
        private signalrConnectionSerivce: SignalrConnectionService,
        private connectionService: ConnectionService,
        private chessService: ChessService,
        private activatedRoute: ActivatedRoute) {
        super();
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
    }

    ngOnInit() {
        this.Identity$.takeUntil(this.UnSub).subscribe(identity => {
            this.board = this.initBoard('board', null, identity);
            this.gameSubscribeRegister();
            if (this.signalrConnectionSerivce.connection.state === SignalR.ConnectionState.Connected) {
                this.loadGameAfterSignalrReady(identity);
            }
            else {
                this.signalrConnectionSerivce.signalRConnectionStateChanged$
                    .takeUntil(this.UnSub)
                    .subscribe(s => {
                        if (s.newState === SignalR.ConnectionState.Connected) {
                            this.loadGameAfterSignalrReady(identity);
                        }
                    });
            }
        });
    }

    loadGameAfterSignalrReady(identity: Identity) {
        this.activatedRoute.params.takeUntil(this.UnSub).subscribe(s => {
            let chessId = +s.id;
            this.chessReduxStoreService.getChessById(chessId).takeUntil(this.UnSub).subscribe(t => {
                this.handleData(new ChessGame({ ...t }), identity);
            });
            let connectionId = this.signalrConnectionSerivce.connection.id;
            this.connectionService.updateChessConnectionMapper(connectionId, chessId).take(1).subscribe(s => {
                // Get chess from remote then update redux
                this.chessService.getById(chessId).take(1).subscribe(game => {
                    this.handleDataFromRemote(game);
                });
            });
        });
    }
    gameSubscribeRegister() {
        this.chessService.gotRequestNewGameAfterFinish$.takeUntil(this.UnSub).subscribe(game => {
            this.handleRequestNewGameAfterFinishDataFromRemote(game);
        });

        this.chessService.gotRejectNewGameAfterFinish$.takeUntil(this.UnSub).subscribe(game => {
            this.handleRejectNewGameAfterFinishDataFromRemote(game);
        });

        this.chessService.gotAcceptDraw$.takeUntil(this.UnSub).subscribe(game => {
            this.handleAcceptOfferDrawDataFromRemote(game);
        });

        this.chessService.gotRejectDraw$.takeUntil(this.UnSub).subscribe(game => {
            this.handleRejectOfferDrawDataFromRemote(game);
        });

        this.chessService.gotResign$.takeUntil(this.UnSub).subscribe(game => {
            this.handleResignDataFromRemote(game);
        });

        this.chessService.gotNewMove$.takeUntil(this.UnSub).subscribe(game => {
            this.handleDataFromRemote(game);
        });

        this.chessService.gotNewJoin$.takeUntil(this.UnSub).subscribe(join => {
            this.handleJoinDataFromRemote(join);
        });

        this.chessService.gotReady$.takeUntil(this.UnSub).subscribe(ready => {
            this.handleReadyDataFromRemote(ready);
        });

        this.chessService.gotOfferDraw$.takeUntil(this.UnSub).subscribe(offer => {
            this.handleOfferDrawDataFromRemote(offer);
        });
    }

    initBoard(id: string, chess?: ChessGame, identity?: Identity): any {
        const self = this;
        const game = self.engine;
        let cfg = {
            draggable: true,
            onDragStart: onDragStart, // check a pice can move
            onDrop: onDrop, // check valid move
            onSnapEnd: onSnapEnd,
            pieceTheme: 'https://s3-us-west-2.amazonaws.com/chessimg/{piece}.png'
        };
        return this.windowRef.nativeWindow.ChessBoard(id, cfg);

        function onDragStart(source, piece, position, orientation) {
            // do not pick up pieces if the game is over
            // only pick up pieces for the side to move
            if ((identity.id !== self.game.whitePlayerId && self.game.turnMove === TurnMove.WhiteMove) ||
                (identity.id !== self.game.blackPlayerId && self.game.turnMove === TurnMove.BlackMove) ||
                self.game.blackOfferedDraw === true ||
                self.game.whiteOfferedDraw === true ||
                self.game.finished === true ||
                self.engine.game_over() === true ||
                self.engine.in_draw() === true ||
                self.engine.moves().length === 0 ||
                (self.engine.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (self.engine.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
            return true;
        }

        function onDrop(source, target) {
            // see if the move is legal
            var move = game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });

            // illegal move
            if (move === null) {
                return 'snapback';
            } else {
                //updateStatus();
                // Call remote service
                let status = getStatus();
                game.undo();

                self.chessService.move(status, self.signalrConnectionSerivce.connection.id).take(1).subscribe(newStatus => {
                    console.log('New fen: ' + newStatus.fen);
                    self.handleDataFromRemote(newStatus);
                }, error => {
                    alert(JSON.stringify(error));
                });
                return null;
            }
        }

        function onSnapEnd() {
        }

        function getStatus() {
            let chess = new ChessGame({
                ...self.game
            });
            if (game.turn() === 'b') {
                chess.turnMove = TurnMove.BlackMove;
            } else {
                chess.turnMove = TurnMove.WhiteMove;
            }

            if (game.in_checkmate() === true) {
                chess.inCheckmate = true;
            }
            if (game.in_stalemate() === true) {
                chess.inStalemate = true;
            }
            if (game.in_draw() === true) {
                chess.inDraw = true;
            }
            if (game.in_threefold_repetition() === true) {
                chess.inThreefoldRepetition = true;
            }
            if (game.insufficient_material() === true) {
                chess.insufficientMaterial = true;
            }
            if (game.in_check() === true) {
                chess.inCheck = true;
            }

            chess.fen = game.fen();
            chess.pgn = game.pgn();

            return chess;
        }
    }

    join() {
        this.chessService.join(this.game.id, this.signalrConnectionSerivce.connection.id)
            .take(1).subscribe(s => this.handleJoinDataFromRemote(s));
    }

    ready() {
        this.chessService.ready(this.game.id, this.signalrConnectionSerivce.connection.id)
            .take(1).subscribe(s => this.handleReadyDataFromRemote(s));
    }

    resign() {
        this.chessService.resign(this.game.id, this.signalrConnectionSerivce.connection.id)
            .take(1).subscribe(s => this.handleResignDataFromRemote(s));
    }

    offerDraw() {
        this.chessService.offerDraw(this.game.id, this.signalrConnectionSerivce.connection.id)
            .take(1).subscribe(s => this.handleOfferDrawDataFromRemote(s));
    }
    rejectOfferDraw() {
        this.chessService.rejectDraw(this.game.id, this.signalrConnectionSerivce.connection.id)
            .take(1).subscribe(s => {
                this.handleRejectOfferDrawDataFromRemote(s);
            });

    }

    acceptOfferDraw() {
        this.chessService.acceptDraw(this.game.id, this.signalrConnectionSerivce.connection.id).take(1)
            .subscribe(s => {
                this.handleAcceptOfferDrawDataFromRemote(s);
            });
    }

    requestNewGameAfterFinish() {
        this.chessService.requestNewGameAfterFinish(this.game.id, this.signalrConnectionSerivce.connection.id).take(1)
            .subscribe(s => {
                this.handleRequestNewGameAfterFinishDataFromRemote(s);
            });
    }

    rejectNewGameAfterFinish() {
        this.chessService.rejectNewGameAfterFinish(this.game.id, this.signalrConnectionSerivce.connection.id).take(1)
            .subscribe(s => {
                this.handleRejectNewGameAfterFinishDataFromRemote(s);
            });
    }

    private getHistoryMoves(pgn: string): any[] {
        let result: any[] = [];
        let arr = pgn.split(". ");

        for (let index = 1; index < arr.length; index++) {
            const element = arr[index];
            let temp = {
                index: index,
                moves: element.split(" ").slice(0, 2)
            }
            result.push(temp);
        }
        return result;
    }

    private handleData(data: ChessGame, identity: Identity, note?: string) {
        if (note) {
            console.log(note);
        }
        if (!data || !data.fen) {
            return;
        }
        this.game = data;
        if (data.getColor(identity.id) === Color.Black) {
            this.board.orientation('black');
        }
        this.fullPlayers = this.game.fullPlayer;
        this.notPlayer = !this.game.isPlayer(identity.id);

        if (data.getColor(identity.id) === Color.Black && data.blackPlayerReady === true) {
            this.imReady = true;
            this.theOppositeReady = data.whitePlayerReady === true;
        }
        if (data.getColor(identity.id) === Color.White && data.whitePlayerReady === true) {
            this.imReady = true;
            this.theOppositeReady = data.blackPlayerReady === true;
        }
        this.showOverlay = (
            (!this.notPlayer && (!this.imReady || !this.theOppositeReady)) ||
            (this.notPlayer === true && (!this.game.whitePlayerReady || !this.game.blackPlayerReady))
        ) &&
            this.fullPlayers === true;

        if (this.game.pgn) {
            if (this.game.pgn !== this.engine.pgn()) {
                this.engine.load_pgn(this.game.pgn);
                this.board.position(this.game.fen);
                this.historyMoves = this.getHistoryMoves(this.game.pgn);
            }

        } else {
            let loadResult = this.engine.load(this.game.fen);
            if (!loadResult) {
                alert("Error!");
            }
            this.board.position(this.game.fen);
        }

        // Show Game over dialog
        if (this.game.finished === true) {
            if (!this.game.oneOfPlayerRejectNewGameAfterFinish) {
                if (!(this.game.blackRequestedNewGameAfterFinish === true &&
                    this.game.whiteRequestedNewGameAfterFinish === true)) {
                    this.gameFinishModal.show();
                } else {
                    if (this.game['newGameId']) {
                        if (this.gameFinishModal.isShown) {
                            this.gameFinishModal.hide();
                        }
                        this.router.navigate(['chesses/details', this.game['newGameId']]);
                        // alert(this.game['newGameId']);
                    }
                }

            } else {
                if (this.gameFinishModal.isShown) {
                    this.gameFinishModal.hide();
                }
            }

        }
        // Show Draw Offer dialog
        if (Color.White === this.game.getColor(identity.id)) {
            if (this.game.blackOfferedDraw === true && !this.game.finished) {
                this.drawReplyModal.show();
            } else {
                if (this.drawReplyModal.isShown) {
                    this.drawReplyModal.hide();
                }
            }
        }

        if (Color.Black === this.game.getColor(identity.id)) {
            if (this.game.whiteOfferedDraw === true && !this.game.finished) {
                this.drawReplyModal.show();
            } else {
                if (this.drawReplyModal.isShown) {
                    this.drawReplyModal.hide();
                }
            }
        }

        // Specifer disableRequestNewGameAfterFinishButton
        if ((this.game.getColor(identity.id) === Color.Black && this.game.blackRequestedNewGameAfterFinish === true) ||
            (this.game.getColor(identity.id) === Color.White && this.game.whiteRequestedNewGameAfterFinish === true)) {
            this.disableRequestNewGameAfterFinishButton = true;
        }
    }

    private cleanFen(fen: string) {
        if (!fen) {
            throw 'NI'
        }
        let resutl = fen.substring(0, fen.indexOf(" "));
        return resutl;

    }



    private handleOfferDrawDataFromRemote(game: IChess) {
        let data = normalizeChess(game);
        let chesses = data.entities.chesses;
        if (chesses) {
            this.savarActions.offerDraw(new ReduxTable<number>({
                ids: Object.keys(chesses).map(s => +s),
                list: chesses
            }));
        }
    }

    private handleRejectNewGameAfterFinishDataFromRemote(game: IChess) {
        let data = normalizeChess(game);
        let chesses = data.entities.chesses;
        if (chesses) {
            this.savarActions.rejectNewGameAfterFinish(new ReduxTable<number>({
                ids: Object.keys(chesses).map(s => +s),
                list: chesses
            }));
        }
    }
    private handleRequestNewGameAfterFinishDataFromRemote(game: IChess) {
        let data = normalizeChess(game);
        let chesses = data.entities.chesses;
        if (chesses) {
            this.savarActions.requestNewGameAfterFinish(new ReduxTable<number>({
                ids: Object.keys(chesses).map(s => +s),
                list: chesses
            }));
        }
    }
    private handleAcceptOfferDrawDataFromRemote(game: IChess) {
        let data = normalizeChess(game);
        let chesses = data.entities.chesses;
        let users = data.entities.users;
        if (users) {
            this.savarActions.updateUsers(new ReduxTable<string>({
                ids: Object.keys(users),
                list: users
            }));
        }
        if (chesses) {
            this.savarActions.acceptOfferDraw(new ReduxTable<number>({
                ids: Object.keys(chesses).map(s => +s),
                list: chesses
            }));
        }
    }
    private handleRejectOfferDrawDataFromRemote(game: IChess) {
        let data = normalizeChess(game);
        let chesses = data.entities.chesses;
        if (chesses) {
            this.savarActions.rejectOfferDraw(new ReduxTable<number>({
                ids: Object.keys(chesses).map(s => +s),
                list: chesses
            }));
        }
    }

    private handleReadyDataFromRemote(game: IChess) {
        let data = normalizeChess(game);
        let chesses = data.entities.chesses;
        if (chesses) {
            this.savarActions.userReady(new ReduxTable<number>({
                ids: Object.keys(chesses).map(s => +s),
                list: chesses
            }));
        }
    }


    private handleJoinDataFromRemote(game: IChess) {
        let data = normalizeChess(game);
        let users = data.entities.users;
        let chesses = data.entities.chesses;

        if (users) {
            this.savarActions.addOrUpdateUsers(new ReduxTable<string>({
                ids: Object.keys(users),
                list: users
            }));
        }

        if (chesses) {
            this.savarActions.setChessPlayer(new ReduxTable<number>({
                ids: Object.keys(chesses).map(s => +s),
                list: chesses
            }));
        }
    }

    private handleResignDataFromRemote(game: IChess) {
        let data = normalizeChess(game);
        let users = data.entities.users;
        let chesses = data.entities.chesses;

        if (users) {
            this.savarActions.updateUsers(new ReduxTable<string>({
                ids: Object.keys(users),
                list: users
            }));
        }

        if (chesses) {
            this.savarActions.userResign(new ReduxTable<number>({
                ids: Object.keys(chesses).map(s => +s),
                list: chesses
            }));
        }
    }

    private handleDataFromRemote(game: IChess) {
        let data = normalizeChess(game);
        let users = data.entities.users;
        let chesses = data.entities.chesses;

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
