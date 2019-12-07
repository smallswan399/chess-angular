import { Injectable } from '@angular/core';
import { UserManager, User } from 'oidc-client';
import { AuthSettings } from './auth-settings';
import { Identity } from '../entities/identity';
import { SavarActions } from '../app.actions';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {
    mgr: UserManager = new UserManager(AuthSettings);
    private loginStatusSource = new Subject<User>();
    private loginStatus$ = this.loginStatusSource.asObservable();
    private loginStatus(user: User) {
        this.loginStatusSource.next(user);
    }
    constructor(private savarActions: SavarActions) { 
        // Raised when a user session has been established (or re-established).
        this.mgr.events.addUserLoaded(user => {
            this.loginStatus(user);
        });

        // Raised when a user session has been terminated.
        this.mgr.events.addUserUnloaded((e) => {
            this.loginStatus(null);
        });

        this.mgr.getUser().then(s => {
            if (s && !s.expired) {
                let identity = new Identity(s);
                this.savarActions.loggedInSuccessfully(identity);
                // this.getLocalProfile(s.access_token).take(1).subscribe(profile => {
                //     let roles = profile.roles;
                //     roles.forEach(role => {
                //         identity.claims.push({ type: "role", value: role });
                //     });
                //     this.savarActions.loggedInSuccessfully(identity);

                //     let user = ({
                //         id: identity.id,
                //         name: identity.getName(),
                //         isOnline: true,
                //         mobile: identity.getMobile(),
                //         picture: identity.getPicture()
                //     });
                //     let normalizedData = normalizeUsers([user]);
                //     let users = normalizedData.entities.users;
                //     this.ngRedux.dispatch({ type: 'ADD_USERS', payload: new ReduxTable({ list: users, ids: normalizedData.result }) });
                // });
            }
        });
    }

    beginLogin(): Promise<User> {
        return this.mgr.signinRedirect();
    }

    async completeLogin(): Promise<User> {
        let result = await this.mgr.signinRedirectCallback();
        if (result && !result.expired) {
            let identity = new Identity(result);
            this.savarActions.loggedInSuccessfully(identity);
            // this.getLocalProfile(result.access_token).take(1).subscribe(profile => {
            //     let roles = profile.roles;
            //     roles.forEach(role => {
            //         identity.claims.push({ type: "role", value: role });
            //     });
            //     this.savarActions.loggedInSuccessfully(identity);
            // });

            // let identity = new Identity(resull);
            // let user = ({
            //     id: identity.id,
            //     name: identity.getName(),
            //     isOnline: true,
            //     mobile: identity.getMobile(),
            //     picture: identity.getPicture()
            // });
            // let normalizedData = normalizeUsers([user]);
            // let users = normalizedData.entities.users;
            // this.ngRedux.dispatch({ type: 'ADD_USERS', payload: new ReduxTable({ list: users, ids: normalizedData.result }) });

            return result;
        }
        return null;
    }

    async signOut(): Promise<any> {
        let currentUser = await this.mgr.getUser();
        let result = await this.mgr.signoutPopup();
        this.savarActions.loggedOutSuccessfully();
        this.loginStatus(null);
        // let identity = new Identity(currentUser);
        // this.ngRedux.dispatch({ type: 'REMOVE_USER', payload: {id: identity.id} });

        return result;
    }

    completeSignOut(): Promise<void> {
        return this.mgr.signoutPopupCallback(false);
    }
}
