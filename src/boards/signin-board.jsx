import './signin-board.scss'
import React from 'react';
import Icon from '../directives/icon'
import {store} from '../store/store'
import {animate} from '../utils/utils';

const avatars = [
    'snail', 'dog', 'monkey','fox', 'bee', 'boy',  'student','girl-2',
    'cat', 'penguin', 'bird',  'chicken', 'bee-1', 'dog-1',  'girl-1'
];

export default function SignInBoard(props) {
    return (
        <form className="sign-in-board board shiny-block" onSubmit={(e) => submit(e)}>
            <input placeholder="your name" name="name" />
            <input placeholder="slogan" name="slogan" />
            <fieldset className={'avatar-select'} name="avatar-select">
                <div className={'flex-inner-wrapper'}>
                {avatars.map(iconName => (
                    <label key={iconName}>
                        <input name="avatar" type="radio" value={iconName} tabIndex="true"/>
                        <Icon iconName={iconName}/>
                    </label>
                ))}
                </div>
            </fieldset>
            <button type="submit" className="main-button" tabIndex="true">join</button>
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

    if(!data.name){
        animate(formElements.name,'heartBeat');
        return false
    }

    if(!data.slogan){
        animate(formElements.slogan,'heartBeat');
        return false
    }

    if(!data.avatar){
        animate(formElements['avatar-select'],'heartBeat');
        return false
    }

    store.run.login(data);
    return false;
}
