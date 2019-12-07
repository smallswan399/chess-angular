import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterUser } from '../components/account/signup/register-user';
import { User } from '../entities/user';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccountService {

    constructor(private http: HttpClient) { }

    register(user: RegisterUser){
        return this.http.post("api/account/register", user);
    }

    getSensitiveUserInfo(): Observable<User>{
        return this.http.get<User>("api/account/getsensitiveuserinfo");
    }

    updateEthereumAccountAddress(user: User): Observable<User>{
        return this.http.post<User>("api/account/updateethereumaccountaddress", user);
    }

    getTransactions(): Observable<any>{
        return this.http.get("api/account/gettransactions");
    }
}
