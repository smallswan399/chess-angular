export interface IMessage {
    id: number;
    user: number;
    userId: number;
    chess: number;
    chessId: number;
    content: string;
    createdDate: Date;
}

export class Message implements IMessage {
    constructor(parameters?: Partial<Message>) {
        Object.assign(this, parameters);
    }

    id: number;
    user: number;
    userId: number;
    chess: number;
    chessId: number;
    content: string;
    createdDate: Date;
}
