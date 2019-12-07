import { Identity } from './entities/identity';
import { PagingInfo } from './entities/paging-info';
import { SavarActions } from './app.actions';
import { Chess } from './entities/chess';
import * as _ from 'lodash';

export class ReduxTable<T> {
    constructor(init?: Partial<ReduxTable<T>>) {
        Object.assign(this, init);
    }
    ids: T[] = [];
    list: any = {};
}

export interface IAppState {
    identity: Identity;
    entities: {
        chesses: ReduxTable<number>;
        users: ReduxTable<number>;
        messages: ReduxTable<number>;
    };
}

export const INITIAL_STATE: IAppState = {
    identity: new Identity(),
    entities: {
        chesses: new ReduxTable<number>(),
        users: new ReduxTable<number>(),
        messages: new ReduxTable<number>()
    }
};

export function rootReducer(state: IAppState, action): IAppState {
    return {
        identity: identity(state.identity, action),
        entities: {
            chesses: chesses(state.entities.chesses, action),
            users: users(state.entities.users, action),
            messages: messages(state.entities.messages, action)
        }
    };
}

export const messages = (state: ReduxTable<number>, action) => {
    switch (action.type) {
        case SavarActions.addMessages:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });
        default:
            return state;
    }

};

export const users = (state: ReduxTable<number>, action) => {
    switch (action.type) {
        case SavarActions.updateSensitiveUserInfo:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });
        case SavarActions.ADD_USERS:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });
        case SavarActions.addOrUpdateUsers:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });

        case SavarActions.updateUsers:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });
        case 'ADD_USER':
            return _.merge({}, state, action.payload);
        case 'REMOVE_USER':
            return new ReduxTable({
                ...state,
                ids: state.ids.filter(s => s !== action.payload.id),
                list: _.omit(state.list, [action.payload.id])
            });
        default:
            return state;
    }
};


export const chesses = (state: ReduxTable<number>, action) => {
    switch (action.type) {
        case SavarActions.rejectNewGameAfterFinish:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });
        case SavarActions.requestNewGameAfterFinish:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });
        case SavarActions.ADD_CHESSES:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });
        case SavarActions.setChessPlayer:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });
        case SavarActions.OFFER_DRAW:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });
        case SavarActions.REJECT_OFFER_DRAW:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });

        case SavarActions.acceptOfferDraw:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });
        case SavarActions.userReady:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });
        case SavarActions.userResign:
            return _.mergeWith({}, state, action.payload, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return _.union(objValue, srcValue);
                }
            });
        default:
            return state;
    }
};

export const identity = (state: Identity, action) => {
    switch (action.type) {
        case SavarActions.ADD_IDENTITY:
            return action.payload;
        case SavarActions.REMOVE_IDENTITY:
            return new Identity();
        default:
            return state;
    }
};
