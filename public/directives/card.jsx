import './card.scss';
import React, {Component, useState} from "react";
import get from 'lodash/get'
import {classnames} from '../utils/utils';


export default function Card({card, onClick, className, children, lay}) {
    const style = lay && {
        transform: `rotate(${lay.rotate}deg)`,
        transformOrigin: `${lay.origin[0]}% ${lay.origin[1]}%`,
    };
    // const [anime, setAnime] = useState('');
    const state = {
        isInvalid: false,
    };

    // const [stateClass, setState] = useState(state);

    // function updateState(){
    //     setState(state);
    // }
    //
    //
    // const animations = `animated ${classnames(stateClass)}` ${animations};

    return <tk-card class={`${className || ""} ${get(card, 'color') || ''}`}
                    onClick={onClick}
                    style={style}
                    id={get(card, 'id')}
                    data-symbol={get(card, 'symbol')}>{children}</tk-card>

}
