import React, {Component} from "react";

import Fragment from '../utils/fragment';
import Icon from './icon'
import "./welcome-board.scss"

import {connect} from 'unistore/react';
import {actions} from '../store/store';

var playerName = '';
var slogan = '';

function setPlayerName({target}) {
    playerName = target.value;
}

function setPlayerSlogan({target}) {
    slogan = target.value;
}

const avatars = [
    'icon-snail', 'icon-monkey', 'icon-bee', 'icon-student', 'icon-girl-1', 'icon-penguin',
    'icon-chicken', 'icon-dog-1', 'icon-dog', 'icon-fox', 'icon-boy', 'icon-girl-2', 'icon-cat',
    'icon-bird', 'icon-bee-1'
];


function WelcomeBoard({player, login, startGame}) {

    function submit(event) {
        event.preventDefault();
        const elements = event.target.elements;
        const data = {
            name: elements.name.value,
            slogan: elements.slogan.value,
            avatar: elements.avatar.value
        };

        login(data);
        return false;
    }

    return (
        <welcome-board class="board shiny-block">
            {!player ?

                    <form onSubmit={submit}>
                        <input placeholder="your name" name="name" onChange={setPlayerName}/>
                        <input placeholder="slogan" name="slogan" onChange={setPlayerSlogan}/>
                        <avatart-select>
                            {avatars.map(icon => (
                                <label key={icon}>
                                    <input name="avatar" type="radio" value={icon} tabIndex="true"/>
                                    <Icon className={icon}/>
                                </label>
                            ))}
                        </avatart-select>
                        <button type="submit" className="main-button" tabIndex="true"> join </button>
                    </form>

                :
                    <React.Fragment>
                        <Icon className={player.avatar}/>
                        <h2>{player.name}</h2>
                        <h3>{player.slogan}</h3>
                        <button className="main-button start-game" onClick={startGame}>start game</button>
                    </React.Fragment>

            }
        </welcome-board>
    )

}

export default connect(['player'], actions)(WelcomeBoard);

