import React from 'react';
import {connect} from 'react-redux';

import {getCustomerOrderList} from '../actions/apiActions';
import {updateCustomerOrderList} from '../actions/actions';
import { hashRedirect } from '../utility/redirectFunctions';

import {padWithZeros} from '../utility/utility';

import {Link} from 'react-router';

const mapStateToProps = (store) => {
    return {
        customerDetails: store.customerOrderList,
        userDetails: store.userDetails
    }
}

class CustomerDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let customerId = this.props.routeParams.customerId;
        let warehouse_id = this.props.userDetails.warehouse_id;
        this.props.dispatch(updateCustomerOrderList(getCustomerOrderList(customerId, warehouse_id)));
    }

    componentWillReceiveProps(nextProps) {
        
        if(this.props.routeParams.customerId != nextProps.routeParams.customerId) {
            let customerId = nextProps.routeParams.customerId;
            let warehouse_id = this.props.userDetails.warehouse_id;
            this.props.dispatch(updateCustomerOrderList(getCustomerOrderList(customerId, warehouse_id)));
        }
    }

    getOrdersList(list) {

        if(list.length == 0 ){
            let  temp = [(<tr key={0}><td>No Records</td></tr>)];
            return temp;
        }

        let temp = list.map((elem, index) => {
            return (
                <tr key={index}>
                    <td><Link to={`/order/sales/${elem.order_id}`}>#{padWithZeros(elem.order_id, 5)}</Link></td>
                    <td>{elem.order_datetime}</td>
                    <td>
                        {
                            elem.order_cancel?
                                <span className="label label-danger font-12">Canceled</span>
                                :
                                elem.shipping_done?
                                    <span className="label label-success font-12">Completed</span>
                                    :
                                    <span className="label label-info font-12">Processing</span>
                        }
                    </td>
                </tr>
            )
        });
        return temp;
    }

    closeModal() {
        hashRedirect("/customers");
    }

    render() {
        console.log(this.props);
        return (
            <div className="custom-modal fadeIn">
                <div className="header">
                    <i className="close-button glyphicon glyphicon-remove cusor-pointer" onClick={this.closeModal}></i>
                    <h3>{this.props.customerDetails.company_name}'s orders</h3>
                </div>
                <div className="width-100 height-85p float-left overflow-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order Id</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.getOrdersList(this.props.customerDetails.orderDetails)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(CustomerDetails);