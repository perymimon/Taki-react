const {GAME_MODE} = require('./game-consts');

exports.isCardValid = isCardValid;

function isCardValid(state, card) {
    /*if this is first card any card valid*/
    if (state.stack.topCards[0]){
        const lastCard = state.stack.topCards[0];

        switch (state.mode) {
            case GAME_MODE.NATURAL:
                const colorMatch = (card.color === lastCard.color);
                const symbolMatch = (card.symbol === lastCard.symbol);
                const isMagicCard = (card.color === 'M');
                return colorMatch || symbolMatch || isMagicCard;
            case GAME_MODE.CHANGE_COLOR:
                return true;
            case GAME_MODE.PLUS_TWO :
                /*strictMode*/
                return (card.symbol === 'W');
            case GAME_MODE.TAKI :
                /*strictMode*/
                return (card.color === lastCard.color);
        }
        return false;
    }
    return true;

}


function serverPrivate(object,key){
    Object.defineProperties(object,key,{
        enumerable:false
    })
}
