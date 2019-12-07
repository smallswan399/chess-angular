export class MessageCreate {
    constructor(parameters?: Partial<MessageCreate>) {
        Object.assign(this, parameters);
    }

    content: string;
}