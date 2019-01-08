exports.GAME_MODE = {
    NATURAL: 'natural',
    PLUS_TWO: '+2',
    TAKI: 'taki',
    CHANGE_COLOR: 'ch',
};

exports.SOCKET_EVENTS = {
    UPDATE_GAME_STATE: 'update-game-state',
    INCOMING_MESSAGE:'incoming-message',
    CONNECTION: 'connection',
    LOGIN: 'login',
    LOGGED_IN: 'logged-in',
    /*reserved event*/
    // logout: 'logout',
    // SIGN_IN: 'sign-in',
    // SIGN_OUT:'sign-out',
    START_GAME: 'start-game',
};

exports.GAME_EVENTS = {
    OUTGOING_MESSAGE: 'outgoing-message',
    STATE_UPDATE: 'game-state-update',
};


exports.GAME_STAGE = {
    PLAYER_SIGNIN: 'signin',
    WELCOME: 'welcome',
    GAME_TABLE: 'game',
};
