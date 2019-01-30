import './signin-board.scss'
import React from 'react';
import Icon,{Icon2} from '../component/icon'
import {store,actions} from '../store/store'

const avatars = [
    'icon-snail', 'icon-monkey', 'icon-bee', 'icon-student', 'icon-girl-1', 'icon-penguin',
    'icon-chicken', 'icon-dog-1', 'icon-dog', 'icon-fox', 'icon-boy', 'icon-girl-2', 'icon-cat',
    'icon-bird', 'icon-bee-1',
];

export default function SignInBoard(props) {
    return (
        <form className="sign-in-board board shiny-block" onSubmit={(e) => submit(e)}>
            <input placeholder="your name" name="name" />
            <input placeholder="slogan" name="slogan" />
            <avatar-select>
                {avatars.map(iconName => (
                    <label key={iconName}>
                        <input name="avatar" type="radio" value={iconName} tabIndex="true"/>
                        <Icon className={iconName}/>
                    </label>
                ))}
            </avatar-select>
            <button type="submit" className="main-button" tabIndex="true"> join</button>
        </form>
    )
}


function submit(event) {
    event.preventDefault();
    const formElements = event.target.elements;
    const data = {
        name: formElements.name.value,
        slogan: formElements.slogan.value,
        avatar: formElements.avatar.value,
    };

    store.run.login(data);
    return false;
}
