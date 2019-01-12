import './card.scss';
import React, {Component} from "react";
import get from 'lodash/get'


export default function ({card, onClick, className, children, lay}) {
        const style = lay && {
            transform: `rotate(${lay.rotate}deg)`,
            transformOrigin: `${lay.origin[0]}% ${lay.origin[1]}%`,
        };

    return <tk-card class={`${className || ""} ${get(card, 'color')}`}
                    onClick={onClick}
                    data-symbol={get(card, 'symbol')}>{children}</tk-card>

}
