import Icon from './icon';
import {connect} from '../link';
import React from "react";
import './counter-down.scss';
import {Timer} from '../../common/Timer.js';
import {animate} from '../utils/utils';


import {GAME_SETTING} from '../../common/game-consts'


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
    ticksCallback.forEach(cb => cb(progress));
}, 200);

let lastTurn = -1;
let lastTimeLeft = 0;
const ticksCallback = new Set();

export default connect('timeLeft, turn')(
    function CounterDown({timeLeft, turn, onTick}) {
        // const classState = classnames({});
        onTick && ticksCallback.add(onTick);
        const turnMove = (lastTurn !== turn) || (lastTimeLeft < timeLeft);
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
                <Icon iconName="stopwatch">
                    <tk-text class="self-center">0</tk-text>
                </Icon>
                <Icon iconName="stopwatch">
                    <tk-text class="self-center">60</tk-text>
                </Icon>
            </tk-timer>
        )
    },
)
