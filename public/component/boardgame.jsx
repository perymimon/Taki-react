import React, {Component} from "react";
import './boardgame.scss';
import Card from './card'

import {connect} from 'unistore/react';
// import  {connect} from 'unistore/src/integrations/react';
import {actions} from '../store/store';


function boardgame({stack, deck, messages, players,turn, lastMove, drawCards}) {
    return (
        <board-game>
            <div className="player-turn">
                {/*{lastMove && <div>{lastMove.player.name} just play <Card card={lastMove.card}/> </div>}*/}
                {/*turn {players[turn].name}*/}
                {/*<TalkBox messages={messages}/>*/}
            </div>
            <Card className="stack" card={stack.topCard}/>
            <Card className="deck" onClick={() => drawCards()}>{deck.length}</Card>
        </board-game>
    )
}

const Boardgame  =connect(['stack','deck','messages','players','turn'],actions)(boardgame);
export default Boardgame;


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
