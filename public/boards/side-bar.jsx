import {connect} from 'unistore/react';
import React, {Component} from "react";
import './side-bar.scss'
import Card from '../directives/card'
import PlayerName from '../directives/player-name'


const cardPropsExp = /{(\w):(\w)}/;
const tokensExp = /({\w:\w})|(\[\w+?])/;
const userExp = /\[(\w+?)]/;

function Messages({value}) {
    if (value === 'separator') {
        return <separator/>
    } else {
        const text = value.text;
        const tokens = text.split(tokensExp).filter(Boolean); /*clean undefined*/
        let match = null;
        return (
            <div className={'message'}>{
                tokens.map(function (token) {
                    match = token.match(cardPropsExp);
                    if (match) {
                        const [, symbol, color] = match;
                        const card = {symbol, color};
                        return <Card card={card} key={card.id}/>;
                    }
                    match = token.match(userExp);
                    if (match) {
                        const [, playerName] = match;
                        return <PlayerName name={playerName}/>;
                    }
                    return token;
                })
            }</div>
        );
    }
}

export default connect('messages')(
    function ({messages}) {
        return (
            <side-bar>
                {
                    messages.map(message => {
                        return <Messages key={message.id} value={message}/>
                    })
                }
            </side-bar>
        )
    },
)
