import './game-board.scss';
import React, {Component} from "react";
import Card from '../directives/card'
import get from 'lodash/get';


const {GAME_MODE} = require('../../common/game-consts');

import {connect} from 'unistore/src/integrations/react';
// import  {connect} from 'unistore/src/integrations/react';
import {store, actions} from '../store/store';
import {classnames} from '../utils/utils';


export default connect('stack, deck, mode')(
    function GameBoard({stack, deck, mode}) {
        var topStackCards = [...stack.topCards];
        var topCard = stack.topCards[0];
        const classState = classnames({
            'taki-mode': (mode === GAME_MODE.TAKI),
        });
        return (
            <board-game class={`${classState}  ${get(topCard, 'card.color')}`}>
                <tk-text>TAKI</tk-text>
                <tk-card class="stack self-center">
                    {topStackCards.reverse().map(({card, lay}) => {
                        return <Card card={card} lay={lay} key={card.id}/>
                    })}
                </tk-card>

                <tk-card class="deck flip-transform" onClick={store.run.drawCards}>
                    <tk-text class="flip-transform">{deck.length}</tk-text>
                </tk-card>

            </board-game>
        )
    },
)


// class TalkBox extends Component {
//     componentWillReceiveProps({messages}) {
//         const lines = this.talkBox.querySelectorAll('.text-line');
//         [...lines ].forEach( el => el.classList.add('leave') );
//         const netTags = messages.map( msg => `<div class="text-line">${msg.text}</div>`);
//         this.talkBox.insertAdjacentHTML('afterbegin',netTags);
//     }
//
//     shouldComponentUpdate(nextProps, nextState){
//         return false;
//     }
//     componentDidMount() {
//         this.talkBox.addEventListener('transitionend', (evt) => {
//             evt.target.remove();
//         });
//     }
//    render({messages}) {
//         return (
//             <talk-box ref={el => this.talkBox = el}>
//                 {messages.map(message => (
//                     <div class="text-line">{message}</div>
//                 ))}
//             </talk-box>
//         )
//     }
//
//
// }
