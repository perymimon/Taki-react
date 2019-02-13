import React, {Component} from "react";
import './icon.scss'

import snail from "../assets/avatar/001-snail.html";
import dog from "../assets/avatar/002-dog.html";
import monkey from "../assets/avatar/003-monkey.html";
import fox from "../assets/avatar/004-fox.html";
import bee from "../assets/avatar/005-bee.html";
import boy from "../assets/avatar/006-boy.html";
import student from "../assets/avatar/007-student.html";
import girl2 from "../assets/avatar/008-girl-2.html";
import girl1 from "../assets/avatar/009-girl-1.html";
import cat from "../assets/avatar/010-cat.html";
import penguin from "../assets/avatar/011-penguin.html";
import bird from "../assets/avatar/012-bird.html";
import chicken from "../assets/avatar/013-chicken.html";
import bee1 from "../assets/avatar/014-bee-1.html";
import dog1 from "../assets/avatar/015-dog-1.html";

import stopwatch from '../assets/icons/stopwatch.html'
import hosting from '../assets/icons/hosting.html'
import reset from '../assets/icons/reset.html'
import exit from '../assets/icons/turn-on.html'

// const parser = new DOMParser();
// const svgElement = parser.parseFromString(chromeSvg, "image/svg+xml");

const icons = {
    snail, dog, monkey, fox, bee, boy, student, 'girl-2': girl2,
    cat, penguin, bird, chicken, 'bee-1': bee1, 'dog-1': dog1, 'girl-1': girl1,
    stopwatch,hosting,reset,exit
};
export default function Icon({className, iconName, children, title}) {
    // return <i className={`${'icon'} ${className}`}>
    //     {Array(27).fill('').map( (e,i)=> <span key={i} className={"path"+(i+1)}></span>)}
    // </i>
    return <tk-icon class={(className|| '') + ' icon'} title={title}>
        {React.createElement('span', {
            dangerouslySetInnerHTML: {__html: icons[iconName]},
        })}
        {children}
    </tk-icon>
    ;
}
