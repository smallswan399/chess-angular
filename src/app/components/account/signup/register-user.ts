export class RegisterUser {
    constructor(parameters?: Partial<RegisterUser>) {
        Object.assign(this, parameters);
    }
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}
