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
    const counterDown = new Timer(GAME_SETTING.TURN_COUNTER,false, true, function () {
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
        get prevTurn() {
            return getPrevTurnBefore(currentIndex);
        },
        mode: GAME_MODE.NATURAL,
        punishment: 0,
        direction: 1,
        victoryRank: [],
        get timeLeft() {
            return (GAME_SETTING.TURN_COUNTER - counterDown.timePass)
        }
    };
    const SENTENCE = require('./sentence').factoryMessages(publicState);

    function notifyPlayers(messageFactory, args={}, referrer) {
        referrer = referrer || currentPlayer;
        args.player = args.player || referrer;
        var {code, private, public, meta} = messageFactory(args);
        var id = shortId.generate();

        if(private){
            var personal = {id, code, text: private, meta, private: true};
            player$messages.get(referrer).push(personal);
        }

        if(public){
            var other = {id, code, text: public, meta, private: false};
            getOtherPlayer(referrer).forEach(function (p, i) {
                player$messages.get(p).push(other)
            });
        }


        emitter.emit(GAME_EVENTS.OUTGOING_MESSAGE, player$messages);
    }

    function getOtherPlayer(currentPlayer) {
        return players.filter(p => p !== currentPlayer);
    }

    /*ACTION*/
    function dealCards(amount, player) {
        if (deck.length < amount) {
            let returnStack = stack.splice(1);
            deck.push(...returnStack.sort(_ => Math.random() - .5));
        }
        const cards = deck.splice(0, amount);
        player.hand.push(...cards);
        return cards;
    }

    function drawCards(amount = 1, player = currentPlayer) {
        const punishmentMode = (publicState.mode === GAME_MODE.PLUS_TWO);
        if (punishmentMode) {
            amount = (publicState.punishment);
            publicState.punishment = 0;
        }

        const cards = dealCards(amount, player);

        if (cards.length === 0) {
            notifyPlayers(SENTENCE.deckIsEmpty, {amount}, player)
        } else if (punishmentMode) {
            notifyPlayers(SENTENCE.punishmentCards, {amount, cards}, player);
        } else {
            /*todo: fix private message when player is not the current player*/
            notifyPlayers(SENTENCE.drawCards, {amount, cards}, player);
        }


        if ([GAME_MODE.TAKI, GAME_MODE.PLUS_TWO].includes(publicState.mode)) {
            publicState.mode = GAME_MODE.NATURAL;
        }
        moveToNextPlayer();

        emitter.emit(GAME_EVENTS.STATE_UPDATE);
        return cards;
    }

    function playCard(card) {

        card = Card.toCard(card);

        if (isCardValid(publicState, card)) {
            stack.unshift(card);

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
                        publicState.punishment += 2;
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
                        moveToNextPlayer();
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
    }

    /** API **/
    return {
        on: emitter.on.bind(emitter),
        setup() {
            players.sort(_ => Math.random() - .5).forEach((player, i) => {
                dealCards(GAME_SETTING.INIT_CARD_EACH_PLAYER, player);
                player.index = i;
            });
            // Object.freeze(players);
            publicState.gameInProgress = true;
            moveToNextPlayer();
            notifyPlayers(SENTENCE.setup);
            emitter.emit(GAME_EVENTS.STATE_UPDATE);
        },
        joinPlayer(player) {
            if (this.isPlayerInGame(player.token)) return false;
            player.index = players.length;
            player.__defineGetter__('itHisTurn', function () {
                return this.index === currentIndex
            });
            players.push(player);
            if (publicState.gameInProgress) {
                dealCards(GAME_SETTING.INIT_CARD_EACH_PLAYER, player);
            }
            player$messages.set(player, []);
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
        getPlayer,
        endTurn() {
            drawCards(0);
        },
        drawCards(token, amount, player) {
            if (isPlayerInvalid(token)) return;
            return drawCards(amount, player);
        },
        // selectColor(colorSelected) {
        //     if (publicState.mode === GAME_MODE.CHANGE_COLOR) {
        //         stack[0].card.color = colorSelected;
        //         publicState.mode = GAME_MODE.NATURAL;
        //         notifyPlayers(SENTENCE.SelectColor);
        //         moveToNextPlayer();
        //         emitter.emit(GAME_EVENTS.STATE_UPDATE);
        //     }
        // },
        playCard(token, card) {
            if (isPlayerInvalid(token)) return false;
            playCard(card);
        },

    };

    function getPlayer(token) {
        return players.find(p => p.token === token)
    }

    function isPlayerInvalid(token) {
        const player = getPlayer(token);
        if (player === currentPlayer) {
            return false;
        }
        /*fix: add referer so player get his message*/
        notifyPlayers(SENTENCE.notYourTurn, {player}, player);
        return true;
    }

    function moveToNextPlayer() {
        currentIndex = getNextTurnAfter(currentIndex);
        currentPlayer = players[currentIndex];
        // emitMessage( `put or draw card` );
        counterDown.restart();
        return currentPlayer;
    }

    function getNextTurnAfter(turn) {
        return (players.length + turn + publicState.direction) % players.length;
    }

    function getPrevTurnBefore(turn) {
        return (players.length + turn + -1 * publicState.direction) % players.length;
    }

    function checkVictoryCondition() {
        return currentPlayer.hand.length === 0;
    }

}
