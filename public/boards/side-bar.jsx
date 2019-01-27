import {connect, PlayerName} from '../link';
import React, {Component} from "react";
import './side-bar.scss'
import Card from '../directives/card'

const cardPropsExp = /{(\w):(\w)}/;
const tokensExp = /({\w:\w})|(\[\w+?])/;
const userExp = /\[(\w+?)]/;

function Messages({message}) {
    if (message.code === 'separator') {
        return <tk-separator/>
    } else {
        const text = message.text;
        const tokens = text.split(tokensExp).filter(Boolean); /*clean undefined*/
        let match = null;
        return (
            <div className={'message'}>{
                tokens.map(function (token,i) {
                    match = token.match(cardPropsExp);
                    if (match) {
                        const [, symbol, color] = match;
                        const card = {symbol, color, id:[symbol,color].join('')};
                        return <Card card={card} key={card.id}/>;
                    }
                    match = token.match(userExp);
                    if (match) {
                        const [, playerName] = match;
                        return <PlayerName name={playerName} key={playerName}/>;
                    }
                    return token;
                })
            }</div>
        );
    }
}

export default connect('messages')(
    function SideBar({messages}) {
        return (
            <side-bar>
                {
                    messages.map(message => {
                      return <Messages key={message.id } message={message}/>;
                    })
                }
            </side-bar>
        )
    },
)
