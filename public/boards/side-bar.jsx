import {connect} from 'unistore/react';
import React, {Component} from "react";
import './side-bar.scss'
import Card from '../directives/card'


const cardPropsExp = /{(\w):(\w)}/;
const cardExp = /({\w:\w})/;

function toCardObject(token) {
    const [, symbol, color] = token.match(cardPropsExp);
    return {symbol, color}
}

function Messages({children}) {
    const text = children;
    const tokens = text.split(cardExp);

    // return (
    //     <div>{
    //         tokens.map(function (token) {
    //             return cardExp.test(token) ? <Card card={toCardObject(token)}/> : token
    //         })
    //     }</div>
    // );
    const pp = tokens.map(function (token) {
        return cardExp.test(token) ? <Card card={toCardObject(token)}/> : token
    });

    return pp
}

export default connect('messages')(
    function ({messages}) {
        return (
            <side-bar>
                {
                    messages.map(message => {
                        return <Messages key={message.id}>{message.text}</Messages>
                    })
                }
            </side-bar>
        )
    },
)
