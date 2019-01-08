module.exports.factoryMessages = function (_state) {
    const state = Object.create(_state);
    state.__defineGetter__('playerName', () => state.players[state.turn].name);

    return {
        setup() {
            return {
                code: 0,
                public: `new game, ${state.playerName} begin by playing card`,
                private: `new game, ${state.playerName} you begin by playing any card`,
            }
        },
        drawCards({amount}) {
            return {
                code: 1,
                public: `${state.playerName} take ${amount > 1 ? `${amount} cards` : 'card'}`,
                private: `you take ${amount > 1 ? `${amount} cards` : 'card'}`,
            }
        },
        playTaki({color}) {
            return {
                code: 2,
                public: `${state.playerName} play ${color} TAKI`,
                private: `continue to play ${color} cards or end your turn`,
            }
        },
        playStop({blockedPlayer}) {
            return {
                code: 3,
                public: `${blockedPlayer.name} block, turn over to ${state.playerName}`,
                private: `you blocked ${blockedPlayer.name}, turn over to ${state.playerName}`,
            }
        },
        playColor(color) {
            return {
                code: 4,
                public: `${state.playerName} play Change Color `,
                private: `select the new color`,
            }
        },
        playPlus2({nextPlayer}) {
            return {
                code: 5,
                public: `${nextPlayer.name} punishment, must play +2 card or get ${state.punishmentCounter} cards`,
                private: `${nextPlayer.name} punishment, must play +2 card or get ${state.punishmentCounter} cards`,
            }
        },

        playPlus({color}) {
            return {
                code: 6,
                public: `${state.playerName} should play another ${color} card or get card from deck`,
                private: `put another ${color} card or take card from the deck`,
            }
        },
        playChangeDirection() {
            return {
                code: 7,
                public: `${state.playerName} play again`,
                private: `${state.playerName} play again`,
            }
        },
        playRegular() {
            return {
                code: 8,
                public: `${state.playerName} should play card or draw card from deck`,
                private: `${state.playerName} you should play card or draw card from deck`,
            }
        },
        playInvalid({card}) {
            return {
                code: 500,
                public: `${state.playerName} try to play invalid card ... `,
                private: `${card.symbol}/${card.color} are invalid to play..`,
            }
        },
        SelectColor({color}) {
            return {
                code: 9,
                public: `${state.playerName} choose ${color} color`,
                private: `${color} selected`,
            }
        },

    }
};
