import { normalize, schema } from "normalizr";

export const chess = new schema.Entity('chesses');
export const chesses = new schema.Array(chess);

export const user = new schema.Entity('users');
export const users = new schema.Array(user);

export const message = new schema.Entity('messages');
export const messages = new schema.Array(message);


chess.define({
    whitePlayer: user,
    blackPlayer: user
});

message.define({
    chess: chess,
    user: user
});


export const normalizeUser = (data) => normalize(data, user);
export const normalizeUsers = (data) => normalize(data, users);


export const normalizeChess = (data) => normalize(data, chess);
export const normalizeChesses = (data) => normalize(data, chesses);

export const normalizeMessage = (data) => normalize(data, message);
export const normalizeMessages = (data) => normalize(data, messages);