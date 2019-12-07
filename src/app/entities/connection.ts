import { User } from './user';

export class Connection {
    constructor(parameters?: Partial<Connection>) {
        Object.assign(this, parameters);
    }
    public connectionId: string;
    public userAgent: string;
    public connected: boolean;
    public user: number;
    public userId: number;
}
