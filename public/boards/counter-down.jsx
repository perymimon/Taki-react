import {connect} from 'unistore/react';
import React, {Component} from "react";
import './counter-down.scss';
import {Timer} from '../../common/Timer';
import {animate, classnames} from '../utils/utils';


const {GAME_MODE, GAME_STAGE, SOCKET_EVENTS, GAME_SETTING} = require('../../common/game-consts');


function toSec(timePass) {
    return Math.ceil((GAME_SETTING.TURN_COUNTER - timePass) / 1000);
}

const counterDown = new Timer(GAME_SETTING.TURN_COUNTER, true, true);

counterDown.tick(function () {
    const timeLeft = toSec(counterDown.timePass);
    const textEl = document.querySelector('tk-timer tk-text');
    lastTimeLeft = timeLeft;
    textEl && (textEl.innerText = timeLeft);
    const progress = counterDown.progress;
    ticksCallback.forEach( cb => cb(progress));
}, 200);

let lastTurn = -1;
let lastTimeLeft = 0;
const ticksCallback = new Set();

export default connect('timeLeft, turn')(
    function CounterDown({timeLeft, turn, onTick}) {
        // const classState = classnames({});
        onTick && ticksCallback.add(onTick);
        const turnMove = (lastTurn !== turn) || (lastTimeLeft < timeLeft);
        console.log(timeLeft);
        counterDown.sync(timeLeft);
        if (turnMove) {
            const tkTimer = document.querySelector('tk-timer');
            tkTimer && animate(tkTimer, 'rotate');
            requestAnimationFrame(_ => {
                const textEl = document.querySelector('tk-timer tk-text:nth-child(2)');
                textEl && (textEl.innerText = lastTimeLeft);
            })

        }

        return (
            <tk-timer className="time-left">
                <i className="icon-stopwatch">
                    <tk-text class="self-center">0</tk-text>
                </i>
                <i className="icon-stopwatch">
                    <tk-text class="self-center">60</tk-text>
                </i>
            </tk-timer>
        )
    },
)
