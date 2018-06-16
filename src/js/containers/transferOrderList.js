import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import {getTransferOrderList} from '../actions/apiActions';
import {updateTransferOrderList} from '../actions/actions';

import {padWithZeros} from '../utility/utility';

const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails,
        transferOrderList: store.transferOrderList
    }
}

class PurchaseOrderList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let show = "";

        if(this.props.location.query.show) {
            show = this.props.location.query.show;
        }
        let warehouseId = this.props.userDetails.warehouse_id;
        this.props.dispatch(updateTransferOrderList(getTransferOrderList(warehouseId, "", show)));
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
                this.props.dispatch(updateTransferOrderList(getTransferOrderList(warehouseId, "", show)));
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
        if(list.length < 1) {
            let temp = [(<tr key="0"><td>No Records</td></tr>)];
            return temp;
        }

        let temp = list.map((elem, index) => {
            let orderLink = `/order/transfer/${elem.order_id}`;
            return (
                <tr key={index}>
                    <td>
                        {
                            elem.from_warehouse_id == this.props.userDetails.warehouse_id ?
                                <i className="glyphicon glyphicon-export"></i>
                                :
                                <i className="glyphicon glyphicon-import"></i>
                        }
                    </td>
                    <td><Link to={orderLink}>#{padWithZeros(elem.order_id, 5)}</Link></td>
                    <td>{elem.order_datetime}</td>
                    <td className="text-center">{elem.from_warehouse_location}</td>
                    <td className="text-center">
                        {elem.to_warehouse_location}
                    </td>
                    <td className="text-center">{
                        this.checkStatus(elem.order_approved)
                    }</td>
                    <td className="text-center">{this.checkStatus(elem.order_received)}</td>
                    <td className="text-center">{elem.quantity_transfered}</td>
                    <td>
                        {
                            elem.order_reject?
                                <span className="label label-danger">Rejected</span>
                                :
                               elem.order_received?
                                   <span className="label label-success">Completed</span>
                                       :
                                       elem.order_approved?
                                           <span className="label label-primary">Approved</span>
                                           :
                                           elem.order_rejected?
                                               <span className="label label-danger">Rejected</span>
                                               :
                                               <span className="label label-info">Waiting for Approval</span>

                        }
                    </td>
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
                        <h3>Transfer Order List</h3>
                    </div>

                    <div className="col-sm-2 col-sm-offset-3">
                        <div className="dropdown margin-top-20">
                            <button className=" form-control btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                 Filter&nbsp;
                                <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                                <Link  to="/order/transfer?show=request"><li className="padding-5 cusor-pointer">Transfer Requests</li></Link>
                                <Link to="/order/transfer?show=order"><li className="padding-5 cusor-pointer">Transfer Orders</li></Link>
                                <Link to="/order/transfer"><li className="padding-5 cusor-pointer">All</li></Link>
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-3 ">
                        <div className="form-group">
                            <Link to="/order/transfer/add"><button className="form-control btn btn-success margin-top-20"><i className="glyphicon glyphicon-plus"></i> New Transfer Order</button></Link>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-10">
                        <b>Order Types:</b> <i className="glyphicon glyphicon-export"></i>&nbsp;Request received for transfer. &nbsp;<i className="glyphicon glyphicon-import"></i>&nbsp;Request sent for transfer.
                    </div>
                </div>
                <table className="table margin-top-20">
                    <thead>
                    <tr>
                        <th>Order Type</th>
                        <th>Order Id</th>
                        <th>Date</th>
                        <th>Stock from Warehouse</th>
                        <th>Stock to Warehouse</th>
                        <th>Order Approved</th>
                        <th>Order Received</th>
                        <th>Total Quantity</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.getOrderListPage(this.props.transferOrderList)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(mapStateToProps)(PurchaseOrderList);