import React from 'react';

import {showNotificationusBar} from '../actions/actions';
import {connect} from 'react-redux';


class Test extends React.Component {

    componentWillMount() {
        this.props.dispatch(showNotificationusBar("Not found", "error"));
    }

    render() {

        return (
            <div className="custom-container">Not Allowed</div>
        )
    }
}


export default connect()(Test);