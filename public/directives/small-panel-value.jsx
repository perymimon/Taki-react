import './small-panel-value.scss';
import React from 'react';
import Icon from '../component/icon';


export default function SmallPanelValue({icon, value,className}) {

    return (
        <small-panel-value class={`${className} panel-show-value`} value={value}>
            <Icon className={`${icon}`}/>
            <text>{value}</text>
        </small-panel-value>
    )

}
