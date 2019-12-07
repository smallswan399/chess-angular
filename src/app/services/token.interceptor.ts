import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mergeMap';

import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { select } from '@angular-redux/store';
import { IAppState } from '../app.store';
import { Identity } from '../entities/identity';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    @select((state: IAppState) => state.identity) identity$: Observable<Identity>;
    constructor(public auth: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.identity$.take(1).mergeMap(user => {
            if (user.isAuthenticated) {
                // options.headers.set('Authorization', 'Bearer ' + user.getAccessToken());
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${user.getAccessToken()}`
                    }
                });
                
            }
            return next.handle(request);
        });
    }
}