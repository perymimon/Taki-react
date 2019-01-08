const taki = require('./taki-cards');
const EventEmitter = require('events');
const shortId = require('shortid');
const {GAME_EVENTS, GAME_MODE} = require('../common/game-consts');

const colorCode$ColorName = {
    B: 'blue',
    R: 'red',
    G: 'green',
    Y: 'yellow',
    '': 'uncolor',
};

module.exports = Game;

function Game() {
    const emitter = new EventEmitter();
    const lastMove = {};

    let deck = taki.getNewDeck();
    const stack = [];
    let currentIndex = -1;
    let currentPlayer = null;
    const players = [];
    // let allPlayers = players.slice();
    const player$messages = new Map;
    const state = {
        gameInProgress: false,
        get players() {/*return public player info*/
            /*todo:change player to inerihete from common object*/
            return players.map(
                ({hand, token, color, name, slogan, avatar}) => ({
                    hand: hand.length,
                    token,
                    color,
                    name,
                    slogan,
                    avatar,
                }));
        },
        get stack() {
            return {
                topCard: stack[0],
                length: stack.length,
            };
        },
        get deck() {
            return {length: deck.length}
        },
        get turn() {
            return currentIndex;
        },
        mode: GAME_MODE.NATURAL,
        punishmentCounter: 0,
        direction: 1,
        victoryRank: [],

    };
    const SENTENCE = require('./SENTENCE').factoryMessages(state);

    function notifyPlayers(messageFactory, args) {
        var {code, private, public} = messageFactory(args);
        var id = shortId.generate();
        var other = {id, code, text: public};
        var personal = {id, code, text: private};

        player$messages.get(currentPlayer).push(personal);
        getOtherPlayer().forEach(function (p, i) {
            player$messages.get(p).push(other)
        });

        emitter.emit(GAME_EVENTS.OUTGOING_MESSAGE, player$messages);
    }

    function getOtherPlayer() {
        return players.filter(p => p !== currentPlayer);
    }


    /** API **/
    return {
        on: emitter.on.bind(emitter),
        setup() {
            players.sort(_ => Math.random() - .5);
            players.forEach((p, i) => {
                p.hand = deck.splice(0, 8);
                p.index = i;
                p.__defineGetter__('itHisTurn', function () {
                    return this.index === currentIndex
                });
                player$messages.set(p, []);
            });
            Object.freeze(players);
            state.gameInProgress = true;
            moveToNextPlayer();
            notifyPlayers(SENTENCE.setup);
            emitter.emit(GAME_EVENTS.STATE_UPDATE);
        },
        joinPlayer(player) {
            if (this.isPlayerInGame(player.token)) return false;
            players.push(player);
            emitter.emit(GAME_EVENTS.STATE_UPDATE);
            return true;
        },

        isPlayerInGame(token) {
            return this.getPlayer(token);
        },
        getPlayerState(token) {
            const messages = player$messages.get(this.getPlayer(token)) || [];
            const player = this.getPlayer(token) || null;
            // const itHisTurn = (player.index === currentIndex);
            const extra = {
                playerInGame: !!player,
            };
            return {...state, player, messages, ...extra/*itHisTurn*/};
        },
        flushMessages() {
            player$messages.clear();
            players.forEach(p => player$messages.set(p, []));
        },
        getPlayer(token) {
            return players.find(p => p.token === token)
        },
        endTurn: function () {
            if (state.mode === GAME_MODE.PLUS_TWO) {
                this.drawCards(state.punishmentCounter);
                state.punishmentCounter = 0;
            }
            state.mode = GAME_MODE.NATURAL;
            moveToNextPlayer();
            emitter.emit(GAME_EVENTS.STATE_UPDATE);
        },
        drawCards(amount = 1) {
            if (deck.length < amount) {
                let returnStack = stack.splice(1);
                deck.push(...returnStack.sort(_ => Math.random() - .5));
            }
            currentPlayer.hand.push(...deck.splice(0, amount));
            notifyPlayers(SENTENCE.drawCards, {amount});
            moveToNextPlayer();
            emitter.emit(GAME_EVENTS.STATE_UPDATE);
        },
        selectColor(colorSelected) {
            if (state.mode === GAME_MODE.CHANGE_COLOR) {
                stack[0].color = colorSelected;
                state.mode = GAME_MODE.NATURAL;
                notifyPlayers(SENTENCE.SelectColor);
                moveToNextPlayer();
                emitter.emit(GAME_EVENTS.STATE_UPDATE);
            }
        },
        playCard(card) {
            if (isCardValid(card)) {
                stack.unshift(card);

                /*remove card from player hand*/
                currentPlayer.hand = currentPlayer.hand
                    .filter(handCard => handCard.id !== card.id);

                const colorName = colorCode$ColorName[card.color];
                state.lastMove = {card, player: state.players[currentIndex]};
                if (state.mode !== GAME_MODE.TAKI) {
                    switch (card.symbol) {
                        case "T": {
                            notifyPlayers(SENTENCE.playTaki, {color: colorName});
                            state.mode = GAME_MODE.TAKI;
                            break;
                        }

                        case "S": {
                            let blockedPlayer = moveToNextPlayer();
                            moveToNextPlayer();
                            notifyPlayers(SENTENCE.playStop, {blockedPlayer});
                            break;
                        }

                        case "C": {
                            state.mode = GAME_MODE.CHANGE_COLOR;
                            notifyPlayers(SENTENCE.playColor, {color: colorName});
                            break;
                        }

                        case "W": {
                            state.mode = GAME_MODE.PLUS_TWO;
                            state.punishmentCounter += 2;
                            let nextPlayer = moveToNextPlayer();
                            notifyPlayers(SENTENCE.playPlus2, {nextPlayer});
                            break;
                        }

                        case "P": {
                            notifyPlayers(SENTENCE.playPlus, {color: colorName});
                            break;
                        }

                        case "D": {
                            state.direction = state.direction > 0 ? -1 : +1;
                            notifyPlayers(SENTENCE.playChangeDirection)
                        }

                        default: {
                            moveToNextPlayer();
                            notifyPlayers(SENTENCE.playRegular);

                        }
                    }

                }

                if (checkVictoryCondition()) {
                    state.victoryRank.push(currentPlayer.id);
                    players.splice(currentIndex, 1);
                }

                emitter.emit(GAME_EVENTS.STATE_UPDATE);

            } else {
                notifyPlayers(SENTENCE.playInvalid, {card});
                return false;
            }
        },


    }

    function moveToNextPlayer() {
        currentIndex = (players.length + currentIndex + state.direction) % players.length;
        currentPlayer = players[currentIndex];
        // emitMessage( `put or draw card` );
        return currentPlayer;
    }

    function isCardValid(card) {
        const lastCard = stack[0];
        /*if this is first card any card valid*/
        if (!lastCard) return true;
        const colorMatch = (lastCard.color === card.color) && state.mode === GAME_MODE.NATURAL;
        const symboleMatch = (card.symbol === lastCard.symbol) && !state.mode;
        const isMagicCard = (!card.color) && !state.mode;
        const strictMode = (function () {
            switch (state.mode) {
                case GAME_MODE.PLUS_TWO:
                    return card.symbol === 'W';
                case GAME_MODE.TAKI :
                    return card.color === lastCard.color;
            }
            return false;
        })();


        return colorMatch || symboleMatch || isMagicCard || strictMode;
    }

    function checkVictoryCondition() {
        return currentPlayer.hand.length === 0;
    }

}
