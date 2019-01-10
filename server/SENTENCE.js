module.exports.factoryMessages = function (_state) {
    const state = Object.create(_state);

    state.__defineGetter__('playerName', () => state.players[state.turn].name);
    state.__defineGetter__('player', () => state.players[state.turn]);


    return {
        setup() {
            return {
                code: 0,
                public: `new game, ${state.player.toString()} begin by playing card`,
                private: `new game, ${state.player.toString()} you begin by playing any card`,
            }
        },
        drawCards({amount}) {
            return {
                code: 1,
                public: `${state.player.toString()} take ${amount > 1 ? `${amount} cards` : 'card'}`,
                private: `you take ${amount > 1 ? `${amount} cards` : 'card'}`,
            }
        },
        playTaki({color}) {
            return {
                code: 2,
                public: `${state.player.toString()} play ${color} TAKI`,
                private: `continue to play ${color} cards or end your turn`,
            }
        },
        playStop({blockedPlayer}) {
            return {
                code: 3,
                public: `${blockedPlayer.toString()} block, turn over to ${state.player.toString()}`,
                private: `you blocked ${blockedPlayer.toString()}, turn over to ${state.player.toString()}`,
            }
        },
        playColor(color) {
            return {
                code: 4,
                public: `${state.player.toString()} play Change Color `,
                private: `select the new color`,
            }
        },
        playPlus2({nextPlayer}) {
            return {
                code: 5,
                public: `${nextPlayer.toString()} punishment, must play +2 card or get ${state.punishmentCounter} cards`,
                private: `${nextPlayer.toString()} punishment, must play +2 card or get ${state.punishmentCounter} cards`,
            }
        },

        playPlus({color}) {
            return {
                code: 6,
                public: `${state.player.toString()} should play another ${color} card or get card from deck`,
                private: `put another ${color} card or take card from the deck`,
            }
        },
        playChangeDirection() {
            return {
                code: 7,
                public: `${state.player.toString()} play again`,
                private: `${state.player.toString()} play again`,
            }
        },
        playRegular() {
            return {
                code: 8,
                public: `${state.player.toString()} should play card or draw card from deck`,
                private: `${state.player.toString()} you should play card or draw card from deck`,
            }
        },
        SelectColor({color}) {
            return {
                code: 9,
                public: `${state.player.toString()} choose ${color} color`,
                private: `${color} selected`,
            }
        },
        playInvalidCard({card}) {
            return {
                code: 500,
                public: `${state.player.toString()} try to play invalid card ... `,
                private: `${card.toString()} are invalid to play..`,
            }
        },

    }
};
