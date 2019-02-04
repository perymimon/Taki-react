import React, {Component} from "react";
import './icon.scss'

import snail from "../assets/avatar/001-snail.svg";
import dog from "../assets/avatar/002-dog.svg";
import monkey from "../assets/avatar/003-monkey.svg";
import fox from "../assets/avatar/004-fox.svg";
import bee from "../assets/avatar/005-bee.svg";
import boy from "../assets/avatar/006-boy.svg";
import student from "../assets/avatar/007-student.svg";
import girl2 from "../assets/avatar/008-girl-2.svg";
import girl1 from "../assets/avatar/009-girl-1.svg";
import cat from "../assets/avatar/010-cat.svg";
import penguin from "../assets/avatar/011-penguin.svg";
import bird from "../assets/avatar/012-bird.svg";
import chicken from "../assets/avatar/013-chicken.svg";
import bee1 from "../assets/avatar/014-bee-1.svg";
import dog1 from "../assets/avatar/015-dog-1.svg";

import stopwatch from '../assets/icons/stopwatch.svg'

// const parser = new DOMParser();
// const svgElement = parser.parseFromString(chromeSvg, "image/svg+xml");

const icons = {
    snail, dog, monkey, fox, bee, boy, student, 'girl-2': girl2,
    cat, penguin, bird, chicken, 'bee-1': bee1, 'dog-1': dog1, 'girl-1': girl1,
    stopwatch,
};
export default function Icon({className, iconName, children}) {
    // return <i className={`${'icon'} ${className}`}>
    //     {Array(27).fill('').map( (e,i)=> <span key={i} className={"path"+(i+1)}></span>)}
    // </i>
    return <tk-icon class={(className|| '') + ' icon'}>
        {React.createElement('span', {
            dangerouslySetInnerHTML: {__html: icons[iconName]},
        })}
        {children}
    </tk-icon>
    ;
}
