import React, {Component} from "react";
import './icon.scss'

import snail from "../assets/avatar/001-snail.svg?raw"
import dog from "../assets/avatar/002-dog.svg?raw"
import monkey from "../assets/avatar/003-monkey.svg?raw"
import fox from "../assets/avatar/004-fox.svg?raw"
import bee from "../assets/avatar/005-bee.svg?raw"
import boy from "../assets/avatar/006-boy.svg?raw"
import student from "../assets/avatar/007-student.svg?raw"
import girl2 from "../assets/avatar/008-girl-2.svg?raw"
import girl1 from "../assets/avatar/009-girl-1.svg?raw"
import cat from "../assets/avatar/010-cat.svg?raw"
import penguin from "../assets/avatar/011-penguin.svg?raw"
import bird from "../assets/avatar/012-bird.svg?raw"
import chicken from "../assets/avatar/013-chicken.svg?raw"
import bee1 from "../assets/avatar/014-bee-1.svg?raw"
import dog1 from "../assets/avatar/015-dog-1.svg?raw"

import stopwatch from '../assets/icons/stopwatch.svg?raw'
import hosting from '../assets/icons/hosting.svg?raw'
import reset from '../assets/icons/reset.svg?raw'
import exit from '../assets/icons/turn-on.svg?raw'
import sortNumericAsc from '../assets/icons/sort-numeric-asc.svg?raw'
import sortNumericDesc from '../assets/icons/sort-numeric-desc.svg?raw'
import sortColor from '../assets/icons/color-sort.svg?raw'
import cardNumber1 from '../assets/icons/card0001.svg?raw'
import cardNumber2 from '../assets/icons/card0002.svg?raw'
import cardNumber3 from '../assets/icons/card0003.svg?raw'

// const parser = new DOMParser();
// const svgElement = parser.parseFromString(chromeSvg, "image/svg+xml");

const icons = {
    snail, dog, monkey, fox, bee, boy, student, 'girl-2': girl2,
    cat, penguin, bird, chicken, 'bee-1': bee1, 'dog-1': dog1, 'girl-1': girl1,
    stopwatch,hosting,reset,exit,sortColor,sortNumericAsc,sortNumericDesc,
    cardNumber1,cardNumber2,cardNumber3
};
export default function Icon({className, iconName, children, title,onClick,value}) {
    // return <i className={`${'icon'} ${className}`}>
    //     {Array(27).fill('').map( (e,i)=> <span key={i} className={"path"+(i+1)}></span>)}
    // </i>
    return <tk-icon class={(className|| '') + ' icon'} title={title} onClick={onClick} value={value}>
        {React.createElement('span', {
            dangerouslySetInnerHTML: {__html: icons[iconName]},
        })}
        {children}
    </tk-icon>
    ;
}
