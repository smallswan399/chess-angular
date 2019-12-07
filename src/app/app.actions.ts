import { Action } from 'redux';
import { Injectable } from '@angular/core';
import { IAppState, ReduxTable } from './app.store';
import { NgRedux } from '@angular-redux/store';
import { Identity } from './entities/identity';

@Injectable()
export class SavarActions {
    static updateSensitiveUserInfo = 'updateSensitiveUserInfo';
    updateSensitiveUserInfo(users: ReduxTable<string>) {
        this.ngRedux.dispatch({
            type: SavarActions.updateSensitiveUserInfo,
            payload: users
        });
    }


    // tslint:disable-next-line:member-ordering
    static addMessages = 'addMessages';
    addMessages(messages: ReduxTable<number>) {
        this.ngRedux.dispatch({
            type: SavarActions.addMessages,
            payload: messages
        });
    }


    // tslint:disable-next-line:member-ordering
    static rejectNewGameAfterFinish = 'rejectNewGameAfterFinish';
    rejectNewGameAfterFinish(chesses: ReduxTable<number>) {
        this.ngRedux.dispatch({
            type: SavarActions.rejectNewGameAfterFinish,
            payload: chesses
        });
    }

    // tslint:disable-next-line:member-ordering
    static requestNewGameAfterFinish = 'requestNewGameAfterFinish';
    requestNewGameAfterFinish(chesses: ReduxTable<number>) {
        this.ngRedux.dispatch({
            type: SavarActions.requestNewGameAfterFinish,
            payload: chesses
        });
    }

    // tslint:disable-next-line:member-ordering
    static ADD_IDENTITY = 'ADD_IDENTITY';
    // tslint:disable-next-line:member-ordering
    static REMOVE_IDENTITY = 'REMOVE_IDENTITY';
    // tslint:disable-next-line:member-ordering
    static ACCOUNT_INIT = 'ACCOUNT_INIT';
    // tslint:disable-next-line:member-ordering
    static addOrUpdateUsers = 'addOrUpdateUsers';
    // tslint:disable-next-line:member-ordering
    static setChessPlayer = 'setChessPlayer';

    // tslint:disable-next-line:member-ordering
    static userReady = 'userReady';
    userReady(chesses: ReduxTable<number>) {
        this.ngRedux.dispatch({
            type: SavarActions.userReady,
            payload: chesses
        });
    }

    // tslint:disable-next-line:member-ordering
    static updateUsers = 'updateUsers';
    updateUsers(users: ReduxTable<string>) {
        this.ngRedux.dispatch({
            type: SavarActions.updateUsers,
            payload: users
        });
    }

    // tslint:disable-next-line:member-ordering
    static userResign = 'userResign';
    userResign(chesses: ReduxTable<number>) {
        this.ngRedux.dispatch({
            type: SavarActions.userResign,
            payload: chesses
        });
    }


    // tslint:disable-next-line:member-ordering
    static ADD_USERS = 'ADD_USERS';
    // tslint:disable-next-line:member-ordering
    static ADD_CHESSES = 'ADD_CHESSES';
    // tslint:disable-next-line:member-ordering
    static OFFER_DRAW = 'OFFER_DRAW';
    // tslint:disable-next-line:member-ordering
    static REJECT_OFFER_DRAW = 'REJECT_OFFER_DRAW';

    constructor(private ngRedux: NgRedux<IAppState>) {

    }

    loggedInSuccessfully(identity: Identity) {
        this.ngRedux.dispatch({ type: SavarActions.ADD_IDENTITY, payload: identity });
    }

    loggedOutSuccessfully() {
        this.ngRedux.dispatch({ type: SavarActions.REMOVE_IDENTITY });
    }

    addUsers(users: ReduxTable<string>) {
        this.ngRedux.dispatch({
            type: SavarActions.ADD_USERS,
            payload: users
        });
    }

    addOrUpdateUsers(users: ReduxTable<string>) {
        this.ngRedux.dispatch({
            type: SavarActions.addOrUpdateUsers,
            payload: users
        });
    }
    addChesses(chesses: ReduxTable<number>) {
        this.ngRedux.dispatch({
            type: SavarActions.ADD_CHESSES,
            payload: chesses
        });
    }

    setChessPlayer(chesses: ReduxTable<number>) {
        this.ngRedux.dispatch({
            type: SavarActions.setChessPlayer,
            payload: chesses
        });
    }

    offerDraw(chesses: ReduxTable<number>) {
        this.ngRedux.dispatch({
            type: SavarActions.OFFER_DRAW,
            payload: chesses
        });
    }

    rejectOfferDraw(chesses: ReduxTable<number>) {
        this.ngRedux.dispatch({
            type: SavarActions.REJECT_OFFER_DRAW,
            payload: chesses
        });
    }

    // tslint:disable-next-line:member-ordering
    static acceptOfferDraw = 'acceptOfferDraw';
    acceptOfferDraw(chesses: ReduxTable<number>) {
        this.ngRedux.dispatch({
            type: SavarActions.acceptOfferDraw,
            payload: chesses
        });
    }
}
