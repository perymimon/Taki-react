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

function Messages({value}) {


    if( value ==='separator'){
        return <separator/>
    }else{
        const text = value.text;
        const tokens = text.split(cardExp);
        return (
            <div className={'message'}>{
                tokens.map(function (token) {
                    return cardExp.test(token) ? <Card card={toCardObject(token)} key={0}/> : token
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
