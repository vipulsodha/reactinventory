import React from 'react';

import {showNotificationusBar} from '../actions/actions';
import {connect} from 'react-redux';


class Test extends React.Component {

    componentWillMount() {
        this.props.dispatch(showNotificationusBar("Not found", "error"));
    }

    render() {
        console.log(this.props);

        return (
            <div className="custom-container">Not Found</div>
        )
    }
}


export default connect()(Test);