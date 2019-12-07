export class User {
    constructor(parameters?: Partial<User>) {
        Object.assign(this, parameters);
    }
    public id: number;
    public userName: string;
    public win: number;
    public draw: number;
    public lose: number;
    public ethereumAccountAddress: string;
}
