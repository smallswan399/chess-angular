import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppState } from '../app.store';
import { Observable } from 'rxjs/Observable';
import { Identity } from '../entities/identity';
import { select } from '@angular-redux/store';

@Injectable()
export class HttpClientService {
    @select((state: IAppState) => state.identity) identity$: Observable<Identity>;
    constructor(private httpClient: HttpClient) { }
    
}
