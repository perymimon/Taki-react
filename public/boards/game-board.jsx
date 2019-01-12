import './game-board.scss';
import React, {Component} from "react";
import Card from '../directives/card'

import {connect} from 'unistore/src/integrations/react';
// import  {connect} from 'unistore/src/integrations/react';
import {store, actions} from '../store/store';


export default connect('stack, deck, stackLay')(
    function GameBoard({stack, deck}) {
        return (
            <board-game>
                {/*<div className="player-turn">*/}
                {/*{lastMove && <div>{lastMove.player.name} just play <Card card={lastMove.card}/> </div>}*/}
                {/*turn {players[turn].name}*/}
                {/*<TalkBox messages={messages}/>*/}
                {/*</div>*/}
                <div className="stack self-center">
                    {stack.topCards.reverse().map(({card,lay}) => {
                        return <Card card={card} lay={lay} key={card.id}/>
                    })}
                </div>

                <div className="deck" onClick={store.run.drawCards}>
                    {deck.length}
                    <Card className="flip-card"/>
                </div>

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
