import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import {getReturnOrderList} from '../actions/apiActions';
import {updateReturnOrderList} from '../actions/actions';

import {padWithZeros} from '../utility/utility';

import Constants from '../constants/constants';
const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails,
        returnOrderList: store.returnOrderList
    }
}


class ReturnOrderList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        let show = "";

        if(this.props.location.query.show) {
            show = this.props.location.query.show;
        }
        this.props.dispatch(updateReturnOrderList(getReturnOrderList(warehouseId, show)));
    }

    componentWillReceiveProps(nextProps) {
        let warehouseId = this.props.userDetails.warehouse_id;
        let show = "";
        if(nextProps.location.query.show || this.props.location.query.show) {
            if(nextProps.location.query.show != this.props.location.query.show) {
                let show = "";
                if(nextProps.location.query.show) {
                    show = nextProps.location.query.show;
                }
                this.props.dispatch(updateReturnOrderList(getReturnOrderList(warehouseId, show)));
            }
        }
    }

    checkStatus(data) {
        if(data == 1) {
            return (
                <i className="glyphicon glyphicon-ok success-font"></i>
            )
        }
        return (
            <i className="glyphicon glyphicon-remove error-font"></i>
        )
    }

    getOrderListPage(list) {
        // <th>Order Id</th>
        // <th>Date</th>
        // <th>Sales Order Id</th>
        // <th>Reason</th>
        // <th className="text-center">Received</th>
        //     <th>Status</th>

        if(list.length < 1) {
            let temp = [(<tr key="0"><td>No Records</td></tr>)];
            return temp;
        }
        let temp = list.map((elem, index) => {
            let orderLink = `/order/sales/${elem.sales_order_id}`;
            let returnLink = `/order/return/${elem.order_id}`
            return (
                <tr key={index}>
                    <td><Link to={returnLink}>#{padWithZeros(elem.order_id, 5)}</Link></td>
                    <td>{elem.order_datetime}</td>
                    <td><Link to={orderLink}>#{padWithZeros(elem.sales_order_id, 5)}</Link></td>
                    <td>{Constants.returnReasons[elem.return_reason]}</td>
                    <td className="text-center">
                        {this.checkStatus(elem.order_received)}
                    </td>
                    <td>{
                        elem.order_received?
                            <span className="label label-success">Received</span>
                            :
                            <span className="label label-danger">Not Received</span>
                    }</td>
                </tr>
            )
        });
        return temp;
    }

    render() {

        return (
            <div className="custom-container">
                <div className="row">
                    <div className="col-sm-4">
                        <h3>Return Order List</h3>
                    </div>

                    <div className="col-sm-2 col-sm-offset-3">
                        <div className="dropdown margin-top-20">
                            <button className=" form-control btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                Filter&nbsp;
                                <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                                <Link  to="/order/return?show=pending"><li className="padding-5 cusor-pointer">Returns Pending</li></Link>
                                <Link to="/order/return?show=received"><li className="padding-5 cusor-pointer">Returns Completed</li></Link>
                                <Link to="/order/return"><li className="padding-5 cusor-pointer">All</li></Link>
                            </ul>
                        </div>
                    </div>
                </div>
                <table className="table margin-top-20">
                    <thead>
                    <tr>
                        <th>Order Id</th>
                        <th>Date</th>
                        <th>Sales Order Id</th>
                        <th>Reason</th>
                        <th className="text-center">Received</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.getOrderListPage(this.props.returnOrderList)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ReturnOrderList);