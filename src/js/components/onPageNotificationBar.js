/**
 * Created by Dell-1 on 08-12-2016.
 */

import React from 'react';

import {connect} from 'react-redux';
import {hideNotificationBar} from '../actions/actions';

const mapStateToProps = (store) => {
    return {
        notificationStatus: store.notificationStatus
    }
}

class NotificationBar extends React.Component {

    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
        this.timeOut = this.timeOut.bind(this);
    }

    close() {
        this.props.dispatch(hideNotificationBar());
    }

    timeOut() {
        setTimeout(()=> {
            this.props.dispatch(hideNotificationBar());
        }, 2000);
    }

    render() {
        let  opts ={}
        if(this.props.notificationStatus.show) {
            if(this.props.notificationStatus.type == "error") {
                opts['className'] = "notification-bar slideDown error-background";
            } else {
                opts['className'] = "notification-bar slideDown";
            }
            this.timeOut();
        } else {
            opts['className'] = "notification-bar display-none";
        }
        // if (this.props.notificationStatus.timeOut) {
        //     this.timeOut();
        // }

        return (
            <div {...opts} ><span>{this.props.notificationStatus.message}</span><i onClick={this.close} className="glyphicon glyphicon-remove float-right cusor-pointer"></i></div>
        )
    }
}

export default connect(mapStateToProps)(NotificationBar);

