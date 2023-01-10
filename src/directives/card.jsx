import './card.scss';
import React, {Component, useState} from "react";
import get from 'lodash/get'
import {classnames} from '../utils/utils';


export default function Card({card, onClick, className, children}) {
    const {layRotate,layOrigin} = card || {};
    const style = layRotate && layOrigin && {
        transform: `rotate(${layRotate}deg)`,
        transformOrigin: `${layOrigin[0]}% ${layOrigin[1]}%`,
    };
    const state = {
        isInvalid: false,
    };

    return <tk-card class={`${className || ""} ${get(card, 'color') || ''}`}
                    onClick={onClick}
                    style={style}
                    id={get(card, 'id')}
                    data-symbol={get(card, 'symbol')}>{children}</tk-card>

}
