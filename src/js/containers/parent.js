import React from 'react';
import { connect } from 'react-redux';

import Nav from './nav'
import SideBar from './sideBar';
import NotificationBar from '../components/onPageNotificationBar'

import {updateUserDetailsAction} from '../actions/actions';
import {getUserDetails} from '../actions/apiActions';
import Constants from '../constants/constants';

const  mapStateToProps = (store) => {
	return {
		sideBar: store.sideBar,
		userDetails: store.userDetails
	}

	store.sideBar;
}


const getSideBarList = (userRole) => {
	return Constants.sideBarRoles[userRole];
}


class Parent extends React.Component {
	constructor(props) {
		super(props);
		this.getSideBarClasses = this.getSideBarClasses.bind(this);
	}



	getSideBarClasses() {
		return 'transition-all '+((this.props.sideBar.hideSideBar) ?'content-container-close':'content-container');
	}
	componentWillMount() {
		this.props.dispatch(updateUserDetailsAction(getUserDetails()));
	}
	render() {
		return (
			<div id="parent">
				<SideBar list = {getSideBarList(this.props.userDetails.role_id)} />
				<div className={this.getSideBarClasses()}>
					<Nav />
					<NotificationBar message=" hello"/>
						{this.props.children}
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps)(Parent)
