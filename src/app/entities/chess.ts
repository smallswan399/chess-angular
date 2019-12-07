import { User } from './user';
import { TurnMove, GameResult, Color } from './enums';
import { ChessConfiguration } from './chessConfiguration';

export interface IChess {
    id: number;
    blackPlayer?: number;
    blackPlayerId?: number;
    whitePlayer?: number;
    whitePlayerId?: number;
    fen?: string;
    pgn?: string;
    title?: string;
    startAt?: Date;
    finishAt?: Date;
    chessConfiguration?: ChessConfiguration;
    payed?: boolean;

    turnMove?: TurnMove;
    inCheckmate?: boolean;
    inDraw?: boolean;
    inCheck?: boolean;
    inStalemate?: boolean;
    inThreefoldRepetition?: boolean;
    insufficientMaterial?: boolean;

    blackResigned?: boolean;
    whiteResigned?: boolean;
    whiteAcceptedDraw?: boolean;
    blackAcceptedDraw?: boolean;
    whiteOfferedDraw?: boolean;
    blackOfferedDraw?: boolean;

    whitePlayerTimeLeft?: string;
    blackPlayerTimeLeft?: string;
    whiteTurnStartAt?: Date;
    blackTurnStartAt?: Date;

    whitePlayerReady?: boolean;
    blackPlayerReady?: boolean;

    blackRequestedNewGameAfterFinish?: boolean;
    whiteRequestedNewGameAfterFinish?: boolean;
    oneOfPlayerRejectNewGameAfterFinish?: boolean;

    finished: boolean;
    gameResult: GameResult;
    bothPlayerAlready: boolean;
    stopwatchPause: boolean;
    blackStopwatchPause: boolean;
    whiteStopwatchPause: boolean;
    fullPlayer: boolean;
}

export class Chess implements IChess {
    constructor(parameters?: Partial<Chess>) {
        Object.assign(this, parameters);
    }
    public id: number;
    public blackPlayer?: number;
    public blackPlayerId?: number;
    public whitePlayer?: number;
    public whitePlayerId?: number;
    public fen?: string;
    public pgn?: string;
    public title?: string;
    public startAt?: Date;
    public finishAt?: Date;
    public turnMove?: TurnMove;
    public inCheckmate?: boolean;
    public inDraw?: boolean;
    public inCheck?: boolean;
    public inStalemate?: boolean;
    public inThreefoldRepetition?: boolean;
    public insufficientMaterial?: boolean;
    public whitePlayerReady?: boolean;
    public blackPlayerReady?: boolean;
    public whitePlayerTimeLeft?: string;
    public blackPlayerTimeLeft?: string;
    public whiteTurnStartAt?: Date;
    public blackTurnStartAt?: Date;

    public blackResigned?: boolean;
    public whiteResigned?: boolean;
    public whiteAcceptedDraw?: boolean;
    public blackAcceptedDraw?: boolean;
    public whiteOfferedDraw?: boolean;
    public blackOfferedDraw?: boolean;
    public blackRequestedNewGameAfterFinish?: boolean;
    public whiteRequestedNewGameAfterFinish?: boolean;
    public oneOfPlayerRejectNewGameAfterFinish?: boolean;

    public chessConfiguration?: ChessConfiguration;
    public payed?: boolean;
    public get finished(): boolean {
        return this.inCheckmate === true ||
            this.whiteResigned === true ||
            this.blackResigned === true ||
            this.blackAcceptedDraw === true ||
            this.whiteAcceptedDraw === true ||
            this.inStalemate === true;
    }

    public get gameResult(): GameResult {
        if (this.whiteAcceptedDraw === true || this.blackAcceptedDraw === true) {
            return GameResult.Draw;
        }
        if (this.whiteResigned === true) {
            return GameResult.BlackWin;
        }
        if (this.blackResigned === true) {
            return GameResult.WhiteWin;
        }
        if (this.inStalemate === true || this.inCheckmate === true) {
            if (this.turnMove === TurnMove.BlackMove) {
                return GameResult.WhiteWin;
            }
            return GameResult.BlackWin;
        }
        return null;
    }

    public get bothPlayerAlready(): boolean {
        return this.whitePlayerReady === true && this.blackPlayerReady === true;
    }

    public get stopwatchPause(): boolean {
        return this.finished === true || this.blackOfferedDraw === true || this.whiteOfferedDraw === true || !this.bothPlayerAlready;
    }

    public get blackStopwatchPause(): boolean {
        return this.stopwatchPause === true || this.turnMove === TurnMove.WhiteMove;
    }

    public get whiteStopwatchPause(): boolean {
        return this.stopwatchPause === true || this.turnMove === TurnMove.BlackMove;
    }

    public get fullPlayer(): boolean {
        return this.whitePlayerId && this.blackPlayerId && true;
    }

    public isPlayer(userId: number): boolean {
        return this.whitePlayerId === userId || this.blackPlayerId === userId;
    }

    public getColor(userId: number): Color {
        if (userId === this.whitePlayerId) {
            return Color.White;
        }
        if (userId === this.blackPlayerId) {
            return Color.Black;
        }
        return null;
    }
}
