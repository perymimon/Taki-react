import './game-board.scss';
import React, {Component} from "react";
import Card from '../directives/card'
import get from 'lodash/get';


const {GAME_MODE} = require('../../common/game-consts');

import {connect} from 'unistore/src/integrations/react';
// import  {connect} from 'unistore/src/integrations/react';
import {store, actions} from '../store/store';
import {classnames} from '../utils/utils';


export default connect('stack, deck, mode, punishment')(
    function GameBoard({stack, deck, mode, punishment}) {
        var topStackCards = [...stack.topCards];
        var topCard = stack.topCards[0];
        const classState = classnames({
            'taki-mode': (mode === GAME_MODE.TAKI),
            'plus-2-mode': (mode === GAME_MODE.PLUS_TWO),
            'change-color-mode': (mode === GAME_MODE.CHANGE_COLOR),
            'deck-empty':!deck.length,
            [get(topCard, 'color')]:get(topCard, 'color')
        });
        const markerText = {
            [GAME_MODE.TAKI]: 'TAKI',
            [GAME_MODE.PLUS_TWO]: '+' + punishment,
            [GAME_MODE.CHANGE_COLOR]: 'COLOR',
        }
        return (
            <board-game class={classState}>
                <tk-text class="marker">{markerText[mode]}</tk-text>
                <tk-card class="stack self-center">
                    {topStackCards.reverse().map((card) => {
                        return <Card card={card} key={card.id}/>
                    })}
                </tk-card>

                <tk-card class="deck" onClick={store.run.drawCards}>
                    <tk-text class="">{deck.length}</tk-text>
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
