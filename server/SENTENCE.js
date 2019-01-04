module.exports.messages ={
  setup: ({currentPlayer})=>({
      code:0,
      other: `new game, ${currentPlayer.name} begin by playing card`,
      personal: `new game, ${currentPlayer.name} you begin by playing any card`
  }),
  drawCards:({amount,currentPlayer })=>({
      code:1,
      other: `${currentPlayer.name} take ${ amount>1? `${amount} cards`: 'card'}`,
      personal:`you take ${ amount>1? `${amount} cards`: 'card' }`
  }),
  playTaki: ({color, currentPlayer})=>({
      code:2,
      other: `${currentPlayer.name} play ${color} TAKI`,
      personal: `continue to play ${color} cards or end your turn`
  }),
  playStop: ({blockedPlayer,currentPlayer})=> ({
      code:3,
      other:`${blockedPlayer.name} block, turn over to ${ currentPlayer.name }`,
      personal:`you ${blockedPlayer.name} block, turn over to ${ currentPlayer.name }`
  }),
  playColor:({color,currentPlayer})=>({
      code: 4,
      other: `${currentPlayer.name} play Color Change`,
      personal: `select the new color`
  }),
  playPlus2: ({nextPlayer})=>({
      code:5,
      other: `${nextPlayer.name} punishment, must play +2 card or get ${state.punishmentCounter} cards`,
      personal: `${nextPlayer.name} punishment, must play +2 card or get ${state.punishmentCounter} cards`
  }),
  playPlus: ({currentPlayer,color})=>({
      code:6,
      other: `${currentPlayer.name} should play another ${color} card or get card from deck`,
      personal:`put another ${color} card or take card from the deck`
  }),
  playChangeDirection:({currentPlayer}) =>({
      code: 7,
      other: `${currentPlayer.name} play again`,
      personal: `${currentPlayer.name} play again`
  }),
  playRegular:({currentPlayer}) =>({
      code: 8,
      other: `${currentPlayer.name} should play card or draw card from deck`,
      personal: `${currentPlayer.name} you should play card or draw card from deck`
  }),
  playInvalid: ({card,currentPlayer})=>({
      code:500,
      other:`${currentPlayer.name} try to play invalid card ... `,
      personal: `${card.symbol}/${card.color} are invalid to play..`
  }),
  SelectColor({color, currentPlayer}){
      return {
          code: 9,
          other: `${currentPlayer.name} choose ${color} color`,
          personal: `${color} selected`
      }
  }





};
