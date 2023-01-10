import './small-panel-value.scss';
import React from 'react';
import Icon from './icon';

export default function SmallPanelValue({icon, value,className,children}) {
    return (
        <small-panel-value class={`${className} panel-show-value`} value={value}>
            {children}
            <Icon className={`${icon}`}/>
            <tk-text>{value}</tk-text>
        </small-panel-value>
    )

}
