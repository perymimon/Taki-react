import React, {Component} from "react";
import './card.scss';

export default function ({card = {color: ''}, onClick, className, children}) {

    return  <card-game class={`${className || ""} ${card.color}`}
                   onClick={onClick}
                   data-symbol={card.symbol}>{children}</card-game>

}