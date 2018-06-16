import React from 'react';
import { connect } from 'react-redux';

import {Link} from 'react-router';
import {toggleSideBarAction, updateCurrentNotification} from '../actions/actions';
import {getNotification} from '../actions/apiActions';
import Constants from '../constants/constants';

const mapStateToProps = (store) => {
	return {
		userDetails: store.userDetails,
		notifications: store.notifications,
		sideBar: store.sideBar
	}
}

class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.toggleSideBar = this.toggleSideBar.bind(this);
		this.getNotificationsPage = this.getNotificationsPage.bind(this);
		// console.log(this);
		this.isOpen = this.isOpen.bind(this);
	}
	componentWillMount() {
		this.props.dispatch(updateCurrentNotification(getNotification(this.props.userDetails.warehouse_id, this.props.userDetails.role_id)));
	}

	toggleSideBar() {
		this.props.dispatch(toggleSideBarAction());
	}

	logout() {
		Constants.genericConstants.LocalStorage.removeItem("authId");
		Constants.genericConstants.LocalStorage.removeItem("userDetails");
		window.location = "login.html";
	}

	getNotificationsPage() {
		let temp = this.props.notifications.map((elem, index)=> {
			return (
				<li key={index}><Link to={elem.link}>{elem.message}</Link></li>
			)
		});
		return temp;
	}


	isOpen() {
		return 'navbar navbar-default padding-5 ' +((this.props.sideBar.hideSideBar) ?'top-bar-navigation-close':'top-bar-navigation');
	}

	render() {
		return (
			<div className={this.isOpen()}>
				<div className="col-sm-1 font-28 ">
					<i className="glyphicon glyphicon-menu-hamburger cusor-pointer" onClick={this.toggleSideBar}></i>
				</div>
				<div className="col-sm-5 font-24 col-sm-offset-3 text-center">
					{this.props.userDetails.warehouse_location} Warehouse <span className="font-12">({Constants.roleConstants[this.props.userDetails.role_id]})</span>
				</div>

				<div className="col-sm-2">
					<div className="col-sm-6">
						<div className="dropdown">
						<span className="btn dropdown-toggle border-0 nav-background-color" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
									<span className="notification-count">{this.props.notifications.length }</span>
							<i className="glyphicon glyphicon-bell"></i>
							<span className="caret"></span>
						</span>

							<ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
								{this.getNotificationsPage()}
							</ul>
						</div>
					</div>

					<div className="col-sm-6">
						<div className="dropdown">
						<span className="btn dropdown-toggle border-0 nav-background-color" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
							{this.props.userDetails.name}&nbsp;<i className="glyphicon glyphicon-user"></i>
							<span className="caret"></span>
						</span>
							<ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
								<li className="padding-10 text-center">
									{Constants.roleConstants[this.props.userDetails.role_id]}
								</li>

								<li className="padding-10 cusor-pointer" onClick={this.logout}><i className="glyphicon glyphicon-log-out"></i>&nbsp;Logout</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}
}


export default connect(mapStateToProps)(Nav)
