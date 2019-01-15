import './game-board.scss';
import React, {Component} from "react";
import Card from '../directives/card'

import {connect} from 'unistore/src/integrations/react';
// import  {connect} from 'unistore/src/integrations/react';
import {store, actions} from '../store/store';


export default connect('stack, deck, stackLay')(
    function GameBoard({stack, deck}) {
        var topStackCards = [...stack.topCards];
        return (
            <board-game>
                <tk-card class="stack self-center">
                    {topStackCards.reverse().map(({card,lay}) => {
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
