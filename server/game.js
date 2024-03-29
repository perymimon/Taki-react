import EventEmitter from 'node:events';

import {Timer} from '../common/Timer.js';
import {CycleIndexTracker} from '../common/IndexTracker.js';
import  {Card, getNewDeck}  from './taki-cards.js';

import shortId from 'shortid';
import {GAME_EVENTS, GAME_MODE, GAME_SETTING} from '../common/game-consts.js';
import {isCardValid} from '../common/common-methods.js';

import {factoryMessages} from "./sentence.js";

const colorCode$ColorName = {
    B: 'blue',
    R: 'red',
    G: 'green',
    Y: 'yellow',
    '': 'uncolor',
};

export function Game() {
    const emitter = new EventEmitter();
    const counterDown = new Timer(GAME_SETTING.TURN_COUNTER, false, true, function () {
        notifyPlayers(SENTENCE.timeEnd);
        drawCards()
    });

    let deck = getNewDeck();
    const stack = [];
    const players = [];
    const turnTracker = new CycleIndexTracker(players, -1);

    const player$messages = new Map;

    const publicState = {
        gameInProgress: false,
        gameEnd: false,
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
            return turnTracker.whatIndex();
        },
        get prevTurn() {
            return turnTracker.whatPrev();
        },
        mode: GAME_MODE.NATURAL,
        punishment: 0,
        direction: 1,
        round: 0,
        victoryScore: [],
        get timeLeft() {
            return (GAME_SETTING.TURN_COUNTER - counterDown.timePass)
        },
    };



    const SENTENCE = factoryMessages(publicState);

    function notifyPlayers(message, args = {}, referrer) {
        referrer = referrer || turnTracker.getCurrent();
        args.player = args.player || referrer;
        var msg = message(args);
        var id = shortId.generate();

        if (msg.private) {
            var personal = {...msg, id, text: msg.private, private: true};
            player$messages.get(referrer).push(personal);
        }

        if (msg.public) {
            var other = {...msg, id, text: msg.public, private: false};
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
        cards.forEach(c => {
            delete c.layOrigin;
            delete c.layRotate;
        });

        player.hand.push(...cards);
        return cards;
    }

    function drawCards(amount = 1, player) {
        player = player || turnTracker.getCurrent();
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
            const player = turnTracker.getCurrent();
            player.hand = player.hand.filter(handCard => handCard.id !== card.id);

            const colorName = colorCode$ColorName[card.color];

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
                        notifyPlayers(SENTENCE.playChangeDirection);
                        moveToNextPlayer();
                        break;
                    }

                    default: {
                        publicState.mode = GAME_MODE.NATURAL;
                        moveToNextPlayer();
                        notifyPlayers(SENTENCE.playRegular);

                    }
                }

            }

            if (checkVictoryCondition()) {
                calcualtePlayersScores();
                if (publicState.round >= publicState.endRound) {
                    endGame()
                }
            }

            emitter.emit(GAME_EVENTS.STATE_UPDATE);
            return true
        } else {
            notifyPlayers(SENTENCE.playInvalidCard, {card});
            return false;
        }
    }

    function calcualtePlayersScores() {
        turnTracker.getCurrent().score += GAME_SETTING.VICTORY_VALUE;
        players.forEach(player => {
            player.score += getPlayerScore(player);
        });
    }

    function getPlayerScore(player) {
        return player.hand.reduce(function (acc, card) {
            return acc + card.value;
        }, 0)
    }

    function endGame() {
        publicState.gameInProgress = false;
        publicState.gameEnd = true;
        counterDown.stop();
    }

    /** API **/
    return {
        on: emitter.on.bind(emitter),
        reset() {
            endGame();
            publicState.round = 0;
            turnTracker.reset();
            publicState.gameEnd = false;
            publicState.gameInProgress = false;

            if (players.length === 0) {
                emitter.emit(GAME_EVENTS.STATE_UPDATE);

            } else {
                this.setup({isNewRound: false});
            }
        },
        setup({isNewRound = false, rounds = GAME_SETTING.NUMBER_OF_ROUND}) {
            deck = getNewDeck();
            stack.length = 0;
            players.sort(_ => Math.random() - .5).forEach((player, i) => {
                player.hand.length = 0;
                dealCards(GAME_SETTING.INIT_CARD_EACH_PLAYER, player);
                player.index = i;
            });
            // Object.freeze(players);
            publicState.endRound = rounds;
            publicState.round = isNewRound ? publicState.round + 1 : 0;

            publicState.gameInProgress = true;
            moveToNextPlayer();
            notifyPlayers(isNewRound ? SENTENCE.newRound : SENTENCE.setup);

            emitter.emit(GAME_EVENTS.STATE_UPDATE);
        },
        joinPlayer(player) {
            const getPlayer = this.getPlayer;
            player.moveRoom('game');
            if (this.isPlayerInGame(player.token)) return false;
            player.index = players.length;
            player.score = 0;
            player.__defineGetter__('itHisTurn', function () {
                return this.index === turnTracker.whatIndex();
            });
            player.__defineGetter__('inGame', function () {
                return !!getPlayer(this.token) || null;
            });
            players.push(player);
            if (publicState.gameInProgress) {
                dealCards(GAME_SETTING.INIT_CARD_EACH_PLAYER, player);
            }
            player$messages.set(player, []);
            emitter.emit(GAME_EVENTS.STATE_UPDATE);
            return true;
        },
        exitPlayer(playerToken) {
            if (!this.isPlayerInGame(playerToken)) return false;
            const player = getPlayer(playerToken);
            if (player.index === turnTracker.whatIndex()) {
                moveToNextPlayer();
            }
            const i = players.indexOf(player);
            players.splice(i, 1);
            deck.splice(0, 0, ...player.hand);
            player.hand.length = 0;
            player$messages.delete(player);
            if (players.length === 0) {
                this.reset(false);
            }
            emitter.emit(GAME_EVENTS.STATE_UPDATE);

            return true;
        },

        isPlayerInGame(token) {
            return this.getPlayer(token);
        },
        getPlayerState(token) {
            const player = this.getPlayer(token) || null;
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
        drawCards(player, amount) {
            if (isPlayerInvalid(player)) return;
            if (publicState.mode === GAME_MODE.taki) {
                notifyPlayers(SENTENCE.drawCardInTakiMode);
                return false;
            }
            return drawCards(amount);
        },

        playCard(player, card) {
            if (isPlayerInvalid(player)) return false;
            playCard(card);
        },

    };

    function getPlayer(token) {
        return players.find(p => p.token === token)
    }

    function isPlayerInvalid(player) {
        if (player === turnTracker.getCurrent()) {
            return false;
        }
        /*fix: add referer so player get his message*/
        notifyPlayers(SENTENCE.notYourTurn, {player}, player);
        return true;
    }

    function moveToNextPlayer() {
        counterDown.restart();
        return turnTracker.moveNext();
    }

    function checkVictoryCondition() {
        return turnTracker.getCurrent().hand.length === 0;
    }

}
