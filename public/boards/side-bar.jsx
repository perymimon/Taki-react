import {connect} from 'unistore/react';
import './side-bar.scss'

export default connect('messages',
    function ({messages}) {
        return <side-bar>
            {
                messages.map( message => {
                    return <div key={message.id}>{message.text}</div>
                })
            }
        </side-bar>
    }
)
