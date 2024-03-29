export const GAME_MODE = {
    NATURAL: 'natural',
    PLUS_TWO: '+2',
    TAKI: 'taki',
    CHANGE_COLOR: 'change color',
};

export const SOCKET_EVENTS = {
    UPDATE_GAME_STATE: 'update-game-state',
    INCOMING_MESSAGE: 'incoming-message',
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    CONNECT: 'connect',
    ONLINE:'online',
    OFFLINE:'offline',
    LOGIN: 'login',
    LOGOUT:'logout',
    JOIN_GAME:'join-game',
    LOGGED_IN: 'logged-in',
    /*reserved event*/
    // logout: 'logout',
    // SIGN_IN: 'sign-in',
    // SIGN_OUT:'sign-out',
    START_GAME: 'start-game',
    RESET_GAME:'reset-game'

};

export const GAME_EVENTS = {
    OUTGOING_MESSAGE: 'outgoing-message',
    STATE_UPDATE: 'game-state-update',
};


export const GAME_STAGE = {
    PLAYER_SIGNIN: 'signin',
    WELCOME: 'welcome',
    GAME_TABLE: 'in-game',
    VICTORY:'victory'
};

export const GAME_SETTING = {
    TURN_COUNTER: 20 * 1000,
    ADD_SEPARATOR_TIMEOUT: 1000,
    INIT_CARD_EACH_PLAYER: 8,
    NUMBER_OF_ROUND: 6,
    VALUE_OF_SPECIAL_CARDS: 10,
    VICTORY_VALUE: -100,
};
