import React from 'react';
import {connect} from 'react-redux';

import {getCustomerDetails} from '../actions/apiActions'
import {updateCurrentCusotmerDetails} from '../actions/actions'
import { hashRedirect } from '../utility/redirectFunctions'


import {Link} from 'react-router';

const mapStateToProps = (store) => {
    return {
        customerDetails: store.currentCustomerDetails
    }
}


class CustomerDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let customerId = this.props.routeParams.customerId;
        this.props.dispatch(updateCurrentCusotmerDetails(getCustomerDetails(customerId)));
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.routeParams.customerId != nextProps.routeParams.customerId) {
            let customerId = nextProps.routeParams.customerId;
            this.props.dispatch(updateCurrentCusotmerDetails(getCustomerDetails(customerId)));
        }

    }

    getAddressList(list) {

        let temp = list.map((elem, index) => {
            return (
                <tr key={index}>
                    <td>{elem.shipping_address}</td>
                    <td>{elem.address_name}</td>
                </tr>
            )
        });
        return temp;
    }

    closeModal() {
        hashRedirect("/customers");
    }

    render() {
        return (
            <div className="custom-modal fadeIn">
                <div className="header">
                    <i className="close-button glyphicon glyphicon-remove cusor-pointer" onClick={this.closeModal}></i>
                    <h3>{this.props.customerDetails.company_name}</h3>
                </div>
                <div className="info-container">
                    <img className="customer-image"/>
                    <span className="span-class"><b>Customer Name</b>{this.props.customerDetails.name}</span>
                    <span className="span-class"><b>Company Name</b>{this.props.customerDetails.company_name}</span>
                    <span className="span-class"><b>Phone No.</b>{this.props.customerDetails.ph_no}</span>
                    <span className="span-class"><b>Email</b>{this.props.customerDetails.email_id}</span>
                    <span className="span-class"><Link to={`/customers/${this.props.customerDetails.customer_id}/orders`}><b>Show Orders</b></Link></span>
                </div>
                <div className="address-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>Address name</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.getAddressList(this.props.customerDetails.addressDetails)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(CustomerDetails);