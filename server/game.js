const {Timer} = require('../common/Timer');


const taki = require('./taki-cards');
const EventEmitter = require('events');
const shortId = require('shortid');
const {GAME_EVENTS, GAME_MODE, GAME_SETTING} = require('../common/game-consts');
const {Card} = require('./taki-cards');
const {isCardValid} = require('../common/common-methods');
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
    const counterDown = new Timer(GAME_SETTING.TURN_COUNTER, function () {
        notifyPlayers(SENTENCE.timeEnd);
        drawCards()
    });

    let deck = taki.getNewDeck();
    const stack = [];
    let currentIndex = -1;
    let currentPlayer = null;
    const players = [];

    // let allPlayers = players.slice();
    const player$messages = new Map;

    const publicState = {
        gameInProgress: false,
        get players() {/*return public player info*/
            /*todo:change player to inerihete from common object*/
            return players.map(p => p.public);
        },
        get stack() {
            return {
                topCards: stack.slice(0, 10),
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
        get timeLeft() {
            return (GAME_SETTING.TURN_COUNTER - counterDown.timePass)
        },
        lastMove: {
            card: null,
            player: null,
        },

    };
    const SENTENCE = require('./SENTENCE').factoryMessages(publicState);

    function notifyPlayers(messageFactory, args) {
        var {code, private, public, meta} = messageFactory(args);
        var id = shortId.generate();
        var other = {id, code, text: public, meta, private: false};
        var personal = {id, code, text: private, meta, private: true};

        player$messages.get(currentPlayer).push(personal);
        getOtherPlayer().forEach(function (p, i) {
            player$messages.get(p).push(other)
        });

        emitter.emit(GAME_EVENTS.OUTGOING_MESSAGE, player$messages);
    }

    function getOtherPlayer() {
        return players.filter(p => p !== currentPlayer);
    }

    /*ACTION*/

    function drawCards(amount = 1) {
        const punishmentMode = (publicState.mode === GAME_MODE.PLUS_TWO);
        if (punishmentMode) {
            amount = (publicState.punishmentCounter);
            publicState.punishmentCounter = 0;
        }

        let cards = [];

        if (deck.length < amount) {
            let returnStack = stack.splice(1);
            deck.push(...returnStack.sort(_ => Math.random() - .5));
        }
        cards = deck.splice(0, amount);
        currentPlayer.hand.push(...cards);

        // publicState.lastMove = {
        //     cards.length,
        //     player: publicState.players[currentIndex],
        //     action:'drawCards'
        // };
        if (cards.length === 0) {
            notifyPlayers(SENTENCE.punishmentCards, {amount})
        } else if (punishmentMode) {
            notifyPlayers(SENTENCE.punishmentCards, {amount, cards});
        } else {
            notifyPlayers(SENTENCE.drawCards, {amount, cards});
        }


        if ([GAME_MODE.TAKI, GAME_MODE.PLUS_TWO].includes(publicState.mode)) {
            publicState.mode = GAME_MODE.NATURAL;
        }
        moveToNextPlayer();
        counterDown.restart();
        emitter.emit(GAME_EVENTS.STATE_UPDATE);
        return cards;
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
            // Object.freeze(players);
            publicState.gameInProgress = true;
            moveToNextPlayer();
            counterDown.restart();
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
            const player = this.getPlayer(token) || null;
            // const itHisTurn = (player.index === currentIndex);
            const extra = {
                playerInGame: !!player,
            };
            return {...publicState, player, ...extra/*itHisTurn*/};
        },
        flushMessages() {
            player$messages.clear();
            players.forEach(p => player$messages.set(p, []));
        },
        getPlayer(token) {
            return players.find(p => p.token === token)
        },
        endTurn() {
            drawCards(0);
        },
        drawCards,
        // selectColor(colorSelected) {
        //     if (publicState.mode === GAME_MODE.CHANGE_COLOR) {
        //         stack[0].card.color = colorSelected;
        //         publicState.mode = GAME_MODE.NATURAL;
        //         notifyPlayers(SENTENCE.SelectColor);
        //         moveToNextPlayer();
        //         emitter.emit(GAME_EVENTS.STATE_UPDATE);
        //     }
        // },
        playCard(card, lay) {
            card = Card.toCard(card);

            if (isCardValid(publicState, card)) {
                stack.unshift({card, lay});

                /*remove card from player hand*/
                currentPlayer.hand = currentPlayer.hand
                    .filter(handCard => handCard.id !== card.id);

                const colorName = colorCode$ColorName[card.color];

                publicState.lastMove = {
                    cards: [card],
                    player: publicState.players[currentIndex],
                    action: 'playCard',
                };

                notifyPlayers(SENTENCE.playCard, {card});

                if (publicState.mode !== GAME_MODE.TAKI) {
                    switch (card.symbol) {
                        case "T": {
                            notifyPlayers(SENTENCE.playTaki, {color: colorName});
                            publicState.mode = GAME_MODE.TAKI;
                            break;
                        }

                        case "S": {
                            let blockedPlayer = moveToNextPlayer();
                            moveToNextPlayer();
                            notifyPlayers(SENTENCE.playStop, {blockedPlayer});
                            break;
                        }

                        case "C": {
                            publicState.mode = GAME_MODE.CHANGE_COLOR;
                            notifyPlayers(SENTENCE.playColor, {color: colorName});
                            break;
                        }

                        case "W": {
                            publicState.mode = GAME_MODE.PLUS_TWO;
                            publicState.punishmentCounter += 2;
                            let nextPlayer = moveToNextPlayer();
                            //todo: should be error here currentPlayer == nextPlayer
                            notifyPlayers(SENTENCE.playPlus2, {nextPlayer});
                            break;
                        }

                        case "P": {
                            notifyPlayers(SENTENCE.playPlus, {color: colorName});
                            break;
                        }

                        case "D": {
                            publicState.direction = publicState.direction > 0 ? -1 : +1;
                            notifyPlayers(SENTENCE.playChangeDirection)
                        }

                        default: {
                            publicState.mode = GAME_MODE.NATURAL;
                            moveToNextPlayer();
                            notifyPlayers(SENTENCE.playRegular);

                        }
                    }

                }

                if (checkVictoryCondition()) {
                    publicState.victoryRank.push(currentPlayer.id);
                    players.splice(currentIndex, 1);
                }

                emitter.emit(GAME_EVENTS.STATE_UPDATE);
                return true
            } else {
                notifyPlayers(SENTENCE.playInvalidCard, {card});
                return false;
            }
        },

    };

    function moveToNextPlayer() {
        currentIndex = (players.length + currentIndex + publicState.direction) % players.length;
        currentPlayer = players[currentIndex];
        // emitMessage( `put or draw card` );
        return currentPlayer;
    }


    function checkVictoryCondition() {
        return currentPlayer.hand.length === 0;
    }

}
